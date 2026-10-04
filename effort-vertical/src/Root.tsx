import React from 'react';
import {Composition} from 'remotion';
import {EffortEvolution, effortSchemaDefaults} from './compositions/EffortEvolution';
import {loadFonts} from './fonts';
import {DURATION, FPS, HEIGHT, WIDTH} from './utils/timing';

loadFonts();

export const RemotionRoot: React.FC = () => (
	<Composition
		id="EffortEvolution"
		component={EffortEvolution}
		durationInFrames={DURATION}
		fps={FPS}
		width={WIDTH}
		height={HEIGHT}
		defaultProps={effortSchemaDefaults}
	/>
);
