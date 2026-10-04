import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MONO} from '../fonts';
import {easeInCubic, prog, springAt} from '../utils/animation';
import {RAINBOW} from '../utils/colors';
import {Level, LEVELS, PHASES, sec} from '../utils/timing';
import {SparkleIcon} from './Sparkle';

const NAME_COLOR: Record<Level, string> = {
	low: '#F39A72',
	medium: '#F39A72',
	high: '#F39A72',
	xhigh: '#8BE07A',
	max: '#F5AE52',
	ultracode: '#B9A0F5',
	ultrathink: 'rainbow',
};
const ICON_COLOR: Record<Level, string> = {
	low: '#E9764A',
	medium: '#E9764A',
	high: '#E9764A',
	xhigh: '#7CE36B',
	max: '#F2A24A',
	ultracode: '#A98BF0',
	ultrathink: 'rainbow',
};

const TYPE_CPS = 14; // typing speed, chars per second (matches the reference)
const ERASE_CPS = 40;
const APPEAR = 8; // frames after phase start
const HOLD: Partial<Record<Level, number>> = {ultrathink: sec(5.2)};
const DEFAULT_HOLD = sec(3.9);

/** Badge timeline for one level: typed in, held, erased (as in the reference). */
const badgeFor = (frame: number, level: Level) => {
	const text = `effort: ${level}`;
	const start = PHASES[level].start + (level === 'low' ? sec(0.3) : APPEAR);
	const hideAt = start + (HOLD[level] ?? DEFAULT_HOLD);
	const typed = Math.min(text.length, Math.max(0, Math.floor(((frame - start - 6) / 60) * TYPE_CPS)));
	const erased = Math.max(0, Math.floor(((frame - hideAt) / 60) * ERASE_CPS));
	const chars = Math.max(0, typed - erased);
	const eraseEnd = hideAt + Math.ceil((text.length / ERASE_CPS) * 60);
	const pillIn = springAt(frame, start, {damping: 13, stiffness: 160});
	const pillOut = prog(frame, eraseEnd - 4, 10, easeInCubic);
	const typing = frame < start + 6 + (text.length / TYPE_CPS) * 60 || frame > hideAt;
	return {text, chars, presence: pillIn * (1 - pillOut), typing, start};
};

export const EffortBadge: React.FC = () => {
	const frame = useCurrentFrame();
	// pick the latest level whose badge has started
	let level: Level = 'low';
	for (const l of LEVELS) {
		if (frame >= PHASES[l].start) level = l;
	}
	if (frame >= PHASES.outro.start + sec(0.6)) return null;
	const b = badgeFor(frame, level);
	if (b.presence < 0.01) return null;
	const prefix = 'effort: ';
	const shown = b.text.slice(0, b.chars);
	const pre = shown.slice(0, prefix.length);
	const name = shown.slice(prefix.length);
	const caretOn = b.typing || Math.floor((frame - b.start) / 18) % 2 === 0;
	const nameColor = NAME_COLOR[level];
	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				top: 1640,
				transformOrigin: '0% 50%',
				transform: `scale(${(0.82 + 0.18 * b.presence).toFixed(4)})`,
				opacity: Math.min(1, b.presence * 1.4),
			}}
		>
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 16,
					height: 78,
					padding: '0 26px 0 22px',
					borderRadius: 14,
					background: '#171313',
					boxShadow: '5px 6px 0 rgba(23,19,19,0.22), 0 14px 28px rgba(40,30,25,0.18)',
					fontFamily: MONO,
					fontSize: 34,
					fontWeight: 500,
					color: '#EDE6DA',
					whiteSpace: 'pre',
				}}
			>
				<SparkleIcon size={24} fill={ICON_COLOR[level]} gradientId={ICON_COLOR[level] === 'rainbow' ? 'badge-rb' : undefined} />
				<span style={{display: 'inline-flex', alignItems: 'center', minWidth: 20}}>
					<span>{pre}</span>
					<span style={{fontWeight: 600}}>
						{nameColor === 'rainbow'
							? name.split('').map((ch, i) => (
									<span key={i} style={{color: RAINBOW[i % RAINBOW.length]}}>
										{ch}
									</span>
								))
							: <span style={{color: nameColor}}>{name}</span>}
					</span>
					<span
						style={{
							display: 'inline-block',
							width: 15,
							height: 36,
							marginLeft: 3,
							background: '#EDE6DA',
							opacity: caretOn ? 0.85 : 0,
						}}
					/>
				</span>
			</div>
		</div>
	);
};
