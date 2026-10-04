// Render review stills (bundles once, then renders each frame) into out/stills/.
// Usage: npm run render:stills -- [frame frame ...] [--scale=0.5]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const DEFAULT = [
	120, 250, // low
	420, 600, // medium
	820, 960, // high
	1180, 1250, 1450, 1640, // xhigh
	1760, 1880, 2050, // max
	2200, 2300, 2420, 2600, 2840, // ultracode
	2900, 3000, 3200, 3330, 3400, // ultrathink
	3470, 3539, // outro
];

const args = process.argv.slice(2);
const scaleArg = args.find((a) => a.startsWith('--scale='));
const scale = scaleArg ? Number(scaleArg.split('=')[1]) : 1;
const frames = args.filter((a) => !a.startsWith('--')).map(Number);
const list = frames.length ? frames : DEFAULT;

mkdirSync('out/stills', {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const composition = await selectComposition({serveUrl, id: 'EffortEvolution', browserExecutable});
for (const f of list) {
	const output = `out/stills/f${String(f).padStart(4, '0')}.png`;
	const t0 = Date.now();
	await renderStill({composition, serveUrl, output, frame: f, scale, browserExecutable, overwrite: true});
	console.log(`${output}  (${Date.now() - t0} ms)`);
}
