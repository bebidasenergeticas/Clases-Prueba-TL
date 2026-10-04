import {continueRender, delayRender, staticFile} from 'remotion';

export const MONO = "'IBM Plex Mono', 'JetBrains Mono', 'Roboto Mono', ui-monospace, monospace";

const WEIGHTS = [400, 500, 600, 700];

let loaded = false;

export const loadFonts = () => {
	if (loaded || typeof document === 'undefined') return;
	loaded = true;
	const handle = delayRender('Loading IBM Plex Mono');
	Promise.all(
		WEIGHTS.map((w) =>
			new FontFace('IBM Plex Mono', `url(${staticFile(`fonts/ibm-plex-mono-latin-${w}-normal.woff2`)}) format('woff2')`, {
				weight: String(w),
				style: 'normal',
			})
				.load()
				.then((f) => {
					(document.fonts as unknown as {add: (f: FontFace) => void}).add(f);
				}),
		),
	)
		.then(() => continueRender(handle))
		.catch((err) => {
			console.error('Font loading failed, falling back to system mono', err);
			continueRender(handle);
		});
};
