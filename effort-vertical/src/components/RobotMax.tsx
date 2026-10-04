// MAX — the robot suits up into a mech: armour plates fly in and lock,
// the visor lenses ignite, energy charges, and a HUD reads EFFORT: MAX.
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {Particles} from '../effects/Particles';
import {HatchLayer, makeMatteTexture} from '../effects/SketchTexture';
import {MONO} from '../fonts';
import {clamp, easeInCubic, easeInOutCubic, easeOutCubic, impulse, lerp, prog, springAt} from '../utils/animation';
import {C} from '../utils/colors';
import {noise1, range, rng} from '../utils/random';
import {roundRectPath, sketchRoundRect} from '../utils/sketch';
import {BEATS, PHASES} from '../utils/timing';
import {ARM_CY, BODY_TOP, EYE_CY, ROBOT} from './RobotBase';

const B = BEATS.max;
const A0 = B.assemble;
const COL = B.collapse;
// assembly order: boots, side plates, shoulders, chest, visor
const PIECE_AT = [A0, A0 + 12, A0 + 24, A0 + 36, A0 + 48];
const PIECE_OUT = [COL + 16, COL + 12, COL + 8, COL + 4, COL];

const pieceIn = (frame: number, i: number) => springAt(frame, PIECE_AT[i], {damping: 11, stiffness: 160, mass: 0.8});
const pieceOut = (frame: number, i: number) => prog(frame, PIECE_OUT[i], 18, easeInCubic);

export const maxAmount = (frame: number) =>
	frame < A0 || frame > COL + 40 ? 0 : prog(frame, A0, 60) * (1 - prog(frame, COL, 30));

export const lensOn = (frame: number) => {
	if (frame < B.powerUp) return 0;
	const t = frame - B.powerUp;
	if (t < 18) return [1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1][t] ?? 1;
	const out = prog(frame, COL - 4, 8);
	return (0.85 + Math.sin(frame / 9) * 0.15) * (1 - out);
};

export const applyMax = (frame: number, s: SceneState) => {
	if (frame < PHASES.max.start - 2 || frame > PHASES.ultracode.start + 30) return;
	// discharge flash decays as the armour starts flying in
	const flashDecay = 1 - prog(frame, PHASES.max.start, 36, easeOutCubic);
	if (frame >= PHASES.max.start) {
		s.flash.color = '#FFFFFF';
		s.flash.opacity = Math.max(s.flash.opacity, flashDecay);
	}
	// legs retract into the boots, arms hide under side plates
	const legsGone = prog(frame, A0 - 4, 10) * (1 - prog(frame, COL + 14, 14, easeOutCubic));
	s.pose.legScale *= 1 - legsGone;
	const armsGone = (pieceIn(frame, 1) > 0.85 ? 1 : 0) * (frame < PIECE_OUT[1] + 4 ? 1 : 0);
	if (armsGone) {
		s.pose.armL = {...s.pose.armL, scale: 0.001};
		s.pose.armR = {...s.pose.armR, scale: 0.001};
	}
	// visor covers the eyes
	const visor = pieceIn(frame, 4) * (1 - pieceOut(frame, 4));
	s.look.baseEyes = Math.min(s.look.baseEyes, 1 - clamp(visor * 1.4));

	// impacts as each piece locks in
	let hit = 0;
	PIECE_AT.forEach((at) => {
		hit += impulse(frame, at + 10, 6) * (frame >= at + 10 ? 1 : 0);
	});
	hit = Math.min(1.2, hit);
	s.camera.x += Math.sin(frame * 2.3) * 4 * hit;
	s.camera.y += Math.cos(frame * 3.1) * 3 * hit;
	s.pose.squash += 0.025 * hit;
	s.pose.bob += 3 * hit;

	// power-up: charge, burst, then heavy hydraulic idle
	const charge = prog(frame, B.powerUp, 36, easeInCubic) * (frame < B.powerUp + 36 ? 1 : 0);
	const burst = impulse(frame, B.powerUp + 36, 9) * (frame >= B.powerUp + 36 ? 1 : 0);
	s.camera.x += noise1(frame * 0.8, 61) * (charge * 3 + burst * 7);
	s.camera.y += noise1(frame * 0.8, 62) * (charge * 2 + burst * 5);
	const m = maxAmount(frame);
	s.camera.scale += 0.03 * easeInOutCubic(prog(frame, B.powerUp, 40)) * (1 - prog(frame, COL - 20, 40, easeInOutCubic)) + burst * 0.01;
	s.pose.squash += burst * 0.04 - charge * 0.02;
	// heavier, slower breathing while armoured
	s.pose.bob += Math.sin(frame / 18) * 1.6 * m;
	s.flash.color = s.flash.opacity > 0.05 ? s.flash.color : '#FFE2B8';
	s.flash.opacity = Math.max(s.flash.opacity, burst * 0.22);
};

// ---------------------------------------------------------------------------
// Gear emblem
// ---------------------------------------------------------------------------
const gearPath = (r: number, teeth: number, depth: number) => {
	let d = '';
	for (let i = 0; i < teeth * 2; i++) {
		const a0 = (i / (teeth * 2)) * Math.PI * 2;
		const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
		const rr = i % 2 === 0 ? r : r - depth;
		d += `${i === 0 ? 'M' : 'L'}${(Math.cos(a0) * rr).toFixed(2)} ${(Math.sin(a0) * rr).toFixed(2)}L${(Math.cos(a1) * rr).toFixed(2)} ${(Math.sin(a1) * rr).toFixed(2)}`;
	}
	return d + 'Z';
};

// ---------------------------------------------------------------------------
// Armour (body space)
// ---------------------------------------------------------------------------
const Plate: React.FC<{x: number; y: number; w: number; h: number; r: number; seed: number; boil: number; children?: React.ReactNode}> = ({
	x,
	y,
	w,
	h,
	r,
	seed,
	boil,
	children,
}) => {
	const d = useMemo(() => sketchRoundRect(x, y, w, h, r, {seed, amp: 0.8, boil, step: 7}), [x, y, w, h, r, seed, boil]);
	const tex = useMemo(() => makeMatteTexture(seed, {x, y, w, h}, 1.3), [x, y, w, h, seed]);
	const clipId = `plate-${seed}`;
	return (
		<g>
			<clipPath id={clipId}>
				<path d={roundRectPath(x, y, w, h, r)} />
			</clipPath>
			<path d={d} fill={C.metal} />
			<g clipPath={`url(#${clipId})`}>
				<rect x={x} y={y + h * 0.72} width={w} height={h * 0.28} fill={C.metalShade} />
				<rect x={x + w - Math.min(16, w * 0.16)} y={y} width={Math.min(16, w * 0.16)} height={h} fill={C.metalShade} opacity={0.8} />
				<HatchLayer segs={tex} color="#8B7B62" width={1.1} />
				<path d={`M${x + 6} ${y + h - 10}L${x + 6} ${y + 8}L${x + w - 18} ${y + 6}`} stroke="#FFFFFF" strokeWidth={2.6} fill="none" opacity={0.55} strokeLinecap="round" />
			</g>
			{children}
			<path d={d} fill="none" stroke={C.ink} strokeWidth={5.5} strokeLinejoin="round" />
		</g>
	);
};

const flyTransform = (inAmt: number, outAmt: number, from: [number, number], to: [number, number], rotOut: number, pivot: [number, number]) => {
	const dx = (1 - inAmt) * from[0] + outAmt * to[0];
	const dy = (1 - inAmt) * from[1] + outAmt * to[1] + outAmt * outAmt * 120;
	return `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${(outAmt * rotOut).toFixed(1)} ${pivot[0]} ${pivot[1]})`;
};

export const MaxArmor: React.FC<{boil: number}> = ({boil}) => {
	const frame = useCurrentFrame();
	if (frame < A0 - 2 || frame > COL + 40) return null;
	const W = ROBOT.W;
	const lens = lensOn(frame);
	const gearRot = frame * 0.8;
	const chestGlow = prog(frame, B.powerUp + 10, 30) * (1 - prog(frame, COL, 10));
	const pieces: React.ReactNode[] = [];
	// side plates (over the arms)
	{
		const i = pieceIn(frame, 1);
		const o = pieceOut(frame, 1);
		if (i > 0.001 && o < 1) {
			[-1, 1].forEach((sd) => {
				const x = sd < 0 ? -W / 2 - 80 : W / 2 - 6;
				pieces.push(
					<g key={`side${sd}`} transform={flyTransform(i, o, [sd * 340, -20], [sd * 160, -60], sd * 70, [x + 43, ARM_CY])} opacity={1 - o}>
						<Plate x={x} y={ARM_CY - 48} w={86} h={96} r={12} seed={300 + sd} boil={boil}>
							<g stroke={C.metalDark} strokeWidth={3.2} strokeLinecap="round">
								{[0, 1, 2].map((k) => (
									<line key={k} x1={x + 24 + k * 16} y1={ARM_CY - 32} x2={x + 24 + k * 16} y2={ARM_CY + 30} />
								))}
							</g>
						</Plate>
					</g>,
				);
			});
		}
	}
	// shoulder / corner plates
	{
		const i = pieceIn(frame, 2);
		const o = pieceOut(frame, 2);
		if (i > 0.001 && o < 1) {
			[-1, 1].forEach((sd) => {
				const x = sd < 0 ? -W / 2 - 18 : W / 2 - 68;
				const y = BODY_TOP - 20;
				pieces.push(
					<g key={`sh${sd}`} transform={flyTransform(i, o, [sd * 60, -320], [sd * 140, -200], sd * 90, [x + 43, y + 37])} opacity={1 - o}>
						<Plate x={x} y={y} w={86} h={76} r={16} seed={310 + sd} boil={boil}>
							<path d={roundRectPath(x + 11, y + 11, 64, 52, 9)} fill={C.metalShade} stroke={C.metalDark} strokeWidth={2.5} />
							<circle cx={x + (sd < 0 ? 22 : 64)} cy={y + 22} r={4.2} fill={C.metalDark} stroke={C.ink} strokeWidth={2} />
						</Plate>
					</g>,
				);
			});
		}
	}
	// chest plate with gear emblem
	{
		const i = pieceIn(frame, 3);
		const o = pieceOut(frame, 3);
		if (i > 0.001 && o < 1) {
			const x = -122;
			const y = -172;
			pieces.push(
				<g key="chest" transform={flyTransform(i, o, [0, 200], [0, 160], 25, [0, -130])} opacity={(1 - o) * clamp(i * 2)}>
					<Plate x={x} y={y} w={244} h={88} r={14} seed={320} boil={boil}>
						<path d={roundRectPath(x + 12, y + 11, 220, 66, 10)} fill="none" stroke={C.metalDark} strokeWidth={2.2} />
						{chestGlow > 0.01 && <circle cx={0} cy={y + 44} r={34} fill={C.amberGlow} opacity={chestGlow * 0.55} filter="url(#blur-md)" />}
						<g transform={`translate(0 ${y + 44}) rotate(${gearRot.toFixed(1)})`}>
							<path d={gearPath(21, 8, 6)} fill={chestGlow > 0.3 ? '#E9A24C' : '#C98A3E'} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
							<circle r={7.5} fill={C.metal} stroke={C.ink} strokeWidth={2.5} />
						</g>
						<circle cx={x + 26} cy={y + 44} r={4.5} fill={C.metalDark} stroke={C.ink} strokeWidth={2} />
						<circle cx={x + 218} cy={y + 44} r={4.5} fill={C.metalDark} stroke={C.ink} strokeWidth={2} />
					</Plate>
				</g>,
			);
		}
	}
	// visor
	{
		const i = pieceIn(frame, 4);
		const o = pieceOut(frame, 4);
		if (i > 0.001 && o < 1) {
			const x = -164;
			const y = EYE_CY - 46;
			const scan = ((frame - B.powerUp) % 70) / 70;
			pieces.push(
				<g key="visor" transform={flyTransform(i, o, [0, -230], [0, -260], -30, [0, EYE_CY])} opacity={1 - o}>
					<Plate x={x} y={y} w={328} h={92} r={22} seed={330} boil={boil}>
						<rect x={x + 12} y={y + 12} width={304} height={68} rx={15} fill="#171313" stroke={C.ink} strokeWidth={3} />
						{lens > 0.01 && (
							<g>
								<line x1={ROBOT.EYE_X[0]} y1={EYE_CY} x2={ROBOT.EYE_X[1]} y2={EYE_CY} stroke={C.amber} strokeWidth={9} opacity={lens * 0.35} filter="url(#blur-sm)" />
								{ROBOT.EYE_X.map((ex) => (
									<ellipse key={ex} cx={ex} cy={EYE_CY} rx={40} ry={48} fill={C.amberGlow} opacity={lens * 0.55} filter="url(#blur-md)" />
								))}
							</g>
						)}
						<line x1={ROBOT.EYE_X[0]} y1={EYE_CY} x2={ROBOT.EYE_X[1]} y2={EYE_CY} stroke={lens > 0.1 ? C.amber : '#5A4436'} strokeWidth={3.5} />
						{ROBOT.EYE_X.map((ex) => (
							<g key={ex}>
								<rect x={ex - 18} y={EYE_CY - 28} width={36} height={56} rx={17} fill={lens > 0.1 ? '#F8C77C' : '#6A4E3A'} stroke={C.ink} strokeWidth={3} />
								<rect x={ex - 9} y={EYE_CY - 19} width={18} height={38} rx={9} fill={lens > 0.1 ? '#FFE7B8' : '#7E5E46'} />
							</g>
						))}
						{frame > B.powerUp && frame < B.powerUp + 70 && (
							<rect x={x + 14 + scan * 296} y={y + 13} width={5} height={66} fill={C.amberGlow} opacity={0.5} />
						)}
						{[
							[x + 9, y + 9],
							[x + 319, y + 9],
							[x + 9, y + 83],
							[x + 319, y + 83],
						].map(([cx, cy], k) => (
							<circle key={k} cx={cx} cy={cy} r={3} fill={C.metalDark} stroke={C.ink} strokeWidth={1.5} />
						))}
					</Plate>
				</g>,
			);
		}
	}
	return <g>{pieces}</g>;
};

/** Boots replace the legs (feet layer: follows lift, not body bob). */
export const MaxBoots: React.FC<{boil: number}> = ({boil}) => {
	const frame = useCurrentFrame();
	const i = pieceIn(frame, 0);
	const o = pieceOut(frame, 0);
	if (i < 0.001 || o >= 1 || frame > COL + 40) return null;
	return (
		<g>
			{[-1, 1].map((sd) => {
				const cx = sd * 104;
				const x = cx - 62;
				return (
					<g key={sd} transform={flyTransform(i, o, [0, -300], [sd * 60, 40], sd * 20, [cx, -40])} opacity={1 - o}>
						<Plate x={x} y={-84} w={124} h={84} r={14} seed={340 + sd} boil={boil}>
							<rect x={x + 3} y={-16} width={118} height={13} rx={4} fill={C.metalDark} />
							<line x1={x + 10} y1={-48} x2={x + 114} y2={-48} stroke={C.metalDark} strokeWidth={2.6} />
							<rect x={x + 20} y={-40} width={38} height={18} rx={5} fill={C.body} stroke={C.ink} strokeWidth={2.5} />
							<circle cx={x + 96} cy={-66} r={4.5} fill={C.metalDark} stroke={C.ink} strokeWidth={2} />
						</Plate>
					</g>
				);
			})}
		</g>
	);
};

// ---------------------------------------------------------------------------
// Energy (scene space): charge rings, burst shockwave, embers, steam
// ---------------------------------------------------------------------------
export const MaxEnergy: React.FC<{cx: number; cy: number}> = ({cx, cy}) => {
	const frame = useCurrentFrame();
	if (frame < B.powerUp - 2 || frame > COL + 30) return null;
	const nodes: React.ReactNode[] = [];
	for (let k = 0; k < 3; k++) {
		const t = prog(frame, B.powerUp + k * 9, 30, easeInCubic);
		if (t > 0 && t < 1) {
			const sc = lerp(2.3, 0.25, t);
			nodes.push(
				<ellipse key={`c${k}`} cx={cx} cy={cy} rx={250 * sc} ry={160 * sc} fill="none" stroke={C.amber} strokeWidth={5 - t * 2} opacity={Math.sin(t * Math.PI) * 0.8} strokeDasharray="22 12" />,
			);
		}
	}
	const bt = prog(frame, B.powerUp + 36, 30, easeOutCubic);
	if (bt > 0 && bt < 1) {
		nodes.push(<ellipse key="burst" cx={cx} cy={cy} rx={120 + bt * 520} ry={80 + bt * 330} fill="none" stroke={C.amberGlow} strokeWidth={14 * (1 - bt)} opacity={1 - bt} />);
	}
	const steamAt = [B.powerUp + 150, B.powerUp + 250];
	steamAt.forEach((at, k) => {
		const t = prog(frame, at, 40);
		if (t > 0 && t < 1) {
			[-1, 1].forEach((sd) => {
				for (let j = 0; j < 3; j++) {
					const tt = clamp(t * 1.3 - j * 0.15);
					nodes.push(
						<circle
							key={`st${k}${sd}${j}`}
							cx={cx + sd * (300 + tt * 90 + j * 20)}
							cy={cy + 40 - tt * 70 - j * 18}
							r={10 + tt * 26}
							fill="#F4F1EA"
							stroke="#B8B0A4"
							strokeWidth={2}
							opacity={(1 - tt) * 0.85}
						/>,
					);
				}
			});
		}
	});
	return (
		<g>
			{nodes}
			<Particles
				frame={frame}
				from={B.powerUp + 30}
				to={COL}
				rate={0.6}
				origin={(i) => [cx + range(rng(i), -230, 230), cy + range(rng(i + 1), -40, 120)]}
				velocity={(i) => [range(rng(i * 3), -0.6, 0.6), range(rng(i * 3 + 1), -2.6, -1.2)]}
				life={60}
				size={[2, 4.5]}
				colors={[C.amber, C.amberGlow, '#FFD9A0']}
				seed={23}
			/>
		</g>
	);
};

// ---------------------------------------------------------------------------
// HUD (scene space)
// ---------------------------------------------------------------------------
const HX = 590;
const HY = 636;
const HW = 420;
const HH = 156;
const P0: [number, number] = [736, 958];
const P1: [number, number] = [806, HY + HH];

export const MaxHud: React.FC = () => {
	const frame = useCurrentFrame();
	const D = B.hud;
	if (frame < D || frame > COL + 20) return null;
	const out = prog(frame, COL - 8, 14, easeInCubic);
	const line = prog(frame, D, 14, easeOutCubic) * (1 - out);
	const brackets = springAt(frame, D + 8, {damping: 12, stiffness: 170}) * (1 - out);
	const panel = springAt(frame, D + 12, {damping: 14, stiffness: 150}) * (1 - out);
	const text = 'EFFORT: MAX';
	const chars = Math.max(0, Math.min(text.length, Math.floor((frame - D - 20) / 3)));
	const pwr = Math.round(easeInOutCubic(prog(frame, D + 40, 40)) * 100);
	const caret = Math.floor(frame / 15) % 2 === 0;
	const shown = text.slice(0, chars);
	const bk = (x: number, y: number, sx: number, sy: number) =>
		`M${x + sx * 26} ${y}L${x} ${y}L${x} ${y + sy * 26}`;
	const cxp = HX + HW / 2;
	const cyp = HY + HH / 2;
	const bs = lerp(1.25, 1, brackets);
	return (
		<g>
			{/* leader line */}
			<path d={`M${P0[0]} ${P0[1]}L${P1[0]} ${P1[1]}`} stroke={C.amber} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} strokeLinecap="round" />
			<circle cx={P0[0]} cy={P0[1]} r={6 * line} fill={C.amber} />
			<circle cx={P0[0]} cy={P0[1]} r={13 * line} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
			{/* panel */}
			<g transform={`translate(${HX} ${cyp}) scale(${panel.toFixed(4)} ${Math.min(1, panel * 1.3).toFixed(4)}) translate(${-HX} ${-cyp})`} opacity={Math.min(1, panel * 1.5)}>
				<rect x={HX + 6} y={HY + 8} width={HW} height={HH} rx={14} fill="#000" opacity={0.18} />
				<rect x={HX} y={HY} width={HW} height={HH} rx={14} fill="#1A1416" />
				<rect x={HX + 8} y={HY + 8} width={HW - 16} height={HH - 16} rx={9} fill="none" stroke="#3A2E2C" strokeWidth={1.5} />
				<text x={HX + 34} y={HY + 74} fontFamily={MONO} fontWeight={700} fontSize={50} letterSpacing={1}>
					<tspan fill="#EFE7DA">{shown.slice(0, 8)}</tspan>
					<tspan fill={C.amber}>{shown.slice(8)}</tspan>
				</text>
				{chars < text.length && caret && <rect x={HX + 36 + chars * 31} y={HY + 36} width={22} height={44} fill="#EFE7DA" opacity={0.85} />}
				{[0, 1, 2, 3, 4].map((k) => {
					const lit = prog(frame, D + 40 + k * 7, 6);
					const x = HX + 46 + k * 31;
					const y = HY + 116;
					return (
						<g key={k} transform={`translate(${x} ${y}) rotate(45) scale(${(0.7 + 0.3 * lit).toFixed(3)})`}>
							<rect x={-8} y={-8} width={16} height={16} fill={lit > 0.5 ? C.amber : 'none'} stroke={C.amber} strokeWidth={2.4} opacity={0.4 + lit * 0.6} />
						</g>
					);
				})}
				<text x={HX + 222} y={HY + 126} fontFamily={MONO} fontWeight={600} fontSize={29}>
					<tspan fill="#9C938C">PWR </tspan>
					<tspan fill={C.amber}>{`${pwr}%`}</tspan>
				</text>
				{/* faint scanline */}
				<rect x={HX + 8} y={HY + 10 + ((frame * 2) % (HH - 20))} width={HW - 16} height={2} fill="#FFFFFF" opacity={0.05} />
			</g>
			{/* corner brackets */}
			<g transform={`translate(${cxp} ${cyp}) scale(${bs.toFixed(4)}) translate(${-cxp} ${-cyp})`} opacity={brackets} stroke={C.amber} strokeWidth={3.2} fill="none" strokeLinecap="round">
				<path d={bk(HX - 10, HY - 10, 1, 1)} />
				<path d={bk(HX + HW + 10, HY - 10, -1, 1)} />
				<path d={bk(HX - 10, HY + HH + 10, 1, -1)} />
				<path d={bk(HX + HW + 10, HY + HH + 10, -1, -1)} />
			</g>
		</g>
	);
};
