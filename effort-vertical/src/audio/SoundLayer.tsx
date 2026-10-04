import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CUES} from './sfx';

/** Places every cue on the timeline. Only mounted when withAudio = true. */
export const SoundLayer: React.FC = () => (
	<>
		{CUES.map((c, i) => (
			<Sequence key={`${c.sfx}-${i}`} from={c.at} durationInFrames={60 * 8} layout="none">
				<Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={c.volume ?? 0.5} playbackRate={c.playbackRate ?? 1} />
			</Sequence>
		))}
	</>
);
