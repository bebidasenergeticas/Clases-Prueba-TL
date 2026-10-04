// ULTRACODE — back to the basic robot, but with glowing violet eyes, while
// copies of it appear behind: 2, 5, 15, dozens, hundreds of parallel agents.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneState} from '../compositions/director';
import {easeInOutCubic, easeOutCubic, impulse, prog} from '../utils/animation';
import {C} from '../utils/colors';
import {BEATS, PHASES} from '../utils/timing';
import {BODY_TOP, ROBOT} from './RobotBase';

const U = BEATS.ultracode;

export const violetAmount = (frame: number) =>
	prog(frame, U.violet, 20, easeOutCubic) * (1 - prog(frame, BEATS.ultrathink.rainbow, 14, easeInOutCubic));

export const applyUltraCode = (frame: number, s: SceneState) => {
	if (frame < PHASES.ultracode.start - 40 || frame > PHASES.ultrathink.start + 30) return;
	const v = violetAmount(frame);
	s.look.violet = Math.max(s.look.violet, v);
	s.look.baseEyes = Math.min(s.look.baseEyes, 1 - v);
	// a little "power" squash when the eyes ignite
	const ign = impulse(frame, U.violet + 4, 8) * (frame >= U.violet + 4 ? 1 : 0);
	s.pose.squash += ign * 0.05;
	// the hero reacts to each wave of clones (tiny hop + arms up)
	let w = 0;
	for (const at of U.waves) w += impulse(frame, at, 9) * (frame >= at ? 1 : 0);
	w = Math.min(1, w);
	s.pose.squash -= w * 0.03;
	s.pose.bob -= w * 6;
	s.pose.armL.rot -= w * 18;
	s.pose.armR.rot += w * 18;
	// ripples of synchronisation start from the hero
	for (const at of U.ripples) {
		const r = impulse(frame, at, 10) * (frame >= at ? 1 : 0);
		s.pose.eyeScale *= 1 + r * 0.2;
		s.pose.squash += r * 0.03;
	}
	// camera: ease back to reveal the depth of the army, then lean in again
	const back = easeInOutCubic(prog(frame, U.waves[3], 150)) * (1 - easeInOutCubic(prog(frame, U.dissolve, 70)));
	s.camera.scale -= 0.05 * back;
	s.camera.originY = 1300 * back + s.camera.originY * (1 - back);
	s.camera.scale += 0.015 * easeInOutCubic(prog(frame, U.ripples[0], 240)) * (1 - prog(frame, U.dissolve, 40));
};

/** Soft violet aura around the hero (body space, behind the body). */
export const UltraCodeAura: React.FC = () => {
	const frame = useCurrentFrame();
	const v = violetAmount(frame);
	if (v < 0.01) return null;
	let pulse = 0;
	for (const at of U.ripples) pulse += Math.max(0, 1 - Math.abs(frame - at - 6) / 16);
	const W = ROBOT.W;
	return (
		<g opacity={v}>
			<rect
				x={-W / 2 - 46}
				y={BODY_TOP - 40}
				width={W + 92}
				height={ROBOT.H + 112}
				rx={70}
				fill={C.violetGlow}
				opacity={0.5 + pulse * 0.3}
				filter="url(#blur-lg)"
			/>
		</g>
	);
};
