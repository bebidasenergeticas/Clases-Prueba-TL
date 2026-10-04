import React from 'react';
import {RAINBOW, RAINBOW_PASTEL} from '../utils/colors';
import {sketchEllipse} from '../utils/sketch';

/**
 * Huge concentric pastel halo (no blur filter: a radial gradient gives the
 * soft bands for free) + hand-drawn ring outlines on each band edge.
 */
export const EnergyHalo: React.FC<{
	cx: number;
	cy: number;
	radius: number;
	amount: number;
	frame: number;
}> = ({cx, cy, radius, amount, frame}) => {
	if (amount < 0.01) return null;
	const breathe = 1 + Math.sin(frame / 40) * 0.02;
	const r = radius * breathe;
	const boil = Math.floor(frame / 6);
	const rings = RAINBOW_PASTEL.length;
	// outer bands first (violet/pink outside, warm inside)
	const stops = [...RAINBOW_PASTEL].reverse();
	return (
		<g opacity={amount}>
			<defs>
				<radialGradient id="halo-grad" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#FFFDF6" stopOpacity={0.9} />
					{stops.map((c, i) => (
						<stop key={i} offset={`${12 + (i / (stops.length - 1)) * 80}%`} stopColor={c} stopOpacity={0.55 - i * 0.04} />
					))}
					<stop offset="100%" stopColor={RAINBOW_PASTEL[RAINBOW_PASTEL.length - 1]} stopOpacity={0} />
				</radialGradient>
			</defs>
			<circle cx={cx} cy={cy} r={r} fill="url(#halo-grad)" />
			{Array.from({length: rings}).map((_, i) => {
				const rr = r * (0.2 + (i / rings) * 0.78);
				return (
					<path
						key={i}
						d={sketchEllipse(cx, cy, rr, rr, {seed: 700 + i, amp: 1.6, boil, step: 14})}
						fill="none"
						stroke={RAINBOW[(RAINBOW.length - 1 - i + RAINBOW.length) % RAINBOW.length]}
						strokeWidth={1.6}
						opacity={0.22}
					/>
				);
			})}
		</g>
	);
};

/** Thin tilted orbit ring, split in a back half and a front half for depth. */
export const OrbitRing: React.FC<{
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	rot: number;
	half: 'back' | 'front';
	frame: number;
	speed: number;
	amount: number;
	id: string;
}> = ({cx, cy, rx, ry, rot, half, frame, speed, amount, id}) => {
	if (amount < 0.01) return null;
	return (
		<g transform={`translate(${cx} ${cy}) rotate(${rot})`} opacity={amount}>
			<defs>
				<linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="0">
					{RAINBOW.map((c, i) => (
						<stop key={c} offset={`${(i / (RAINBOW.length - 1)) * 100}%`} stopColor={c} />
					))}
				</linearGradient>
				<clipPath id={`${id}-${half}`}>
					<rect x={-rx - 40} y={half === 'back' ? -ry - 40 : 0} width={rx * 2 + 80} height={ry + 40} />
				</clipPath>
			</defs>
			<g clipPath={`url(#${id}-${half})`}>
				<ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={`url(#${id}-g)`} strokeWidth={8} opacity={0.25} filter="url(#blur-sm)" />
				<ellipse
					cx={0}
					cy={0}
					rx={rx}
					ry={ry}
					fill="none"
					stroke={`url(#${id}-g)`}
					strokeWidth={3.2}
					strokeDasharray="46 22 8 22"
					strokeDashoffset={-frame * speed}
					strokeLinecap="round"
				/>
			</g>
		</g>
	);
};
