const { writeFileSync } = require('node:fs');
const { join } = require('node:path');
const QRCode = require('./vendor/QRCode');
const levels = require('./vendor/QRCode/QRErrorCorrectLevel');

const publicUrl = process.env.RENDER_EXTERNAL_URL;
if (!publicUrl) throw new Error('RENDER_EXTERNAL_URL est requis pour générer le flashcode.');
const target = new URL(publicUrl);
if (target.protocol !== 'https:') throw new Error('Le flashcode exige une adresse HTTPS.');

const qr = new QRCode(-1, levels.M);
qr.addData(target.origin + '/');
qr.make();

const margin = 4;
const size = qr.getModuleCount() + margin * 2;
const modules = [];
for (let row = 0; row < qr.getModuleCount(); row++) {
  for (let col = 0; col < qr.getModuleCount(); col++) {
    if (qr.isDark(row, col)) modules.push('M' + (col + margin) + ' ' + (row + margin) + 'h1v1h-1z');
  }
}
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size +
  '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' +
  modules.join('') + '"/></svg>';
writeFileSync(join(__dirname, '../dist/flashcode.svg'), svg);
