import assert from 'node:assert/strict';
import test from 'node:test';
import { Readable } from 'node:stream';
import { handler } from '../index.mjs';

const ENV = {
  DATABASE_URL: 'postgres://local-test-placeholder',
  ADMIN_PASSWORD: 'local-test-admin-secret',
};

function request(path, { method = 'GET', body, headers = {} } = {}) {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  const req = Readable.from(chunks);
  req.url = `/api${path}`;
  req.method = method;
  req.headers = { host: 'scrolltek.name.ng', ...headers };
  return req;
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(data = '') {
      this.body += data;
    },
  };
}

async function invoke(app, path, options) {
  const res = response();
  await app(request(path, options), res);
  return {
    status: res.statusCode,
    headers: res.headers,
    body: res.body ? JSON.parse(res.body) : null,
  };
}

function mockDatabase(resultForQuery = () => []) {
  const queries = [];
  const db = {
    async query(query, params = []) {
      queries.push({ query, params });
      return { rows: resultForQuery(query, params) };
    },
  };
  return { db, queries };
}

function makeApp({ db, env = ENV, onDatabase = () => {}, refreshSetup = async () => 0 } = {}) {
  return (req, res) => handler(req, res, {
    env,
    databaseFactory: (runtimeEnv) => {
      onDatabase(runtimeEnv);
      return db;
    },
    refreshSetup,
  });
}

async function login(app) {
  const result = await invoke(app, '/admin/login', {
    method: 'POST',
    body: { password: ENV.ADMIN_PASSWORD },
  });
  assert.equal(result.status, 200);
  assert.equal(typeof result.body.token, 'string');
  return result.body.token;
}

test('health, unknown routes, invalid methods, and unauthorized admin requests never create a pool', async () => {
  let poolFactoryCalls = 0;
  let setupCalls = 0;
  const { db, queries } = mockDatabase();
  const app = makeApp({
    db,
    onDatabase: () => { poolFactoryCalls += 1; },
    refreshSetup: async () => { setupCalls += 1; return 0; },
  });

  assert.equal((await invoke(app, '/health')).status, 200);
  assert.equal((await invoke(app, '/not-a-route')).status, 404);
  assert.equal((await invoke(app, '/articles', { method: 'POST' })).status, 404);
  assert.equal((await invoke(app, '/admin/articles', { method: 'DELETE' })).status, 404);
  assert.equal((await invoke(app, '/admin/force-seed?key=local-test-admin-secret')).status, 404);

  for (const [path, options] of [
    ['/admin/articles', { method: 'GET' }],
    ['/admin/articles', { method: 'GET', headers: { authorization: 'Bearer malformed' } }],
    ['/admin/articles', { method: 'POST', body: { title: 'should not be read' } }],
    ['/admin/articles/7', { method: 'PUT', body: { title: 'should not be read' } }],
    ['/admin/articles/7', { method: 'DELETE' }],
    ['/admin/articles/7/publish', { method: 'PATCH' }],
    ['/admin/force-seed', { method: 'POST' }],
  ]) {
    assert.equal((await invoke(app, path, options)).status, 401, `${options.method} ${path}`);
  }

  assert.equal(poolFactoryCalls, 0);
  assert.equal(setupCalls, 0);
  assert.equal(queries.length, 0);
});

test('public listing and authenticated admin listing use SELECT only and do not run setup', async () => {
  const { db, queries } = mockDatabase((query) => (
    /COUNT\(\*\)/i.test(query) ? [{ total: '0' }] : []
  ));
  let poolFactoryCalls = 0;
  let setupCalls = 0;
  const app = makeApp({
    db,
    onDatabase: () => { poolFactoryCalls += 1; },
    refreshSetup: async () => { setupCalls += 1; return 0; },
  });

  const token = await login(app);
  assert.equal(poolFactoryCalls, 0, 'admin login must not create a pool');

  const publicList = await invoke(app, '/articles?limit=5');
  assert.equal(publicList.status, 200);
  assert.deepEqual(publicList.body, { articles: [], total: 0, hasMore: false });

  const adminList = await invoke(app, '/admin/articles', {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(adminList.status, 200);
  assert.deepEqual(adminList.body, []);

  assert.equal(poolFactoryCalls, 2);
  assert.equal(setupCalls, 0);
  assert.ok(queries.length >= 3);
  assert.ok(queries.every(({ query }) => /^\s*SELECT\b/i.test(query.trim())), 'article listings must remain read-only');
  assert.doesNotMatch(queries.map(({ query }) => query).join('\n'), /\b(CREATE|INSERT|UPDATE|DELETE|ALTER|DROP)\b/i);
});

test('legacy Vercel setup is an explicit authenticated POST and never runs for the old GET URL', async () => {
  const { db, queries } = mockDatabase();
  const events = [];
  const app = makeApp({
    db,
    onDatabase: () => { events.push('database-factory'); },
    refreshSetup: async (pool) => {
      assert.equal(pool, db);
      events.push('authorized-setup');
      return 23;
    },
  });

  assert.equal((await invoke(app, '/admin/force-seed?key=local-test-admin-secret')).status, 404);
  assert.equal((await invoke(app, '/admin/force-seed', { method: 'POST' })).status, 401);
  assert.deepEqual(events, []);
  assert.equal(queries.length, 0);

  const token = await login(app);
  const result = await invoke(app, '/admin/force-seed', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
  });

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    success: true,
    total: 23,
    message: 'Setup complete. 23 articles now in database.',
  });
  assert.deepEqual(events, ['database-factory', 'authorized-setup']);
  assert.equal(queries.length, 0, 'test setup is injected and must not execute SQL');
});

test('single article GET does not update views', async () => {
  const article = {
    id: 8,
    slug: 'read-only-story',
    title: 'Read-only story',
    subtitle: null,
    excerpt: 'A summary',
    body: '<p>Body</p>',
    category: 'Tech',
    author_id: 1,
    author_name: 'Maya Chen',
    avatar_url: '',
    image_url: '',
    read_time: 4,
    views: 3,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date('2026-10-01T12:00:00.000Z'),
    tags: [],
  };
  const { db, queries } = mockDatabase(() => [article]);
  const app = makeApp({ db });

  const result = await invoke(app, '/articles/read-only-story');
  assert.equal(result.status, 200);
  assert.equal(result.body.slug, 'read-only-story');
  assert.equal(queries.length, 1);
  assert.match(queries[0].query, /^\s*SELECT\b/i);
  assert.doesNotMatch(queries[0].query, /UPDATE|INSERT|DELETE|CREATE/i);
});
