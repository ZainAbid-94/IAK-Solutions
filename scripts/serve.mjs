import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };

export function createServer() {
  return http.createServer(async (req, res) => {
    const headers = Object.fromEntries(config.headers[0].headers.map(item => [item.key, item.value]));
    const send = (status, body, mime = types['.html']) => {
      res.writeHead(status, { ...headers, 'Content-Type': mime });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); send(405, 'Method not allowed', types['.txt']); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { send(400, 'Bad request', types['.txt']); return; }
    if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..')) { send(400, 'Bad request', types['.txt']); return; }
    if (pathname === '/index.html' || pathname === '/index' || pathname.endsWith('.html') || (pathname !== '/' && pathname.endsWith('/'))) {
      const destination = pathname === '/index.html' || pathname === '/index' ? '/' : pathname.replace(/\.html$/, '').replace(/\/$/, '');
      res.writeHead(308, { ...headers, Location: destination }); res.end(); return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1) + (path.extname(pathname) ? '' : '.html');
    try { send(200, await readFile(path.join(root, relative)), types[path.extname(relative)] || 'application/octet-stream'); }
    catch (error) {
      if (!['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) { send(500, 'Unable to serve page', types['.txt']); return; }
      send(404, await readFile(path.join(root, '404.html')));
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, '127.0.0.1', () => console.log(`IAK Solutions preview: http://localhost:${port}`));
}
