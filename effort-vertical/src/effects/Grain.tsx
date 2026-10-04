import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../utils/random';
import {HEIGHT, WIDTH} from '../utils/timing';

/**
 * Animated film/paper grain. The noise layer is rasterised once (static SVG
 * turbulence on its own compositor layer); only its offset changes, every
 * 3 frames, giving a hand-made "boil" without re-running the filter.
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
	const frame = useCurrentFrame();
	const step = Math.floor(frame / 3);
	const dx = Math.round(hash(step, 17) * 90);
	const dy = Math.round(hash(step, 31) * 90);
	const W = WIDTH + 100;
	const H = HEIGHT + 100;
	return (
		<AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'multiply', opacity}}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					transform: `translate(${-dx}px, ${-dy}px)`,
					width: W,
					height: H,
					willChange: 'transform',
				}}
			>
				<svg width={W} height={H}>
					<filter id="grain-f" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
						<feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={2} seed={9} stitchTiles="stitch" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 2.2 -0.9" />
					</filter>
					<rect width={W} height={H} filter="url(#grain-f)" />
				</svg>
			</div>
		</AbsoluteFill>
	);
};
