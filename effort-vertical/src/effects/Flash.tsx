import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Full-frame light flash with a hot centre (discharges, bursts, the final bloom). */
export const Flash: React.FC<{color: string; opacity: number; cx?: number; cy?: number}> = ({
	color,
	opacity,
	cx = 540,
	cy = 1100,
}) => {
	if (opacity < 0.005) return null;
	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				opacity: Math.min(1, opacity),
				background: `radial-gradient(circle at ${cx}px ${cy}px, #FFFFFF 0%, ${color} 38%, ${color} 100%)`,
			}}
		/>
	);
};
