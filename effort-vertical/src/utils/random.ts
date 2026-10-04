// Deterministic randomness: every render of the same frame is identical.

// Integer hash -> [0, 1)
export const hash = (n: number, seed = 0): number => {
	let h = (Math.imul(n | 0, 0x27d4eb2d) ^ Math.imul(seed | 0, 0x165667b1)) >>> 0;
	h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
	h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
	h = (h ^ (h >>> 16)) >>> 0;
	return h / 4294967296;
};

// Seeded PRNG stream (mulberry32)
export const rng = (seed: number) => {
	let a = (seed * 2654435761) >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

export const range = (r: () => number, min: number, max: number) =>
	min + (max - min) * r();

// Smooth 1D value noise in [-1, 1]
export const noise1 = (x: number, seed = 0): number => {
	const i = Math.floor(x);
	const f = x - i;
	const u = f * f * (3 - 2 * f);
	const a = hash(i, seed) * 2 - 1;
	const b = hash(i + 1, seed) * 2 - 1;
	return a + (b - a) * u;
};

// Fractal (2 octaves) smooth noise in ~[-1, 1]
export const fbm1 = (x: number, seed = 0): number =>
	(noise1(x, seed) * 0.7 + noise1(x * 2.13 + 17.1, seed + 9) * 0.3);
