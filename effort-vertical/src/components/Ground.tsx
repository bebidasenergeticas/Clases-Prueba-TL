import React, {useMemo} from 'react';
import {C, RAINBOW} from '../utils/colors';
import {range, rng} from '../utils/random';
import {sketchLine} from '../utils/sketch';

export const GROUND_Y = 1300;

/** Thin pencil ground line, fading at both ends. */
export const GroundLine: React.FC<{y?: number; opacity?: number}> = ({y = GROUND_Y, opacity = 1}) => {
	const d = useMemo(() => sketchLine(48, y, 1032, y, {seed: 3, amp: 0.7, step: 10, freq: 1 / 90}), [y]);
	const d2 = useMemo(() => sketchLine(140, y + 1.2, 940, y + 0.8, {seed: 8, amp: 0.9, step: 12, freq: 1 / 70}), [y]);
	return (
		<g opacity={opacity}>
			<defs>
				<linearGradient id="ground-fade" x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor={C.ground} stopOpacity={0} />
					<stop offset="0.12" stopColor={C.ground} stopOpacity={1} />
					<stop offset="0.88" stopColor={C.ground} stopOpacity={1} />
					<stop offset="1" stopColor={C.ground} stopOpacity={0} />
				</linearGradient>
			</defs>
			<path d={d} stroke="url(#ground-fade)" strokeWidth={2} fill="none" strokeLinecap="round" />
			<path d={d2} stroke="url(#ground-fade)" strokeWidth={1} fill="none" opacity={0.5} />
		</g>
	);
};

/**
 * Pencil-hatched contact shadow (dense short strokes inside an ellipse),
 * exactly the way the reference shades the floor under the robot.
 */
export const PencilShadow: React.FC<{
	cx: number;
	cy: number;
	rx: number;
	ry?: number;
	opacity?: number;
	seed?: number;
	rainbow?: number;
}> = ({cx, cy, rx, ry = 12, opacity = 1, seed = 1, rainbow = 0}) => {
	const strokes = useMemo(() => {
		const r = rng(seed * 97 + 3);
		const out: {d: string; o: number}[] = [];
		const buckets: string[][] = [[], [], []];
		for (let i = 0; i < 2600; i++) {
			const u = range(r, -1, 1);
			const v = range(r, -1, 1);
			const d2 = u * u + v * v;
			if (d2 > 1) continue;
			// denser toward the middle, feathered rim
			if (r() > 1.0 - d2 * 0.8) continue;
			const x = u * 300;
			const y = v * 15 * (0.75 + 0.25 * Math.sqrt(1 - u * u));
			const len = range(r, 3, 8);
			const a = (range(r, 40, 62) * Math.PI) / 180;
			const dx = (Math.cos(a) * len) / 2;
			const dy = (Math.sin(a) * len) / 2;
			const b = Math.min(2, Math.floor(r() * 3 * (1.15 - d2 * 0.6)));
			buckets[b].push(`M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)}L${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`);
		}
		buckets.forEach((b, i) => out.push({d: b.join(''), o: [0.2, 0.34, 0.5][i]}));
		return out;
	}, [seed]);
	const sx = rx / 300;
	const sy = ry / 15;
	return (
		<g transform={`translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`} opacity={opacity}>
			<ellipse cx={0} cy={1} rx={285} ry={11} fill="#8E867D" opacity={0.28} filter="url(#blur-sm)" />
			{strokes.map((s, i) => (
				<path key={i} d={s.d} stroke={C.pencil} strokeWidth={1.1 / Math.max(0.4, sx)} strokeOpacity={s.o} strokeLinecap="round" />
			))}
			{rainbow > 0.01 && (
				<g opacity={rainbow}>
					{RAINBOW.map((c, i) => (
						<ellipse
							key={c}
							cx={0}
							cy={0}
							rx={250 + i * 9}
							ry={11 + i * 0.6}
							fill="none"
							stroke={c}
							strokeWidth={2.2 / sx}
							opacity={0.55 - i * 0.04}
						/>
					))}
				</g>
			)}
		</g>
	);
};
