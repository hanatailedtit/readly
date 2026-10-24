const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const api = require('./design.js');
const manifest = require('./screens.json');
const logoArtwork = fs.readFileSync(path.join(__dirname, 'assets/readly-logo.svg'), 'utf8').match(/<g fill="#141414">.*<\/g>/)[0];
let scenes = 0;
function flatten(node) { return [node, ...(node.children || []).flatMap(flatten)]; }
function verifyScene(scene) {
  scenes++;
  for (const node of flatten(scene)) {
    assert(node.w > 0 && node.h >= 0, node.name + ' invalid size');
    for (const child of node.children || []) {
      assert(child.x >= 0 && child.y >= 0 && child.x + child.w <= node.w + .01 && child.y + child.h <= node.h + .01, node.name + ' / ' + child.name + ' overflow');
    }
    if (node.type === 'cover') assert.equal(node.h / node.w, 1.5);
    if (node.name.startsWith('Record Card')) {
      const footer = node.children.at(-1);
      assert(Math.abs(node.h - footer.y - footer.h - 24) < .01, 'Card footer alignment');
    }
    if (node.name === 'Brand and Account') assert.equal(node.children.at(-1).children[0].lines.length, 1, 'Mobile login must fit on one line');
  }
  const svg = api.svg(scene);
  assert.equal(svg.split(logoArtwork).length - 1, 2, 'Header and footer must use the approved vector logo');
  assert(!/undefined|NaN|@yeong|RIDI|리디|와이어프레임/.test(svg), 'Export contains invalid values or source branding');
}
assert.equal(manifest.length, 34);
for (const entry of manifest) verifyScene(api.build(entry.key, entry.state));
for (const width of [320, 375, 390, 414]) {
  for (const [key] of api.pages) {
    for (const state of [{}, { view: 'grid' }, { view: 'list' }, { reply: true }, { error: true }, { bookSelected: false, bookSearch: true }, { wholeBook: true }, { recommendation: 1 }, { recommendation: 2 }]) {
      verifyScene(api.build(key, { device: 'mobile', mobileWidth: width, ...state }));
    }
  }
  for (const onlyRecorded of [false, true]) {
    const nodes = flatten(api.build('books', { device: 'mobile', mobileWidth: width, onlyRecorded }));
    const list = nodes.find(node => node.name === 'Mobile Book List');
    assert.equal(list.dir, 'col');
    assert.equal(list.children.length, onlyRecorded ? 6 : 8);
    for (const item of list.children) {
      assert.equal(item.w, width - 32);
      assert.equal(item.action, 'page:book-detail');
    }
  }
}
for (const device of ['desktop', 'mobile']) {
  for (const wholeBook of [false, true]) {
    const fields = flatten(api.build('write', { device, wholeBook })).filter(node => ['Field · 시작 쪽수', 'Field · 마지막 쪽수'].includes(node.name));
    assert.equal(fields.length, 2);
    assert(fields.every(node => node.disabled === wholeBook), 'Whole-book switch must retain and disable page inputs');
  }
  const withReply = flatten(api.build('record-detail', { device, reply: true }));
  assert(withReply.some(node => node.name.includes('대댓글')));
  assert(withReply.some(node => node.name === 'Field · 책갈피 님에게 답글'));
}
function luminance(hex) {
  const rgb = hex.match(/\w\w/g).map(c => parseInt(c, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
for (const foreground of ['1670B5', '636C73', 'C82E2E']) assert((1.05) / (luminance(foreground) + .05) >= 4.5, 'Text contrast ' + foreground);

// Exercise the actual preview handlers without browser automation or API calls.
const nodes = new Map();
function element() {
  return { style: {}, dataset: {}, value: '', handlers: {}, addEventListener(type, fn) { this.handlers[type] = fn; }, append() {}, focus() {}, showModal() {} };
}
for (const id of ['page-picker', 'device-picker', 'canvas', 'preview-size', 'current-title', 'current-note', 'state-button', 'svg-download', 'toast', 'search-dialog', 'query']) nodes.set('#' + id, element());
const context = {
  ReadlyDesign: api,
  document: { querySelector: selector => nodes.get(selector), createElement: element },
  window: { innerWidth: 1440, scrollTo() {} },
  location: { search: '', hash: '' },
  history: { replaceState() {} },
  URLSearchParams, URL: { createObjectURL: () => 'blob:preview', revokeObjectURL() {} },
  Blob, clearTimeout() {}, setTimeout: () => 1,
};
vm.createContext(context);
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(!/\.canvas\s+svg\s*\{/.test(html), 'Responsive scaling must target only the outer SVG');
const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).find(Boolean);
vm.runInContext(script, context);
function click(action) {
  nodes.get('#canvas').handlers.click({ preventDefault() {}, target: { closest: () => ({ dataset: { action } }) } });
}
function state() { return vm.runInContext('({current,device,state:state()})', context); }
click('page:books'); click('filter');
assert.equal(state().state.onlyRecorded, true);
click('page:book-detail'); click('write');
assert.equal(state().current, 'write');
assert.equal(state().state.bookSelected, true);
click('write-whole-book'); assert.equal(state().state.wholeBook, true);
click('book-search'); click('select-book:2');
assert.equal(state().state.selectedBook, 2);
assert.equal(state().state.bookSelected, true);
click('write-publish'); assert.equal(state().state.error, true);
click('page:home'); click('write'); assert.equal(state().state.bookSelected, false);
click('page:records'); click('sort'); click('view:grid'); click('recommendation:2');
assert.equal(state().state.sort, 'popular'); assert.equal(state().state.view, 'grid'); assert.equal(state().state.recommendation, 2);
click('page:record-detail'); click('reply'); assert.equal(state().state.reply, true);
click('page:signup'); click('agree'); assert.equal(state().state.agreed, true);
nodes.get('#device-picker').value = 'mobile'; nodes.get('#device-picker').handlers.change();
assert.equal(state().device, 'mobile');
assert.equal(nodes.get('#canvas').style.maxWidth, '438px');
assert.equal(state().state.agreed, true);
console.log(`${scenes} scenes checked; covers, mobile rows, switches, comments, contrast, and preview interactions passed.`);
