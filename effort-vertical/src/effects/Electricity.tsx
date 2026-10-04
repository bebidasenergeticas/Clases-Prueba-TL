import React from 'react';
import {rng, range} from '../utils/random';

type P = [number, number];

/**
 * Jagged lightning path between A and B following a quadratic "bow"
 * (control point C), via recursive midpoint displacement.
 */
export const boltPoints = (a: P, b: P, c: P, seed: number, rough = 0.16, depth = 6): P[] => {
	const r = rng(seed);
	const q = (t: number): P => [
		(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
		(1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
	];
	let ts = [0, 1];
	let offs = [0, 0];
	const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
	let amp = len * rough;
	for (let d = 0; d < depth; d++) {
		const nts: number[] = [];
		const noffs: number[] = [];
		for (let i = 0; i < ts.length - 1; i++) {
			nts.push(ts[i]);
			noffs.push(offs[i]);
			nts.push((ts[i] + ts[i + 1]) / 2);
			noffs.push((offs[i] + offs[i + 1]) / 2 + range(r, -1, 1) * amp);
		}
		nts.push(ts[ts.length - 1]);
		noffs.push(offs[offs.length - 1]);
		ts = nts;
		offs = noffs;
		amp *= 0.55;
	}
	return ts.map((t, i) => {
		const p = q(t);
		const p2 = q(Math.min(1, t + 0.01));
		const p1 = q(Math.max(0, t - 0.01));
		const dx = p2[0] - p1[0];
		const dy = p2[1] - p1[1];
		const l = Math.hypot(dx, dy) || 1;
		return [p[0] + (-dy / l) * offs[i], p[1] + (dx / l) * offs[i]];
	});
};

const toD = (pts: P[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');

/** A single electric arc: soft glow + coloured body + white-hot core (+ forks). */
export const Bolt: React.FC<{
	a: P;
	b: P;
	bow?: P; // control point (defaults to midpoint)
	seed: number;
	intensity?: number; // 0..1
	color?: string;
	core?: string;
	width?: number;
	rough?: number;
	forks?: number;
}> = ({a, b, bow, seed, intensity = 1, color = '#7CFF6B', core = '#F2FFEE', width = 1, rough = 0.16, forks = 2}) => {
	if (intensity <= 0.01) return null;
	const c: P = bow ?? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
	const pts = boltPoints(a, b, c, seed, rough);
	const d = toD(pts);
	const r = rng(seed * 3 + 1);
	const forkDs: string[] = [];
	for (let i = 0; i < forks; i++) {
		const idx = Math.floor(range(r, 0.2, 0.8) * (pts.length - 1));
		const s = pts[idx];
		const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + range(r, -1.2, 1.2);
		const len = range(r, 30, 80) * width;
		const e: P = [s[0] + Math.cos(ang) * len, s[1] + Math.sin(ang) * len];
		forkDs.push(toD(boltPoints(s, e, [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2], seed * 7 + i, 0.25, 4)));
	}
	return (
		<g opacity={Math.min(1, intensity)} strokeLinecap="round" strokeLinejoin="round" fill="none">
			<path d={d} stroke={color} strokeWidth={22 * width} opacity={0.4} filter="url(#blur-sm)" />
			<path d={d} stroke={color} strokeWidth={5 * width} />
			{forkDs.map((fd, i) => (
				<path key={i} d={fd} stroke={color} strokeWidth={2.5 * width} opacity={0.85} />
			))}
			<path d={d} stroke={core} strokeWidth={1.8 * width} />
		</g>
	);
};
