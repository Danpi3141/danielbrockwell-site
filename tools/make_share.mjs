// Makes src/assets/img/share.png (1200 x 630), the image shown when a page is shared:
// a four-line LCD screenshot scaled 2x on a dark bezel. Reads the emulator's PNGs, which are
// 8-bit RGB with filter 0 on every row (as tests/ui/shots.js writes them).
//   node tools/make_share.mjs [screenshot.png]
import fs from 'node:fs';
import zlib from 'node:zlib';

const src = process.argv[2] || 'src/assets/img/psion/connect4/lz64-four.png';
const out = 'src/assets/img/share.png';

function readPng(file) {
  const b = fs.readFileSync(file);
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  if (b[24] !== 8 || b[25] !== 2) throw new Error('expects 8-bit RGB');
  const idat = [];
  for (let i = 8; i < b.length;) {
    const len = b.readUInt32BE(i), type = b.toString('latin1', i + 4, i + 8);
    if (type === 'IDAT') idat.push(b.subarray(i + 8, i + 8 + len));
    i += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const rgb = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    if (raw[y * (w * 3 + 1)] !== 0) throw new Error('expects filter 0 rows');
    raw.copy(rgb, y * w * 3, y * (w * 3 + 1) + 1, (y + 1) * (w * 3 + 1));
  }
  return { w, h, rgb };
}

const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t.push(c >>> 0); } return t; })();
const crc32 = (buf) => { let c = 0xFFFFFFFF; for (const x of buf) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function writePng(file, w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}

const W = 1200, H = 630, S = 2;
const img = readPng(src);
const canvas = Buffer.alloc(W * H * 3);
const bg = [0x12, 0x16, 0x14], bezel = [0x3A, 0x42, 0x3D];
for (let i = 0; i < W * H; i++) canvas.set(bg, i * 3);
const sw = img.w * S, sh = img.h * S, x0 = (W - sw) >> 1, y0 = (H - sh) >> 1, B = 16;
for (let y = y0 - B; y < y0 + sh + B; y++) for (let x = x0 - B; x < x0 + sw + B; x++) canvas.set(bezel, (y * W + x) * 3);
for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
  const s = (((y / S) | 0) * img.w + ((x / S) | 0)) * 3;
  img.rgb.copy(canvas, ((y0 + y) * W + x0 + x) * 3, s, s + 3);
}
writePng(out, W, H, canvas);
console.log(`wrote ${out} (${W} x ${H}) from ${src}`);
