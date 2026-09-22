// Servidor de desarrollo local; no expone carpetas ni escucha en la red pública.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535.');
}
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/model.js', ['model.js', 'text/javascript']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/portable/RespiraLab.html', ['portable/RespiraLab.html', 'text/html']]
]);

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, {'Allow': 'GET, HEAD'});
    return res.end();
  }
  let route;
  try { route = new URL(req.url, 'http://127.0.0.1').pathname; }
  catch { res.writeHead(400); return res.end(); }
  if (route === '/favicon.ico') { res.writeHead(204); return res.end(); }
  const file = files.get(route);
  if (!file) { res.writeHead(404); return res.end('No encontrado'); }
  try {
    const body = await readFile(path.join(root, file[0]));
    res.writeHead(200, {
      'Content-Type': file[1] + '; charset=utf-8',
      'Content-Length': body.length,
      'Cache-Control': 'no-store'
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500);
    res.end('No se pudo leer el archivo del proyecto.');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `El puerto ${port} está ocupado. Cierra el servidor anterior o elige otro PORT.`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`RespiraLab: http://127.0.0.1:${port}`);
  console.log('Abre esa dirección en el navegador. Ctrl+C detiene el servidor.');
});
