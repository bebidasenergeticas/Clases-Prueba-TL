// XHIGH — mad-scientist supercomputing: huge round glasses with code in the
// eyes, thought bubbles, Tesla coils, snaking cables, a bubbling green flask,
// levitation and green electricity.
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {Bolt} from '../effects/Electricity';
import {Particles} from '../effects/Particles';
import {HatchLayer, makeMatteTexture} from '../effects/SketchTexture';
import {MONO} from '../fonts';
import {clamp, easeInCubic, easeInOutCubic, easeOutBack, easeOutCubic, impulse, lerp, prog, springAt} from '../utils/animation';
import {C} from '../utils/colors';
import {hash, noise1, range, rng} from '../utils/random';
import {sketchEllipse} from '../utils/sketch';
import {BEATS, PHASES} from '../utils/timing';
import {BODY_TOP, EYE_CY, ROBOT, RobotPose} from './RobotBase';

const X = BEATS.xhigh;
const END = PHASES.max.start; // discharge flash
const RX = 540;
const GY = 1300;
const COIL_X = [150, 930] as const;
const TERMINAL_Y = 744;

// ---------------------------------------------------------------------------
// timeline helpers
// ---------------------------------------------------------------------------
export const glassesAmount = (frame: number) =>
	frame >= END ? 0 : springAt(frame, X.glasses, {damping: 9, stiffness: 120, mass: 0.9});

export const coilSlide = (frame: number) =>
	frame >= END ? 0 : springAt(frame, X.coilsIn, {damping: 12, stiffness: 95, mass: 1.1});

export const powerAmount = (frame: number) =>
	frame >= END ? 0 : prog(frame, X.powerOn, 30, easeOutCubic);

export const liftAmount = (frame: number) =>
	frame >= END ? 0 : easeInOutCubic(prog(frame, X.powerOn + 6, 54));

/** Strikes: coil -> robot discharges. Returns 0..1 (flickering) */
export const strikeAt = (frame: number) => {
	if (frame < X.powerOn + 40 || frame >= END) return 0;
	const overload = frame >= X.overload;
	const period = overload ? 14 : 56;
	const base = X.powerOn + 40;
	const k = Math.floor((frame - base) / period);
	const t = frame - base - k * period;
	const dur = overload ? 10 : 11;
	if (t > dur) return 0;
	const flick = hash(frame, 41) > 0.25 ? 1 : 0.35;
	return (1 - t / dur) * flick;
};

const strikeStart = (frame: number) => {
	const overload = frame >= X.overload;
	const period = overload ? 14 : 56;
	const base = X.powerOn + 40;
	return base + Math.floor((frame - base) / period) * period;
};

export const applyXHigh = (frame: number, s: SceneState) => {
	if (frame < PHASES.xhigh.start - 20 || frame > END + 2) return;
	const g = glassesAmount(frame);
	s.look.baseEyes = Math.min(s.look.baseEyes, 1 - clamp(g * 3));

	// thinking beat (bubbles): eyes up, slight head tilt
	const think = prog(frame, X.bubbles - 10, 16, easeOutCubic) * (1 - prog(frame, X.coilsIn - 8, 14));
	s.pose.eyeDy -= 4 * think;
	s.pose.eyeDx += 3 * think;
	s.pose.tilt += -2 * think + noise1(frame / 40, 8) * 0.6 * think;

	// coil landing impacts
	const land = impulse(frame, X.coilsIn + 20, 7) * (frame >= X.coilsIn + 20 ? 1 : 0);
	s.camera.x += Math.sin(frame * 2.1) * 6 * land;
	s.camera.y += Math.cos(frame * 2.7) * 4 * land;
	s.pose.squash += land * 0.03;
	s.pose.eyeScale *= 1 + land * 0.12;

	// levitation, dangling legs
	const lf = liftAmount(frame);
	s.pose.lift += lf * 46 + Math.sin(frame / 22) * 5 * lf;
	s.pose.legRot = s.pose.legRot.map((r, i) => r + Math.sin(frame / 14 + i * 1.3) * 7 * lf);
	s.shadow.scale *= 1 - lf * 0.22;
	s.shadow.opacity *= 1 - lf * 0.35;

	// strikes: flash, shake, jolt
	const st = strikeAt(frame);
	const p = powerAmount(frame);
	const over = prog(frame, X.overload, END - X.overload);
	s.flash.color = '#EFFFE8';
	s.flash.opacity = Math.max(s.flash.opacity, st * (0.14 + over * 0.18));
	s.camera.x += noise1(frame * 0.9, 3) * (st * 5 + over * 6);
	s.camera.y += noise1(frame * 0.9, 4) * (st * 4 + over * 5);
	s.camera.scale += 0.012 * p + over * 0.02;
	s.pose.squash += st * 0.02;
	s.pose.eyeScale *= 1 + st * 0.06;
	s.pose.tilt += noise1(frame * 0.6, 12) * 1.6 * over;
	// final white-out builds into the MAX discharge
	const pre = prog(frame, END - 14, 14, easeInCubic);
	s.flash.color = pre > 0.05 ? '#FFFFFF' : s.flash.color;
	s.flash.opacity = Math.max(s.flash.opacity, pre);
};

// ---------------------------------------------------------------------------
// Glasses (body space)
// ---------------------------------------------------------------------------
const GLYPHS = ['{', '}', '<', '/', '>', '0', '1', '#', '=', ';', '*', '+', '%', '&', '$', '?'];
const LENS_R = 62;

const Lens: React.FC<{cx: number; cy: number; pose: RobotPose; frame: number; side: number; strike: number; power: number}> = ({
	cx,
	cy,
	pose,
	frame,
	side,
	strike,
	power,
}) => {
	const ex = cx + pose.eyeDx * 1.7;
	const ey = cy + pose.eyeDy * 1.5;
	const eh = 78 * pose.eyeOpen * pose.eyeScale;
	const ew = 46 * pose.eyeScale;
	const speed = 8 - power * 4;
	const step = Math.floor(frame / speed);
	const frac = (frame % speed) / speed;
	const id = `lens-${side}`;
	return (
		<g>
			<defs>
				<clipPath id={`${id}-clip`}>
					<circle cx={cx} cy={cy} r={LENS_R - 4} />
				</clipPath>
				<clipPath id={`${id}-eye`}>
					<rect x={ex - ew / 2} y={ey - eh / 2} width={ew} height={eh} rx={13} />
				</clipPath>
			</defs>
			<circle cx={cx} cy={cy} r={LENS_R} fill="#F3DDC6" />
			<g clipPath={`url(#${id}-clip)`}>
				<circle cx={cx + 16} cy={cy + 18} r={LENS_R} fill="#E7C7A9" opacity={0.65} />
				<rect x={ex - ew / 2} y={ey - eh / 2} width={ew} height={eh} rx={13} fill={C.eye} />
				<g clipPath={`url(#${id}-eye)`}>
					{[0, 1, 2, 3].map((k) => {
						const gi = Math.floor(hash(step + k, 300 + side) * GLYPHS.length);
						return (
							<text
								key={k}
								x={ex}
								y={ey - 26 + k * 24 - frac * 24 + 8}
								textAnchor="middle"
								fontFamily={MONO}
								fontWeight={700}
								fontSize={21}
								fill={C.green}
								opacity={0.55 + power * 0.45 - (k === 0 ? frac * 0.5 : 0)}
							>
								{GLYPHS[gi]}
							</text>
						);
					})}
				</g>
				{eh > 30 && <rect x={ex + 3} y={ey - eh / 2 + 7} width={14} height={15} rx={3} fill="#FBF6EE" />}
				<circle cx={cx} cy={cy} r={LENS_R} fill="#9BEA7E" opacity={strike * 0.35 + power * 0.06} />
			</g>
			<path
				d={`M${cx - 42} ${cy - 18}A46 46 0 0 1 ${cx - 16} ${cy - 44}`}
				stroke="#FFFFFF"
				strokeWidth={5}
				fill="none"
				strokeLinecap="round"
				opacity={0.75}
			/>
			<circle cx={cx - 46} cy={cy - 2} r={2.6} fill="#FFFFFF" opacity={0.75} />
			<circle cx={cx} cy={cy} r={LENS_R} fill="none" stroke={C.ink} strokeWidth={10} />
			<circle cx={cx} cy={cy} r={LENS_R - 5.5} fill="none" stroke="#5A4846" strokeWidth={1.6} opacity={0.8} />
		</g>
	);
};

export const Glasses: React.FC<{pose: RobotPose}> = ({pose}) => {
	const frame = useCurrentFrame();
	const g = glassesAmount(frame);
	if (g < 0.01) return null;
	const strike = strikeAt(frame);
	const power = powerAmount(frame);
	const [lx, rx] = ROBOT.EYE_X;
	const sc = lerp(0.3, 1, g);
	const tf = (cx: number) => `translate(${cx} ${EYE_CY}) scale(${sc.toFixed(4)}) translate(${-cx} ${-EYE_CY})`;
	return (
		<g>
			{/* temples + bridge */}
			<g opacity={clamp(g * 2 - 0.6)} stroke={C.ink} strokeLinecap="round" fill="none">
				<path d={`M${lx - LENS_R + 2} ${EYE_CY - 8}L${-ROBOT.W / 2 - 6} ${EYE_CY - 14}`} strokeWidth={8} />
				<path d={`M${rx + LENS_R - 2} ${EYE_CY - 8}L${ROBOT.W / 2 + 6} ${EYE_CY - 14}`} strokeWidth={8} />
				<path d={`M${lx + LENS_R - 6} ${EYE_CY - 10}Q${(lx + rx) / 2} ${EYE_CY - 32} ${rx - LENS_R + 6} ${EYE_CY - 10}`} strokeWidth={9} />
			</g>
			<g transform={tf(lx)}>
				<Lens cx={lx} cy={EYE_CY} pose={pose} frame={frame} side={0} strike={strike} power={power} />
			</g>
			<g transform={tf(rx)}>
				<Lens cx={rx} cy={EYE_CY} pose={pose} frame={frame} side={1} strike={strike} power={power} />
			</g>
		</g>
	);
};

/** Plugs where the cables enter the body (body space). */
export const CablePlugs: React.FC = () => {
	const frame = useCurrentFrame();
	const c = prog(frame, X.cables + 18, 10, easeOutBack) * (frame >= END ? 0 : 1);
	if (c < 0.01) return null;
	return (
		<g opacity={c}>
			{[-1, 1].map((sd) => (
				<g key={sd}>
					<rect x={sd * 66 - 13} y={BODY_TOP - 14} width={26} height={18} rx={4} fill="#3A2D2C" stroke={C.ink} strokeWidth={4} />
					<rect x={sd * (ROBOT.W / 2) - 9} y={-128} width={18} height={30} rx={4} fill="#3A2D2C" stroke={C.ink} strokeWidth={4} />
				</g>
			))}
		</g>
	);
};

// ---------------------------------------------------------------------------
// Thought bubbles (pencil ellipses) — the reference's second XHIGH beat
// ---------------------------------------------------------------------------
export const ThoughtBubbles: React.FC<{lift: number}> = ({lift}) => {
	const frame = useCurrentFrame();
	const popAt = X.coilsIn - 6;
	if (frame < X.bubbles || frame > popAt + 14) return null;
	const boil = Math.floor(frame / 6);
	const bubbles = [
		{x: RX - 62, y: GY - 330 - 98, rx: 30, ry: 25, at: X.bubbles},
		{x: RX + 22, y: GY - 330 - 150, rx: 50, ry: 40, at: X.bubbles + 12},
	];
	return (
		<g>
			{bubbles.map((b, i) => {
				const draw = prog(frame, b.at, 18, easeOutCubic);
				const pop = prog(frame, popAt + i * 3, 9);
				const drift = (frame - b.at) * 0.12;
				const sway = Math.sin(frame / 25 + i) * 4;
				const sc = 1 + pop * 0.35;
				const d = sketchEllipse(0, 0, b.rx, b.ry, {seed: 90 + i, amp: 1.3, boil, step: 6});
				const d2 = sketchEllipse(0.8, -0.6, b.rx - 1, b.ry + 1, {seed: 95 + i, amp: 1.8, boil: boil + 2, step: 7});
				return (
					<g key={i} transform={`translate(${b.x + sway} ${b.y - drift - lift}) scale(${sc})`} opacity={1 - pop}>
						<path d={d} fill="none" stroke="#8A837B" strokeWidth={2.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} strokeLinecap="round" />
						<path d={d2} fill="none" stroke="#8A837B" strokeWidth={1.1} opacity={0.5 * draw} />
					</g>
				);
			})}
		</g>
	);
};

// ---------------------------------------------------------------------------
// Tesla coils
// ---------------------------------------------------------------------------
const TeslaCoil: React.FC<{cx: number; power: number; frame: number; seed: number}> = ({cx, power, frame, seed}) => {
	const tex = useMemo(() => makeMatteTexture(seed, {x: cx - 76, y: 1236, w: 152, h: 64}, 0.9), [cx, seed]);
	const torusTex = useMemo(() => makeMatteTexture(seed + 5, {x: cx - 76, y: 772, w: 152, h: 56}, 1.2), [cx, seed]);
	const colTop = 822;
	const colBot = 1238;
	const winds: string[] = [];
	for (let y = colTop + 10; y < colBot - 8; y += 9) {
		winds.push(`M${cx - 30} ${y}Q${cx} ${y + 4} ${cx + 30} ${y}`);
	}
	const glow = power * (0.75 + noise1(frame / 3, seed) * 0.25);
	return (
		<g>
			{/* plinth */}
			<rect x={cx - 76} y={1236} width={152} height={64} rx={10} fill={C.metal} />
			<rect x={cx + 40} y={1236} width={36} height={64} fill={C.metalShade} opacity={0.8} />
			<HatchLayer segs={tex} color="#8B7B62" width={1.1} />
			<rect x={cx - 76} y={1236} width={152} height={13} fill="#3A2D2C" />
			<rect x={cx - 76} y={1236} width={152} height={64} rx={10} fill="none" stroke={C.ink} strokeWidth={5} />
			<circle cx={cx - 56} cy={1276} r={4.5} fill={C.metalDark} stroke={C.ink} strokeWidth={2} />
			<circle cx={cx + 56} cy={1276} r={4.5} fill={C.metalDark} stroke={C.ink} strokeWidth={2} />
			{/* column + windings */}
			<rect x={cx - 31} y={colTop} width={62} height={colBot - colTop} fill="#7A3E26" />
			<path d={winds.join('')} stroke="#D98A52" strokeWidth={4.6} fill="none" strokeLinecap="round" />
			<path d={winds.join('')} stroke={C.green} strokeWidth={4.6} fill="none" opacity={glow * 0.35} />
			<rect x={cx + 12} y={colTop} width={19} height={colBot - colTop} fill="#3B1A10" opacity={0.25} />
			<rect x={cx - 31} y={colTop} width={62} height={colBot - colTop} fill="none" stroke={C.ink} strokeWidth={5} />
			<ellipse cx={cx} cy={colBot - 2} rx={42} ry={10} fill={C.metal} stroke={C.ink} strokeWidth={4.5} />
			{/* torus */}
			<ellipse cx={cx} cy={800} rx={76} ry={29} fill={C.metal} />
			<clipPath id={`torus-${seed}`}>
				<ellipse cx={cx} cy={800} rx={76} ry={29} />
			</clipPath>
			<g clipPath={`url(#torus-${seed})`}>
				<ellipse cx={cx + 8} cy={814} rx={76} ry={22} fill={C.metalShade} />
				<HatchLayer segs={torusTex} color="#8B7B62" width={1.1} />
			</g>
			<ellipse cx={cx} cy={800} rx={76} ry={29} fill="none" stroke={C.ink} strokeWidth={5} />
			<ellipse cx={cx} cy={794} rx={30} ry={9} fill="#B9AA90" stroke={C.ink} strokeWidth={3.5} />
			<path d={`M${cx - 58} ${790}Q${cx - 40} ${776} ${cx - 10} ${774}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round" />
			{/* terminal */}
			<rect x={cx - 4.5} y={752} width={9} height={40} fill="#B9AA90" stroke={C.ink} strokeWidth={3} />
			{glow > 0.01 && <circle cx={cx} cy={TERMINAL_Y} r={46} fill={C.green} opacity={glow * 0.5} filter="url(#blur-md)" />}
			<circle cx={cx} cy={TERMINAL_Y} r={13} fill={glow > 0.3 ? '#E9FFE0' : C.metal} stroke={C.ink} strokeWidth={4} />
		</g>
	);
};

export const TeslaCoils: React.FC = () => {
	const frame = useCurrentFrame();
	const slide = coilSlide(frame);
	if (slide < 0.005) return null;
	const power = powerAmount(frame);
	return (
		<g>
			{COIL_X.map((cx, i) => {
				const off = (1 - slide) * (i === 0 ? -360 : 360);
				return (
					<g key={i} transform={`translate(${off.toFixed(1)} 0)`}>
						<TeslaCoil cx={cx} power={power} frame={frame} seed={i * 17 + 3} />
					</g>
				);
			})}
			{/* landing dust */}
			{frame >= X.coilsIn + 18 && frame < X.coilsIn + 50 && (
				<g opacity={1 - (frame - X.coilsIn - 18) / 32}>
					{COIL_X.map((cx, i) => (
						<path
							key={i}
							d={sketchEllipse(cx, 1296, 90 + (frame - X.coilsIn - 18) * 2.2, 10 + (frame - X.coilsIn - 18) * 0.3, {seed: 140 + i, amp: 1.5})}
							fill="none"
							stroke="#9A9286"
							strokeWidth={2}
							strokeDasharray="10 14"
						/>
					))}
				</g>
			)}
		</g>
	);
};

// ---------------------------------------------------------------------------
// Cables (scene space). Back cables pass behind the robot; one runs in front.
// ---------------------------------------------------------------------------
const cablePaths = (lift: number, bob: number) => {
	const top = GY - 330 - lift + bob;
	const side = GY - 113 - lift + bob;
	const L = COIL_X[0];
	const R = COIL_X[1];
	return {
		back: [
			`M${L + 50} 1240C${L + 110} 1150 ${L + 40} 1000 ${L + 120} 930S${RX - 150} ${top - 70} ${RX - 66} ${top - 4}`,
			`M${R - 50} 1240C${R - 110} 1150 ${R - 40} 1000 ${R - 120} 930S${RX + 150} ${top - 70} ${RX + 66} ${top - 4}`,
			`M${L + 70} 1290C${L + 150} 1306 ${L + 120} ${side + 50} ${RX - 212} ${side}`,
			`M${R - 70} 1290C${R - 150} 1306 ${R - 120} ${side + 50} ${RX + 212} ${side}`,
		],
		front: `M${L + 76} 1296C${L + 200} 1336 ${RX - 120} 1286 ${RX - 20} 1318S${R - 150} 1330 ${R - 76} 1296`,
	};
};

const Cable: React.FC<{d: string; draw: number; power: number; frame: number; seed: number}> = ({d, draw, power, frame, seed}) => (
	<g fill="none" strokeLinecap="round">
		<path d={d} stroke={C.ink} strokeWidth={12} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
		<path d={d} stroke="#4A3B3A" strokeWidth={6.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
		<path d={d} stroke="#8E7B76" strokeWidth={1.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} transform="translate(-1 -2)" opacity={0.8} />
		{power > 0.01 && (
			<>
				<path d={d} stroke={C.green} strokeWidth={10} pathLength={1} strokeDasharray="0.05 0.25" strokeDashoffset={-((frame * 0.012 + seed * 0.1) % 1)} opacity={power * 0.45} filter="url(#blur-sm)" />
				<path d={d} stroke="#D9FFD0" strokeWidth={3} pathLength={1} strokeDasharray="0.05 0.25" strokeDashoffset={-((frame * 0.012 + seed * 0.1) % 1)} opacity={power * 0.9} />
			</>
		)}
	</g>
);

export const CablesBack: React.FC<{lift: number; bob: number}> = ({lift, bob}) => {
	const frame = useCurrentFrame();
	const draw = prog(frame, X.cables, 32, easeInOutCubic) * coilSlide(frame);
	if (draw < 0.01) return null;
	const p = cablePaths(lift, bob);
	const power = powerAmount(frame);
	return (
		<g>
			{p.back.map((d, i) => (
				<Cable key={i} d={d} draw={draw} power={power} frame={frame} seed={i} />
			))}
		</g>
	);
};

export const CablesFront: React.FC<{lift: number; bob: number}> = ({lift, bob}) => {
	const frame = useCurrentFrame();
	const draw = prog(frame, X.cables + 8, 30, easeInOutCubic) * coilSlide(frame);
	if (draw < 0.01) return null;
	return <Cable d={cablePaths(lift, bob).front} draw={draw} power={powerAmount(frame)} frame={frame} seed={9} />;
};

// ---------------------------------------------------------------------------
// Flask
// ---------------------------------------------------------------------------
const FLASK_X = 806;
const FLASK_Y = 1316;

export const Flask: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = frame >= END ? 0 : springAt(frame, X.cables + 14, {damping: 10, stiffness: 150});
	if (pop < 0.01) return null;
	const power = powerAmount(frame);
	const body = 'M-15 -96L-15 -70L-60 -14Q-66 0 -50 0L50 0Q66 0 60 -14L15 -70L15 -96Z';
	const slosh = Math.sin(frame / 9) * 3 * (0.4 + power);
	const level = -54;
	const bubbles = [];
	for (let i = 0; i < 9; i++) {
		const period = 40 + Math.floor(hash(i, 7) * 30);
		const t = ((frame + i * 13) % period) / period;
		const bx = range(rng(i + 3), -34, 34) * (1 - t * 0.4);
		bubbles.push(<circle key={i} cx={bx} cy={-6 - t * 46} r={2 + hash(i, 9) * 4} fill="none" stroke="#E9FFE0" strokeWidth={1.6} opacity={1 - t} />);
	}
	return (
		<g transform={`translate(${FLASK_X} ${FLASK_Y}) scale(${pop.toFixed(4)})`}>
			<ellipse cx={0} cy={-30} rx={80} ry={60} fill={C.green} opacity={0.18 + power * 0.25} filter="url(#blur-lg)" />
			<ellipse cx={0} cy={2} rx={62} ry={8} fill="#6F675F" opacity={0.2} />
			<clipPath id="flask-clip">
				<path d={body} />
			</clipPath>
			<path d={body} fill="#F4F1EA" opacity={0.85} />
			<g clipPath="url(#flask-clip)">
				<path
					d={`M-80 ${level + slosh}Q-30 ${level - slosh * 1.5} 0 ${level}T80 ${level - slosh}L80 10L-80 10Z`}
					fill={C.greenGlass}
				/>
				<path d={`M-80 ${level + 22}L80 ${level + 22}L80 10L-80 10Z`} fill={C.greenDeep} opacity={0.55} />
				{bubbles}
				<path d="M-38 -14L-14 -60" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
			</g>
			<path d={body} fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
			<rect x={-21} y={-106} width={42} height={12} rx={5} fill={C.metal} stroke={C.ink} strokeWidth={4} />
			<g stroke={C.ink} strokeWidth={2} opacity={0.6}>
				<line x1={22} y1={-40} x2={32} y2={-40} />
				<line x1={30} y1={-28} x2={42} y2={-28} />
				<line x1={38} y1={-16} x2={50} y2={-16} />
			</g>
			{/* vapour */}
			{[0, 1, 2].map((k) => {
				const period = 70;
				const t = ((frame + k * 23) % period) / period;
				return (
					<path
						key={k}
						d={`M0 -110C${-14 + k * 6} ${-130 - t * 40} ${16 - k * 4} ${-150 - t * 50} ${(-6 + k * 5).toFixed(1)} ${(-176 - t * 70).toFixed(1)}`}
						stroke={C.greenGlass}
						strokeWidth={4 - t * 2}
						fill="none"
						strokeLinecap="round"
						opacity={(1 - t) * 0.7}
					/>
				);
			})}
		</g>
	);
};

// ---------------------------------------------------------------------------
// Electricity + sparks (scene space, top-most)
// ---------------------------------------------------------------------------
export const XHighElectricity: React.FC<{lift: number; bob: number}> = ({lift, bob}) => {
	const frame = useCurrentFrame();
	const power = powerAmount(frame);
	const slide = coilSlide(frame);
	if (power < 0.01 || slide < 0.9) return null;
	const flick = Math.floor(frame / 2);
	const crackle = hash(flick, 5) > 0.22 ? 1 : 0;
	const over = prog(frame, X.overload, END - X.overload);
	const L: [number, number] = [COIL_X[0] + 6, TERMINAL_Y - 4];
	const R: [number, number] = [COIL_X[1] - 6, TERMINAL_Y - 4];
	const strike = strikeAt(frame);
	const sStart = strikeStart(frame);
	const headY = GY - lift + bob - 250;
	const targets: [number, number][] = [
		[RX - ROBOT.W / 2 - 4, headY],
		[RX + ROBOT.W / 2 + 4, headY],
	];
	const sparkOrigins = (i: number): [number, number] => {
		const pick = hash(i, 3);
		if (pick < 0.35) return [COIL_X[0] + range(rng(i), -12, 12), TERMINAL_Y];
		if (pick < 0.7) return [COIL_X[1] + range(rng(i), -12, 12), TERMINAL_Y];
		return targets[Math.floor(hash(i, 4) * 2)];
	};
	return (
		<g>
			{/* coil-to-coil arc, bowing over the robot */}
			<Bolt a={L} b={R} bow={[RX, 610 - over * 50]} seed={flick} intensity={power * crackle} width={1.25 + over * 0.4} rough={0.075} forks={4} />
			{over > 0.2 && <Bolt a={L} b={R} bow={[RX, 640]} seed={flick + 999} intensity={over * (hash(flick, 9) > 0.4 ? 1 : 0)} width={0.8} rough={0.09} />}
			{/* small crawling arcs on the terminals */}
			{COIL_X.map((cx, i) => (
				<Bolt
					key={i}
					a={[cx, TERMINAL_Y]}
					b={[cx + (hash(flick, 20 + i) - 0.5) * 120, TERMINAL_Y - 30 - hash(flick, 30 + i) * 50]}
					seed={flick * 3 + i}
					intensity={power * (hash(flick, 40 + i) > 0.4 ? 1 : 0)}
					width={0.55}
					rough={0.2}
					forks={1}
				/>
			))}
			{/* strikes into the robot */}
			{strike > 0 &&
				targets.map((t, i) => (
					<Bolt key={i} a={i === 0 ? L : R} b={t} bow={[(t[0] + (i === 0 ? L : R)[0]) / 2, Math.min(t[1], TERMINAL_Y) - 40]} seed={sStart * 5 + i + flick} intensity={strike} width={1.1} rough={0.13} />
				))}
			<Particles
				frame={frame}
				from={X.powerOn}
				to={END}
				rate={1.2 + over * 2}
				origin={sparkOrigins}
				velocity={(i) => [range(rng(i * 7), -5, 5), range(rng(i * 7 + 1), -6, 1)]}
				gravity={0.32}
				life={26}
				size={[2.5, 5]}
				colors={[C.green, '#D9FFD0', '#B6FF9E']}
				seed={11}
				kind="spark"
			/>
		</g>
	);
};
