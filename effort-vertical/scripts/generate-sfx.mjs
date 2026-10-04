// Procedurally synthesises the optional sound effects into public/sfx/*.wav.
// No dependencies, deterministic (seeded). Usage: npm run sfx
import {mkdirSync, writeFileSync} from 'node:fs';

const SR = 44100;
const OUT = 'public/sfx';
mkdirSync(OUT, {recursive: true});

// --- helpers ----------------------------------------------------------------
let seed = 1234567;
const rnd = () => {
	seed = (seed * 1664525 + 1013904223) >>> 0;
	return seed / 4294967296;
};
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));
const TAU = Math.PI * 2;

const onePoleLP = (x, cutoff) => {
	const a = Math.exp((-TAU * cutoff) / SR);
	let y = 0;
	for (let i = 0; i < x.length; i++) {
		y = (1 - a) * x[i] + a * y;
		x[i] = y;
	}
	return x;
};
const onePoleHP = (x, cutoff) => {
	const lp = onePoleLP(Float32Array.from(x), cutoff);
	for (let i = 0; i < x.length; i++) x[i] -= lp[i];
	return x;
};
const add = (dst, src, at = 0, gain = 1) => {
	const o = Math.floor(at * SR);
	for (let i = 0; i < src.length && o + i < dst.length; i++) dst[o + i] += src[i] * gain;
	return dst;
};
const normalize = (x, peak = 0.9) => {
	let m = 0;
	for (const v of x) m = Math.max(m, Math.abs(v));
	if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= peak / m;
	return x;
};
const fadeOut = (x, sec = 0.02) => {
	const n = Math.floor(sec * SR);
	for (let i = 0; i < n && i < x.length; i++) x[x.length - 1 - i] *= i / n;
	return x;
};
const writeWav = (name, x) => {
	fadeOut(x);
	const data = Buffer.alloc(44 + x.length * 2);
	data.write('RIFF', 0);
	data.writeUInt32LE(36 + x.length * 2, 4);
	data.write('WAVE', 8);
	data.write('fmt ', 12);
	data.writeUInt32LE(16, 16);
	data.writeUInt16LE(1, 20);
	data.writeUInt16LE(1, 22);
	data.writeUInt32LE(SR, 24);
	data.writeUInt32LE(SR * 2, 28);
	data.writeUInt16LE(2, 32);
	data.writeUInt16LE(16, 34);
	data.write('data', 36);
	data.writeUInt32LE(x.length * 2, 40);
	for (let i = 0; i < x.length; i++) {
		const v = Math.max(-1, Math.min(1, x[i]));
		data.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
	}
	writeFileSync(`${OUT}/${name}.wav`, data);
	console.log(`${OUT}/${name}.wav  ${(x.length / SR).toFixed(2)}s`);
};

// --- building blocks --------------------------------------------------------
const click = (bright = 3000, len = 0.012) => {
	const x = buf(len);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] = (rnd() * 2 - 1) * env(t, 0.0004, len / 5);
	}
	onePoleLP(x, bright);
	return onePoleHP(x, 400);
};
const tone = (freqs, len, decay, attack = 0.002, amps) => {
	const x = buf(len);
	freqs.forEach((f, k) => {
		const amp = amps ? amps[k] : 1 / freqs.length;
		const d = Array.isArray(decay) ? decay[k] : decay;
		for (let i = 0; i < x.length; i++) {
			const t = i / SR;
			x[i] += Math.sin(TAU * f * t) * amp * env(t, attack, d);
		}
	});
	return x;
};
const sweep = (f0, f1, len, decay, shape = 1) => {
	const x = buf(len);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const f = f0 + (f1 - f0) * Math.pow(t / len, shape);
		ph += (TAU * f) / SR;
		x[i] = Math.sin(ph) * env(t, 0.004, decay);
	}
	return x;
};
const noise = (len, amp = 1) => {
	const x = buf(len);
	for (let i = 0; i < x.length; i++) x[i] = (rnd() * 2 - 1) * amp;
	return x;
};

// --- sounds -----------------------------------------------------------------
const typing = (len, rate, bright) => {
	const x = buf(len);
	let t = 0.02;
	while (t < len - 0.05) {
		add(x, click(bright * (0.8 + rnd() * 0.4)), t, 0.5 + rnd() * 0.5);
		t += (1 / rate) * (0.5 + rnd());
	}
	return normalize(x, 0.7);
};
writeWav('type-soft', typing(2.0, 6, 2200));
writeWav('type-fast', typing(2.0, 15, 3600));

{
	const len = 0.55;
	const x = noise(len);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] *= Math.sin((Math.PI * t) / len) ** 2;
	}
	onePoleLP(x, 1800);
	writeWav('whoosh', normalize(onePoleHP(x, 200), 0.6));
}
{
	const x = tone([1850, 920, 3100], 0.09, [0.012, 0.02, 0.008], 0.0008, [0.5, 0.4, 0.2]);
	add(x, click(5000, 0.006), 0, 0.6);
	writeWav('chess-click', normalize(x, 0.8));
}
writeWav('pop', normalize(sweep(260, 980, 0.12, 0.04, 0.6), 0.7));
{
	const x = sweep(85, 42, 0.35, 0.12);
	add(x, onePoleLP(noise(0.08, 0.6), 600), 0, 1);
	writeWav('thud', normalize(x, 0.85));
}
{
	const len = 5.2;
	const x = buf(len);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const trem = 0.8 + 0.2 * Math.sin(TAU * 7 * t);
		x[i] = (Math.sin(TAU * 60 * t) * 0.5 + Math.sin(TAU * 120 * t) * 0.35 + Math.sin(TAU * 180 * t) * 0.15) * trem * Math.min(1, t / 0.4);
	}
	for (let k = 0; k < 40; k++) add(x, click(6000, 0.006), rnd() * (len - 0.1), 0.25);
	writeWav('hum', normalize(x, 0.6));
}
{
	const len = 0.28;
	const x = noise(len);
	let gate = 1;
	for (let i = 0; i < x.length; i++) {
		if (i % 220 === 0) gate = rnd() > 0.35 ? 1 : 0.1;
		const t = i / SR;
		x[i] = (x[i] * 0.7 + Math.sign(Math.sin(TAU * 1900 * t)) * 0.3) * gate * env(t, 0.002, 0.08);
	}
	writeWav('zap', normalize(onePoleHP(x, 900), 0.7));
}
{
	const x = buf(1.6);
	const z = noise(0.5);
	for (let i = 0; i < z.length; i++) z[i] *= env(i / SR, 0.003, 0.12);
	add(x, onePoleHP(z, 700), 0, 0.8);
	add(x, sweep(110, 35, 1.5, 0.4), 0, 1);
	writeWav('discharge', normalize(x, 0.9));
}
{
	const x = tone([523, 1307, 2110, 3203], 0.5, [0.18, 0.1, 0.07, 0.04], 0.001, [0.4, 0.3, 0.2, 0.12]);
	add(x, click(7000, 0.008), 0, 0.9);
	add(x, sweep(140, 90, 0.15, 0.05), 0, 0.5);
	writeWav('clank', normalize(x, 0.8));
}
{
	const len = 1.5;
	const x = buf(len);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const f = 110 + 800 * Math.pow(t / len, 2);
		ph += (TAU * f) / SR;
		x[i] = (Math.sin(ph) + Math.sin(ph * 2) * 0.4 + Math.sin(ph * 3) * 0.2) * Math.pow(t / len, 1.5);
	}
	add(x, sweep(900, 1400, 0.15, 0.08), len - 0.15, 0.8);
	writeWav('power-up', normalize(x, 0.75));
}
{
	const x = buf(0.3);
	add(x, tone([1200], 0.08, 0.05), 0, 0.6);
	add(x, tone([1600], 0.1, 0.06), 0.11, 0.6);
	writeWav('hud-beep', normalize(x, 0.6));
}
{
	const x = sweep(380, 760, 0.1, 0.035, 0.5);
	add(x, tone([1520], 0.08, 0.02), 0.01, 0.2);
	writeWav('clone-pop', normalize(x, 0.7));
}
writeWav('chime', normalize(tone([880, 1320, 1760, 2640], 1.6, [0.7, 0.5, 0.35, 0.2], 0.003, [0.5, 0.3, 0.2, 0.1]), 0.6));
{
	const len = 2.8;
	const x = buf(len);
	for (let k = 0; k < 70; k++) {
		const f = 1400 + rnd() * 4200;
		add(x, tone([f], 0.5, 0.12 + rnd() * 0.2, 0.002), rnd() * (len - 0.5), 0.3 + rnd() * 0.5);
	}
	add(x, tone([523.25, 659.25, 783.99, 1046.5], len, 1.2, 0.05), 0, 1.2);
	writeWav('shimmer', normalize(x, 0.7));
}
{
	const len = 2.2;
	const x = buf(len);
	const n = onePoleLP(noise(len), 2500);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const g = Math.pow(t / len, 2);
		x[i] = (n[i] * 0.5 + Math.sin(TAU * 261.6 * t) * 0.25 + Math.sin(TAU * 392 * t) * 0.2 + Math.sin(TAU * 523.2 * t) * 0.15) * g;
	}
	writeWav('swell', normalize(x, 0.7));
}
