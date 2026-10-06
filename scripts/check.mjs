import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const pages = ['index', 'about', 'services', 'projects', 'contact', '404'];
const content = new Map();
for (const page of pages) content.set(page, await readFile(path.join(root, `${page}.html`), 'utf8'));

function assert(value, message) { if (!value) throw new Error(message); }
for (const [page, html] of content) {
  assert(!html.includes('{{'), `${page}: unresolved template placeholder`);
  assert(!/touch\s+display|ai-powered\s+voice\s+agent/i.test(html), `${page}: excluded service present`);
  assert((html.match(/<h1(?:\s|>)/g) || []).length === 1, `${page}: expected one main heading`);
  assert(html.includes('name="viewport"'), `${page}: missing mobile viewport`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:tel:|mailto:|https?:|data:)/.test(value)) continue;
    const [urlPath, fragment] = value.split('#');
    const route = urlPath || (page === 'index' ? '/' : `/${page}`);
    const target = route === '/' ? 'index.html' : route.slice(1) + (path.extname(route) ? '' : '.html');
    assert(route.startsWith('/') && !target.includes('..'), `${page}: unsafe or relative URL ${value}`);
    await access(path.join(root, target));
    if (fragment) {
      const targetHtml = await readFile(path.join(root, target), 'utf8');
      assert(targetHtml.includes(`id="${fragment}"`), `${page}: missing anchor ${value}`);
    }
  }
}
const services = content.get('services');
assert((services.match(/class="service-row"/g) || []).length === 10, 'Expected ten retained services');
assert(content.get('contact').includes('tel:+923165147531'), 'Contact phone link missing');
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
assert(config.cleanUrls === true && config.outputDirectory === 'public' && config.framework === null, 'Invalid static Vercel configuration');
console.log('Passed: six pages, ten services, links, anchors, local assets, mobile metadata and Vercel configuration.');
