import React, {useMemo} from 'react';
import {BASE_PALETTE, C, mix, RAINBOW, RobotPalette} from '../utils/colors';
import {roundRectPath, sketchRoundRect} from '../utils/sketch';
import {makeSurfaceTexture, SurfaceTextureLayer} from '../effects/SketchTexture';
import {Sparkle} from './Sparkle';

// ---------------------------------------------------------------------------
// Geometry (robot-local space: origin = ground point under the robot centre)
// Proportions measured on the reference still (REFERENCE_ANALYSIS.md §5).
// ---------------------------------------------------------------------------
export const ROBOT = {
	W: 420,
	H: 258,
	RAD: 17,
	STROKE: 7,
	LEG_H: 72,
	LEG_W: 34,
	ARM_W: 66,
	ARM_H: 74,
	EYE_W: 36,
	EYE_H: 64,
	EYE_X: [-110, 108] as const,
	LEG_X: [0.135, 0.304, 0.677, 0.85].map((f) => (f - 0.5) * 420),
};
export const BODY_TOP = -(ROBOT.LEG_H + ROBOT.H); // -330
export const BODY_BOTTOM = -ROBOT.LEG_H; // -72
export const BODY_LEFT = -ROBOT.W / 2;
export const BODY_RIGHT = ROBOT.W / 2;
export const EYE_CY = BODY_TOP + ROBOT.H * 0.44;
export const ARM_CY = BODY_TOP + ROBOT.H * 0.57;
export const BODY_CY = BODY_TOP + ROBOT.H / 2;

export type ArmPose = {
	dx: number;
	dy: number;
	rot: number;
	front?: boolean;
	scale?: number;
	/** 'desk' = drawn by a scene layer in front of the robot (e.g. over the chessboard) */
	layer?: 'body' | 'desk';
};

export type RobotPose = {
	lift: number; // levitation (px, up)
	bob: number; // body vertical offset (px, + = down); grounded legs compensate
	squash: number; // > 0 squash, < 0 stretch
	tilt: number; // deg
	armL: ArmPose;
	armR: ArmPose;
	legLift: number[]; // per-leg foot raise (px)
	legRot: number[]; // per-leg swing (deg)
	legScale: number; // 0 = retracted into body
	eyeOpen: number; // 1 open .. 0.05 closed
	eyeDx: number;
	eyeDy: number;
	eyeScale: number;
};

export type RobotLook = {
	palette: RobotPalette;
	anger: number; // slanted "focused" eyes (MEDIUM)
	baseEyes: number; // opacity of the plain dark eyes
	violet: number; // ULTRACODE eyes
	capsule: number; // ULTRATHINK eyes
	capsuleGlow: [string, string];
	rainbow: number; // ULTRATHINK fill reveal 0..1
	rainbowPhase: number;
	limbColors?: string[]; // [armL, armR, leg0..leg3] overrides
	aberration: number; // chromatic aberration offset (px)
	detail: 'full' | 'mid';
	seed: number;
	boil: number;
};

export const defaultPose = (): RobotPose => ({
	lift: 0,
	bob: 0,
	squash: 0,
	tilt: 0,
	armL: {dx: 0, dy: 0, rot: 0},
	armR: {dx: 0, dy: 0, rot: 0},
	legLift: [0, 0, 0, 0],
	legRot: [0, 0, 0, 0],
	legScale: 1,
	eyeOpen: 1,
	eyeDx: 0,
	eyeDy: 0,
	eyeScale: 1,
});

export const defaultLook = (): RobotLook => ({
	palette: BASE_PALETTE,
	anger: 0,
	baseEyes: 1,
	violet: 0,
	capsule: 0,
	capsuleGlow: ['#FDBA55', '#8392C9'],
	rainbow: 0,
	rainbowPhase: 0,
	aberration: 0,
	detail: 'full',
	seed: 1,
	boil: 0,
});

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Polygon with rounded corners (quadratic corner fillets). */
export const roundedPoly = (pts: [number, number][], r: number) => {
	const n = pts.length;
	let d = '';
	for (let i = 0; i < n; i++) {
		const p = pts[i];
		const a = pts[(i - 1 + n) % n];
		const b = pts[(i + 1) % n];
		const la = Math.hypot(a[0] - p[0], a[1] - p[1]) || 1;
		const lb = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1;
		const ra = Math.min(r, la / 2);
		const rb = Math.min(r, lb / 2);
		const A = [p[0] + ((a[0] - p[0]) / la) * ra, p[1] + ((a[1] - p[1]) / la) * ra];
		const B = [p[0] + ((b[0] - p[0]) / lb) * rb, p[1] + ((b[1] - p[1]) / lb) * rb];
		d += `${i === 0 ? 'M' : 'L'}${A[0].toFixed(1)} ${A[1].toFixed(1)}Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}`;
	}
	return d + 'Z';
};

const bodyTransform = (pose: RobotPose) => {
	const sx = 1 + pose.squash;
	const sy = 1 - pose.squash;
	return `translate(0 ${pose.bob.toFixed(2)}) translate(0 ${BODY_BOTTOM}) rotate(${pose.tilt.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 ${-BODY_BOTTOM})`;
};

// ---------------------------------------------------------------------------
// Rainbow fill (ULTRATHINK): wavy vertical bands that scroll sideways
// ---------------------------------------------------------------------------
const RainbowBands: React.FC<{phase: number; reveal: number; uid: string}> = ({
	phase,
	reveal,
	uid,
}) => {
	const {W, H} = ROBOT;
	const bandW = W / 5.4;
	const bands: React.ReactNode[] = [];
	const whole = Math.floor(phase);
	const frac = phase - whole;
	const mod = (n: number, m: number) => ((n % m) + m) % m;
	// band identity k stays attached to the same colour as the bands scroll right
	const edge = (i: number, y: number) => {
		const k = i - whole;
		return (
			BODY_LEFT - bandW * 2 + (i + frac) * bandW +
			Math.sin(y * 0.022 + k * 0.55 + phase * 0.35) * 16 +
			Math.sin(y * 0.061 + k * 1.7) * 4
		);
	};
	for (let i = 0; i < 9; i++) {
		const left: string[] = [];
		const right: string[] = [];
		for (let y = BODY_TOP - 6; y <= BODY_BOTTOM + 6; y += 12) {
			left.push(`${edge(i, y).toFixed(1)} ${y}`);
			right.unshift(`${(edge(i + 1, y) + 1).toFixed(1)} ${y}`);
		}
		bands.push(
			<path
				key={i}
				d={`M${left.join('L')}L${right.join('L')}Z`}
				fill={RAINBOW[mod(i - whole, RAINBOW.length)]}
			/>,
		);
	}
	// wavy "liquid" reveal rising from the bottom
	const top = BODY_BOTTOM + 10 - (H + 40) * reveal;
	let clip = `M${BODY_LEFT - 20} ${BODY_BOTTOM + 30}`;
	for (let x = BODY_LEFT - 20; x <= BODY_RIGHT + 20; x += 14) {
		clip += `L${x} ${(top + Math.sin(x * 0.045 + phase * 4) * 9).toFixed(1)}`;
	}
	clip += `L${BODY_RIGHT + 20} ${BODY_BOTTOM + 30}Z`;
	return (
		<g>
			<defs>
				<clipPath id={`${uid}-rbclip`}>
					<path d={clip} />
				</clipPath>
			</defs>
			<g clipPath={`url(#${uid}-rbclip)`}>{bands}</g>
		</g>
	);
};

// ---------------------------------------------------------------------------
// Eyes
// ---------------------------------------------------------------------------
const Eye: React.FC<{
	cx: number;
	cy: number;
	side: -1 | 1; // -1 left eye, +1 right eye
	pose: RobotPose;
	look: RobotLook;
}> = ({cx, cy, side, pose, look}) => {
	const {EYE_W, EYE_H} = ROBOT;
	const s = pose.eyeScale;
	const w = EYE_W * s;
	const h = EYE_H * s;
	const x = cx + pose.eyeDx;
	const y = cy + pose.eyeDy;
	const open = pose.eyeOpen;
	const slant = 19 * look.anger;
	// inner side is toward the face centre
	const innerX = side < 0 ? x + w / 2 : x - w / 2;
	const outerX = side < 0 ? x - w / 2 : x + w / 2;
	const top = y - h / 2;
	const bot = y + h / 2;
	const basePts: [number, number][] =
		side < 0
			? [
					[outerX, top - slant * 0.25],
					[innerX, top + slant * 0.85],
					[innerX, bot],
					[outerX, bot],
				]
			: [
					[innerX, top + slant * 0.85],
					[outerX, top - slant * 0.25],
					[outerX, bot],
					[innerX, bot],
				];
	const blinkT = `translate(0 ${y}) scale(1 ${open.toFixed(3)}) translate(0 ${-y})`;
	return (
		<g>
			{look.baseEyes > 0.001 && (
				<g opacity={look.baseEyes} transform={blinkT}>
					<path d={roundedPoly(basePts, 9 * s)} fill={look.palette.eye} />
					{open > 0.45 && (
						<rect
							x={x - 2}
							y={top + 6 + slant * 0.55}
							width={13 * s}
							height={14 * s}
							rx={3}
							fill="#FBF6EE"
							opacity={0.95}
						/>
					)}
				</g>
			)}
			{look.violet > 0.001 && (
				<g opacity={look.violet} transform={blinkT}>
					<ellipse cx={x} cy={y} rx={44} ry={58} fill={C.violetGlow} opacity={0.75} filter={`url(#blur-md)`} />
					<ellipse cx={x} cy={y} rx={30} ry={42} fill={C.violetRing} />
					<ellipse cx={x} cy={y} rx={30} ry={42} fill="none" stroke="#8F62B0" strokeWidth={2} opacity={0.6} />
					<rect x={x - 12.5} y={y - 24} width={25} height={48} rx={7} fill={C.violetCore} stroke={look.palette.ink} strokeWidth={3.6} />
					<rect x={x - 6} y={y - 18} width={6} height={18} rx={3} fill="#FFFFFF" opacity={0.9} />
				</g>
			)}
			{look.capsule > 0.001 && (
				<g opacity={look.capsule} transform={blinkT}>
					<circle cx={x} cy={y} r={54} fill={look.capsuleGlow[side < 0 ? 0 : 1]} opacity={0.85} filter={`url(#blur-md)`} />
					<ellipse cx={x} cy={y} rx={33} ry={42} fill="#FFF8E8" opacity={0.55} filter={`url(#blur-sm)`} />
					<rect x={x - 16} y={y - 28} width={32} height={56} rx={14} fill="#FFFEFA" stroke={look.palette.ink} strokeWidth={3.6} />
					<rect x={x - 9} y={y - 21} width={6} height={20} rx={3} fill="#FFFFFF" />
					<Sparkle x={x + 20} y={y - 30} size={15} fill="#FFFFFF" stroke={look.palette.ink} strokeWidth={1.4} />
					{[0, 1, 2, 3, 4].map((k) => {
						const a = -0.6 + k * 0.55 + side * 0.2;
						return (
							<line
								key={k}
								x1={x + Math.cos(a) * 40}
								y1={y + Math.sin(a) * 46}
								x2={x + Math.cos(a) * 52}
								y2={y + Math.sin(a) * 58}
								stroke="#FFFFFF"
								strokeWidth={2}
								strokeLinecap="round"
								opacity={0.7}
							/>
						);
					})}
				</g>
			)}
		</g>
	);
};

// ---------------------------------------------------------------------------
// Limbs
// ---------------------------------------------------------------------------
export const RobotArm: React.FC<{
	side: -1 | 1;
	p: ArmPose;
	fill: string;
	shade: string;
	ink: string;
	seed: number;
	boil: number;
	detail: 'full' | 'mid';
}> = ({side, p, fill, shade, ink, seed, boil, detail}) => {
	const {ARM_W, ARM_H, W} = ROBOT;
	const x0 = side < 0 ? -W / 2 - ARM_W + 14 : W / 2 - 14;
	const y0 = ARM_CY - ARM_H / 2;
	const pivotX = (side * W) / 2;
	const outline = useMemo(
		() =>
			detail === 'full'
				? sketchRoundRect(x0, y0, ARM_W, ARM_H, 8, {seed: seed + (side < 0 ? 11 : 13), amp: 0.9, boil, step: 6})
				: roundRectPath(x0, y0, ARM_W, ARM_H, 8),
		[x0, y0, ARM_W, ARM_H, seed, side, boil, detail],
	);
	const sc = p.scale ?? 1;
	return (
		<g
			transform={`translate(${p.dx.toFixed(2)} ${p.dy.toFixed(2)}) rotate(${p.rot.toFixed(2)} ${pivotX} ${ARM_CY}) translate(${pivotX} ${ARM_CY}) scale(${sc}) translate(${-pivotX} ${-ARM_CY})`}
		>
			<path d={outline} fill={fill} />
			{/* lower + outer shading like the reference */}
			<rect x={x0 + 3} y={y0 + ARM_H - 15} width={ARM_W - 6} height={12} rx={4} fill={shade} opacity={0.75} />
			{side > 0 && <rect x={x0 + ARM_W - 16} y={y0 + 3} width={12} height={ARM_H - 6} rx={4} fill={shade} opacity={0.8} />}
			{detail === 'full' && (
				<g stroke={mix(shade, ink, 0.4)} strokeWidth={1.1} strokeLinecap="round" opacity={0.35}>
					<line x1={x0 + 14} y1={y0 + 40} x2={x0 + 30} y2={y0 + 18} />
					<line x1={x0 + 26} y1={y0 + 52} x2={x0 + 46} y2={y0 + 24} />
					<line x1={x0 + 40} y1={y0 + 60} x2={x0 + 56} y2={y0 + 38} />
				</g>
			)}
			<path d={outline} fill="none" stroke={ink} strokeWidth={ROBOT.STROKE - 0.5} strokeLinejoin="round" />
		</g>
	);
};

const Leg: React.FC<{
	x: number;
	top: number;
	bottom: number;
	rot: number;
	fill: string;
	shade: string;
	ink: string;
	seed: number;
	boil: number;
	detail: 'full' | 'mid';
}> = ({x, top, bottom, rot, fill, shade, ink, seed, boil, detail}) => {
	const {LEG_W} = ROBOT;
	const h = Math.max(0, bottom - top);
	const hr = Math.round(h);
	const outline = useMemo(
		() =>
			detail === 'full'
				? sketchRoundRect(x - LEG_W / 2, top, LEG_W, hr, 7, {seed, amp: 0.7, boil, step: 6})
				: roundRectPath(x - LEG_W / 2, top, LEG_W, hr, 7),
		[x, top, hr, seed, boil, detail, LEG_W],
	);
	if (h < 2) return null;
	return (
		<g transform={`rotate(${rot.toFixed(2)} ${x} ${top})`}>
			<path d={outline} fill={fill} />
			<rect x={x + LEG_W / 2 - 13} y={top + 2} width={10} height={Math.max(0, hr - 5)} rx={4} fill={shade} opacity={0.7} />
			<path d={outline} fill="none" stroke={ink} strokeWidth={ROBOT.STROKE - 1} strokeLinejoin="round" />
		</g>
	);
};

// ---------------------------------------------------------------------------
// Robot
// ---------------------------------------------------------------------------
export type RobotProps = {
	x: number;
	y: number; // ground y
	scale?: number;
	pose: RobotPose;
	look: RobotLook;
	uid: string;
	/** inside body transform, behind arms + body */
	backLayer?: React.ReactNode;
	/** inside body transform, on top of body + eyes */
	faceLayer?: React.ReactNode;
	/** inside body transform, top-most (in front of front arms) */
	frontLayer?: React.ReactNode;
	/** follows levitation but not body bob (e.g. boots) */
	feetLayer?: React.ReactNode;
	/** behind everything (legs included), follows lift + bob: auras */
	underLayer?: React.ReactNode;
	/** replaces body texture/fill opacity, e.g. armour hides parts */
	opacity?: number;
};

export const RobotBase: React.FC<RobotProps> = ({
	x,
	y,
	scale = 1,
	pose,
	look,
	uid,
	backLayer,
	faceLayer,
	frontLayer,
	feetLayer,
	underLayer,
	opacity = 1,
}) => {
	const {W, H, RAD, STROKE} = ROBOT;
	const P = look.palette;
	const full = look.detail === 'full';

	const tex = useMemo(
		() => makeSurfaceTexture(look.seed, {x: BODY_LEFT, y: BODY_TOP, w: W, h: H}),
		[look.seed, W, H],
	);
	const outline = useMemo(
		() =>
			full
				? sketchRoundRect(BODY_LEFT, BODY_TOP, W, H, RAD, {seed: look.seed, amp: 1.15, boil: look.boil, step: 8})
				: roundRectPath(BODY_LEFT, BODY_TOP, W, H, RAD),
		[full, look.seed, look.boil, W, H, RAD],
	);
	const outline2 = useMemo(
		() =>
			full
				? sketchRoundRect(BODY_LEFT + 0.8, BODY_TOP - 0.6, W - 1, H, RAD, {seed: look.seed + 50, amp: 1.9, boil: look.boil + 3, step: 9})
				: '',
		[full, look.seed, look.boil, W, H, RAD],
	);
	const clipD = useMemo(() => roundRectPath(BODY_LEFT + 1, BODY_TOP + 1, W - 2, H - 2, RAD - 1), [W, H, RAD]);

	const limb = (i: number, base: string) => {
		const c = look.limbColors?.[i];
		return c ? mix(base, c, look.rainbow) : base;
	};
	const armLFill = limb(0, P.leg);
	const armRFill = limb(1, P.leg);
	const shadeOf = (c: string) => mix(c, '#7A1F1A', 0.22);

	const legTop = BODY_BOTTOM + pose.bob - 14;
	const arms = (front: boolean) => (
		<>
			{!!pose.armL.front === front && pose.armL.layer !== 'desk' && (
				<RobotArm side={-1} p={pose.armL} fill={armLFill} shade={shadeOf(armLFill)} ink={P.ink} seed={look.seed} boil={look.boil} detail={look.detail} />
			)}
			{!!pose.armR.front === front && pose.armR.layer !== 'desk' && (
				<RobotArm side={1} p={pose.armR} fill={armRFill} shade={shadeOf(armRFill)} ink={P.ink} seed={look.seed} boil={look.boil} detail={look.detail} />
			)}
		</>
	);

	return (
		<g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale})`} opacity={opacity}>
			<defs>
				<clipPath id={`${uid}-body`}>
					<path d={clipD} />
				</clipPath>
			</defs>
			<g transform={`translate(0 ${(-pose.lift).toFixed(2)})`}>
				{underLayer && <g transform={`translate(0 ${pose.bob.toFixed(2)})`}>{underLayer}</g>}
				{/* legs */}
				{pose.legScale > 0.01 &&
					ROBOT.LEG_X.map((lx, i) => {
						const lfill = limb(2 + i, P.leg);
						const bottomGround = -pose.legLift[i];
						const len = (bottomGround - legTop) * pose.legScale;
						return (
							<Leg
								key={i}
								x={lx}
								top={legTop}
								bottom={legTop + len}
								rot={pose.legRot[i]}
								fill={lfill}
								shade={shadeOf(lfill)}
								ink={P.ink}
								seed={look.seed + 20 + i}
								boil={look.boil}
								detail={look.detail}
							/>
						);
					})}
				{feetLayer}
				<g transform={bodyTransform(pose)}>
					{backLayer}
					{arms(false)}
					{/* body */}
					<path d={outline} fill={P.body} />
					<g clipPath={`url(#${uid}-body)`}>
						<rect x={BODY_RIGHT - W * 0.125} y={BODY_TOP} width={W * 0.125} height={H} fill={P.bodyRight} opacity={0.92} />
						<rect x={BODY_RIGHT - W * 0.05} y={BODY_TOP} width={W * 0.05} height={H} fill={mix(P.bodyRight, P.ink, 0.1)} opacity={0.55} />
						<rect x={BODY_LEFT} y={BODY_BOTTOM - H * 0.085} width={W} height={H * 0.085} fill={P.bodyBottom} opacity={0.95} />
						{look.rainbow > 0.001 && <RainbowBands phase={look.rainbowPhase} reveal={look.rainbow} uid={uid} />}
						{full && (
							<SurfaceTextureLayer
								tex={tex}
								light={mix(P.bodyLight, '#FFFFFF', look.rainbow * 0.7)}
								dark={mix(P.hatch, '#3A2050', look.rainbow * 0.5)}
								strength={1 - look.rainbow * 0.45}
							/>
						)}
						{/* inner rim light, top + left */}
						<path
							d={`M${BODY_LEFT + 8} ${BODY_BOTTOM - 26}L${BODY_LEFT + 8} ${BODY_TOP + 12}Q${BODY_LEFT + 8} ${BODY_TOP + 8} ${BODY_LEFT + 14} ${BODY_TOP + 8}L${BODY_RIGHT - W * 0.14} ${BODY_TOP + 8}`}
							stroke={mix(P.bodyLight, '#FFFFFF', 0.25 + look.rainbow * 0.5)}
							strokeWidth={3}
							fill="none"
							strokeLinecap="round"
							opacity={0.55}
						/>
					</g>
					{look.aberration > 0.05 && (
						<g opacity={0.45} fill="none" strokeWidth={STROKE - 2}>
							<path d={outline} stroke="#FF4D6D" transform={`translate(${-look.aberration} ${look.aberration * 0.3})`} />
							<path d={outline} stroke="#38C8FF" transform={`translate(${look.aberration} ${-look.aberration * 0.3})`} />
						</g>
					)}
					<path d={outline} fill="none" stroke={P.ink} strokeWidth={STROKE} strokeLinejoin="round" />
					{full && <path d={outline2} fill="none" stroke={P.ink} strokeWidth={1.5} opacity={0.3} />}
					{/* eyes */}
					<Eye cx={ROBOT.EYE_X[0]} cy={EYE_CY} side={-1} pose={pose} look={look} />
					<Eye cx={ROBOT.EYE_X[1]} cy={EYE_CY} side={1} pose={pose} look={look} />
					{faceLayer}
					{arms(true)}
					{frontLayer}
				</g>
			</g>
		</g>
	);
};
