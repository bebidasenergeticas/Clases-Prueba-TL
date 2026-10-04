import React from 'react';
import {hash} from '../utils/random';

export type ParticleOpts = {
	frame: number;
	from: number; // first spawn frame
	to: number; // last spawn frame
	rate: number; // particles per frame
	origin: (i: number) => [number, number];
	velocity: (i: number) => [number, number]; // px/frame
	gravity?: number;
	life: number; // frames
	size: [number, number];
	colors: string[];
	seed: number;
	kind?: 'dot' | 'spark' | 'star';
	drag?: number;
};

/**
 * Deterministic, stateless particle system: every particle's position is a
 * closed-form function of (spawn frame, index), so any frame renders alone.
 */
export const Particles: React.FC<ParticleOpts & {opacity?: number}> = (o) => {
	const {frame, from, to, rate, life, seed} = o;
	const nodes: React.ReactNode[] = [];
	const first = Math.max(from, frame - life);
	const last = Math.min(to, frame);
	const g = o.gravity ?? 0;
	const drag = o.drag ?? 0.985;
	for (let f = Math.ceil(first); f <= last; f++) {
		const count = rate >= 1 ? Math.floor(rate) : hash(f, seed + 1) < rate ? 1 : 0;
		for (let k = 0; k < count; k++) {
			const i = f * 16 + k;
			const age = frame - f;
			if (age < 0 || age > life) continue;
			const [ox, oy] = o.origin(i);
			const [vx, vy] = o.velocity(i);
			// integrate with drag: x = v (1 - d^t) / (1 - d)
			const dt = (1 - Math.pow(drag, age)) / (1 - drag);
			const x = ox + vx * dt;
			const y = oy + vy * dt + 0.5 * g * age * age;
			const t = age / life;
			const sz = o.size[0] + (o.size[1] - o.size[0]) * hash(i, seed + 3);
			const col = o.colors[Math.floor(hash(i, seed + 5) * o.colors.length)];
			const alpha = (1 - t) * (t < 0.1 ? t * 10 : 1);
			if (o.kind === 'spark') {
				const sp = Math.hypot(vx, vy) || 1;
				const len = sz * 3;
				nodes.push(
					<line
						key={i}
						x1={x}
						y1={y}
						x2={x - (vx / sp) * len}
						y2={y - (vy / sp) * len + g * age * 0.6}
						stroke={col}
						strokeWidth={sz * 0.55}
						strokeLinecap="round"
						opacity={alpha}
					/>,
				);
			} else if (o.kind === 'star') {
				const s = sz * (0.6 + 0.4 * Math.sin(age * 0.3 + i));
				const k2 = s * 0.18;
				nodes.push(
					<path
						key={i}
						d={`M${x} ${y - s}C${x + k2} ${y - k2} ${x + k2} ${y - k2} ${x + s} ${y}C${x + k2} ${y + k2} ${x + k2} ${y + k2} ${x} ${y + s}C${x - k2} ${y + k2} ${x - k2} ${y + k2} ${x - s} ${y}C${x - k2} ${y - k2} ${x - k2} ${y - k2} ${x} ${y - s}Z`}
						fill={col}
						opacity={alpha}
					/>,
				);
			} else {
				nodes.push(<circle key={i} cx={x} cy={y} r={sz * (1 - t * 0.5)} fill={col} opacity={alpha} />);
			}
		}
	}
	return <g opacity={o.opacity ?? 1}>{nodes}</g>;
};
