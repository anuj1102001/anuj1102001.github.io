// A pixel-art version of the sunglasses portrait for Pixel mode: shrunk to a small grid,
// reduced to a short palette with hard alpha edges, then scaled back up without smoothing.
import sharp from "sharp";
const SRC = "design/photos/sunglasses-cut.png";
const GRID = 84; // pixels across
const small = await sharp(SRC).resize({ width: GRID, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = small;
for (let i = 0; i < data.length; i += 4) data[i + 3] = data[i + 3] > 110 ? 255 : 0; // hard edge
const quant = await sharp(data, { raw: info }).png({ palette: true, colours: 14, dither: 0 }).toBuffer();
for (const w of [700, 1200, 1800]) {
  const h = Math.round((info.height / info.width) * w);
  await sharp(quant).resize({ width: w, height: h, kernel: "nearest" }).png({ palette: true, colours: 14 }).toFile(`public/img/me/sunglasses-pixel-${w}.png`);
}
console.log("pixel avatar", info.width, "x", info.height);
