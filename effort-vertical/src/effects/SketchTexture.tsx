import React, {useMemo} from 'react';
import {bucketSegs, hatch, HatchOpts, Seg} from '../utils/sketch';

/** Renders hatch segments as a few bucketed <path>s (cheap DOM). */
export const HatchLayer: React.FC<{
	segs: Seg[];
	color: string;
	width?: number;
	opacity?: number;
	buckets?: number;
}> = ({segs, color, width = 1.3, opacity = 1, buckets = 3}) => {
	const paths = useMemo(() => bucketSegs(segs, buckets), [segs, buckets]);
	return (
		<g opacity={opacity}>
			{paths.map((p, i) => (
				<path
					key={i}
					d={p.d}
					stroke={color}
					strokeWidth={width}
					strokeOpacity={p.o}
					strokeLinecap="round"
					fill="none"
				/>
			))}
		</g>
	);
};

const smooth = (a: number, b: number, x: number) => {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

export type SurfaceTexture = {
	streaks: Seg[];
	hatch: Seg[];
	cross: Seg[];
	scratches: Seg[];
};

/**
 * The "illustrated" surface used on the robot body, reproduced from the
 * reference: light horizontal streaks top-left, diagonal pencil hatching that
 * thickens toward the lower-right, cross-hatching in the bottom-right corner.
 */
export const makeSurfaceTexture = (
	seed: number,
	box: {x: number; y: number; w: number; h: number},
	density = 1,
): SurfaceTexture => {
	const area = (box.w * box.h) / (420 * 258);
	const n = (k: number) => Math.max(4, Math.round(k * area * density));
	const base: Omit<HatchOpts, 'count' | 'angle' | 'len' | 'opacity' | 'seed'> = {
		box,
	};
	return {
		streaks: hatch({
			...base,
			seed: seed * 7 + 1,
			count: n(80),
			angle: -3,
			angleJitter: 3,
			len: [16, 64],
			opacity: [0.22, 0.62],
			weight: (u, v) => Math.pow(1 - u, 0.9) * Math.pow(1 - v, 1.4) * 1.25,
		}),
		hatch: hatch({
			...base,
			seed: seed * 7 + 2,
			count: n(150),
			angle: -57,
			angleJitter: 7,
			len: [12, 46],
			opacity: [0.1, 0.34],
			weight: (u, v) => 0.12 + smooth(0.25, 1.05, u * 0.62 + v * 0.58),
		}),
		cross: hatch({
			...base,
			seed: seed * 7 + 3,
			count: n(55),
			angle: 38,
			angleJitter: 8,
			len: [10, 30],
			opacity: [0.08, 0.26],
			weight: (u, v) => smooth(0.45, 1.0, u * 0.55 + v * 0.6),
		}),
		scratches: hatch({
			...base,
			seed: seed * 7 + 4,
			count: n(14),
			angle: -62,
			angleJitter: 5,
			len: [40, 95],
			opacity: [0.06, 0.16],
		}),
	};
};

export const SurfaceTextureLayer: React.FC<{
	tex: SurfaceTexture;
	light: string;
	dark: string;
	strength?: number;
}> = ({tex, light, dark, strength = 1}) => (
	<g>
		<HatchLayer segs={tex.streaks} color={light} width={2.4} opacity={strength} />
		<HatchLayer segs={tex.scratches} color={dark} width={1} opacity={strength} />
		<HatchLayer segs={tex.hatch} color={dark} width={1.35} opacity={strength} />
		<HatchLayer segs={tex.cross} color={dark} width={1.2} opacity={strength} />
	</g>
);

/** Subtle texture for beige / metal / paper-like surfaces. */
export const makeMatteTexture = (
	seed: number,
	box: {x: number; y: number; w: number; h: number},
	density = 1,
): Seg[] => {
	const area = (box.w * box.h) / (300 * 150);
	return hatch({
		seed: seed * 13 + 5,
		box,
		count: Math.max(6, Math.round(60 * area * density)),
		angle: -55,
		angleJitter: 8,
		len: [8, 30],
		opacity: [0.06, 0.2],
		weight: (u, v) => 0.25 + smooth(0.2, 1, u * 0.5 + v * 0.7),
	});
};
