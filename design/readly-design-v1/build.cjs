const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const api = require('./design.js');
const base = __dirname;
const logoSvg = fs.readFileSync(path.join(base, 'assets/readly-logo.svg'), 'utf8').trim().replace('width="216" height="72"', 'width="132" height="44"');
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'screens.json')));
const font = {
  fontFiles: fs.readdirSync(path.join(base, 'fonts')).filter(file => /\.(otf|ttf)$/.test(file)).map(file => path.join(base, 'fonts', file)),
  loadSystemFonts: false,
  defaultFontFamily: 'Pretendard',
};
for (const folder of ['screens', 'previews']) fs.mkdirSync(path.join(base, folder), { recursive: true });
for (const entry of manifest) {
  const scene = api.build(entry.key, entry.state);
  entry.name = scene.name;
  entry.width = scene.w;
  entry.height = scene.h;
  const svg = api.svg(scene);
  fs.writeFileSync(path.join(base, 'screens', entry.file + '.svg'), svg);
  fs.writeFileSync(path.join(base, 'previews', entry.file + '.png'), new Resvg(svg, { font }).render().asPng());
}
fs.writeFileSync(path.join(base, 'screens.json'), JSON.stringify(manifest, null, 2) + '\n');

for (const mobile of [false, true]) {
  const entries = manifest.filter(entry => (entry.state.device === 'mobile') === mobile).filter((entry, index, items) => items.findIndex(other => other.key === entry.key) === index);
  const tileWidth = mobile ? 234 : 360, gap = 28, margin = 28, columns = 4;
  const width = margin * 2 + tileWidth * columns + gap * (columns - 1);
  let y = 100;
  const elements = [];
  for (let start = 0; start < entries.length; start += columns) {
    const group = entries.slice(start, start + columns);
    for (const [index, entry] of group.entries()) {
      const x = margin + index * (tileWidth + gap), height = entry.height * tileWidth / entry.width;
      const data = fs.readFileSync(path.join(base, 'previews', entry.file + '.png')).toString('base64');
      elements.push(`<text x="${x}" y="${y - 16}" font-family="Pretendard" font-size="16" font-weight="600" fill="#141414">${entry.name.replace(' / 모바일', '')}</text><image x="${x}" y="${y}" width="${tileWidth}" height="${height}" href="data:image/png;base64,${data}"/>`);
    }
    y += Math.max(...group.map(entry => entry.height * tileWidth / entry.width)) + 64;
  }
  const overview = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.ceil(y)}"><rect width="100%" height="100%" fill="#EBECEE"/><g transform="translate(28,8)">${logoSvg}</g><text x="176" y="38" font-family="Pretendard" font-size="20" font-weight="700" fill="#141414">${mobile ? 'MOBILE' : 'DESKTOP'} DESIGN</text><text x="28" y="66" font-family="Pretendard" font-size="14" fill="#636C73">읽고 남은 마음 · 8 PAGES</text>${elements.join('')}</svg>`;
  fs.writeFileSync(path.join(base, mobile ? 'mobile-overview.png' : 'overview.png'), new Resvg(overview, { font }).render().asPng());
}
console.log('Rendered 34 SVG/PNG pairs and desktop/mobile overviews.');
