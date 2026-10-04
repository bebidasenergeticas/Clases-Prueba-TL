// Procedural "hand-drawn" geometry: wobbly outlines + pencil hatching.
import {fbm1, range, rng} from './random';

export type Pt = [number, number];

const f1 = (n: number) => Math.round(n * 10) / 10;

/** Resample a polyline so consecutive points are ~`step` apart. */
export const resample = (pts: Pt[], step: number, closed: boolean): Pt[] => {
	const src = closed ? [...pts, pts[0]] : pts;
	const out: Pt[] = [];
	for (let i = 0; i < src.length - 1; i++) {
		const [x1, y1] = src[i];
		const [x2, y2] = src[i + 1];
		const len = Math.hypot(x2 - x1, y2 - y1);
		const n = Math.max(1, Math.ceil(len / step));
		for (let k = 0; k < n; k++) {
			const t = k / n;
			out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
		}
	}
	if (!closed) out.push(src[src.length - 1]);
	return out;
};

/** Points along a rounded rectangle perimeter (clockwise from top-left). */
export const roundRectPoints = (
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
): Pt[] => {
	r = Math.min(r, w / 2, h / 2);
	const pts: Pt[] = [];
	const arc = (cx: number, cy: number, a0: number) => {
		const n = Math.max(3, Math.ceil(r / 3));
		for (let i = 0; i <= n; i++) {
			const a = a0 + (Math.PI / 2) * (i / n);
			pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
		}
	};
	arc(x + w - r, y + r, -Math.PI / 2);
	arc(x + w - r, y + h - r, 0);
	arc(x + r, y + h - r, Math.PI / 2);
	arc(x + r, y + r, Math.PI);
	return pts;
};

export const ellipsePoints = (
	cx: number,
	cy: number,
	rx: number,
	ry: number,
	n = 48,
): Pt[] => {
	const pts: Pt[] = [];
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
	}
	return pts;
};

export type WobbleOpts = {
	seed?: number;
	amp?: number; // px of wobble
	freq?: number; // wobble frequency along arc length (1/px)
	step?: number; // resample step
	boil?: number; // boil index (changes the noise phase)
};

/** Offset each point along its normal with smooth noise -> organic line. */
export const wobble = (pts: Pt[], closed: boolean, o: WobbleOpts = {}): Pt[] => {
	const {seed = 1, amp = 1.2, freq = 1 / 38, step = 7, boil = 0} = o;
	const p = resample(pts, step, closed);
	const n = p.length;
	let s = 0;
	return p.map((pt, i) => {
		const prev = p[(i - 1 + n) % n];
		const next = p[(i + 1) % n];
		const a = closed || (i > 0 && i < n - 1) ? prev : pt;
		const b = closed || (i > 0 && i < n - 1) ? next : pt;
		let dx = b[0] - a[0];
		let dy = b[1] - a[1];
		if (!closed && i === 0) {
			dx = next[0] - pt[0];
			dy = next[1] - pt[1];
		}
		if (!closed && i === n - 1) {
			dx = pt[0] - prev[0];
			dy = pt[1] - prev[1];
		}
		const len = Math.hypot(dx, dy) || 1;
		const nx = -dy / len;
		const ny = dx / len;
		if (i > 0) s += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
		const d = amp * fbm1(s * freq + boil * 3.71, seed);
		return [pt[0] + nx * d, pt[1] + ny * d];
	});
};

export const toPath = (pts: Pt[], closed: boolean) => {
	if (!pts.length) return '';
	let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
	for (let i = 1; i < pts.length; i++) d += `L${f1(pts[i][0])} ${f1(pts[i][1])}`;
	return closed ? d + 'Z' : d;
};

export const sketchRoundRect = (
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
	o: WobbleOpts = {},
) => toPath(wobble(roundRectPoints(x, y, w, h, r), true, o), true);

export const sketchPoly = (pts: Pt[], closed: boolean, o: WobbleOpts = {}) =>
	toPath(wobble(pts, closed, o), closed);

export const sketchEllipse = (
	cx: number,
	cy: number,
	rx: number,
	ry: number,
	o: WobbleOpts = {},
) => toPath(wobble(ellipsePoints(cx, cy, rx, ry, 64), true, o), true);

export const sketchLine = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	o: WobbleOpts = {},
) =>
	toPath(
		wobble(
			[
				[x1, y1],
				[x2, y2],
			],
			false,
			o,
		),
		false,
	);

/** Plain (non-wobbly) rounded-rect path, for clip paths. */
export const roundRectPath = (
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
) =>
	`M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

// --- hatching ------------------------------------------------------------

export type Seg = {x1: number; y1: number; x2: number; y2: number; o: number};

export type HatchOpts = {
	seed: number;
	box: {x: number; y: number; w: number; h: number};
	count: number;
	angle: number; // degrees (0 = horizontal, -50 = rising to the right)
	angleJitter?: number;
	len: [number, number];
	opacity: [number, number];
	/** acceptance weight in [0,1] for normalised (u, v) in the box */
	weight?: (u: number, v: number) => number;
	/** allow slight curvature / pencil tremor */
	maxTries?: number;
};

export const hatch = (o: HatchOpts): Seg[] => {
	const r = rng(o.seed);
	const out: Seg[] = [];
	const tries = o.maxTries ?? o.count * 12;
	let t = 0;
	while (out.length < o.count && t < tries) {
		t++;
		const u = r();
		const v = r();
		const w = o.weight ? o.weight(u, v) : 1;
		if (r() > w) continue;
		const cx = o.box.x + u * o.box.w;
		const cy = o.box.y + v * o.box.h;
		const len = range(r, o.len[0], o.len[1]);
		const a =
			((o.angle + range(r, -1, 1) * (o.angleJitter ?? 6)) * Math.PI) / 180;
		const dx = (Math.cos(a) * len) / 2;
		const dy = (Math.sin(a) * len) / 2;
		out.push({
			x1: cx - dx,
			y1: cy - dy,
			x2: cx + dx,
			y2: cy + dy,
			o: range(r, o.opacity[0], o.opacity[1]),
		});
	}
	return out;
};

/** Bucket segments by opacity so they render as a handful of <path>s. */
export const bucketSegs = (segs: Seg[], buckets = 3) => {
	const res: {d: string; o: number}[] = [];
	if (!segs.length) return res;
	const min = Math.min(...segs.map((s) => s.o));
	const max = Math.max(...segs.map((s) => s.o));
	for (let b = 0; b < buckets; b++) {
		const lo = min + ((max - min) * b) / buckets;
		const hi = min + ((max - min) * (b + 1)) / buckets + (b === buckets - 1 ? 1e-6 : 0);
		const inB = segs.filter((s) => s.o >= lo && s.o < hi);
		if (!inB.length) continue;
		const d = inB
			.map((s) => `M${f1(s.x1)} ${f1(s.y1)}L${f1(s.x2)} ${f1(s.y2)}`)
			.join('');
		res.push({d, o: (lo + hi) / 2});
	}
	return res;
};
