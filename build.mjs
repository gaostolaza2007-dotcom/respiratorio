// Reúne el código editable en un único HTML, sin descargar paquetes.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
let html = await readFile(path.join(root, 'index.html'), 'utf8');
const css = await readFile(path.join(root, 'styles.css'), 'utf8');
const cssTag = '<link rel="stylesheet" href="styles.css">';
if (!html.includes(cssTag)) throw new Error('No se encontró la referencia a styles.css.');
html = html.replace(cssTag, () => '<style>\n' + css + '\n</style>');
for (const name of ['model.js', 'app.js']) {
  const tag = `<script src="${name}"></script>`;
  if (!html.includes(tag)) throw new Error('No se encontró la referencia a ' + name);
  const script = await readFile(path.join(root, name), 'utf8');
  html = html.replace(tag, () => '<script>\n' + script.replace(/<\/script/gi, '<\\/script') + '\n</script>');
}
await mkdir(path.join(root, 'portable'), {recursive: true});
await writeFile(path.join(root, 'portable', 'RespiraLab.html'), html, 'utf8');
console.log('Listo: portable/RespiraLab.html. Los cambios del código ya están incluidos.');
