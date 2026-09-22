const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {breathAt, comparison} = require('../model.js');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

assert.equal(breathAt(0).volume, 0);
assert.equal(breathAt(.4).volume, 1);
assert.equal(breathAt(1).volume, 0);
assert.equal(breathAt(0).flow, 0);
assert.equal(breathAt(.4).flow, 0);
for (let i = 1; i < 1000; i++) {
  const p = i / 1000, b = breathAt(p), previous = breathAt((i - 1) / 1000);
  assert.ok(b.volume >= 0 && b.volume <= 1);
  if (p < .4) { assert.ok(b.volume > previous.volume); assert.ok(b.flow > 0); }
  if (p > .4) { assert.ok(b.volume < previous.volume); assert.ok(b.flow < 0); }
}
assert.equal(comparison(6, 4).delta, -2);
assert.equal(comparison(5, 5).delta, 0);
assert.equal(comparison(3, 8).delta, 5);
assert.throws(() => comparison(0, 5));
assert.throws(() => comparison(5, 11));
assert.throws(() => comparison(5, NaN));

for (const name of ['model.js', 'app.js']) new vm.Script(read(name), {filename: name});
let expected = read('index.html').replace('<link rel="stylesheet" href="styles.css">', () => '<style>\n' + read('styles.css') + '\n</style>');
for (const name of ['model.js', 'app.js']) {
  expected = expected.replace(`<script src="${name}"></script>`, () => '<script>\n' + read(name).replace(/<\/script/gi, '<\\/script') + '\n</script>');
}
const html = read('portable/RespiraLab.html');
assert.equal(html, expected, 'La copia portátil no está actualizada. Ejecuta npm run build.');
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 3);
assert.ok(scripts.every(([, attrs]) => !attrs.includes('src=')));
for (const [, attrs, code] of scripts) {
  if (attrs.includes('application/json')) JSON.parse(code);
  else new vm.Script(code);
}
const markup = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
assert.ok(!/<link[^>]+rel="stylesheet"|@import|url\(https?:/i.test(markup));
const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Hay identificadores HTML duplicados.');
for (const section of ['explorar', 'vias', 'cerebro', 'experiencia', 'evidencia', 'presentar']) {
  assert.ok(ids.includes(section), 'Falta la sección ' + section);
}
assert.ok(html.includes('10.1523/JNEUROSCI.2586-16.2016'));
assert.ok(html.includes('10.1038/s41598-023-49279-8'));
assert.ok(!/localStorage|sessionStorage|sendBeacon|XMLHttpRequest|WebSocket/.test(html));
console.log('OK: modelo, comparación, código, seis secciones y HTML portátil actualizado y autónomo.');
