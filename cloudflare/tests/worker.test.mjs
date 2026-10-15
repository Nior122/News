import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker.mjs';

const ENV = {
  DATABASE_URL: 'local-test-placeholder',
  ADMIN_PASSWORD: 'local-test-admin-secret',
};

function request(path, { method = 'GET', body, headers = {} } = {}) {
  return new Request(`https://scrolltek.pages.dev/api${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

function database(handler = () => []) {
  const calls = [];
  const sql = async (strings, ...values) => {
    const query = strings.join(' ? ');
    calls.push({ query, values });
    return handler({ query, values, calls });
  };
  return { sql, calls };
}

async function invoke(path, options = {}, dependencies = {}) {
  return worker.fetch(request(path, options), ENV, undefined, dependencies);
}

test('Worker validates route and method and authenticates before database initialization', async () => {
  let factoryCalls = 0;
  let setupCalls = 0;
  const forbiddenFactory = () => {
    factoryCalls += 1;
    throw new Error('database factory must not be called');
  };
  const dependencies = {
    databaseFactory: forbiddenFactory,
    refreshSetup: async () => { setupCalls += 1; return 0; },
  };

  for (const [path, options, expectedStatus] of [
    ['/health', {}, 200],
    ['/not-a-route', {}, 404],
    ['/articles', { method: 'POST' }, 404],
    ['/admin/articles', { method: 'DELETE' }, 404],
    ['/admin/force-seed?key=local-test-admin-secret', {}, 404],
    ['/admin/articles', { method: 'GET' }, 401],
    ['/admin/articles', { method: 'GET', headers: { Authorization: 'Bearer malformed' } }, 401],
    ['/admin/articles', { method: 'POST', body: { title: 'unauthorized' } }, 401],
    ['/admin/articles/5', { method: 'PUT', body: { title: 'unauthorized' } }, 401],
    ['/admin/articles/5', { method: 'DELETE' }, 401],
    ['/admin/articles/5/publish', { method: 'PATCH' }, 401],
    ['/admin/force-seed', { method: 'POST' }, 401],
  ]) {
    const response = await invoke(path, options, dependencies);
    assert.equal(response.status, expectedStatus, `${options.method ?? 'GET'} ${path}`);
  }

  assert.equal(factoryCalls, 0);
  assert.equal(setupCalls, 0);
});

test('Worker admin login and read-only article listings do not initialize setup', async () => {
  const fixture = database(({ query }) => (
    /COUNT\(\*\)/i.test(query) ? [{ total: '0' }] : []
  ));
  let factoryCalls = 0;
  let setupCalls = 0;
  const dependencies = {
    databaseFactory: () => { factoryCalls += 1; return fixture.sql; },
    refreshSetup: async () => { setupCalls += 1; return 0; },
  };

  const loginResponse = await invoke('/admin/login', {
    method: 'POST',
    body: { password: ENV.ADMIN_PASSWORD },
  }, dependencies);
  assert.equal(loginResponse.status, 200);
  const { token } = await loginResponse.json();
  assert.equal(factoryCalls, 0, 'admin login must not create a database client');

  const publicList = await invoke('/articles?limit=5', {}, dependencies);
  assert.equal(publicList.status, 200);
  assert.deepEqual(await publicList.json(), { articles: [], total: 0, hasMore: false });

  const adminList = await invoke('/admin/articles', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }, dependencies);
  assert.equal(adminList.status, 200);
  assert.deepEqual(await adminList.json(), []);

  assert.equal(factoryCalls, 2);
  assert.equal(setupCalls, 0);
  assert.ok(fixture.calls.every(({ query }) => /^\s*SELECT\b/i.test(query.trim())));
  assert.doesNotMatch(fixture.calls.map(({ query }) => query).join('\n'), /\b(CREATE|INSERT|UPDATE|DELETE|ALTER|DROP)\b/i);
});

test('Worker setup remains an explicit authenticated POST', async () => {
  const fixture = database();
  const events = [];
  const dependencies = {
    databaseFactory: () => { events.push('database-factory'); return fixture.sql; },
    refreshSetup: async (db) => {
      assert.equal(db, fixture.sql);
      events.push('authorized-setup');
      return 19;
    },
  };

  const loginResponse = await invoke('/admin/login', {
    method: 'POST',
    body: { password: ENV.ADMIN_PASSWORD },
  }, dependencies);
  const { token } = await loginResponse.json();
  assert.equal((await invoke('/admin/force-seed', { method: 'POST' }, dependencies)).status, 401);
  assert.deepEqual(events, []);

  const setupResponse = await invoke('/admin/force-seed', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }, dependencies);
  assert.equal(setupResponse.status, 200);
  assert.deepEqual(await setupResponse.json(), {
    success: true,
    total: 19,
    message: 'Setup complete. 19 articles now in database.',
  });
  assert.deepEqual(events, ['database-factory', 'authorized-setup']);
  assert.equal(fixture.calls.length, 0, 'setup is injected; no live SQL should run in this test');
});

test('Worker single article GET does not increment view counts', async () => {
  const article = {
    id: 12,
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
    read_time: 3,
    views: 9,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date('2026-10-01T12:00:00.000Z'),
    tags: [],
  };
  const fixture = database(() => [article]);
  const response = await invoke('/articles/read-only-story', {}, {
    databaseFactory: () => fixture.sql,
    refreshSetup: async () => { throw new Error('ordinary reads must not run setup'); },
  });

  assert.equal(response.status, 200);
  assert.equal((await response.json()).slug, 'read-only-story');
  assert.equal(fixture.calls.length, 1);
  assert.match(fixture.calls[0].query, /^\s*SELECT\b/i);
  assert.doesNotMatch(fixture.calls[0].query, /UPDATE|INSERT|DELETE|CREATE/i);
});
