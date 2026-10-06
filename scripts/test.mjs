import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from './serve.mjs';

const server = createServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const route of ['/', '/about', '/services', '/projects', '/contact']) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /IAK Solutions/);
    assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
    for (const asset of html.matchAll(/(?:src|href)="(\/(?:assets\/[^"#]+|style\.css))"/g)) {
      const assetResponse = await fetch(origin + asset[1]);
      assert.equal(assetResponse.status, 200, asset[1]);
      assert.ok((await assetResponse.arrayBuffer()).byteLength > 0);
    }
  }
  for (const [route, location] of [['/about.html', '/about'], ['/contact/', '/contact'], ['/index.html', '/']]) {
    const response = await fetch(origin + route, { redirect: 'manual' });
    assert.equal(response.status, 308); assert.equal(response.headers.get('location'), location);
  }
  const missing = await fetch(origin + '/missing-page');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /PAGE NOT FOUND/);
  const deep = await fetch(origin + '/missing/deep/page');
  assert.equal(deep.status, 404);
  assert.equal((await fetch(origin + '/scripts/check.mjs')).status, 404);
  const head = await fetch(origin + '/contact', { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  assert.equal((await fetch(origin + '/contact', { method: 'POST' })).status, 405);
  console.log('Passed: clean page routes, assets, HTML redirects, custom 404, public-file isolation, headers and HEAD requests.');
} finally { server.close(); await once(server, 'close'); }
