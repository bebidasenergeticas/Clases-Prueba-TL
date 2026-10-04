// Palette sampled from the reference frames (see REFERENCE_ANALYSIS.md §3),
// nudged toward the brief's values where the screen capture looked washed out.

export const C = {
	paper: '#ECEAE2',
	paperLight: '#F3F1EA',
	paperDark: '#DFDCD3',
	ground: '#CBC6BC',
	pencil: '#6F675F',

	ink: '#2C1E1F', // outlines
	inkSoft: '#3A2D2C',
	eye: '#2E1C1F',

	body: '#DB7452',
	bodyLight: '#F0936D',
	bodyRight: '#CF5540',
	bodyBottom: '#C44A3A',
	bodyHatch: '#7E2A1F',
	leg: '#D97352',
	legShade: '#C2513D',

	uiBlack: '#1A1416',
	uiCream: '#F1EADF',
	uiDone: '#5F5853',
	uiPending: '#CFCAC2',

	metal: '#EFE2CA',
	metalShade: '#D9CDB8',
	metalDark: '#B9AA90',
	wood: '#9A6440',
	woodDark: '#6E4128',
	woodLight: '#C08857',
	checkerLight: '#F3E6CC',
	checkerDark: '#D9A877',

	orange: '#F08050',
	amber: '#F2A24A',
	amberGlow: '#FFB65C',
	green: '#7CFF6B',
	greenDeep: '#2FD158',
	greenGlass: '#9BEA7E',
	violet: '#A98BF0',
	violetRing: '#AA7DC1',
	violetCore: '#F6EAFD',
	violetGlow: '#B9A3E8',
};

export const RAINBOW = [
	'#F06D4D',
	'#FA8B4D',
	'#FDBA55',
	'#8FB679',
	'#7FA0C1',
	'#8392C9',
	'#9A80BB',
	'#BB6FB0',
];

export const RAINBOW_PASTEL = [
	'#F7B3A0',
	'#FBD1A2',
	'#FBE7A6',
	'#C9E3B4',
	'#B5D2EA',
	'#C4C3EC',
	'#DCC3EC',
	'#F2C0DD',
];

// Level accent colours (menu icon + badge level name)
export const LEVEL_ACCENT: Record<string, string> = {
	low: '#E9764A',
	medium: '#E9764A',
	high: '#E9764A',
	xhigh: '#7CE36B',
	max: '#F2A24A',
	ultracode: '#A98BF0',
	ultrathink: 'rainbow',
};

const hexToRgb = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '');
	return [
		parseInt(h.slice(0, 2), 16),
		parseInt(h.slice(2, 4), 16),
		parseInt(h.slice(4, 6), 16),
	];
};

const toHex = (n: number) =>
	Math.round(Math.max(0, Math.min(255, n)))
		.toString(16)
		.padStart(2, '0');

/** Mix two hex colours. t = 0 -> a, t = 1 -> b */
export const mix = (a: string, b: string, t: number) => {
	const A = hexToRgb(a);
	const B = hexToRgb(b);
	return `#${toHex(A[0] + (B[0] - A[0]) * t)}${toHex(A[1] + (B[1] - A[1]) * t)}${toHex(A[2] + (B[2] - A[2]) * t)}`;
};

/** Desaturate toward grey of same luminance. */
export const desaturate = (hex: string, t: number) => {
	const [r, g, b] = hexToRgb(hex);
	const l = 0.299 * r + 0.587 * g + 0.114 * b;
	return `#${toHex(r + (l - r) * t)}${toHex(g + (l - g) * t)}${toHex(b + (l - b) * t)}`;
};

export const rgba = (hex: string, a: number) => {
	const [r, g, b] = hexToRgb(hex);
	return `rgba(${r},${g},${b},${a})`;
};

export type RobotPalette = {
	body: string;
	bodyLight: string;
	bodyRight: string;
	bodyBottom: string;
	hatch: string;
	leg: string;
	legShade: string;
	ink: string;
	eye: string;
};

export const BASE_PALETTE: RobotPalette = {
	body: C.body,
	bodyLight: C.bodyLight,
	bodyRight: C.bodyRight,
	bodyBottom: C.bodyBottom,
	hatch: C.bodyHatch,
	leg: C.leg,
	legShade: C.legShade,
	ink: C.ink,
	eye: C.eye,
};

/** Atmospheric fade of a whole palette toward a haze colour (army depth). */
export const fadePalette = (
	p: RobotPalette,
	haze: string,
	t: number,
	sat = 0,
): RobotPalette => {
	const f = (c: string) => mix(desaturate(c, sat), haze, t);
	return {
		body: f(p.body),
		bodyLight: f(p.bodyLight),
		bodyRight: f(p.bodyRight),
		bodyBottom: f(p.bodyBottom),
		hatch: f(p.hatch),
		leg: f(p.leg),
		legShade: f(p.legShade),
		ink: mix(p.ink, haze, t * 0.85),
		eye: mix(p.eye, haze, t * 0.85),
	};
};
