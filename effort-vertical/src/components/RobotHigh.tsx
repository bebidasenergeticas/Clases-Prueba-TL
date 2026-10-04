// HIGH — the keyboard morphs into a big chessboard; the robot calculates,
// pieces move on their own and the robot pushes pawns with its hands.
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {HatchLayer, makeMatteTexture} from '../effects/SketchTexture';
import {clamp, easeInBack, easeInCubic, easeInOutCubic, easeOutBack, easeOutCubic, lerp, prog, springAt} from '../utils/animation';
import {C, mix} from '../utils/colors';
import {noise1} from '../utils/random';
import {BEATS, PHASES} from '../utils/timing';
import {ARM_CY, ROBOT, RobotArm, RobotLook, RobotPose} from './RobotBase';
import {KEYBOARD_SLAB, KeyboardKeys, Slab, slabPoint} from './RobotMedium';

const H = BEATS.high;
const BOARD_SLAB: Slab = {backY: -128, backW: 480, frontY: 6, frontW: 594, thick: 34};
const U0 = 0.04;
const U1 = 0.96;
const V0 = 0.075;
const V1 = 0.93;

// ---------------------------------------------------------------------------
// desk timeline
// ---------------------------------------------------------------------------
export const deskState = (frame: number) => {
	const rise = springAt(frame, BEATS.medium.keyboard, {damping: 13, stiffness: 130});
	const morph = prog(frame, H.morph, 38, easeInOutCubic);
	const settle = springAt(frame, H.morph + 30, {damping: 8, stiffness: 200});
	const fold = prog(frame, H.exit + 10, 22, easeInBack);
	const gone = prog(frame, H.exit + 28, 10);
	return {rise, morph, settle, fold, gone};
};

const lerpSlab = (a: Slab, b: Slab, t: number): Slab => ({
	backY: lerp(a.backY, b.backY, t),
	backW: lerp(a.backW, b.backW, t),
	frontY: lerp(a.frontY, b.frontY, t),
	frontW: lerp(a.frontW, b.frontW, t),
	thick: lerp(a.thick, b.thick, t),
});

// ---------------------------------------------------------------------------
// chess pieces
// ---------------------------------------------------------------------------
type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
const PIECE_D: Record<PieceType, string> = {
	p: 'M-14 0L14 0L12 -7L7 -9L5 -22C9 -23 11 -27 11 -31C11 -37 6 -41 0 -41C-6 -41 -11 -37 -11 -31C-11 -27 -9 -23 -5 -22L-7 -9L-12 -7Z',
	r: 'M-15 0L15 0L13 -7L9 -9L9 -34L12 -36L12 -47L7 -47L7 -42L2.5 -42L2.5 -47L-2.5 -47L-2.5 -42L-7 -42L-7 -47L-12 -47L-12 -36L-9 -34L-9 -9L-13 -7Z',
	n: 'M-15 0L15 0L13 -7L10 -9C12 -20 12 -31 8 -40C5 -47 -1 -52 -8 -53L-6 -47C-12 -44 -16 -38 -15 -33C-14 -29 -11 -29 -8 -31C-5 -33 -2 -33 0 -31C-4 -25 -9 -19 -10 -9L-13 -7Z',
	b: 'M-14 0L14 0L12 -7L7 -9L5 -30C10 -33 11 -40 8 -46C6 -50 2 -54 0 -56C-2 -54 -6 -50 -8 -46C-11 -40 -10 -33 -5 -30L-7 -9L-12 -7Z',
	q: 'M-15 0L15 0L13 -7L8 -9L6 -38L13 -51L6 -45L3 -55L0 -46L-3 -55L-6 -45L-13 -51L-6 -38L-8 -9L-13 -7Z',
	k: 'M-15 0L15 0L13 -7L8 -9L6 -38C10 -40 11 -44 8 -47L-8 -47C-11 -44 -10 -40 -6 -38L-8 -9L-13 -7Z',
};

type Move = {at: number; to: [number, number]; dur: number; arc: number; by?: 'L' | 'R'};
type Piece = {id: string; t: PieceType; white: boolean; sq: [number, number]; moves?: Move[]; capturedAt?: number};

const [M0, M1, M2, M3, M4] = H.moves;
const PIECES: Piece[] = [
	// black (robot side, back ranks)
	{id: 'bk', t: 'k', white: false, sq: [4, 0], moves: [{at: M3, to: [5, 1], dur: 20, arc: 26}]},
	{id: 'bq', t: 'q', white: false, sq: [3, 1]},
	{id: 'br1', t: 'r', white: false, sq: [0, 0]},
	{id: 'br2', t: 'r', white: false, sq: [7, 0]},
	{id: 'bn', t: 'n', white: false, sq: [2, 2]},
	{id: 'bb', t: 'b', white: false, sq: [6, 1]},
	{id: 'bpa', t: 'p', white: false, sq: [0, 1], moves: [{at: M4, to: [0, 3], dur: 18, arc: 0, by: 'L'}]},
	{id: 'bpb', t: 'p', white: false, sq: [1, 2]},
	{id: 'bpe', t: 'p', white: false, sq: [4, 3]},
	{id: 'bpf', t: 'p', white: false, sq: [5, 1], capturedAt: M2 + 22},
	{id: 'bph', t: 'p', white: false, sq: [7, 1], moves: [{at: M1, to: [7, 2], dur: 14, arc: 0, by: 'R'}]},
	// white (viewer side)
	{id: 'wk', t: 'k', white: true, sq: [6, 7]},
	{id: 'wq', t: 'q', white: true, sq: [3, 7]},
	{id: 'wr', t: 'r', white: true, sq: [0, 7]},
	{id: 'wr2', t: 'r', white: true, sq: [4, 7]},
	{id: 'wn', t: 'n', white: true, sq: [5, 5], moves: [{at: M0, to: [6, 3], dur: 26, arc: 40}]},
	{id: 'wb', t: 'b', white: true, sq: [2, 4], moves: [{at: M2, to: [5, 1], dur: 24, arc: 6}], capturedAt: M3 + 18},
	{id: 'wpa', t: 'p', white: true, sq: [0, 6]},
	{id: 'wpb', t: 'p', white: true, sq: [1, 5]},
	{id: 'wpe', t: 'p', white: true, sq: [4, 4]},
	{id: 'wpf', t: 'p', white: true, sq: [5, 6]},
	{id: 'wpg', t: 'p', white: true, sq: [6, 6]},
	{id: 'wph', t: 'p', white: true, sq: [7, 5]},
];

const squareUV = (f: number, r: number): [number, number] => [
	U0 + ((f + 0.5) / 8) * (U1 - U0),
	V0 + ((r + 0.58) / 8) * (V1 - V0),
];

/** Board-space (f, r) + lift of a piece at frame. */
const pieceAt = (p: Piece, frame: number) => {
	let [f, r] = p.sq;
	let lift = 0;
	for (const m of p.moves ?? []) {
		if (frame < m.at) break;
		const t = clamp((frame - m.at) / m.dur);
		const e = easeInOutCubic(t);
		f = lerp(f, m.to[0], e);
		r = lerp(r, m.to[1], e);
		lift = Math.sin(t * Math.PI) * m.arc;
	}
	return {f, r, lift};
};

/** Which move (if any) is currently being animated — used for gaze/camera/arms. */
export const activeMove = (frame: number) => {
	for (const p of PIECES) {
		for (const m of p.moves ?? []) {
			if (frame >= m.at - 16 && frame <= m.at + m.dur + 10) {
				const pos = pieceAt(p, frame);
				const [u, v] = squareUV(pos.f, pos.r);
				const [x, y] = slabPoint(BOARD_SLAB, u, v);
				return {piece: p, move: m, x, y};
			}
		}
	}
	return null;
};

const ChessPiece: React.FC<{p: Piece; frame: number; g: Slab; appear: number; exit: number}> = ({p, frame, g, appear, exit}) => {
	const pos = pieceAt(p, frame);
	const [u, v] = squareUV(pos.f, pos.r);
	const [x, y] = slabPoint(g, u, v);
	const sc = lerp(0.74, 1.04, v) * 1.12;
	let flyX = 0;
	let flyY = 0;
	let rot = 0;
	let alpha = 1;
	if (p.capturedAt !== undefined && frame >= p.capturedAt) {
		const t = clamp((frame - p.capturedAt) / 26);
		flyX = (p.white ? 1 : -1) * t * 120;
		flyY = -Math.sin(t * Math.PI * 0.9) * 110 + t * t * 40;
		rot = (p.white ? 1 : -1) * t * 160;
		alpha = 1 - easeInCubic(t);
		if (t >= 1) return null;
	}
	const pop = appear;
	const ex = exit;
	const scale = sc * pop * (1 + ex * 0.15) * (1 - easeInBack(ex));
	if (scale < 0.01) return null;
	const fill = p.white ? '#F7F2E8' : '#3B2C2C';
	const shade = p.white ? '#D8CDBB' : '#2A1E1F';
	return (
		<g transform={`translate(${(x + flyX).toFixed(1)} ${(y - pos.lift + flyY - ex * 30).toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(4)})`} opacity={alpha}>
			<ellipse cx={0} cy={1 + pos.lift / scale} rx={15} ry={4} fill="#3B2C2C" opacity={0.22} />
			<path d={PIECE_D[p.t]} fill={fill} />
			<g clipPath={`url(#piece-clip-${p.t})`}>
				<rect x={4} y={-60} width={14} height={60} fill={shade} opacity={0.85} />
			</g>
			{!p.white && <path d="M-5 -12L-3 -28" stroke="#7A6562" strokeWidth={2} strokeLinecap="round" opacity={0.7} />}
			{p.t === 'b' && <circle cx={0} cy={-59} r={3.4} fill={fill} stroke={C.ink} strokeWidth={2} />}
			{p.t === 'k' && (
				<path d="M-1.8 -47L-1.8 -52L-5 -52L-5 -55.5L-1.8 -55.5L-1.8 -59L1.8 -59L1.8 -55.5L5 -55.5L5 -52L1.8 -52L1.8 -47Z" fill={fill} stroke={C.ink} strokeWidth={2} strokeLinejoin="round" />
			)}
			<path d={PIECE_D[p.t]} fill="none" stroke={C.ink} strokeWidth={2.6} strokeLinejoin="round" />
			{p.t === 'n' && <circle cx={-6} cy={-42} r={1.7} fill={p.white ? C.ink : '#A89490'} />}
			{p.t === 'b' && <path d="M-3 -46L3 -40" stroke={p.white ? C.ink : '#A89490'} strokeWidth={1.6} strokeLinecap="round" />}
		</g>
	);
};

// ---------------------------------------------------------------------------
// director contribution
// ---------------------------------------------------------------------------
const REST_DX = -2;
const REST_DY = 34;

export const highAmount = (frame: number) =>
	prog(frame, H.morph + 10, 26, easeInOutCubic) * (1 - prog(frame, H.exit, 18, easeInOutCubic));

export const applyHigh = (frame: number, s: SceneState) => {
	if (frame < H.morph - 5 || frame > PHASES.xhigh.start + 40) return;
	const a = highAmount(frame);
	if (a <= 0) return;
	// hands rest on the board's back corners, drawn over the board
	const armL = {...s.pose.armL};
	const armR = {...s.pose.armR};
	armL.dx = lerp(armL.dx, REST_DX + 4, a);
	armL.dy = lerp(armL.dy, REST_DY, a);
	armR.dx = lerp(armR.dx, -REST_DX - 4, a);
	armR.dy = lerp(armR.dy, REST_DY, a);
	armL.front = false;
	armR.front = false;
	if (a > 0.6) {
		armL.layer = 'desk';
		armR.layer = 'desk';
	}
	const mv = activeMove(frame);
	if (mv) {
		// gaze follows the moving piece
		const look = prog(frame, mv.move.at - 16, 10, easeOutCubic) * (1 - prog(frame, mv.move.at + mv.move.dur, 12));
		s.pose.eyeDx = lerp(s.pose.eyeDx, clamp(mv.x / 32, -7, 7), look);
		s.pose.eyeDy = lerp(s.pose.eyeDy, 5, look);
		s.pose.tilt += (mv.x / 260) * 2.2 * look;
		s.camera.x -= mv.x * 0.025 * look;
		if (mv.move.by) {
			// the hand reaches, pushes, returns
			const reach = prog(frame, mv.move.at - 12, 12, easeOutBack) * (1 - prog(frame, mv.move.at + mv.move.dur + 2, 14, easeInOutCubic));
			const side = mv.move.by === 'L' ? -1 : 1;
			const shoulderX = side * (ROBOT.W / 2 + ROBOT.ARM_W / 2 - 14);
			const tx = mv.x - shoulderX + side * 4;
			const ty = mv.y - 26 - ARM_CY - s.pose.bob;
			const arm = side < 0 ? armL : armR;
			arm.dx = lerp(arm.dx, tx, reach);
			arm.dy = lerp(arm.dy, ty, reach);
			arm.rot = lerp(arm.rot, side * 14, reach);
		}
	} else {
		// thinking: eyes scan the board
		s.pose.eyeDx += noise1(frame / 40, 66) * 5 * a;
		s.pose.eyeDy += 4 * a;
	}
	s.pose.armL = armL;
	s.pose.armR = armR;
	s.look.anger = Math.max(s.look.anger, 0.22 * a);
	// slow push-in
	s.camera.scale += 0.035 * easeInOutCubic(prog(frame, H.morph, 340)) * (1 - prog(frame, H.exit, 30, easeInOutCubic));
};

// ---------------------------------------------------------------------------
// desk: keyboard (MEDIUM) -> chessboard (HIGH) -> folds away (XHIGH)
// ---------------------------------------------------------------------------
export const ChessDesk: React.FC<{x: number; y: number; pose: RobotPose; look: RobotLook}> = ({x, y, pose, look}) => {
	const frame = useCurrentFrame();
	const st = deskState(frame);
	const tex = useMemo(() => makeMatteTexture(81, {x: -300, y: -130, w: 600, h: 175}, 1.6), []);
	if (st.rise < 0.01 || st.gone >= 1) return null;
	const m = st.morph;
	let g = lerpSlab(KEYBOARD_SLAB, BOARD_SLAB, m);
	// fold: the board's back edge drops toward the front, the slab flattens
	if (st.fold > 0) {
		g = {...g, backY: lerp(g.backY, g.frontY - 4, st.fold), backW: lerp(g.backW, g.frontW, st.fold), thick: lerp(g.thick, 6, st.fold)};
	}
	const settle = m >= 1 ? 1 + (1 - st.settle) * 0.025 : 1;
	// keyboard is held (follows body bob), board sits on the floor
	const follow = (1 - m) * pose.bob;
	const riseY = (1 - st.rise) * 110;
	const topCol = mix('#EFE6D6', C.woodLight, m);
	const frontCol = mix(C.metalShade, C.wood, m);
	const a = slabPoint(g, 0, 0);
	const b = slabPoint(g, 1, 0);
	const c = slabPoint(g, 1, 1);
	const d = slabPoint(g, 0, 1);
	const top = `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}L${d[0]} ${d[1]}Z`;
	const front = `M${d[0]} ${d[1]}L${c[0]} ${c[1]}L${c[0] - 2} ${c[1] + g.thick}L${d[0] + 2} ${d[1] + g.thick}Z`;
	// checker squares cascade in from the centre
	const squares: React.ReactNode[] = [];
	if (m > 0.3) {
		for (let r = 0; r < 8; r++) {
			for (let f = 0; f < 8; f++) {
				const dist = Math.hypot(f - 3.5, r - 3.5) / 5;
				const al = clamp((m - 0.35 - dist * 0.3) / 0.25);
				if (al <= 0) continue;
				const u0 = U0 + (f / 8) * (U1 - U0);
				const u1 = U0 + ((f + 1) / 8) * (U1 - U0);
				const v0 = V0 + (r / 8) * (V1 - V0);
				const v1 = V0 + ((r + 1) / 8) * (V1 - V0);
				const p1 = slabPoint(g, u0, v0);
				const p2 = slabPoint(g, u1, v0);
				const p3 = slabPoint(g, u1, v1);
				const p4 = slabPoint(g, u0, v1);
				squares.push(
					<path
						key={`${r}${f}`}
						d={`M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}L${p3[0].toFixed(1)} ${p3[1].toFixed(1)}L${p4[0].toFixed(1)} ${p4[1].toFixed(1)}Z`}
						fill={(r + f) % 2 === 0 ? C.checkerLight : C.checkerDark}
						opacity={al}
					/>,
				);
			}
		}
	}
	const inner0 = slabPoint(g, U0, V0);
	const inner1 = slabPoint(g, U1, V0);
	const inner2 = slabPoint(g, U1, V1);
	const inner3 = slabPoint(g, U0, V1);
	const piecesAppear = (p: Piece, i: number) => springAt(frame, H.morph + 34 + (p.white ? 0 : 6) + i * 1.5, {damping: 11, stiffness: 190});
	const piecesExit = (i: number) => prog(frame, H.exit - 6 + i * 0.8, 12);
	const sorted = [...PIECES].sort((p, q) => pieceAt(p, frame).r - pieceAt(q, frame).r);
	const deskArms = (['L', 'R'] as const).map((sd) => {
		const p = sd === 'L' ? pose.armL : pose.armR;
		if (p.layer !== 'desk') return null;
		return (
			<g key={sd} transform={`translate(0 ${pose.bob.toFixed(2)})`}>
				<RobotArm
					side={sd === 'L' ? -1 : 1}
					p={{...p, layer: 'body'}}
					fill={look.palette.leg}
					shade={mix(look.palette.leg, '#7A1F1A', 0.22)}
					ink={look.palette.ink}
					seed={look.seed}
					boil={look.boil}
					detail="full"
				/>
			</g>
		);
	});
	return (
		<g transform={`translate(${x} ${y + riseY + follow}) scale(${settle.toFixed(4)})`} opacity={(1 - st.gone) * Math.min(1, st.rise * 1.5)}>
			<ellipse cx={0} cy={g.frontY + g.thick + 4} rx={g.frontW * 0.52} ry={9 + m * 6} fill="#6F675F" opacity={0.18 + m * 0.1} filter="url(#blur-sm)" />
			<path d={front} fill={frontCol} />
			<path d={front} fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
			{m > 0.5 && (
				<path
					d={`M${d[0] + 6} ${d[1] + g.thick * 0.55}L${c[0] - 6} ${c[1] + g.thick * 0.55}`}
					stroke={C.woodDark}
					strokeWidth={2}
					opacity={(m - 0.5) * 1.2}
				/>
			)}
			<path d={top} fill={topCol} />
			{m > 0.2 && (
				<path
					d={`M${inner0[0]} ${inner0[1]}L${inner1[0]} ${inner1[1]}L${inner2[0]} ${inner2[1]}L${inner3[0]} ${inner3[1]}Z`}
					fill={mix(topCol, C.checkerLight, 0.5)}
					opacity={clamp((m - 0.2) * 3)}
					stroke={C.woodDark}
					strokeWidth={2}
				/>
			)}
			{squares}
			{m > 0.5 && (
				<g opacity={(m - 0.5) * 2}>
					<clipPath id="board-top-clip">
						<path d={top} />
					</clipPath>
					<g clipPath="url(#board-top-clip)">
						<HatchLayer segs={tex} color="#6E4128" width={1.1} opacity={0.8} />
					</g>
				</g>
			)}
			<KeyboardKeys g={g} opacity={1 - clamp(m * 2.2)} frame={frame} />
			<path d={top} fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
			{deskArms}
			{m > 0.6 && (
				<g>
					<defs>
						{(Object.keys(PIECE_D) as PieceType[]).map((t) => (
							<clipPath key={t} id={`piece-clip-${t}`}>
								<path d={PIECE_D[t]} />
							</clipPath>
						))}
					</defs>
					{sorted.map((p, i) => (
						<ChessPiece key={p.id} p={p} frame={frame} g={g} appear={piecesAppear(p, i)} exit={piecesExit(i)} />
					))}
				</g>
			)}
		</g>
	);
};
