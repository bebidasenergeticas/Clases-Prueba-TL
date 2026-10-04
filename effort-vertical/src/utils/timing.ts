// Global timeline. All values in frames @ 60 fps.
// Phase starts were derived from the reference contact sheet (see REFERENCE_ANALYSIS.md):
// the bottom badge is caught mid-typing at known timestamps, which pins each level's start.

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const sec = (s: number) => Math.round(s * FPS);

export type Level =
	| 'low'
	| 'medium'
	| 'high'
	| 'xhigh'
	| 'max'
	| 'ultracode'
	| 'ultrathink';

export const LEVELS: Level[] = [
	'low',
	'medium',
	'high',
	'xhigh',
	'max',
	'ultracode',
	'ultrathink',
];

export type Window = {start: number; end: number};

export const PHASES: Record<Level | 'outro', Window> = {
	low: {start: 0, end: sec(6.0)},
	medium: {start: sec(6.0), end: sec(12.2)},
	high: {start: sec(12.2), end: sec(18.3)},
	xhigh: {start: sec(18.3), end: sec(28.6)},
	max: {start: sec(28.6), end: sec(36.0)},
	ultracode: {start: sec(36.0), end: sec(48.0)},
	ultrathink: {start: sec(48.0), end: sec(57.0)},
	outro: {start: sec(57.0), end: sec(59.0)},
};

export const DURATION = PHASES.outro.end; // 3540 frames = 59.0 s

// Menu reset cascade at the very end so the video loops seamlessly into frame 0.
export const MENU_RESET = {start: sec(58.15), end: sec(58.85)};

export const levelIndexAt = (frame: number): number => {
	let idx = 0;
	LEVELS.forEach((l, i) => {
		if (frame >= PHASES[l].start) idx = i;
	});
	return idx;
};

// Key beats inside phases (absolute frames). Kept here so transitions, camera
// and audio cues stay in sync from a single source of truth.
export const BEATS = {
	low: {
		laptopIn: sec(0.55),
		laptopOut: sec(5.62),
	},
	medium: {
		jump: sec(5.85),
		land: sec(6.3),
		headset: sec(6.2),
		keyboard: sec(6.15),
		display: sec(6.55),
	},
	high: {
		morph: sec(12.0),
		moves: [sec(13.25), sec(14.25), sec(15.2), sec(16.1), sec(17.0)],
		exit: sec(18.0),
	},
	xhigh: {
		glasses: sec(18.35),
		bubbles: sec(19.5),
		coilsIn: sec(21.6),
		cables: sec(22.0),
		powerOn: sec(22.8),
		overload: sec(27.5),
	},
	max: {
		flash: sec(28.6),
		assemble: sec(28.9),
		powerUp: sec(30.15),
		hud: sec(30.5),
		collapse: sec(35.35),
	},
	ultracode: {
		violet: sec(36.1),
		waves: [sec(36.9), sec(37.6), sec(38.3), sec(39.1), sec(40.0)],
		ripples: [sec(42.6), sec(44.8)],
		dissolve: sec(46.6),
	},
	ultrathink: {
		burst: sec(47.9),
		rainbow: sec(48.0),
		liftoff: sec(48.9),
		peak: sec(55.4),
		fade: sec(56.3),
	},
};
