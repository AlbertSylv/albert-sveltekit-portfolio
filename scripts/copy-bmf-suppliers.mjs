import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(fileURLToPath(new URL('..', import.meta.url)));
const assetsDir = path.join(root, 'src/lib/assets');
const src = fs.readdirSync(assetsDir).find((n) => n.startsWith('Picture3') && n.endsWith('.png'));
if (!src) {
	console.error('No Picture3*.png in src/lib/assets');
	process.exit(1);
}
const from = path.join(assetsDir, src);
const to = path.join(root, 'static/images/experience/bmf-suppliers.png');
const old = path.join(root, 'static/images/experience/bmf-suppliers-incidents.png');
fs.copyFileSync(from, to);
if (fs.existsSync(old)) fs.unlinkSync(old);
console.log(`Copied ${src} -> static/images/experience/bmf-suppliers.png (${fs.statSync(to).size} bytes)`);
