import {spring, SpringConfig} from 'remotion';
import {FPS} from './timing';
import {hash, noise1} from './random';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) =>
	clamp((v - a) / (b - a));

// --- easings -------------------------------------------------------------
export const easeInCubic = (t: number) => t * t * t;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
export const easeInQuad = (t: number) => t * t;
export const easeOutBack = (t: number, s = 1.70158) => {
	const c3 = s + 1;
	return 1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
};
export const easeInBack = (t: number, s = 1.70158) =>
	(s + 1) * t * t * t - s * t * t;

/** Clamped 0..1 progress of `frame` inside [start, start+dur], with easing. */
export const prog = (
	frame: number,
	start: number,
	dur: number,
	ease: (t: number) => number = (t) => t,
) => ease(clamp((frame - start) / Math.max(1, dur)));

/** Spring that starts at `start` (absolute frame). Returns 0 before start. */
export const springAt = (
	frame: number,
	start: number,
	config: Partial<SpringConfig> = {},
	durationInFrames?: number,
) =>
	frame < start
		? 0
		: spring({
				frame: frame - start,
				fps: FPS,
				config: {damping: 12, stiffness: 140, mass: 0.8, ...config},
				durationInFrames,
			});

/** Spring in, spring out: 0 -> 1 at `inAt`, 1 -> 0 at `outAt`. */
export const presence = (
	frame: number,
	inAt: number,
	outAt: number,
	inCfg: Partial<SpringConfig> = {},
	outDur = 14,
) => {
	const a = springAt(frame, inAt, inCfg);
	const b = prog(frame, outAt, outDur, easeInBack);
	return a * (1 - b);
};

/** Triangle pulse 0->1->0 centered at `at` with half-width `w`. */
export const pulse = (frame: number, at: number, w: number) =>
	clamp(1 - Math.abs(frame - at) / w);

/** Exponentially-decaying shake impulse started at `at`. */
export const impulse = (frame: number, at: number, decay = 10) =>
	frame < at ? 0 : Math.exp(-(frame - at) / decay);

// --- character life ------------------------------------------------------

const blinkCache = new Map<number, number[]>();
const blinkTimes = (seed: number) => {
	const cached = blinkCache.get(seed);
	if (cached) return cached;
	const arr: number[] = [];
	let t = 20 + Math.floor(hash(0, seed) * 90);
	let i = 0;
	while (t < 4000) {
		arr.push(t);
		// occasional double blink
		if (hash(i + 99, seed) > 0.72) arr.push(t + 14);
		t += Math.floor(132 + hash(i + 1, seed) * 132);
		i++;
	}
	blinkCache.set(seed, arr);
	return arr;
};

const blinkShape = (d: number) => {
	if (d < 0 || d > 10) return 1;
	if (d < 3) return 1 - d / 3; // close fast
	if (d < 5) return 0.05; // hold
	return 0.05 + ((d - 5) / 5) * 0.95; // open
};

/**
 * Deterministic semi-random blink schedule. Returns eye openness (1 = open).
 * Blinks every ~2.2–4.4 s, sometimes a double blink.
 */
export const blink = (frame: number, seed = 1) => {
	let open = 1;
	for (const t of blinkTimes(seed)) {
		if (t > frame) break;
		if (frame - t <= 10) open = Math.min(open, blinkShape(frame - t));
	}
	return Math.max(0.05, open);
};

/** Idle breathing bob in px (positive = down). */
export const breathe = (frame: number, amp = 4, period = 150, seed = 3) =>
	Math.sin((frame / period) * Math.PI * 2) * amp +
	noise1(frame / 90, seed) * amp * 0.35;

/** Hand-drawn "boil": index that changes every `every` frames. */
export const boilIndex = (frame: number, every = 6) => Math.floor(frame / every);
