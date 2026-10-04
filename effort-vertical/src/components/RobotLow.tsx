// LOW — the robot sits calmly behind a big beige laptop and types slowly.
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {HatchLayer, makeMatteTexture} from '../effects/SketchTexture';
import {clamp, easeInCubic, easeInOutCubic, easeOutCubic, lerp, prog, springAt} from '../utils/animation';
import {C, mix} from '../utils/colors';
import {noise1} from '../utils/random';
import {roundRectPath, sketchEllipse, sketchRoundRect} from '../utils/sketch';
import {BEATS, sec} from '../utils/timing';

const LID_W = 344;
const LID_H = 150;
const LID_BOTTOM = -6;

/** 0..1 how "open"/present the laptop is. */
export const laptopState = (frame: number) => {
	const deck = springAt(frame, BEATS.low.laptopIn, {damping: 15, stiffness: 150});
	const lid = springAt(frame, BEATS.low.laptopIn + 10, {damping: 9, stiffness: 120, mass: 0.9});
	const close = prog(frame, BEATS.low.laptopOut, 15, easeInOutCubic);
	const drop = prog(frame, BEATS.low.laptopOut + 12, 16, easeInCubic);
	return {deck: deck * (1 - drop), lid: lid * (1 - close), drop};
};

/** Typing rhythm: calm, irregular key taps. Returns 0..1 per hand. */
const lowTap = (frame: number, hand: number) => {
	const t = frame / 60;
	const v = Math.sin(t * Math.PI * 2 * 2.1 + hand * 2.4) * 0.5 + 0.5;
	const gate = noise1(t * 1.3, 40 + hand) > -0.25 ? 1 : 0.25;
	return Math.pow(v, 6) * gate;
};

export const applyLow = (frame: number, s: SceneState) => {
	const start = BEATS.low.laptopIn;
	const end = BEATS.low.laptopOut;
	if (frame > end + 40) return;
	// sit down (with a little anticipation) as the laptop arrives
	const sitIn = prog(frame, start + 2, 26, easeInOutCubic);
	const standUp = prog(frame, end - 4, 16, easeInOutCubic);
	const sit = sitIn * (1 - standUp);
	const antic = Math.sin(clamp((frame - start + 2) / 26) * Math.PI) * 0.035;
	s.pose.bob += 22 * sit;
	s.pose.squash += antic * (1 - standUp) + 0.012 * sit;

	// arms reach toward the keyboard behind the lid
	const reach = prog(frame, start + 18, 22, easeOutCubic) * (1 - prog(frame, end - 6, 14, easeInCubic));
	const tl = lowTap(frame, 0) * reach;
	const tr = lowTap(frame, 1) * reach;
	s.pose.armL.rot += lerp(0, -22, reach);
	s.pose.armR.rot += lerp(0, 22, reach);
	s.pose.armL.dx += 16 * reach;
	s.pose.armR.dx -= 16 * reach;
	s.pose.armL.dy += 12 * reach + tl * 4;
	s.pose.armR.dy += 12 * reach + tr * 4;

	// gaze: down at the screen, with an occasional glance at the viewer
	const glance = prog(frame, sec(3.1), 10, easeOutCubic) * (1 - prog(frame, sec(3.9), 12, easeInOutCubic));
	s.pose.eyeDy += 5 * reach * (1 - glance) - 2 * glance;
	s.pose.eyeDx += noise1(frame / 50, 77) * 2 * reach;
	// tiny head nod in time with taps
	s.pose.bob += (tl + tr) * 0.8;
};

/** Laptop seen from behind (lid back facing camera), in robot-local coords. */
export const Laptop: React.FC<{x: number; y: number}> = ({x, y}) => {
	const frame = useCurrentFrame();
	const st = laptopState(frame);
	const boil = Math.floor(frame / 6);
	const lidPath = useMemo(
		() => sketchRoundRect(-LID_W / 2, LID_BOTTOM - LID_H, LID_W, LID_H, 16, {seed: 61, amp: 0.9, boil, step: 8}),
		[boil],
	);
	const deckPath = useMemo(
		() => sketchRoundRect(-LID_W / 2 - 6, -16, LID_W + 12, 16, 6, {seed: 62, amp: 0.6, boil, step: 8}),
		[boil],
	);
	const logo = useMemo(() => sketchEllipse(0, LID_BOTTOM - LID_H / 2 - 4, 17, 17, {seed: 63, amp: 0.6, boil, step: 5}), [boil]);
	const tex = useMemo(() => makeMatteTexture(64, {x: -LID_W / 2, y: LID_BOTTOM - LID_H, w: LID_W, h: LID_H}, 1.1), []);
	if (st.deck < 0.01 && st.lid < 0.01) return null;

	// calm bounce on key taps
	const tap = (lowTap(frame, 0) + lowTap(frame, 1)) * 0.5 * st.lid;
	const lidScaleY = Math.max(0.04, st.lid);
	const dropY = st.drop * 36;
	return (
		<g transform={`translate(${x} ${y + dropY})`} opacity={1 - st.drop}>
			{/* deck / hinge strip */}
			<g transform={`scale(${st.deck.toFixed(4)} 1)`}>
				<path d={deckPath} fill={C.metalShade} />
				<path d={deckPath} fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
			</g>
			{/* lid, hinged at the bottom */}
			<g
				transform={`translate(0 ${LID_BOTTOM}) scale(${(1 + tap * 0.006).toFixed(4)} ${(lidScaleY * (1 + tap * 0.01)).toFixed(4)}) translate(0 ${-LID_BOTTOM})`}
			>
				<defs>
					<clipPath id="lid-clip">
						<path d={roundRectPath(-LID_W / 2 + 1, LID_BOTTOM - LID_H + 1, LID_W - 2, LID_H - 2, 15)} />
					</clipPath>
				</defs>
				<path d={lidPath} fill="#ECE3D1" />
				<g clipPath="url(#lid-clip)">
					<rect x={LID_W / 2 - 40} y={LID_BOTTOM - LID_H} width={40} height={LID_H} fill={C.metalShade} opacity={0.75} />
					<rect x={-LID_W / 2} y={LID_BOTTOM - 22} width={LID_W} height={22} fill={C.metalShade} opacity={0.6} />
					<HatchLayer segs={tex} color="#8B7B62" width={1.1} />
					<path
						d={`M${-LID_W / 2 + 10} ${LID_BOTTOM - 30}L${-LID_W / 2 + 10} ${LID_BOTTOM - LID_H + 12}L${LID_W / 2 - 50} ${LID_BOTTOM - LID_H + 10}`}
						stroke="#FFFFFF"
						strokeWidth={3}
						fill="none"
						opacity={0.55}
						strokeLinecap="round"
					/>
				</g>
				<path d={lidPath} fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
				{/* logo circle */}
				<path d={logo} fill={mix('#ECE3D1', C.metalShade, 0.5)} stroke={C.ink} strokeWidth={4} />
				<circle cx={0} cy={LID_BOTTOM - LID_H / 2 - 4} r={5} fill={C.ink} opacity={0.75} />
			</g>
		</g>
	);
};

/** Soft screen-light spill on the robot's face (drawn inside the body). */
export const LowFaceGlow: React.FC = () => {
	const frame = useCurrentFrame();
	const st = laptopState(frame);
	if (st.lid < 0.05) return null;
	const flicker = 0.85 + noise1(frame / 8, 90) * 0.15;
	return (
		<ellipse
			cx={0}
			cy={-168}
			rx={150}
			ry={30}
			fill="#FFF3D6"
			opacity={0.22 * st.lid * flicker}
			filter="url(#blur-lg)"
		/>
	);
};
