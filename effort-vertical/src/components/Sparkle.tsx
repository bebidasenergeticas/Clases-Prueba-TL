import React from 'react';

/** 4-point sparkle (the ✦ glyph), drawn as a path so it never depends on a font. */
export const sparklePath = (x: number, y: number, size: number, pinch = 0.18) => {
	const r = size / 2;
	const k = r * pinch;
	return `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`;
};

export const Sparkle: React.FC<{
	x: number;
	y: number;
	size: number;
	fill: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	rotate?: number;
}> = ({x, y, size, fill, stroke, strokeWidth = 0, opacity = 1, rotate = 0}) => (
	<path
		d={sparklePath(x, y, size)}
		fill={fill}
		stroke={stroke}
		strokeWidth={strokeWidth}
		strokeLinejoin="round"
		opacity={opacity}
		transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
	/>
);

/** Standalone SVG icon for HTML UI (menu pill / badge). */
export const SparkleIcon: React.FC<{size: number; fill: string; gradientId?: string}> = ({
	size,
	fill,
	gradientId,
}) => (
	<svg width={size} height={size} viewBox="0 0 20 20" style={{display: 'block', overflow: 'visible'}}>
		{gradientId && (
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#F06D4D" />
					<stop offset="30%" stopColor="#FDBA55" />
					<stop offset="55%" stopColor="#8FB679" />
					<stop offset="80%" stopColor="#7FA0C1" />
					<stop offset="100%" stopColor="#BB6FB0" />
				</linearGradient>
			</defs>
		)}
		<path d={sparklePath(10, 10, 18, 0.16)} fill={gradientId ? `url(#${gradientId})` : fill} />
	</svg>
);
