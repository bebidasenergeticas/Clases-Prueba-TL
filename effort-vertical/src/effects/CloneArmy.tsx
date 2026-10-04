// ULTRACODE army: hundreds of parallel agents generated procedurally in
// perspective. Three levels of detail keep it fast:
//   near  (z <= 3)  -> RobotBase at "mid" detail
//   mid   (z <= 7)  -> lightweight per-clone SVG
//   far   (z  > 7)  -> one batched set of <path>s per row
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
	BODY_TOP,
	defaultLook,
	defaultPose,
	ROBOT,
	RobotBase,
} from '../components/RobotBase';
import {blink, clamp, easeInCubic, lerp, prog, springAt} from '../utils/animation';
import {BASE_PALETTE, C, fadePalette, mix, RobotPalette} from '../utils/colors';
import {hash} from '../utils/random';
import {BEATS} from '../utils/timing';

const U = BEATS.ultracode;
const HORIZON = 500;
const GY = 1300;
const RX = 540;
const Z0 = 1.42;
const ZK = 1.12;
const ROWS = 26;
const SPACING = 560;
const HALF = ROBOT.W / 2 + ROBOT.ARM_W - 14; // visual half-width incl. arms
const HAZE = '#E3DEE4';

type Tier = 'near' | 'mid' | 'far';
export type Clone = {
	id: number;
	row: number;
	z: number;
	s: number;
	x: number;
	gy: number;
	appear: number;
	tier: Tier;
	haze: number;
	depthAlpha: number;
	pal: RobotPalette;
	seed: number;
};

const W = U.waves;

const appearFrame = (k: number, X: number, z: number) => {
	const ax = Math.abs(X);
	const lateral = ax / SPACING;
	if (k === 1) return ax > 10 ? W[0] + lateral * 2 : W[1];
	if (k === 2) return ax < 400 ? W[1] + 4 : W[2] + lateral * 2;
	if (k === 3) return W[2] + 4 + lateral * 3;
	if (k === 4) return ax < 400 ? W[2] + 10 : W[3] + lateral * 2;
	if (k <= 8) return W[3] + (k - 4) * 6 + lateral * 1.5 + hash(Math.round(X), k) * 4;
	return W[4] + (k - 9) * 4 + lateral * 0.7 * (8 / z) + hash(Math.round(X), k) * 5;
};

const buildArmy = (): Clone[] => {
	const out: Clone[] = [];
	let id = 0;
	for (let k = 1; k <= ROWS; k++) {
		const z = Z0 * Math.pow(ZK, k - 1);
		const s = 1 / z;
		const gy = HORIZON + (GY - HORIZON) * s;
		const stagger = k % 2 === 1 ? 0 : SPACING / 2;
		const lim = 540 * z + HALF + 40;
		const jMin = Math.ceil((-lim - stagger) / SPACING);
		const jMax = Math.floor((lim - stagger) / SPACING);
		const t = Math.pow(clamp((z - 1.3) / 15), 0.7) * 0.88;
		const pal = fadePalette(BASE_PALETTE, HAZE, t, t * 0.25);
		for (let j = jMin; j <= jMax; j++) {
			const X = stagger + j * SPACING + (hash(j, k * 7) - 0.5) * 24;
			out.push({
				id: id++,
				row: k,
				z,
				s,
				x: RX + X * s,
				gy,
				appear: appearFrame(k, X, z),
				tier: z <= 3 ? 'near' : z <= 7 ? 'mid' : 'far',
				haze: t,
				depthAlpha: 1 - Math.pow(clamp((z - 9) / 18), 0.8) * 0.7,
				pal,
				seed: 500 + id,
			});
		}
	}
	return out;
};

export const ARMY = buildArmy();
export const ARMY_COUNT = ARMY.length;

// ---------------------------------------------------------------------------
// per-clone animation
// ---------------------------------------------------------------------------
type CloneAnim = {pop: number; x: number; gy: number; s: number; alpha: number; ripple: number; trail: number};

const RIPPLE_SPEED = 24; // px / frame
const rippleAt = (frame: number, cx: number, cy: number) => {
	let r = 0;
	for (const at of U.ripples) {
		if (frame < at) continue;
		const radius = (frame - at) * RIPPLE_SPEED;
		const d = Math.hypot(cx - RX, (cy - 1099) * 1.4);
		r = Math.max(r, clamp(1 - Math.abs(radius - d) / 110));
	}
	return r;
};

const animate = (c: Clone, frame: number): CloneAnim | null => {
	if (frame < c.appear) return null;
	const pop = springAt(frame, c.appear, {damping: 10, stiffness: 190, mass: 0.7});
	let x = c.x;
	let gy = c.gy - (1 - Math.min(1, pop)) * 50 * c.s;
	let s = c.s * pop;
	let alpha = c.depthAlpha;
	let trail = 0;
	// dissolve: far rows fade from the back; near rows converge into the hero
	if (c.row > 14) {
		alpha = c.depthAlpha * (1 - prog(frame, U.dissolve + (ROWS - c.row) * 1.6, 16));
	} else {
		const start = U.dissolve + 22 + (14 - c.row) * 2.2 + hash(c.id, 9) * 6;
		const conv = prog(frame, start, 28, easeInCubic);
		if (conv > 0) {
			const tx = RX;
			const tScale = c.s * (1 - conv * 0.75);
			const tgy = 1099 + 201 * tScale;
			x = lerp(c.x, tx, conv);
			gy = lerp(c.gy, tgy, conv);
			s = tScale * pop;
			alpha = 1 - conv * conv;
			trail = conv;
		}
	}
	if (alpha <= 0.01 || s < 0.01) return null;
	const cy = gy - 201 * s;
	return {pop, x, gy, s, alpha, ripple: rippleAt(frame, x, cy), trail};
};

// ---------------------------------------------------------------------------
// renderers
// ---------------------------------------------------------------------------
const NearClone: React.FC<{c: Clone; a: CloneAnim; frame: number}> = ({c, a, frame}) => {
	const pose = defaultPose();
	pose.bob = Math.sin((frame + c.id * 37) / 24) * 3;
	pose.eyeOpen = blink(frame, c.seed);
	pose.eyeDx = Math.sin((frame + c.id * 11) / 70) * 3;
	pose.armL.rot = Math.sin((frame + c.id * 5) / 30) * 4;
	pose.armR.rot = -Math.sin((frame + c.id * 7) / 33) * 4;
	const look = defaultLook();
	look.detail = 'mid';
	look.palette = a.ripple > 0 ? {...c.pal, eye: mix(c.pal.eye, '#7B55C9', a.ripple)} : c.pal;
	look.violet = a.ripple * 0.9;
	look.baseEyes = 1 - a.ripple * 0.9;
	look.seed = c.seed;
	return (
		<g opacity={a.alpha}>
			<ellipse cx={a.x} cy={a.gy + 2 * a.s} rx={250 * a.s} ry={12 * a.s} fill={mix('#8E867D', HAZE, c.haze)} opacity={0.35} />
			<RobotBase x={a.x} y={a.gy} scale={a.s} pose={pose} look={look} uid={`clone-${c.id}`} />
		</g>
	);
};

const MidClone: React.FC<{c: Clone; a: CloneAnim; frame: number}> = ({c, a, frame}) => {
	const P = c.pal;
	const {W: BW, H: BH, LEG_H, LEG_W, ARM_W, ARM_H, EYE_W, EYE_H, EYE_X, LEG_X} = ROBOT;
	const bob = Math.sin((frame + c.id * 37) / 24) * 3;
	const open = blink(frame, c.seed);
	const eyeCol = mix(P.eye, '#8D66D8', a.ripple);
	return (
		<g transform={`translate(${a.x.toFixed(1)} ${a.gy.toFixed(1)}) scale(${a.s.toFixed(4)})`} opacity={a.alpha}>
			<ellipse cx={0} cy={2} rx={250} ry={12} fill={mix('#8E867D', HAZE, c.haze)} opacity={0.35} />
			{LEG_X.map((lx) => (
				<rect key={lx} x={lx - LEG_W / 2} y={-LEG_H - 12 + bob} width={LEG_W} height={LEG_H + 12 - bob} rx={7} fill={P.leg} stroke={P.ink} strokeWidth={7} />
			))}
			<rect x={-BW / 2 - ARM_W + 14} y={-LEG_H - BH * 0.43 - ARM_H / 2 + bob} width={ARM_W} height={ARM_H} rx={8} fill={P.leg} stroke={P.ink} strokeWidth={7} />
			<rect x={BW / 2 - 14} y={-LEG_H - BH * 0.43 - ARM_H / 2 + bob} width={ARM_W} height={ARM_H} rx={8} fill={P.leg} stroke={P.ink} strokeWidth={7} />
			<g transform={`translate(0 ${bob})`}>
				<rect x={-BW / 2} y={BODY_TOP} width={BW} height={BH} rx={17} fill={P.body} />
				<rect x={BW / 2 - BW * 0.125} y={BODY_TOP + 4} width={BW * 0.125 - 4} height={BH - 8} rx={6} fill={P.bodyRight} />
				<rect x={-BW / 2 + 4} y={-LEG_H - BH * 0.085} width={BW - 8} height={BH * 0.085 - 4} rx={4} fill={P.bodyBottom} />
				<rect x={-BW / 2} y={BODY_TOP} width={BW} height={BH} rx={17} fill="none" stroke={P.ink} strokeWidth={7} />
				{EYE_X.map((ex) => (
					<g key={ex}>
						{a.ripple > 0.05 && <ellipse cx={ex} cy={BODY_TOP + BH * 0.44} rx={40} ry={52} fill={C.violetRing} opacity={a.ripple * 0.8} />}
						<rect x={ex - EYE_W / 2} y={BODY_TOP + BH * 0.44 - (EYE_H * open) / 2} width={EYE_W} height={EYE_H * open} rx={9} fill={a.ripple > 0.3 ? mix(eyeCol, C.violetCore, a.ripple) : eyeCol} />
					</g>
				))}
			</g>
		</g>
	);
};

const rr = (x: number, y: number, w: number, h: number, r: number) => {
	const f = (n: number) => n.toFixed(1);
	return `M${f(x + r)} ${f(y)}H${f(x + w - r)}Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)}V${f(y + h - r)}Q${f(x + w)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)}H${f(x + r)}Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)}V${f(y + r)}Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)}Z`;
};

const FarRow: React.FC<{clones: Clone[]; frame: number}> = ({clones, frame}) => {
	if (!clones.length) return null;
	const P = clones[0].pal;
	let limbs = '';
	let bodies = '';
	let bands = '';
	let eyes = '';
	let violetEyes = '';
	let alphaSum = 0;
	let n = 0;
	const {W: BW, H: BH, LEG_H, LEG_W, ARM_W, ARM_H, EYE_W, EYE_H, EYE_X, LEG_X} = ROBOT;
	for (const c of clones) {
		const a = animate(c, frame);
		if (!a) continue;
		alphaSum += a.alpha;
		n++;
		const s = a.s;
		const X = (v: number) => a.x + v * s;
		const Y = (v: number) => a.gy + v * s;
		for (const lx of LEG_X) limbs += rr(X(lx - LEG_W / 2), Y(-LEG_H - 8), LEG_W * s, (LEG_H + 8) * s, 6 * s);
		const ay = -LEG_H - BH * 0.43 - ARM_H / 2;
		limbs += rr(X(-BW / 2 - ARM_W + 14), Y(ay), ARM_W * s, ARM_H * s, 7 * s);
		limbs += rr(X(BW / 2 - 14), Y(ay), ARM_W * s, ARM_H * s, 7 * s);
		bodies += rr(X(-BW / 2), Y(BODY_TOP), BW * s, BH * s, 16 * s);
		bands += rr(X(BW / 2 - BW * 0.13), Y(BODY_TOP + 3), BW * 0.12 * s, (BH - 6) * s, 5 * s);
		const ey = BODY_TOP + BH * 0.44 - EYE_H / 2;
		const target = a.ripple > 0.3 ? 'v' : 'e';
		for (const ex of EYE_X) {
			const d = rr(X(ex - EYE_W / 2), Y(ey), EYE_W * s, EYE_H * s, 6 * s);
			if (target === 'v') violetEyes += d;
			else eyes += d;
		}
	}
	if (!n) return null;
	const s0 = clones[0].s;
	const alpha = alphaSum / n;
	return (
		<g opacity={alpha}>
			<path d={limbs} fill={P.leg} stroke={P.ink} strokeWidth={Math.max(0.6, 7 * s0)} />
			<path d={bodies} fill={P.body} />
			<path d={bands} fill={P.bodyRight} />
			<path d={bodies} fill="none" stroke={P.ink} strokeWidth={Math.max(0.6, 7 * s0)} />
			<path d={eyes} fill={P.eye} />
			{violetEyes && <path d={violetEyes} fill="#9B78E6" />}
		</g>
	);
};

const POOF_TIERS: Tier[] = ['near', 'mid'];

/** Pencil "poof" ring when a clone pops into existence. */
const Poof: React.FC<{c: Clone; frame: number}> = ({c, frame}) => {
	const t = (frame - c.appear) / 16;
	if (t < 0 || t > 1) return null;
	const cy = c.gy - 201 * c.s;
	return (
		<g opacity={(1 - t) * 0.8}>
			<circle cx={c.x} cy={cy} r={(90 + t * 170) * c.s} fill="none" stroke="#A796D6" strokeWidth={3} strokeDasharray="10 9" />
			{[0, 1, 2, 3, 4, 5].map((k) => {
				const ang = (k / 6) * Math.PI * 2 + c.id;
				const r0 = (120 + t * 160) * c.s;
				return <circle key={k} cx={c.x + Math.cos(ang) * r0} cy={cy + Math.sin(ang) * r0 * 0.7} r={4 * c.s + 1} fill="#B9A3E8" />;
			})}
		</g>
	);
};

export const CloneArmy: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < W[0] - 2 || frame > BEATS.ultrathink.burst + 4) return null;
	const rows: React.ReactNode[] = [];
	for (let k = ROWS; k >= 1; k--) {
		const inRow = ARMY.filter((c) => c.row === k);
		const tier = inRow[0]?.tier;
		if (tier === 'far') {
			rows.push(<FarRow key={k} clones={inRow} frame={frame} />);
			continue;
		}
		const nodes: React.ReactNode[] = [];
		for (const c of inRow) {
			const a = animate(c, frame);
			if (POOF_TIERS.includes(c.tier)) nodes.push(<Poof key={`p${c.id}`} c={c} frame={frame} />);
			if (!a) continue;
			if (a.trail > 0) {
				nodes.push(
					<line
						key={`t${c.id}`}
						x1={c.x}
						y1={c.gy - 201 * c.s}
						x2={a.x}
						y2={a.gy - 201 * a.s}
						stroke="#B9A3E8"
						strokeWidth={70 * c.s}
						strokeLinecap="round"
						opacity={0.22 * (1 - a.trail)}
					/>,
				);
			}
			nodes.push(c.tier === 'near' ? <NearClone key={c.id} c={c} a={a} frame={frame} /> : <MidClone key={c.id} c={c} a={a} frame={frame} />);
		}
		rows.push(<g key={k}>{nodes}</g>);
	}
	return <g>{rows}</g>;
};
