import React from 'react';

/** Shared SVG filter definitions for the scene. */
export const SceneFilters: React.FC = () => (
	<defs>
		{(
			[
				['blur-xs', 1.4],
				['blur-sm', 3],
				['blur-md', 9],
				['blur-lg', 22],
				['blur-xl', 42],
			] as const
		).map(([id, s]) => (
			<filter key={id} id={id} x="-60%" y="-60%" width="220%" height="220%">
				<feGaussianBlur stdDeviation={s} />
			</filter>
		))}
		{/* soft bloom: blurred copy merged under the source */}
		<filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur in="SourceGraphic" stdDeviation={6} result="b" />
			<feMerge>
				<feMergeNode in="b" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		{/* subtle pencil tremor for large hand-drawn shapes */}
		<filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
			<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs>
);
