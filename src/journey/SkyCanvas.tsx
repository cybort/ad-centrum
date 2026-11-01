import { memo, useEffect, useRef, type RefObject } from "react";
import { MARKS } from "@/journey/marks";

export type Visual = { p: number; reduced: boolean };

type RGB = [number, number, number];
type Star = { x: number; y: number; z: number; s: number; warm: number; n: number };
type Drifter = { q: number; x: number; s: number; kind: number; ph: number };
type Blob = { x: number; y: number; rx: number; ry: number; rot: number };

const AT: Record<string, number> = {};
for (const m of MARKS) AT[m.id] = m.p;

const STOPS: { p: number; bg: RGB; mid: RGB; hot: RGB }[] = [
  { p: 0, bg: [14, 6, 3], mid: [86, 30, 12], hot: [255, 188, 120] },
  { p: 0.1, bg: [22, 8, 4], mid: [72, 22, 10], hot: [220, 90, 42] },
  { p: 0.16, bg: [3, 14, 22], mid: [10, 42, 58], hot: [140, 196, 206] },
  { p: 0.26, bg: [2, 6, 14], mid: [8, 22, 42], hot: [186, 206, 220] },
  { p: 0.42, bg: [6, 4, 2], mid: [36, 18, 8], hot: [255, 196, 120] },
  { p: 0.58, bg: [1, 2, 8], mid: [8, 12, 24], hot: [170, 190, 214] },
  { p: 0.8, bg: [2, 3, 8], mid: [18, 12, 16], hot: [214, 186, 150] },
  { p: 0.93, bg: [8, 4, 3], mid: [42, 16, 8], hot: [255, 160, 80] },
  { p: 1, bg: [0, 0, 0], mid: [14, 4, 2], hot: [255, 120, 48] },
];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x51c0de);
const NOISE = new Float32Array(256);
for (let i = 0; i < 256; i++) NOISE[i] = rand();

function n1(x: number) {
  const i = Math.floor(x) & 255;
  const f = x - Math.floor(x);
  const u = f * f * (3 - 2 * f);
  return NOISE[i] * (1 - u) + NOISE[(i + 1) & 255] * u;
}

function smooth(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sample(p: number) {
  let i = 1;
  while (i < STOPS.length && STOPS[i].p < p) i++;
  const b = STOPS[Math.min(i, STOPS.length - 1)];
  const a = STOPS[Math.max(0, i - 1)];
  const t = a === b ? 0 : (p - a.p) / (b.p - a.p);
  const mix = (x: RGB, y: RGB): RGB => [
    lerp(x[0], y[0], t),
    lerp(x[1], y[1], t),
    lerp(x[2], y[2], t),
  ];
  return { bg: mix(a.bg, b.bg), mid: mix(a.mid, b.mid), hot: mix(a.hot, b.hot) };
}

function rgb(c: RGB, a = 1) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

function fadeIn(p: number, a: number, b: number) {
  return smooth(a, b, p);
}
function fadeOut(p: number, a: number, b: number) {
  return 1 - smooth(a, b, p);
}

/** Ahead (larger q) sits lower and rises as p increases — same way the stations travel. */
function qY(q: number, p: number, h: number, focus = 0.74, scale = 10) {
  return h * (focus + (q - p) * scale);
}

const DRIFTERS: Drifter[] = [
  { q: AT.trench + 0.004, x: 0.78, s: 1, kind: 0, ph: 0.2 },
  { q: AT.trench + 0.012, x: 0.3, s: 0.85, kind: 3, ph: 1.1 },
  { q: AT.trench + 0.018, x: 0.62, s: 1.15, kind: 1, ph: 2.2 },
  { q: AT.sea - 0.018, x: 0.22, s: 1.35, kind: 2, ph: 0.4 },
  { q: AT.sea - 0.012, x: 0.72, s: 0.7, kind: 1, ph: 1.6 },
  { q: AT.sea - 0.006, x: 0.48, s: 0.9, kind: 1, ph: 2.8 },
  { q: AT.sea - 0.002, x: 0.58, s: 1, kind: 4, ph: 0.8 },
];

const FISH: { x: number; y: number; s: number; ph: number }[] = Array.from({ length: 16 }, () => ({
  x: (rand() - 0.5) * 0.42,
  y: (rand() - 0.5) * 0.16,
  s: 0.55 + rand() * 0.7,
  ph: rand() * 6.28,
}));

const CONTINENTS: Blob[] = [
  { x: 0.12, y: -0.02, rx: 0.22, ry: 0.38, rot: 0.25 },
  { x: 0.28, y: -0.42, rx: 0.36, ry: 0.2, rot: -0.35 },
  { x: -0.42, y: -0.12, rx: 0.18, ry: 0.34, rot: 0.5 },
  { x: 0.42, y: 0.28, rx: 0.2, ry: 0.12, rot: 0.4 },
  { x: -0.08, y: 0.36, rx: 0.16, ry: 0.1, rot: -0.2 },
];

const CLOUDS: Blob[] = Array.from({ length: 9 }, () => ({
  x: rand() * 1.6 - 0.3,
  y: (rand() - 0.5) * 1.3,
  rx: 0.16 + rand() * 0.28,
  ry: 0.05 + rand() * 0.08,
  rot: 0,
}));

const CITIES: { x: number; y: number; b: number }[] = Array.from({ length: 36 }, () => {
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(rand()) * 0.72;
  return { x: -Math.abs(Math.cos(a) * r), y: Math.sin(a) * r * 0.85, b: rand() };
});

const CRATERS: Blob[] = Array.from({ length: 16 }, () => {
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(rand()) * 0.78;
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r,
    rx: 0.05 + rand() * 0.09,
    ry: 0.045 + rand() * 0.08,
    rot: rand() * 3,
  };
});

const MARIA: Blob[] = [
  { x: -0.22, y: 0.08, rx: 0.28, ry: 0.2, rot: 0.3 },
  { x: 0.18, y: -0.22, rx: 0.18, ry: 0.14, rot: -0.4 },
  { x: 0.05, y: 0.28, rx: 0.16, ry: 0.12, rot: 0.2 },
  { x: -0.35, y: -0.28, rx: 0.12, ry: 0.1, rot: 0.5 },
];

const ICES: { q: number; x: number; s: number; ph: number; n: number }[] = Array.from({ length: 14 }, (_, i) => ({
  q: AT.ice + (i / 14) * (AT.ly - AT.ice),
  x: 0.18 + rand() * 0.68,
  s: 0.45 + rand() * 1.15,
  ph: rand() * 6.28,
  n: 3 + (rand() * 3) | 0,
}));

const STARS: Star[] = Array.from({ length: 460 }, () => ({
  x: rand(),
  y: rand(),
  z: 0.15 + rand() * 0.85,
  s: rand() < 0.08 ? 1.8 + rand() * 1.6 : 0.45 + rand() * 1.35,
  warm: rand(),
  n: rand(),
}));

function earthGeom(p: number, w: number, h: number) {
  const m = Math.min(w, h);
  const t = Math.min(1, Math.max(0, (p - (AT.sea + 0.028)) / (AT.moon - AT.sea - 0.03)));
  const k = Math.pow(t, 0.8);
  const R = m * (0.9 * (1 - k) + 0.1 * k);
  let y = h * (0.9 - 0.24 * k) + R * 0.12 * (1 - k);
  const limb = y - R;
  if (limb < h * 0.5) y += h * 0.5 - limb;
  const x = w * (0.5 + 0.22 * k);
  return { x, y, R, k };
}

function shadeSphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  R: number,
  hx: number,
  hy: number,
) {
  const g = ctx.createRadialGradient(x - R * hx, y - R * hy, R * 0.08, x, y, R);
  g.addColorStop(0, "rgba(255,255,255,0.22)");
  g.addColorStop(0.45, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fill();
}

function drawInner(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  ctx.fillStyle = "#140604";
  ctx.fillRect(0, 0, w, h);
  const m = Math.min(w, h);
  const u = smooth(0, AT.lehmann, p);
  const R = m * lerp(0.46, 0.62, u);
  const cx = w * 0.52;
  const cy = h * lerp(0.9, 0.62, u);
  const spin = time * 0.05 + p * 12;

  const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.35);
  glow.addColorStop(0, "rgba(255,150,70,0.55)");
  glow.addColorStop(0.4, "rgba(180,50,16,0.28)");
  glow.addColorStop(1, "rgba(20,6,4,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  const core = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.25, R * 0.05, cx, cy, R);
  core.addColorStop(0, "#ffe0b0");
  core.addColorStop(0.18, "#ff9a45");
  core.addColorStop(0.55, "#c2410c");
  core.addColorStop(1, "#3a0c06");
  ctx.fillStyle = core;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

  for (let i = 0; i < 16; i++) {
    const a0 = spin + (i / 16) * Math.PI * 2;
    const a1 = spin + ((i + 1) / 16) * Math.PI * 2 + 0.08;
    const r0 = R * (0.42 + n1(i * 1.7) * 0.55);
    const r1 = R * (0.5 + n1(i * 2.3 + 4) * 0.5);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
    ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
    ctx.closePath();
    const hot = 0.35 + 0.65 * n1(i * 3.1 + spin);
    ctx.fillStyle = `rgba(${70 + hot * 170},${22 + hot * 55},${10},${0.28 + hot * 0.28})`;
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255,214,170,0.45)";
  ctx.lineWidth = 1.25;
  for (let i = 0; i < 5; i++) {
    const a = spin * 0.7 + i * 1.3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * R * 0.1, cy + Math.sin(a) * R * 0.1);
    ctx.quadraticCurveTo(
      cx + Math.cos(a + 0.6) * R * 0.55,
      cy + Math.sin(a + 0.4) * R * 0.4,
      cx + Math.cos(a + 1.1) * R * 0.92,
      cy + Math.sin(a + 0.9) * R * 0.92,
    );
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(255,186,120,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.01, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 18; i++) {
    const rise = (time * 0.04 * (0.4 + n1(i)) + n1(i + 8)) % 1;
    const ang = n1(i + 3) * 6.28;
    ctx.fillStyle = `rgba(255,${140 + n1(i) * 80},${60},${(1 - rise) * 0.65})`;
    const px = cx + Math.cos(ang) * R * (0.2 + n1(i + 5) * 0.9);
    const py = cy - rise * R * 1.3 + Math.sin(ang) * 10;
    ctx.fillRect(px, py, 2.2, 2.2);
  }
}

function wavyFill(
  ctx: CanvasRenderingContext2D,
  w: number,
  y0: number,
  y1: number,
  color: string,
  seed: number,
  amp: number,
) {
  ctx.beginPath();
  ctx.moveTo(0, y0);
  for (let x = 0; x <= w; x += 20) {
    ctx.lineTo(x, y0 + Math.sin(x * 0.012 + seed) * amp + (n1(x * 0.02 + seed) - 0.5) * amp);
  }
  ctx.lineTo(w, y1 + amp);
  for (let x = w; x >= 0; x -= 20) {
    ctx.lineTo(x, y1 + Math.sin(x * 0.015 + seed + 2) * amp * 0.65);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawOuter(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  ctx.fillStyle = "#140403";
  ctx.fillRect(0, 0, w, h);
  const slide = (p - AT.lehmann) * h * 4.2 + time * 26;

  for (let i = 0; i < 5; i++) {
    const cy = ((i * 0.28 + 0.08) * h - slide * 0.35 + h * 3) % (h * 1.35) - h * 0.15;
    const cx = w * (0.22 + (i % 3) * 0.26);
    const R = Math.min(w, h) * (0.2 + (i % 2) * 0.1);
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, R);
    g.addColorStop(0, "rgba(255, 214, 150, 0.9)");
    g.addColorStop(0.35, "rgba(255, 96, 28, 0.45)");
    g.addColorStop(1, "rgba(40, 8, 4, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 7; i++) {
    const span = h * 0.2;
    const y = i * span - (slide % span);
    ctx.beginPath();
    ctx.lineWidth = 8 + (i % 3) * 7;
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255, 168, 72, 0.82)" : "rgba(255, 78, 24, 0.7)";
    for (let x = 0; x <= w; x += 12) {
      const yy =
        y + Math.sin(x * 0.0075 + time * 0.45 + i) * (20 + (i % 3) * 8) + Math.sin(x * 0.02 + i) * 7;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 236, 200, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const remnant = 1 - smooth(AT.lehmann, AT.gutenberg - 0.006, p);
  if (remnant > 0.05) {
    const R = Math.min(w, h) * 0.18 * (0.45 + remnant);
    const cx = w * 0.5;
    const cy = h * 0.8;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, `rgba(255, 230, 190, ${0.95 * remnant})`);
    g.addColorStop(0.45, `rgba(240, 110, 36, ${0.7 * remnant})`);
    g.addColorStop(1, "rgba(80, 16, 6, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }
}

const MANTLE = ["#100c09", "#4a2c18", "#1c3326", "#7a4e2a", "#16120e", "#3d2818", "#24362a", "#a06838"];
const CRUST = ["#1e1c18", "#5a5044", "#2a3330", "#6e624f", "#26221c", "#3e4844", "#8a7a64", "#141210"];

function drawRock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  time: number,
  colors: string[],
  anchor: number,
  gems: boolean,
) {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);
  const slide = (p - anchor) * h * 7;
  const spacing = h * 0.22;
  const first = Math.floor(slide / spacing) - 2;
  const last = first + Math.ceil(h / spacing) + 5;
  for (let i = first; i <= last; i++) {
    const y0 = i * spacing - slide;
    const y1 = y0 + spacing * (0.72 + (Math.abs(i) % 3) * 0.12);
    wavyFill(ctx, w, y0, y1, colors[Math.abs(i) % colors.length], i * 1.7, 14 + (Math.abs(i) % 4) * 4);
  }

  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  const fault = (slide * 0.15) % (h * 0.5);
  let y = -h * 0.2 + fault;
  ctx.moveTo(w * 0.7, y);
  for (let i = 0; i < 10; i++) {
    y += h * 0.16;
    ctx.lineTo(w * (0.64 + (i % 2) * 0.1), y);
  }
  ctx.stroke();

  if (gems) {
    ctx.fillStyle = "rgba(150,170,110,0.55)";
    for (let i = 0; i < 8; i++) {
      const gy = qY(anchor + 0.004 * i, p, h, 0.2 + n1(i) * 0.9, 8);
      const gx = w * (0.15 + n1(i + 4) * 0.7);
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(time * 0.05 + i);
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(5, 0);
      ctx.lineTo(0, 7);
      ctx.lineTo(-5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  } else {
    ctx.save();
    ctx.translate(w * 0.32, qY(AT.moho - 0.004, p, h, 0.8, 9));
    ctx.strokeStyle = "rgba(90,70,54,0.8)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 5.2;
      const rad = 4 + i * 0.55;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad * 0.7;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function drawFish(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, dir: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir * s, s);
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.quadraticCurveTo(2, 7, -8, 2);
  ctx.lineTo(-15, 7);
  ctx.lineTo(-11, 0);
  ctx.lineTo(-15, -7);
  ctx.lineTo(-8, -2);
  ctx.quadraticCurveTo(2, -7, 14, 0);
  ctx.fill();
  ctx.restore();
}

function drawJelly(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, time: number, ph: number) {
  const wob = Math.sin(time * 1.3 + ph);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(186, 230, 226, 0.55)";
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 16, s * (9 + wob * 2), 0, Math.PI, 0, true);
  ctx.fill();
  ctx.strokeStyle = "rgba(200, 240, 236, 0.45)";
  ctx.lineWidth = 1.2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * s * 6, s * 2);
    ctx.quadraticCurveTo(i * s * 8 + wob * 8, s * 28, i * s * 3, s * 48);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWhale(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, time: number) {
  const wag = Math.sin(time * 0.7) * 0.12;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.06);
  ctx.fillStyle = "rgba(6, 16, 22, 0.94)";
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 86, s * 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(150, 206, 214, 0.55)";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.fillStyle = "rgba(12, 32, 42, 0.95)";
  ctx.beginPath();
  ctx.ellipse(s * 30, -s * 2, s * 36, s * 16, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(8, 20, 28, 0.95)";
  ctx.save();
  ctx.translate(-s * 74, 0);
  ctx.rotate(wag);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-s * 28, -s * 26, -s * 8, -s * 34);
  ctx.quadraticCurveTo(-s * 18, -s * 8, 0, 0);
  ctx.quadraticCurveTo(-s * 18, s * 8, -s * 8, s * 34);
  ctx.quadraticCurveTo(-s * 28, s * 26, 0, 0);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(s * 8, s * 14, s * 16, s * 5, 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(210, 230, 234, 0.8)";
  ctx.beginPath();
  ctx.arc(s * 48, -s * 4, s * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAngler(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, time: number) {
  const lure = Math.sin(time * 1.6) * 4;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#061016";
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 26, s * 14, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(s * 18, 0);
  ctx.lineTo(s * 34, s * 8);
  ctx.lineTo(s * 18, s * 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(180,220,210,0.7)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-s * 6, -s * 12);
  ctx.quadraticCurveTo(-s * 20, -s * 36, -s * 4 + lure, -s * 48);
  ctx.stroke();
  const pulse = 0.45 + 0.55 * Math.sin(time * 3);
  ctx.fillStyle = `rgba(140, 255, 220, ${pulse})`;
  ctx.beginPath();
  ctx.arc(-s * 4 + lure, -s * 48, s * 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(140,255,220,0.15)";
  ctx.beginPath();
  ctx.arc(-s * 4 + lure, -s * 48, s * 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSub(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, time: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 0.4) * 0.04);
  ctx.fillStyle = "#c4552a";
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 28, s * 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8a3018";
  ctx.fillRect(-s * 6, -s * 16, s * 10, s * 10);
  ctx.fillStyle = "#d8e6ea";
  ctx.beginPath();
  ctx.arc(s * 8, 0, s * 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255, 220, 160, ${0.7 + Math.sin(time * 2) * 0.2})`;
  ctx.beginPath();
  ctx.arc(s * 26, s * 2, s * 2.1, 0, Math.PI * 2);
  ctx.arc(-s * 20, s * 3, s * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOcean(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  const surface = h * (0.58 + (p - AT.sea) * 12);
  const floor = h * (0.9 + (p - AT.trench) * 8);

  const water = ctx.createLinearGradient(0, Math.min(surface, h), 0, h);
  water.addColorStop(0, "#1c7c96");
  water.addColorStop(0.16, "#0f5570");
  water.addColorStop(0.5, "#0a3348");
  water.addColorStop(1, "#061824");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, w, h);

  if (surface > -40 && surface < h + 80) {
    const sky = ctx.createLinearGradient(0, 0, 0, Math.max(surface, 1));
    sky.addColorStop(0, "#071422");
    sky.addColorStop(0.7, "#16324a");
    sky.addColorStop(1, "#c47848");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, Math.max(0, surface));

    const sunX = w * 0.72;
    const sunY = surface - h * 0.08;
    const sg = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, Math.min(w, h) * 0.18);
    sg.addColorStop(0, "rgba(255,236,210,0.95)");
    sg.addColorStop(0.35, "rgba(255,170,90,0.45)");
    sg.addColorStop(1, "rgba(255,140,60,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sunX, sunY, Math.min(w, h) * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(190, 230, 228, 0.55)";
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 4; i++) {
      const y = surface + i * 7;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 14) {
        const yy = y + Math.sin(x * 0.012 + time * 0.9 + i) * (5 + i * 1.5);
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 210, 160, 0.18)";
    for (let i = 0; i < 8; i++) {
      const yy = surface + 24 + i * 22;
      ctx.beginPath();
      ctx.ellipse(sunX, yy, 18 - i, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (surface < h * 0.85) {
    ctx.strokeStyle = "rgba(180, 230, 220, 0.07)";
    ctx.lineWidth = 28;
    const origin = Math.max(surface, 0);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w * (0.35 + i * 0.08), origin);
      ctx.lineTo(w * (0.15 + i * 0.16), h);
      ctx.stroke();
    }
  }

  const trench = 1 - smooth(AT.trench, AT.sea - 0.008, p);
  if (trench > 0.04) {
    ctx.fillStyle = `rgba(5, 7, 8, ${0.92 * trench})`;
    const inset = w * lerp(0.3, 0.04, 1 - trench);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(inset, h * 0.25);
    ctx.lineTo(inset * 0.55, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w - inset * 0.85, h * 0.3);
    ctx.lineTo(w - inset * 0.4, h);
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.strokeStyle = "rgba(70, 60, 50, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(inset, h * 0.25);
    ctx.lineTo(inset * 0.55, h);
    ctx.moveTo(w - inset * 0.85, h * 0.3);
    ctx.lineTo(w - inset * 0.4, h);
    ctx.stroke();
  }

  if (floor > -20 && floor < h + 40) {
    ctx.fillStyle = "#12100e";
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 18) {
      ctx.lineTo(x, floor + Math.sin(x * 0.02) * 8 + (n1(x * 0.03) - 0.5) * 16);
    }
    ctx.lineTo(w, h);
    ctx.fill();
    const vx = w * 0.62;
    const glow = ctx.createRadialGradient(vx, floor, 4, vx, floor, 70);
    glow.addColorStop(0, "rgba(255,140,60,0.65)");
    glow.addColorStop(1, "rgba(255,80,20,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(vx, floor, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1614";
    ctx.beginPath();
    ctx.moveTo(vx - 10, floor);
    ctx.lineTo(vx - 4, floor - 36);
    ctx.lineTo(vx + 2, floor - 18);
    ctx.lineTo(vx + 8, floor - 48);
    ctx.lineTo(vx + 14, floor);
    ctx.fill();
  }

  for (const d of DRIFTERS) {
    const y = qY(d.q, p, h, 0.7, 9);
    if (y < -80 || y > h + 80) continue;
    const x = w * d.x + Math.sin(time * 0.3 + d.ph) * 10;
    if (d.kind === 0) drawAngler(ctx, x, y, d.s, time);
    else if (d.kind === 1) drawJelly(ctx, x, y, d.s, time, d.ph);
    else if (d.kind === 2) drawWhale(ctx, x, y, d.s, time);
    else if (d.kind === 3) drawSub(ctx, x, y, d.s, time);
    else {
      ctx.fillStyle = "rgba(170, 214, 216, 0.8)";
      for (const f of FISH) {
        const fx = x + f.x * w + Math.sin(time * 0.8 + f.ph) * 8;
        const fy = y + f.y * h;
        drawFish(ctx, fx, fy, f.s * 0.85, Math.sin(time * 0.5 + f.ph) > 0 ? 1 : -1);
      }
    }
  }

  for (let i = 0; i < 40; i++) {
    const x = n1(i * 2.1) * w;
    const y = ((n1(i * 1.3) + time * 0.015 * (0.3 + n1(i)) + p) % 1) * h;
    ctx.fillStyle = `rgba(200,230,230,${0.15 + n1(i + 5) * 0.35})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  const t = smooth(AT.sea, AT.karman, p);
  const top = lerp(10, 2, t);
  const mid = lerp(28, 8, t);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, `rgb(${top * 0.4},${top * 0.6},${top + 8})`);
  g.addColorStop(0.45, `rgb(${mid * 0.5},${mid},${mid + 18})`);
  g.addColorStop(0.78, `rgb(${40 + t * 10},${70 - t * 30},${110 - t * 40})`);
  g.addColorStop(1, `rgb(${120 - t * 90},${90 - t * 60},${70 - t * 40})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const slide = (p - AT.tropo) * h * 5;
  ctx.fillStyle = "rgba(236, 240, 244, 0.78)";
  for (let i = 0; i < 6; i++) {
    const y = h * (0.55 + i * 0.08) - slide;
    if (y < -40 || y > h + 30) continue;
    ctx.beginPath();
    ctx.ellipse(w * (0.3 + (i % 3) * 0.22), y, w * (0.22 + (i % 2) * 0.08), 16 + (i % 3) * 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * (0.42 + (i % 3) * 0.18), y + 4, w * 0.12, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (t > 0.35) {
    ctx.fillStyle = `rgba(255,255,255,${(t - 0.35) * 0.25})`;
    for (let i = 0; i < 12; i++) {
      ctx.fillRect(n1(i + 9) * w, n1(i * 3) * h * 0.5, 1.4, 1.4);
    }
  }
}

function drawEarth(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  const { x, y, R, k } = earthGeom(p, w, h);
  if (R < 2) return;

  const glow = ctx.createRadialGradient(x, y, R * 0.9, x, y, R * 1.22);
  glow.addColorStop(0, "rgba(0,0,0,0)");
  glow.addColorStop(0.55, "rgba(120,190,210,0.35)");
  glow.addColorStop(0.82, "rgba(230,150,80,0.28)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, R * 1.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.clip();

  const sea = ctx.createRadialGradient(x - R * 0.2, y - R * 0.3, R * 0.1, x, y, R);
  sea.addColorStop(0, "#1f6f9a");
  sea.addColorStop(0.6, "#0c3d62");
  sea.addColorStop(1, "#06243e");
  ctx.fillStyle = sea;
  ctx.fillRect(x - R, y - R, R * 2, R * 2);

  ctx.fillStyle = "#1e6a48";
  for (const c of CONTINENTS) {
    ctx.beginPath();
    ctx.ellipse(x + c.x * R, y + c.y * R, Math.abs(c.rx * R), Math.abs(c.ry * R), c.rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#174e36";
  ctx.beginPath();
  ctx.ellipse(x + R * 0.16, y - R * 0.05, R * 0.1, R * 0.2, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(244,248,250,0.92)";
  ctx.beginPath();
  ctx.ellipse(x, y - R * 0.86, R * 0.22, R * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  for (const c of CLOUDS) {
    const ox = ((c.x + time * 0.012) % 1.8) - 0.4;
    ctx.beginPath();
    ctx.ellipse(x + ox * R, y + c.y * R, c.rx * R, c.ry * R, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const night = smooth(AT.karman, AT.geo, p);
  if (night > 0.02) {
    const sh = ctx.createLinearGradient(x - R, y, x + R * 0.15, y);
    sh.addColorStop(0, `rgba(0,4,12,${0.9 * night})`);
    sh.addColorStop(0.48, `rgba(0,4,12,${0.25 * night})`);
    sh.addColorStop(0.7, "rgba(0,0,0,0)");
    ctx.fillStyle = sh;
    ctx.fillRect(x - R, y - R, R * 2, R * 2);
    for (const c of CITIES) {
      if (c.x > -0.05) continue;
      ctx.fillStyle = `rgba(255,196,120,${night * (0.35 + c.b * 0.65)})`;
      ctx.fillRect(x + c.x * R, y + c.y * R, Math.max(1.2, R * 0.008), Math.max(1.2, R * 0.008));
    }
  }
  ctx.restore();

  if (k > 0.25 && k < 0.72) {
    ctx.strokeStyle = "rgba(210, 220, 230, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, R * 1.45, R * 0.42, -0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(230,236,240,0.8)";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + time * 0.05;
      ctx.fillRect(x + Math.cos(a) * R * 1.45, y + Math.sin(a) * R * 0.42, 2.2, 2.2);
    }
  }
}

function drawIss(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  const { x, y, R } = earthGeom(p, w, h);
  const s = Math.max(22, Math.min(w, h) * 0.06);
  const px = Math.min(w * 0.86, x + R * 0.22);
  const py = Math.max(h * 0.4, y - R - s * 0.15) + Math.sin(time * 0.4) * 3;
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(-0.35);
  ctx.strokeStyle = "#d7dde2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-s * 1.6, 0);
  ctx.lineTo(s * 1.6, 0);
  ctx.stroke();
  ctx.fillStyle = "#e7e1c8";
  ctx.fillRect(-s * 1.55, -s * 0.55, s * 0.7, s * 1.1);
  ctx.fillRect(s * 0.85, -s * 0.55, s * 0.7, s * 1.1);
  ctx.fillStyle = "#c8d0d6";
  ctx.fillRect(-s * 0.45, -s * 0.16, s * 0.9, s * 0.32);
  ctx.fillStyle = "#9aa6ae";
  ctx.fillRect(-s * 0.15, -s * 0.28, s * 0.3, s * 0.2);
  ctx.restore();
}

function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number, R: number) {
  const body = ctx.createRadialGradient(x - R * 0.35, y - R * 0.35, R * 0.1, x, y, R);
  body.addColorStop(0, "#f4f1ea");
  body.addColorStop(0.6, "#c8c2b4");
  body.addColorStop(1, "#8e8980");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(90, 88, 82, 0.45)";
  for (const m of MARIA) {
    ctx.beginPath();
    ctx.ellipse(x + m.x * R, y + m.y * R, m.rx * R, m.ry * R, m.rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(70,66,60,0.55)";
  ctx.lineWidth = 1.2;
  for (const c of CRATERS) {
    ctx.beginPath();
    ctx.ellipse(x + c.x * R, y + c.y * R, c.rx * R, c.ry * R, c.rot, 0, Math.PI * 2);
    ctx.stroke();
  }
  shadeSphere(ctx, x, y, R, 0.4, 0.35);
}

function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, time: number) {
  if (R < 1.2) {
    ctx.fillStyle = "#fff6e4";
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + time * 0.04;
    ctx.strokeStyle = `rgba(255, ${180 + (i % 3) * 20}, 90, ${0.08 + (i % 4) * 0.03})`;
    ctx.lineWidth = R * 0.04;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * R * 0.9, Math.sin(a) * R * 0.9);
    ctx.lineTo(Math.cos(a) * R * (1.7 + (i % 3) * 0.25), Math.sin(a) * R * (1.7 + (i % 3) * 0.25));
    ctx.stroke();
  }
  ctx.restore();

  const disk = ctx.createRadialGradient(x - R * 0.25, y - R * 0.25, R * 0.05, x, y, R);
  disk.addColorStop(0, "#fffaf0");
  disk.addColorStop(0.45, "#ffe08a");
  disk.addColorStop(0.82, "#ffb03a");
  disk.addColorStop(1, "#e06a18");
  ctx.fillStyle = disk;
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.clip();
  for (let i = 0; i < 22; i++) {
    const a = n1(i) * 6.28 + time * 0.1;
    const r = n1(i + 2) * R * 0.75;
    ctx.fillStyle = `rgba(255,255,255,${0.06 + n1(i + 4) * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, R * 0.12, R * 0.08, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(255, 90, 40, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const a = time * 0.15;
  ctx.moveTo(x + Math.cos(a) * R * 0.9, y + Math.sin(a) * R * 0.9);
  ctx.quadraticCurveTo(
    x + Math.cos(a + 0.4) * R * 1.45,
    y + Math.sin(a + 0.2) * R * 1.5,
    x + Math.cos(a + 0.8) * R * 1.05,
    y + Math.sin(a + 0.7) * R * 1.05,
  );
  ctx.stroke();
}

function drawBandedPlanet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  R: number,
  bands: string[],
  spot: string | null,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15);
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.clip();
  for (let i = 0; i < bands.length; i++) {
    ctx.fillStyle = bands[i];
    const y0 = -R + (i * 2 * R) / bands.length;
    ctx.fillRect(-R, y0, R * 2, (2 * R) / bands.length + 1);
  }
  if (spot) {
    ctx.fillStyle = spot;
    ctx.beginPath();
    ctx.ellipse(R * 0.22, R * 0.12, R * 0.26, R * 0.16, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  shadeSphere(ctx, x, y, R, 0.35, 0.4);
}

function drawHelio(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const sx = w * 0.3;
  const sy = h * 0.8;
  const g = ctx.createRadialGradient(sx, sy, 2, sx, sy, 70);
  g.addColorStop(0, "rgba(255, 236, 200, 0.95)");
  g.addColorStop(1, "rgba(255, 170, 70, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sx, sy, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff6e0";
  ctx.beginPath();
  ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(170, 214, 230, 0.8)";
  ctx.beginPath();
  ctx.moveTo(w * 0.8, -10);
  ctx.quadraticCurveTo(w * 0.58, h * 0.45, w * 0.84, h + 10);
  ctx.stroke();
  ctx.lineWidth = 18;
  ctx.strokeStyle = "rgba(140, 190, 220, 0.16)";
  ctx.stroke();

  for (let i = 0; i < 32; i++) {
    const targetY = (i / 32) * h;
    const targetX = w * (0.78 - Math.sin((targetY / h) * Math.PI) * 0.16);
    const u = (time * 0.07 * (0.45 + n1(i)) + n1(i + 3)) % 1;
    const stopped = Math.min(u, 0.96);
    const px = lerp(sx, targetX, stopped);
    const py = lerp(sy, targetY, stopped);
    ctx.fillStyle = `rgba(255, 220, 170, ${0.25 + stopped * 0.55})`;
    ctx.fillRect(px, py, 2.2, 2.2);
  }
}

function drawVoyager(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.5);
  ctx.fillStyle = "#d5dbe0";
  ctx.beginPath();
  ctx.ellipse(-s * 0.2, 0, s * 0.55, s * 0.18, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9aa4ae";
  ctx.fillRect(0, -s * 0.12, s * 0.7, s * 0.24);
  ctx.strokeStyle = "#e8eef2";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(s * 0.7, 0);
  ctx.lineTo(s * 1.5, 0);
  ctx.stroke();
  ctx.restore();
}

function drawIce(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  time: number,
) {
  for (const ice of ICES) {
    const y = qY(ice.q, p, h, 0.72, 6.5);
    if (y < -40 || y > h + 40) continue;
    const x = w * ice.x;
    const s = Math.min(w, h) * 0.02 * ice.s;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.15 + ice.ph);
    ctx.fillStyle = "rgba(226, 236, 242, 0.82)";
    ctx.beginPath();
    for (let i = 0; i < ice.n; i++) {
      const a = (i / ice.n) * Math.PI * 2;
      const rad = s * (0.7 + n1(i + ice.ph) * 0.6);
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  }

  const cometY = qY(AT.oort, p, h, 0.66, 6);
  if (cometY > -60 && cometY < h + 60) {
    const cx = w * 0.7;
    ctx.strokeStyle = "rgba(190, 214, 230, 0.35)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx, cometY);
    ctx.quadraticCurveTo(cx - w * 0.18, cometY - h * 0.08, cx - w * 0.38, cometY - h * 0.02);
    ctx.stroke();
    ctx.fillStyle = "#f4fbff";
    ctx.beginPath();
    ctx.arc(cx, cometY, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawProxima(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, time: number) {
  const flare = 0.65 + 0.35 * Math.sin(time * 0.8);
  const g = ctx.createRadialGradient(x, y, R * 0.2, x, y, R * 3.2);
  g.addColorStop(0, `rgba(255,150,90,${0.45 * flare})`);
  g.addColorStop(1, "rgba(255,60,30,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, R * 3.2, 0, Math.PI * 2);
  ctx.fill();
  const body = ctx.createRadialGradient(x - R * 0.3, y - R * 0.3, R * 0.1, x, y, R);
  body.addColorStop(0, "#ffd0b0");
  body.addColorStop(0.5, "#e2582c");
  body.addColorStop(1, "#8a1e10");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(180, 200, 210, 0.9)";
  ctx.beginPath();
  ctx.arc(x + R * 2.4, y + R * 0.6, R * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawNebula(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number) {
  const x = w * 0.7;
  const y = h * 0.7;
  const s = Math.min(w, h);
  const clouds: [number, number, number, string][] = [
    [0, 0, 0.46, "rgba(150, 50, 80, 0.55)"],
    [0.14, -0.08, 0.3, "rgba(40, 110, 140, 0.5)"],
    [-0.12, 0.1, 0.24, "rgba(200, 90, 60, 0.42)"],
    [0.04, 0.14, 0.2, "rgba(255, 180, 140, 0.28)"],
  ];
  for (const c of clouds) {
    const g = ctx.createRadialGradient(x + c[0] * s, y + c[1] * s, 8, x + c[0] * s, y + c[1] * s, c[2] * s);
    g.addColorStop(0, c[3]);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.fillStyle = "rgba(255, 244, 230, 0.85)";
  for (let i = 0; i < 18; i++) {
    const px = x + (n1(i + p * 10) - 0.5) * s * 0.5;
    const py = y + (n1(i + 6) - 0.5) * s * 0.36;
    const tw = 0.45 + 0.55 * Math.sin(time * 1.4 + i);
    ctx.fillStyle = `rgba(255, 244, 230, ${tw})`;
    ctx.fillRect(px, py, i % 5 === 0 ? 2.4 : 1.3, i % 5 === 0 ? 2.4 : 1.3);
  }
}

function drawMilkyWay(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  ctx.save();
  ctx.translate(w * 0.5, h * 0.72);
  ctx.rotate(-0.55);
  const band = ctx.createLinearGradient(0, -h * 0.18, 0, h * 0.18);
  band.addColorStop(0, "rgba(0,0,0,0)");
  band.addColorStop(0.35, "rgba(90, 80, 70, 0.18)");
  band.addColorStop(0.5, "rgba(230, 214, 190, 0.22)");
  band.addColorStop(0.65, "rgba(80, 60, 50, 0.16)");
  band.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = band;
  ctx.fillRect(-w, -h * 0.2, w * 2, h * 0.4);
  ctx.restore();

  const dust = smooth(AT.arm, AT.dust + 0.01, p);
  if (dust < 0.02) return;
  ctx.save();
  ctx.translate(w * 0.58, h * 0.74);
  ctx.rotate(-0.5);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 ? `rgba(40, 22, 16, ${0.85 * dust})` : `rgba(12, 8, 8, ${0.75 * dust})`;
    ctx.beginPath();
    ctx.ellipse(0, (i - 2) * 26, w * 0.7, 12 + i * 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHole(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number, reduced: boolean) {
  const k = smooth(AT.dust, AT.sgr + 0.01, p);
  const hx = w * (w > h ? 0.72 : 0.7);
  const hy = h * (0.86 - k * 0.08);
  const R = Math.min(w, h) * (0.16 + k * 0.1);
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(-0.55);
  ctx.scale(1, 0.36);
  for (let i = 0; i < 220; i++) {
    const ang = (i / 220) * Math.PI * 2 + (reduced ? 0 : time * 0.28);
    const rad = R * (1.15 + (i % 9) * 0.035);
    const facing = Math.max(0, Math.sin(ang - 0.4));
    const bright = facing * facing;
    ctx.fillStyle =
      facing > 0.42
        ? `rgba(255,228,200,${0.15 + bright * 0.75})`
        : `rgba(160,36,22,${0.08 + bright * 0.4})`;
    ctx.beginPath();
    ctx.arc(Math.cos(ang) * rad, Math.sin(ang) * rad, R * (0.035 + bright * 0.02), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255,220,180,0.7)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, R * 1.04, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(hx, hy, R * 0.42, R * 0.36, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,236,220,0.85)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.ellipse(hx, hy, R * 0.62, R * 0.5, -0.4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,220,180,0.25)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(hx, hy, R * (1.8 + i * 0.7), R * (0.55 + i * 0.18), -0.9 + i * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    const a = (reduced ? i : time * (0.25 + i * 0.08)) + i;
    const rx = R * (1.8 + i * 0.7);
    const ry = R * (0.55 + i * 0.18);
    const rot = -0.9 + i * 0.15;
    const px = hx + rx * Math.cos(a) * Math.cos(rot) - ry * Math.sin(a) * Math.sin(rot);
    const py = hy + rx * Math.cos(a) * Math.sin(rot) + ry * Math.sin(a) * Math.cos(rot);
    ctx.fillStyle = i === 2 ? "#fff4e4" : "#ffb088";
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

type Env = { w: number; h: number; p: number; time: number; reduced: boolean };

function paintScenes(ctx: CanvasRenderingContext2D, e: Env) {
  const { w, h, p, time, reduced } = e;
  const m = Math.min(w, h);

  const aInner = fadeOut(p, AT.core + 0.008, AT.lehmann);
  const aOuter = fadeIn(p, AT.core + 0.01, AT.lehmann) * fadeOut(p, AT.lehmann + 0.01, AT.gutenberg);
  const aMantle = fadeIn(p, AT.lehmann + 0.008, AT.gutenberg) * fadeOut(p, AT.gutenberg + 0.008, AT.moho);
  const aCrust = fadeIn(p, AT.gutenberg + 0.006, AT.moho) * fadeOut(p, AT.moho + 0.008, AT.trench + 0.008);
  const aOcean = fadeIn(p, AT.moho + 0.004, AT.trench) * fadeOut(p, AT.sea + 0.012, AT.tropo + 0.02);
  const aSky = fadeIn(p, AT.sea, AT.tropo) * fadeOut(p, AT.iss, AT.geo);
  const aEarth = fadeIn(p, AT.sea + 0.02, AT.karman) * fadeOut(p, AT.moon + 0.005, AT.l1);
  const aIss = fadeIn(p, AT.iss - 0.012, AT.iss) * fadeOut(p, AT.iss + 0.006, AT.iss + 0.02);
  const aMoon = fadeIn(p, AT.geo + 0.01, AT.moon) * fadeOut(p, AT.moon + 0.012, AT.l1 + 0.01);
  const aSun = fadeIn(p, AT.l1, AT.sun) * fadeOut(p, AT.sun + 0.02, AT.jupiter);
  const aJup = fadeIn(p, AT.sun + 0.012, AT.jupiter) * fadeOut(p, AT.jupiter + 0.012, AT.neptune - 0.008);
  const aNep = fadeIn(p, AT.jupiter + 0.012, AT.neptune) * fadeOut(p, AT.neptune + 0.012, AT.helio);
  const aHelio = fadeIn(p, AT.neptune + 0.01, AT.helio) * fadeOut(p, AT.voyager, AT.ice);
  const aVoy = fadeIn(p, AT.helio + 0.01, AT.voyager) * fadeOut(p, AT.voyager + 0.015, AT.ice);
  const aIce = fadeIn(p, AT.ice - 0.01, AT.oort) * fadeOut(p, AT.ly, AT.proxima - 0.02);
  const aProx = fadeIn(p, AT.dark, AT.proxima) * fadeOut(p, AT.proxima + 0.015, AT.bubble + 0.01);
  const aNeb = fadeIn(p, AT.bubble, AT.orion) * fadeOut(p, AT.arm, AT.dust);
  const aMw = fadeIn(p, AT.ly, AT.bubble);
  const aHole = fadeIn(p, AT.dust - 0.005, AT.sgr);
  const aStar = fadeIn(p, AT.tropo, AT.karman + 0.01);

  const layer = (alpha: number, fn: () => void) => {
    if (alpha < 0.02) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    fn();
    ctx.restore();
  };

  if (aStar > 0.02) {
    const density = 0.22 + 0.78 * smooth(AT.voyager, AT.sgr, p);
    const drift = reduced ? p * 40 : p * 80 + time * 6;
    for (const s of STARS) {
      if (s.n > density) continue;
      const y = ((s.y * h + drift * s.z) % h + h) % h;
      const x = (s.x * w + (reduced ? 0 : Math.sin(time * 0.15 + s.y * 8) * 3) + w) % w;
      const tw = reduced ? 0.8 : 0.45 + 0.55 * Math.sin(time * 1.2 + s.x * 20);
      const warm = s.warm * smooth(AT.orion, AT.sgr, p);
      const rr = 206 + warm * 49;
      const gg = 210 + warm * 8;
      const bb = 222 - warm * 90;
      ctx.fillStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},${aStar * tw * (0.25 + s.z * 0.75)})`;
      const size = s.s * (0.55 + s.z * 0.75);
      ctx.fillRect(x, y, size, size);
      if (s.s > 2.4 && aStar > 0.6 && p > AT.ly) {
        ctx.fillRect(x - size, y + size * 0.35, size * 3, 0.7);
        ctx.fillRect(x + size * 0.35, y - size, 0.7, size * 3);
      }
    }
  }

  layer(aInner, () => drawInner(ctx, w, h, p, time));
  layer(aOuter, () => drawOuter(ctx, w, h, p, time));
  layer(aMantle, () => drawRock(ctx, w, h, p, time, MANTLE, AT.gutenberg, true));
  layer(aCrust, () => drawRock(ctx, w, h, p, time, CRUST, AT.moho, false));
  layer(aSky, () => drawSky(ctx, w, h, p, time));
  layer(aOcean, () => drawOcean(ctx, w, h, p, time));
  layer(aMw * fadeOut(p, AT.dust, AT.sgr), () => drawMilkyWay(ctx, w, h, p));
  layer(aEarth, () => drawEarth(ctx, w, h, p, time));
  layer(aIss, () => drawIss(ctx, w, h, p, time));

  layer(aMoon, () => {
    const y = qY(AT.moon, p, h, 0.7, 8);
    const R = m * lerp(0.08, 0.24, fadeIn(p, AT.geo, AT.moon));
    drawMoon(ctx, w * 0.56, y, R);
  });

  layer(aSun, () => {
    const u = fadeIn(p, AT.l1, AT.sun);
    const v = fadeIn(p, AT.sun + 0.008, AT.jupiter);
    const R = m * (lerp(0.04, 0.3, u) * (1 - v) + 0.012 * v);
    const y = lerp(h * 0.84, h * 0.36, fadeIn(p, AT.sun, AT.jupiter));
    const x = lerp(w * 0.62, w * 0.22, v);
    drawSun(ctx, x, y, Math.max(R, 2), time);
  });

  layer(aJup, () => {
    const y = qY(AT.jupiter, p, h, 0.72, 9);
    drawBandedPlanet(ctx, w * 0.66, y, m * 0.2, ["#e6d3b4", "#c4956a", "#f3ecdf", "#b86a42", "#8d5a36", "#eadcc4", "#6e4428"], "#b23c30");
  });
  layer(aNep, () => {
    const y = qY(AT.neptune, p, h, 0.7, 9);
    drawBandedPlanet(ctx, w * 0.6, y, m * 0.15, ["#1d4e86", "#3d7ec4", "#163e74", "#7eb6e2", "#12325e", "#2a62a0"], "#e8f4ff");
  });
  layer(aHelio, () => drawHelio(ctx, w, h, time));
  layer(aVoy, () => {
    const y = qY(AT.voyager, p, h, 0.68, 8);
    drawVoyager(ctx, w * 0.64, y, Math.max(26, m * 0.05));
  });
  layer(aIce, () => drawIce(ctx, w, h, p, time));
  layer(aProx, () => {
    const y = qY(AT.proxima, p, h, 0.68, 7);
    drawProxima(ctx, w * 0.64, y, m * 0.075, time);
  });

  const bubble = fadeIn(p, AT.proxima, AT.bubble) * fadeOut(p, AT.orion, AT.arm);
  layer(bubble, () => {
    ctx.strokeStyle = "rgba(180, 160, 140, 0.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.55, m * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  });

  layer(aNeb, () => drawNebula(ctx, w, h, p, time));
  layer(aHole, () => drawHole(ctx, w, h, p, time, reduced));

  if (aStar > 0.75 && p > AT.helio && p < AT.dust && !reduced) {
    const u = (time * 0.07) % 1;
    if (u < 0.12) {
      const x0 = w * (0.25 + (Math.floor(time * 0.07) % 4) * 0.12);
      const y0 = h * 0.2 + (u / 0.12) * h * 0.35;
      ctx.strokeStyle = `rgba(255,255,255,${1 - u / 0.12})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 - 36, y0 + 14);
      ctx.stroke();
    }
  }
}

export const SkyCanvas = memo(function SkyCanvas({ visual }: { visual: RefObject<Visual> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const grain = document.createElement("canvas");
    grain.width = 128;
    grain.height = 128;
    const gctx = grain.getContext("2d");
    let pattern: CanvasPattern | null = null;
    if (gctx) {
      const img = gctx.createImageData(128, 128);
      const grit = mulberry32(0xa11ce);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 160 + grit() * 90;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 38;
      }
      gctx.putImageData(img, 0, 0);
      pattern = ctx.createPattern(grain, "repeat");
    }

    let frame = 0;
    let alive = true;

    const draw = (now: number) => {
      const visualNow = visual.current;
      const p = visualNow?.p ?? 0;
      const reduced = visualNow?.reduced ?? false;
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth > 900 ? 1.35 : 1.6);
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      const pw = Math.floor(w * dpr);
      const ph = Math.floor(h * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pal = sample(p);
      const glowY = h * 0.78;
      const g = ctx.createRadialGradient(w * 0.5, glowY, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.95);
      g.addColorStop(0, rgb(pal.hot));
      g.addColorStop(0.18, rgb(pal.mid));
      g.addColorStop(0.5, rgb(pal.bg));
      g.addColorStop(1, rgb(pal.bg));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const time = reduced ? 0 : now * 0.001;
      paintScenes(ctx, { w, h, p, time, reduced });

      const veil = ctx.createLinearGradient(0, 0, 0, h * 0.42);
      veil.addColorStop(0, "rgba(0,0,0,0.72)");
      veil.addColorStop(0.55, "rgba(0,0,0,0.28)");
      veil.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h * 0.42);

      const vg = ctx.createRadialGradient(w * 0.32, h * 0.36, mSafe(w, h) * 0.08, w * 0.4, h * 0.45, Math.max(w, h) * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0.08)");
      vg.addColorStop(0.55, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      if (pattern) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        if (!reduced) ctx.translate((time * 8) % 128, (time * 5) % 128);
        ctx.fillStyle = pattern;
        ctx.fillRect(-128, -128, w + 256, h + 256);
        ctx.restore();
      }
    };

    const loop = (now: number) => {
      if (!alive) return;
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) {
        alive = false;
        cancelAnimationFrame(frame);
      } else if (!alive) {
        alive = true;
        frame = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [visual]);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
});

function mSafe(w: number, h: number) {
  return Math.min(w, h);
}
