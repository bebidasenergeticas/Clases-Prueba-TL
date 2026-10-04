import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MONO} from '../fonts';
import {clamp, easeInOutCubic, easeOutCubic, lerp, prog, springAt} from '../utils/animation';
import {C, LEVEL_ACCENT, mix, RAINBOW} from '../utils/colors';
import {Level, LEVELS, levelIndexAt, MENU_RESET, PHASES} from '../utils/timing';
import {SparkleIcon} from './Sparkle';

const FONT = 28;
const ROW = 44;
const CHAR = FONT * 0.6;
const ICON = 30;
const GAP = 12;

const pillWidth = (i: number) => ICON + GAP + LEVELS[i].length * CHAR + 24;

/**
 * One selection pill slides from row to row (spring), the row it leaves gets
 * a hand-drawn check. At the very end the pill climbs back to "low" while the
 * checks are erased, so the last frame matches frame 0 (seamless loop).
 */
export const menuState = (frame: number) => {
	const c = levelIndexAt(frame);
	let pos = c;
	let width = pillWidth(c);
	if (c > 0) {
		const m = springAt(frame, PHASES[LEVELS[c]].start, {damping: 15, stiffness: 160, mass: 0.9});
		pos = lerp(c - 1, c, m);
		width = lerp(pillWidth(c - 1), pillWidth(c), clamp(m));
	}
	const checks = LEVELS.map((_, i) =>
		i < c ? prog(frame, PHASES[LEVELS[i + 1]].start + 8, 14, easeOutCubic) : 0,
	);
	let accentLevel: Level = LEVELS[Math.round(clamp(pos, 0, 6))];
	if (frame >= MENU_RESET.start) {
		const r = prog(frame, MENU_RESET.start, MENU_RESET.end - MENU_RESET.start, easeInOutCubic);
		pos = lerp(6, 0, r);
		width = lerp(pillWidth(6), pillWidth(0), r);
		checks.forEach((v, i) => {
			const revert = clamp(i + 0.6 - pos);
			checks[i] = v * (1 - revert);
		});
		accentLevel = LEVELS[Math.round(pos)];
	}
	return {pos, width, checks, accentLevel};
};

const Checkbox: React.FC<{check: number; strength: number}> = ({check, strength}) => {
	const box = mix(C.uiPending, '#4A433E', strength);
	return (
		<svg width={ICON} height={ROW} viewBox={`0 0 ${ICON} ${ROW}`} style={{display: 'block', overflow: 'visible'}}>
			<path d="M5.2 14.6 L22.6 14.1 L23.1 31.4 L5.6 31.8 Z" fill="none" stroke={box} strokeWidth={2.1} strokeLinejoin="round" />
			{check > 0.001 && (
				<path
					d="M8.6 22.4 L13.2 28.6 L26.8 7.2"
					fill="none"
					stroke="#2E2624"
					strokeWidth={3}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray={36}
					strokeDashoffset={36 * (1 - check)}
				/>
			)}
		</svg>
	);
};

export const EffortMenu: React.FC = () => {
	const frame = useCurrentFrame();
	const st = menuState(frame);
	const accent = LEVEL_ACCENT[st.accentLevel];
	return (
		<div style={{position: 'absolute', left: 70, top: 120, fontFamily: MONO, fontSize: FONT}}>
			{/* sliding selection pill */}
			<div
				style={{
					position: 'absolute',
					left: -12,
					top: st.pos * ROW + 3,
					width: st.width,
					height: ROW - 6,
					borderRadius: 10,
					background: C.uiBlack,
					boxShadow: '3px 4px 0 rgba(26,20,22,0.18)',
				}}
			/>
			<div style={{position: 'absolute', left: 4, top: st.pos * ROW + ROW / 2 - 11}}>
				<SparkleIcon size={22} fill={accent === 'rainbow' ? '#fff' : accent} gradientId={accent === 'rainbow' ? 'menu-rb' : undefined} />
			</div>
			{LEVELS.map((l, i) => {
				const cover = clamp(1 - Math.abs(st.pos - i) * 1.6);
				const done = st.checks[i];
				const base = mix(C.uiPending, C.uiDone, clamp(done * 1.5));
				const textColor = mix(base, C.uiCream, cover);
				const special = cover > 0.5 && (l === 'ultracode' || l === 'ultrathink');
				return (
					<div key={l} style={{position: 'relative', height: ROW, display: 'flex', alignItems: 'center'}}>
						<div style={{width: ICON, height: ROW, opacity: 1 - cover}}>
							<Checkbox check={done} strength={clamp(done * 1.5)} />
						</div>
						<div
							style={{
								marginLeft: GAP,
								color: textColor,
								fontWeight: cover > 0.5 ? 600 : 500,
								whiteSpace: 'pre',
								lineHeight: `${ROW}px`,
							}}
						>
							{special && l === 'ultrathink'
								? l.split('').map((ch, k) => (
										<span key={k} style={{color: mix(textColor, RAINBOW[k % RAINBOW.length], cover)}}>
											{ch}
										</span>
									))
								: special
									? <span style={{color: mix(textColor, C.violet, cover)}}>{l}</span>
									: l}
						</div>
					</div>
				);
			})}
		</div>
	);
};
