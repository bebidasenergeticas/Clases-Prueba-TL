// MEDIUM — headset on, forehead display streaming code, fast typing on a big keyboard.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {MONO} from '../fonts';
import {clamp, easeInCubic, easeInOutCubic, easeOutCubic, impulse, lerp, prog, springAt} from '../utils/animation';
import {C} from '../utils/colors';
import {hash, noise1} from '../utils/random';
import {BEATS, PHASES} from '../utils/timing';
import {BODY_TOP} from './RobotBase';

const M = BEATS.medium;
const EXIT = BEATS.high.morph; // headset + display retract when the keyboard morphs

/** Fast, irregular typing for one hand (0..1 strike). */
export const fastTap = (frame: number, hand: number) => {
	const t = frame / 60;
	const v = Math.sin(t * Math.PI * 2 * (8.5 + hand * 0.9) + hand * 1.7);
	const burst = noise1(t * 2.2, 50 + hand) > -0.45 ? 1 : 0;
	return Math.max(0, v) * burst;
};

/** "Enter" strikes: head impacts every ~0.9 s while typing. */
const enterHits = (frame: number) => {
	let v = 0;
	for (let f = M.land + 60; f < EXIT; f += 52 + Math.floor(hash(f, 5) * 18)) {
		v += impulse(frame, f, 5) * (frame >= f ? 1 : 0);
	}
	return Math.min(1, v);
};

export const mediumAmount = (frame: number) =>
	prog(frame, M.land - 18, 24, easeOutCubic) * (1 - prog(frame, EXIT - 6, 20, easeInOutCubic));

export const applyMedium = (frame: number, s: SceneState) => {
	if (frame < BEATS.low.laptopOut || frame > PHASES.high.end) return;
	// --- transition LOW -> MEDIUM: anticipation crouch, hop, squash landing
	const crouch = prog(frame, M.jump - 12, 12, easeOutCubic) * (1 - prog(frame, M.jump, 4));
	const hop = clamp((frame - M.jump) / (M.land - M.jump));
	const inAir = frame >= M.jump && frame <= M.land;
	s.pose.squash += crouch * 0.07;
	s.pose.bob += crouch * 10;
	if (inAir) {
		s.pose.lift += Math.sin(hop * Math.PI) * 54;
		s.pose.squash -= Math.sin(hop * Math.PI) * 0.05;
		s.pose.legRot = s.pose.legRot.map((r, i) => r + (i < 2 ? -1 : 1) * Math.sin(hop * Math.PI) * 9);
	}
	const land = impulse(frame, M.land, 7) * (frame >= M.land ? 1 : 0);
	s.pose.squash += land * 0.08;
	s.pose.bob += land * 7;

	// --- typing pose
	const a = mediumAmount(frame);
	const tl = fastTap(frame, 0) * a;
	const tr = fastTap(frame, 1) * a;
	s.pose.armL = {...s.pose.armL, dx: s.pose.armL.dx + 54 * a, dy: s.pose.armL.dy + 66 * a - tl * 7, rot: s.pose.armL.rot * (1 - a) + tl * 4, front: a > 0.5};
	s.pose.armR = {...s.pose.armR, dx: s.pose.armR.dx - 54 * a, dy: s.pose.armR.dy + 66 * a - tr * 7, rot: s.pose.armR.rot * (1 - a) - tr * 4, front: a > 0.5};

	// focused, slanted eyes
	const focus = prog(frame, M.land + 2, 14, easeOutCubic) * (1 - prog(frame, EXIT, 16, easeInOutCubic));
	s.look.anger = Math.max(s.look.anger, focus);
	s.pose.eyeDy += 3 * focus;
	s.pose.eyeDx += noise1(frame / 18, 9) * 2.5 * focus;

	// head impacts on enter + subtle squash/stretch with typing
	const hit = enterHits(frame) * a;
	s.pose.bob += hit * 4 + (tl + tr) * 0.9;
	s.pose.squash += hit * 0.025;
	s.camera.scale += hit * 0.004;
};

// --- headset ---------------------------------------------------------------
export const Headset: React.FC = () => {
	const frame = useCurrentFrame();
	const band = prog(frame, M.headset, 22, easeOutCubic) * (1 - prog(frame, EXIT - 4, 18, easeInCubic));
	const cups = springAt(frame, M.headset + 8, {damping: 10, stiffness: 180}) * (1 - prog(frame, EXIT + 4, 12, easeInCubic));
	const mic = prog(frame, M.headset + 16, 16, easeOutCubic) * (1 - prog(frame, EXIT - 8, 12, easeInCubic));
	if (band < 0.01 && cups < 0.01) return null;
	const top = BODY_TOP - 22;
	const bandD = `M-221 -236L-221 ${top + 34}Q-221 ${top} -186 ${top}L186 ${top}Q221 ${top} 221 ${top + 34}L221 -236`;
	const cup = (side: -1 | 1) => {
		const cx = side * 216;
		return (
			<g transform={`translate(${cx} -226) scale(${cups.toFixed(4)}) translate(${-cx} 226)`}>
				<rect x={cx - 17} y={-264} width={34} height={76} rx={10} fill="#2A2022" stroke={C.ink} strokeWidth={4} />
				<rect x={cx - 9} y={-254} width={18} height={56} rx={6} fill="#4A3C3B" />
				<line x1={cx - 3} y1={-248} x2={cx - 3} y2={-206} stroke="#6E5E5B" strokeWidth={2} strokeLinecap="round" />
			</g>
		);
	};
	return (
		<g>
			<path d={bandD} fill="none" stroke={C.ink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - band} />
			<path d={bandD} fill="none" stroke="#5A4846" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - band} opacity={0.9} transform="translate(0 -1.5)" />
			{cup(-1)}
			{cup(1)}
			{mic > 0.01 && (
				<g>
					<path
						d="M-212 -194C-202 -168 -150 -162 -88 -166"
						fill="none"
						stroke={C.ink}
						strokeWidth={6}
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - mic}
					/>
					<g opacity={clamp(mic * 3 - 2)} transform={`translate(-76 -166) scale(${lerp(0.4, 1, clamp(mic * 2 - 1))})`}>
						<rect x={-13} y={-9} width={26} height={18} rx={8} fill="#2A2022" stroke={C.ink} strokeWidth={3} />
						<circle cx={-4} cy={-1} r={1.6} fill="#7A6865" />
						<circle cx={3} cy={2} r={1.6} fill="#7A6865" />
					</g>
				</g>
			)}
		</g>
	);
};

// --- forehead display streaming code ----------------------------------------
const CODE = `const plan = think();
function solve(task) {
  const parts = split(task);
  for (const p of parts) {
    run(p); verify(p);
  }
  return merge(parts);
}
await solve(plan);
// ship it
`;
const KEYWORDS = /\b(const|function|for|of|return|await)\b/g;

const CodeLine: React.FC<{line: string; y: number}> = ({line, y}) => {
	const parts: {t: string; k: boolean}[] = [];
	let last = 0;
	line.replace(KEYWORDS, (m, _g, idx: number) => {
		if (idx > last) parts.push({t: line.slice(last, idx), k: false});
		parts.push({t: m, k: true});
		last = idx + m.length;
		return m;
	});
	if (last < line.length) parts.push({t: line.slice(last), k: false});
	return (
		<text x={-92} y={y} fontFamily={MONO} fontSize={13.5} fontWeight={500} xmlSpace="preserve" style={{whiteSpace: 'pre'}}>
			{parts.map((p, i) => (
				<tspan key={i} fill={p.k ? '#F39A72' : '#E9E1D3'}>
					{p.t}
				</tspan>
			))}
		</text>
	);
};

export const ForeheadDisplay: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = springAt(frame, M.display, {damping: 11, stiffness: 190});
	const hide = prog(frame, EXIT - 10, 12, easeInCubic);
	const sy = pop * (1 - hide);
	if (sy < 0.01) return null;
	const cps = 34;
	const n = Math.max(0, Math.floor(((frame - M.display - 8) / 60) * cps));
	const typed = CODE.slice(0, n % (CODE.length + 30));
	const lines = typed.split('\n');
	const shown = lines.slice(-3);
	const cy = BODY_TOP + 40;
	const caretOn = Math.floor(frame / 15) % 2 === 0;
	const lastLine = shown[shown.length - 1] ?? '';
	return (
		<g transform={`translate(0 ${cy}) scale(${(0.6 + 0.4 * pop).toFixed(4)} ${sy.toFixed(4)}) translate(0 ${-cy})`}>
			<rect x={-104} y={cy - 28} width={208} height={56} rx={8} fill="#171313" stroke={C.ink} strokeWidth={4.5} />
			<rect x={-98} y={cy - 22} width={196} height={44} rx={4} fill="#221A1B" />
			<clipPath id="fh-clip">
				<rect x={-98} y={cy - 22} width={196} height={44} rx={4} />
			</clipPath>
			<g clipPath="url(#fh-clip)">
				{shown.map((l, i) => (
					<CodeLine key={i} line={l} y={cy - 9 + i * 14.5 - (shown.length - 3) * 14.5} />
				))}
				<rect
					x={-92 + lastLine.length * 8.1}
					y={cy - 9 + (shown.length - 1) * 14.5 - 11 - (shown.length - 3) * 14.5}
					width={7}
					height={13}
					fill="#F39A72"
					opacity={caretOn ? 0.9 : 0.15}
				/>
			</g>
			{/* glass glare */}
			<path d={`M${-90} ${cy - 20}L${-60} ${cy - 20}L${-80} ${cy + 20}L${-96} ${cy + 20}Z`} fill="#FFFFFF" opacity={0.05} />
		</g>
	);
};

// --- keyboard ---------------------------------------------------------------
export type Slab = {backY: number; backW: number; frontY: number; frontW: number; thick: number};
export const KEYBOARD_SLAB: Slab = {backY: -90, backW: 338, frontY: -60, frontW: 362, thick: 16};

export const slabPoint = (g: Slab, u: number, v: number): [number, number] => {
	const w = lerp(g.backW, g.frontW, v);
	return [(u - 0.5) * w, lerp(g.backY, g.frontY, v)];
};

const quad = (g: Slab, u0: number, v0: number, u1: number, v1: number) => {
	const a = slabPoint(g, u0, v0);
	const b = slabPoint(g, u1, v0);
	const c = slabPoint(g, u1, v1);
	const d = slabPoint(g, u0, v1);
	return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}L${c[0].toFixed(1)} ${c[1].toFixed(1)}L${d[0].toFixed(1)} ${d[1].toFixed(1)}Z`;
};

const ROWS = 4;
const COLS = 13;

/** Keys on top of a slab. `opacity` lets the board morph fade them out. */
export const KeyboardKeys: React.FC<{g: Slab; opacity: number; frame: number}> = ({g, opacity, frame}) => {
	if (opacity < 0.01) return null;
	const keys: React.ReactNode[] = [];
	const u0 = 0.045;
	const u1 = 0.955;
	const v0 = 0.14;
	const v1 = 0.9;
	const step = Math.floor(frame / 4);
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			const isEnter = c === COLS - 1 && (r === 1 || r === 2);
			if (c === COLS - 1 && r === 2) continue; // merged into tall enter key
			const ku0 = u0 + ((u1 - u0) * c) / COLS + 0.004;
			const ku1 = u0 + ((u1 - u0) * (c + 1)) / COLS - 0.004;
			const kv0 = v0 + ((v1 - v0) * r) / ROWS + 0.02;
			const kv1 = v0 + ((v1 - v0) * (r + (isEnter ? 2 : 1))) / ROWS - 0.02;
			const pressed = hash(step * 97 + r * 13 + c, 3) > 0.9;
			const dy = pressed ? 1.5 : 0;
			keys.push(
				<path
					key={`${r}-${c}`}
					d={quad(g, ku0, kv0, ku1, kv1)}
					transform={dy ? `translate(0 ${dy})` : undefined}
					fill={isEnter ? C.orange : pressed ? '#E3D8C4' : '#FBF6EC'}
					stroke={isEnter ? '#A8452C' : '#B5A992'}
					strokeWidth={1.1}
				/>,
			);
		}
	}
	// space bar
	keys.push(
		<path key="space" d={quad(g, 0.3, 0.93, 0.7, 0.985)} fill="#FBF6EC" stroke="#B5A992" strokeWidth={1.1} transform={hash(step, 77) > 0.8 ? 'translate(0 1.2)' : undefined} />,
	);
	return <g opacity={opacity}>{keys}</g>;
};
