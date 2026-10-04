import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../utils/colors';
import {range, rng} from '../utils/random';
import {HEIGHT, WIDTH} from '../utils/timing';

/**
 * Physical-paper background. Built procedurally with SVG feTurbulence
 * (mottling + tooth) plus seeded fibres, specks and faint scratches.
 * Fully static -> promoted to its own compositor layer and rasterised once.
 */
export const PaperBackground: React.FC = () => {
	const {fibers, specks, scratches} = useMemo(() => {
		const r = rng(4242);
		const fibers: string[] = [];
		for (let i = 0; i < 260; i++) {
			const x = range(r, 0, WIDTH);
			const y = range(r, 0, HEIGHT);
			const len = range(r, 5, 24);
			const a = range(r, 0, Math.PI * 2);
			const bend = range(r, -6, 6);
			const x2 = x + Math.cos(a) * len;
			const y2 = y + Math.sin(a) * len;
			const mx = (x + x2) / 2 + Math.cos(a + Math.PI / 2) * bend;
			const my = (y + y2) / 2 + Math.sin(a + Math.PI / 2) * bend;
			fibers.push(`M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
		}
		const specks: {x: number; y: number; r: number; o: number}[] = [];
		for (let i = 0; i < 420; i++) {
			const big = r() > 0.95;
			specks.push({
				x: range(r, 0, WIDTH),
				y: range(r, 0, HEIGHT),
				r: big ? range(r, 1.4, 2.4) : range(r, 0.45, 1.3),
				o: big ? range(r, 0.35, 0.7) : range(r, 0.12, 0.55),
			});
		}
		const scratches: string[] = [];
		for (let i = 0; i < 14; i++) {
			const x = range(r, 0, WIDTH);
			const y = range(r, 0, HEIGHT);
			const len = range(r, 60, 220);
			const a = range(r, -0.5, 0.5) + (r() > 0.5 ? 0 : Math.PI / 2);
			scratches.push(
				`M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(a) * len).toFixed(1)} ${(Math.sin(a) * len).toFixed(1)}`,
			);
		}
		return {fibers: fibers.join(''), specks, scratches: scratches.join('')};
	}, []);

	return (
		<AbsoluteFill style={{backgroundColor: C.paper, willChange: 'transform'}}>
			<svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
				<defs>
					<filter id="paper-mottle-dark" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
						<feTurbulence type="fractalNoise" baseFrequency="0.0026" numOctaves={4} seed={11} />
						<feColorMatrix type="matrix" values="0 0 0 0 0.40  0 0 0 0 0.38  0 0 0 0 0.34  1.7 0 0 0 -0.80" />
					</filter>
					<filter id="paper-mottle-light" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
						<feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={29} />
						<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.98  1.8 0 0 0 -0.82" />
					</filter>
					<filter id="paper-tooth" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={5} />
						<feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.23  0 0 0 0 0.2  2.6 0 0 0 -1.42" />
					</filter>
					<filter id="paper-fibre-noise" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
						<feTurbulence type="fractalNoise" baseFrequency="0.012 0.16" numOctaves={2} seed={77} />
						<feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.3  2.4 0 0 0 -1.5" />
					</filter>
					<radialGradient id="paper-vignette" cx="50%" cy="46%" r="75%">
						<stop offset="55%" stopColor="#7A6E5E" stopOpacity={0} />
						<stop offset="100%" stopColor="#7A6E5E" stopOpacity={0.09} />
					</radialGradient>
				</defs>
				<rect width={WIDTH} height={HEIGHT} filter="url(#paper-mottle-dark)" opacity={0.085} />
				<rect width={WIDTH} height={HEIGHT} filter="url(#paper-mottle-light)" opacity={0.45} />
				<rect width={WIDTH} height={HEIGHT} filter="url(#paper-fibre-noise)" opacity={0.06} />
				<rect width={WIDTH} height={HEIGHT} filter="url(#paper-tooth)" opacity={0.22} />
				<path d={fibers} stroke="#8C857B" strokeWidth={0.8} fill="none" opacity={0.28} strokeLinecap="round" />
				<path d={scratches} stroke="#9A9286" strokeWidth={0.7} fill="none" opacity={0.12} strokeLinecap="round" />
				{specks.map((s, i) => (
					<circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#3F3832" opacity={s.o} />
				))}
				<rect width={WIDTH} height={HEIGHT} fill="url(#paper-vignette)" />
			</svg>
		</AbsoluteFill>
	);
};
