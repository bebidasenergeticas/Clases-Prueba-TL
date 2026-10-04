// ULTRATHINK — the army converges into the hero, colour explodes, the robot
// turns rainbow, its eyes become glowing white capsules and it levitates in
// front of a huge pastel halo. Then an energetic fade back to normal.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {EnergyHalo, OrbitRing} from '../effects/EnergyHalo';
import {Particles} from '../effects/Particles';
import {clamp, easeInOutCubic, easeOutCubic, impulse, prog, springAt} from '../utils/animation';
import {RAINBOW, RAINBOW_PASTEL} from '../utils/colors';
import {range, rng} from '../utils/random';
import {roundRectPath} from '../utils/sketch';
import {BEATS, PHASES} from '../utils/timing';
import {BODY_CY, BODY_TOP, ROBOT} from './RobotBase';
import {Sparkle} from './Sparkle';

const T = BEATS.ultrathink;
const RX = 540;
const GY = 1300;
const OFF = T.fade + 6; // rainbow switched off under the white bloom

export const rainbowAmount = (frame: number) =>
	frame >= OFF ? 0 : easeInOutCubic(prog(frame, T.rainbow, 40));

export const utLift = (frame: number) => {
	if (frame >= OFF) return 0;
	const up = easeInOutCubic(prog(frame, T.liftoff, 100));
	return up * 150 + Math.sin((frame - T.liftoff) / 28) * 8 * up;
};

export const haloAmount = (frame: number) =>
	frame >= OFF ? 0 : springAt(frame, T.rainbow + 24, {damping: 16, stiffness: 60}) * 0.95;

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const applyUltraThink = (frame: number, s: SceneState) => {
	if (frame < T.burst - 10 || frame > PHASES.outro.end) return;
	const rb = rainbowAmount(frame);
	const phase = Math.max(0, (frame - T.rainbow) / 55);
	s.look.rainbow = rb;
	s.look.rainbowPhase = phase;
	const cap = frame >= OFF ? 0 : prog(frame, T.rainbow + 4, 16, easeOutCubic);
	s.look.capsule = cap;
	s.look.baseEyes = Math.min(s.look.baseEyes, 1 - cap);
	s.look.violet = Math.min(s.look.violet, 1 - cap);
	const off = Math.floor(phase);
	s.look.limbColors = [
		RAINBOW[mod(1 - off, 8)],
		RAINBOW[mod(6 - off, 8)],
		RAINBOW[mod(0 - off, 8)],
		RAINBOW[mod(2 - off, 8)],
		RAINBOW[mod(4 - off, 8)],
		RAINBOW[mod(6 - off, 8)],
	];
	s.look.capsuleGlow = [RAINBOW[mod(2 - off, 8)], RAINBOW[mod(5 - off, 8)]];
	s.look.aberration = rb * (2 + Math.sin(frame / 7) * 1.2);

	// burst: white-violet flash + squash
	const burst = impulse(frame, T.burst, 10) * (frame >= T.burst ? 1 : 0);
	s.flash.color = '#FBF6FF';
	s.flash.opacity = Math.max(s.flash.opacity, burst * 0.55);
	s.pose.squash += burst * 0.07;

	// levitation
	const lift = utLift(frame);
	const lp = clamp(lift / 150);
	s.pose.lift += lift;
	s.pose.legRot = s.pose.legRot.map((r, i) => r + Math.sin(frame / 16 + i * 1.1) * 6 * lp);
	s.shadow.scale *= 1 - lp * 0.42;
	s.shadow.opacity *= 1 - lp * 0.4;
	s.shadow.rainbow = rb;
	s.pose.eyeDy -= 2 * lp;

	// slow push-in; camera follows the rise a little
	const push = easeInOutCubic(prog(frame, T.rainbow, T.fade - T.rainbow));
	s.camera.scale += 0.06 * push * (frame >= OFF ? 0 : 1);
	s.camera.y += lift * 0.28;
	s.camera.originY = GY - 200 - lift;

	// energy peak: tremble, then the energetic fade (white bloom)
	const peak = prog(frame, T.peak, T.fade - T.peak);
	s.pose.squash += Math.sin(frame * 0.9) * 0.012 * peak;
	s.camera.x += Math.sin(frame * 1.7) * 2.5 * peak;
	const bloomUp = prog(frame, T.fade, 8, easeOutCubic);
	const bloomDown = prog(frame, T.fade + 10, 44, easeInOutCubic);
	const bloom = bloomUp * (1 - bloomDown);
	if (bloom > s.flash.opacity) {
		s.flash.color = '#FFFDF7';
		s.flash.opacity = bloom * 0.96;
	}
	// back to normal: a relieved little settle after the bloom
	const settle = impulse(frame, T.fade + 30, 12) * (frame >= T.fade + 30 ? 1 : 0);
	s.pose.squash += settle * 0.04;
};

/** Pink/rainbow glowing rim behind the body (body space). */
export const UltraThinkGlow: React.FC = () => {
	const frame = useCurrentFrame();
	const rb = rainbowAmount(frame);
	if (rb < 0.01) return null;
	const W = ROBOT.W;
	return (
		<g opacity={rb}>
			<path d={roundRectPath(-W / 2 - 10, BODY_TOP - 10, W + 20, ROBOT.H + 20, 26)} fill="none" stroke="#F7A8C0" strokeWidth={22} opacity={0.65} filter="url(#blur-sm)" />
			<path d={roundRectPath(-W / 2 - 4, BODY_TOP - 4, W + 8, ROBOT.H + 8, 20)} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />
		</g>
	);
};

/** Behind the robot: halo, ground ripples, echo trails, back halves of the orbits. */
export const UltraThinkBack: React.FC<{lift: number; bob: number}> = ({lift, bob}) => {
	const frame = useCurrentFrame();
	if (frame < T.burst - 2 || frame >= OFF + 2) return null;
	const cy = GY - lift + bob + BODY_CY;
	const halo = haloAmount(frame);
	const rb = rainbowAmount(frame);
	const nodes: React.ReactNode[] = [];
	// echo trails: rainbow body duplicates expanding off the body during the burst
	for (let k = 0; k < 6; k++) {
		const t = prog(frame, T.burst + k * 4, 34, easeOutCubic);
		if (t <= 0 || t >= 1) continue;
		const sc = 1 + t * (0.25 + k * 0.08);
		const w = ROBOT.W * sc;
		const h = ROBOT.H * sc;
		const ang = (k / 6) * Math.PI * 2 + 0.4;
		const ox = Math.cos(ang) * t * 70;
		const oy = Math.sin(ang) * t * 50 - t * 20;
		nodes.push(
			<g key={`echo${k}`} opacity={(1 - t) * 0.75}>
				<path d={roundRectPath(RX - w / 2 + ox, cy - h / 2 + oy, w, h, 20 * sc)} fill={RAINBOW[(k * 3) % 8]} opacity={0.32} />
				<path d={roundRectPath(RX - w / 2 + ox, cy - h / 2 + oy, w, h, 20 * sc)} fill="none" stroke={RAINBOW[(k * 3) % 8]} strokeWidth={5 * (1 - t) + 1.5} />
			</g>,
		);
	}
	// rising afterimages while lifting off
	const rising = prog(frame, T.liftoff, 110);
	if (rising > 0 && rising < 1) {
		for (let k = 1; k <= 4; k++) {
			const past = utLift(frame - k * 5);
			const y = GY - past + BODY_CY;
			nodes.push(
				<rect
					key={`ghost${k}`}
					x={RX - ROBOT.W / 2}
					y={y - ROBOT.H / 2}
					width={ROBOT.W}
					height={ROBOT.H}
					rx={18}
					fill={RAINBOW[(k * 2) % 8]}
					opacity={0.16 * (1 - k / 5) * Math.sin(rising * Math.PI)}
				/>,
			);
		}
	}
	// ground ripples (rainbow ellipses) under the levitating robot
	const ripples: React.ReactNode[] = [];
	for (let k = 0; k < 4; k++) {
		const period = 64;
		const t = mod(frame - T.liftoff - k * 16, period) / period;
		if (frame < T.liftoff + k * 16) continue;
		ripples.push(
			<ellipse
				key={`rip${k}`}
				cx={RX}
				cy={GY + 4}
				rx={140 + t * 330}
				ry={14 + t * 32}
				fill="none"
				stroke={RAINBOW[(k * 2 + 1) % 8]}
				strokeWidth={2.4}
				opacity={(1 - t) * 0.55 * rb}
			/>,
		);
	}
	// expanding waves from the robot
	const waves: React.ReactNode[] = [];
	for (let k = 0; k < 3; k++) {
		const period = 75;
		const t = mod(frame - T.rainbow - k * 25, period) / period;
		if (frame < T.rainbow + k * 25) continue;
		waves.push(<circle key={`w${k}`} cx={RX} cy={cy} r={110 + t * 380} fill="none" stroke={RAINBOW_PASTEL[(k * 3) % 8]} strokeWidth={5 * (1 - t) + 1} opacity={(1 - t) * 0.7 * rb} />);
	}
	return (
		<g>
			<EnergyHalo cx={RX} cy={cy} radius={425} amount={halo} frame={frame} />
			{waves}
			{ripples}
			{nodes}
			<OrbitRing cx={RX} cy={cy + 10} rx={330} ry={66} rot={-13} half="back" frame={frame} speed={2.4} amount={rb * halo} id="orbA" />
			<OrbitRing cx={RX} cy={cy - 20} rx={300} ry={58} rot={11} half="back" frame={frame} speed={-1.8} amount={rb * halo * 0.85} id="orbB" />
		</g>
	);
};

const STARS = Array.from({length: 18}).map((_, i) => {
	const r = rng(900 + i);
	const ang = range(r, 0, Math.PI * 2);
	const dist = range(r, 230, 470);
	return {dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist * 0.9, size: range(r, 12, 30), phase: range(r, 0, 6.28), speed: range(r, 0.05, 0.1)};
});

/** In front of the robot: burst rings, front orbit halves, stars, particles. */
export const UltraThinkFront: React.FC<{lift: number; bob: number}> = ({lift, bob}) => {
	const frame = useCurrentFrame();
	if (frame < T.burst - 2 || frame >= OFF + 2) return null;
	const cy = GY - lift + bob + BODY_CY;
	const rb = rainbowAmount(frame);
	const halo = haloAmount(frame);
	const burstRings: React.ReactNode[] = [];
	RAINBOW.forEach((c, i) => {
		const t = prog(frame, T.burst + i * 2, 40, easeOutCubic);
		if (t <= 0 || t >= 1) return;
		burstRings.push(<circle key={c} cx={RX} cy={cy} r={60 + t * 640} fill="none" stroke={c} strokeWidth={12 * (1 - t) + 1} opacity={(1 - t) * 0.9} />);
	});
	return (
		<g>
			{burstRings}
			<OrbitRing cx={RX} cy={cy + 10} rx={330} ry={66} rot={-13} half="front" frame={frame} speed={2.4} amount={rb * halo} id="orbA" />
			<OrbitRing cx={RX} cy={cy - 20} rx={300} ry={58} rot={11} half="front" frame={frame} speed={-1.8} amount={rb * halo * 0.85} id="orbB" />
			<g opacity={halo}>
				{STARS.map((st, i) => {
					const tw = Math.max(0, Math.sin(frame * st.speed + st.phase));
					if (tw < 0.05) return null;
					return (
						<Sparkle
							key={i}
							x={RX + st.dx}
							y={cy + st.dy}
							size={st.size * tw}
							fill="#FFFFFF"
							stroke={RAINBOW_PASTEL[i % 8]}
							strokeWidth={1.4}
							rotate={frame * 0.5 + i * 20}
						/>
					);
				})}
			</g>
			<Particles
				frame={frame}
				from={T.rainbow}
				to={OFF}
				rate={0.9}
				origin={(i) => [RX + range(rng(i), -330, 330), cy + range(rng(i + 1), -120, 260)]}
				velocity={(i) => [range(rng(i * 5), -0.5, 0.5), range(rng(i * 5 + 1), -2.2, -0.8)]}
				life={70}
				size={[2.2, 5]}
				colors={RAINBOW}
				seed={77}
				opacity={rb}
			/>
		</g>
	);
};
