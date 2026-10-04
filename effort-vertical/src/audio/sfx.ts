// Sound-design cue sheet. Visuals never depend on audio: cues only play when
// the composition is rendered with {"withAudio": true} and the WAVs exist in
// public/sfx/ (generate them procedurally with `npm run sfx`).
import {BEATS, PHASES, sec} from '../utils/timing';

export type SfxName =
	| 'type-soft'
	| 'type-fast'
	| 'whoosh'
	| 'chess-click'
	| 'pop'
	| 'thud'
	| 'hum'
	| 'zap'
	| 'discharge'
	| 'clank'
	| 'power-up'
	| 'hud-beep'
	| 'clone-pop'
	| 'chime'
	| 'shimmer'
	| 'swell';

export type Cue = {at: number; sfx: SfxName; volume?: number; playbackRate?: number};

const strikeFrames = () => {
	const out: number[] = [];
	const base = BEATS.xhigh.powerOn + 40;
	for (let f = base; f < BEATS.xhigh.overload; f += 56) out.push(f);
	for (let f = base + Math.ceil((BEATS.xhigh.overload - base) / 14) * 14; f < PHASES.max.start; f += 14) out.push(f);
	return out;
};

export const CUES: Cue[] = [
	// LOW
	{at: sec(1.0), sfx: 'type-soft', volume: 0.35},
	{at: sec(3.0), sfx: 'type-soft', volume: 0.35},
	// MEDIUM
	{at: BEATS.medium.jump, sfx: 'whoosh', volume: 0.4},
	{at: BEATS.medium.land, sfx: 'thud', volume: 0.35},
	{at: sec(6.7), sfx: 'type-fast', volume: 0.45},
	{at: sec(8.7), sfx: 'type-fast', volume: 0.45},
	{at: sec(10.7), sfx: 'type-fast', volume: 0.4},
	// HIGH
	{at: BEATS.high.morph, sfx: 'whoosh', volume: 0.35, playbackRate: 0.8},
	...BEATS.high.moves.map((m, i) => ({at: m + [26, 14, 24, 20, 18][i], sfx: 'chess-click' as const, volume: 0.6})),
	// XHIGH
	{at: BEATS.xhigh.glasses, sfx: 'pop', volume: 0.45},
	{at: BEATS.xhigh.coilsIn + 20, sfx: 'thud', volume: 0.6},
	{at: BEATS.xhigh.powerOn, sfx: 'hum', volume: 0.35},
	...strikeFrames().map((f) => ({at: f, sfx: 'zap' as const, volume: 0.32})),
	{at: PHASES.max.start - 6, sfx: 'discharge', volume: 0.7},
	// MAX
	...[0, 12, 24, 36, 48].map((d) => ({at: BEATS.max.assemble + d + 10, sfx: 'clank' as const, volume: 0.5})),
	{at: BEATS.max.powerUp, sfx: 'power-up', volume: 0.55},
	{at: BEATS.max.hud + 20, sfx: 'hud-beep', volume: 0.35},
	// ULTRACODE
	{at: BEATS.ultracode.violet, sfx: 'chime', volume: 0.35},
	...BEATS.ultracode.waves.map((w, i) => ({at: w, sfx: 'clone-pop' as const, volume: 0.35 + i * 0.08, playbackRate: 1 + i * 0.08})),
	...BEATS.ultracode.ripples.map((r) => ({at: r, sfx: 'chime' as const, volume: 0.4})),
	// ULTRATHINK
	{at: BEATS.ultrathink.burst, sfx: 'shimmer', volume: 0.6},
	{at: BEATS.ultrathink.peak - sec(1.2), sfx: 'swell', volume: 0.5},
];
