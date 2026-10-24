import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../../artifacts/media-site/src/App.tsx', import.meta.url), 'utf8');
const nav = readFileSync(new URL('../../artifacts/media-site/src/components/layout/MobileNav.tsx', import.meta.url), 'utf8');

test('public layout mounts the existing bottom navigation and reserves safe-area space', () => {
  const layout = app.slice(app.indexOf('function PublicLayout'), app.indexOf('function PageLoader'));
  assert.match(app, /import \{ MobileNav \} from "@\/components\/layout\/MobileNav"/);
  assert.equal((layout.match(/<MobileNav\s*\/>/g) || []).length, 1);
  assert.match(layout, /pb-\[calc\(56px\+env\(safe-area-inset-bottom\)\)\] md:pb-0/);
  assert.match(nav, /md:hidden fixed bottom-0/);
  for (const label of ['Home', 'Tech', 'Phone Tips', 'AI & More', 'Culture', 'Trending']) {
    assert.ok(nav.includes(`label: "${label}"`));
  }
});
