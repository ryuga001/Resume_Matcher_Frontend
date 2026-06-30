// ── Workflow canvas engine ──────────────────────────────────────────────────
// Framework-free 2D drawing. `drawWorkflow` is called every frame with the
// current scroll progress (0..1), a continuously-rising `time` (ms) for living
// motion, and the logical canvas size. It paints four cross-faded "stages" that
// illustrate the real product flow: upload → paste JD → analysis → result.
//
// No React, no DOM, no module state — everything derives from the args so the
// frame is fully determined by (progress, time). That keeps scrubbing perfectly
// reversible as the user scrolls up and down.

import {
  WF_COLORS as C,
  WF_RGBA as R,
  WORKFLOW_STAGES,
  WF_TRANSITION as TR,
  RESUME_SKILLS,
  MATCHED_SKILLS,
  MISSING_SKILLS,
  FINAL_SCORE,
  TAILORED_SCORE,
} from "./constants";

// ── tiny math ────────────────────────────────────────────────────────────────
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0 || 1));
  return t * t * (3 - 2 * t);
};

// ── layout ────────────────────────────────────────────────────────────────────
interface Layout {
  W: number;
  H: number;
  cx: number;
  cy: number;
  docW: number;
  docH: number;
  unit: number; // responsive scale unit
}

function computeLayout(W: number, H: number): Layout {
  const unit = Math.max(0.7, Math.min(W / 1100, H / 760, 1.3));
  const docW = Math.max(210, Math.min(W * 0.32, 360));
  return {
    W,
    H,
    cx: W / 2,
    cy: H * 0.5,
    docW,
    docH: docW * 1.3,
    unit,
  };
}

// ── primitives ─────────────────────────────────────────────────────────────────
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, rad);
  } else {
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }
}

function softShadow(ctx: CanvasRenderingContext2D, blur: number, dy: number, alpha: number) {
  ctx.shadowColor = `rgba(58,48,42,${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = dy;
}
function noShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

/** A paper document: header band, folded corner, gray text lines. */
function drawDoc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: {
    headerLabel?: string;
    lines?: number;
    reveal?: number;       // 0..1 fraction of lines drawn (typewriter)
    highlight?: number[];  // indices of lines to box in the highlight colour
    highlightK?: number;   // 0..1 reveal of highlights
    accent?: string;       // header colour
    shadow?: number;       // shadow alpha
    hl?: (a: number) => string; // highlight colour fn (default primary)
  } = {}
) {
  const {
    headerLabel,
    lines = 6,
    reveal = 1,
    highlight = [],
    highlightK = 0,
    accent = C.primary,
    shadow = 0.1,
    hl = R.primary,
  } = opts;
  const r = 12;

  // body
  if (shadow > 0) softShadow(ctx, 26, 16, shadow);
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = C.white;
  ctx.fill();
  noShadow(ctx);

  // header band
  rr(ctx, x, y, w, Math.max(18, h * 0.12), r);
  ctx.fillStyle = accent;
  ctx.fill();
  // square off header bottom corners
  ctx.fillStyle = accent;
  ctx.fillRect(x, y + Math.max(18, h * 0.12) - r, w, r);
  rr(ctx, x, y, w, h, r); // reclip body edge with stroke
  ctx.lineWidth = 1;
  ctx.strokeStyle = R.ink(0.6);
  ctx.stroke();

  if (headerLabel) {
    ctx.fillStyle = R.white(0.92);
    ctx.font = `700 ${Math.round(w * 0.052)}px "Playfair Display", Georgia, serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(headerLabel, x + w * 0.08, y + Math.max(18, h * 0.12) / 2 + 1);
  }

  // text lines
  const padX = w * 0.1;
  const top = y + Math.max(18, h * 0.12) + h * 0.1;
  const lineGap = (h - (top - y) - h * 0.08) / lines;
  const lh = Math.max(4, lineGap * 0.42);
  const widths = [0.82, 0.66, 0.9, 0.55, 0.78, 0.7, 0.86, 0.6, 0.74, 0.5];
  const shown = reveal * lines;

  for (let i = 0; i < lines; i++) {
    const lineProg = clamp01(shown - i);
    if (lineProg <= 0) break;
    const ly = top + i * lineGap;
    const lw = (w - padX * 2) * widths[i % widths.length] * lineProg;

    // highlight backing
    if (highlight.includes(i) && highlightK > 0) {
      const hk = clamp01(highlightK * 2 - highlight.indexOf(i) * 0.5);
      if (hk > 0) {
        rr(ctx, x + padX - 5, ly - lh * 0.9, (w - padX * 2) * widths[i % widths.length] + 10, lh * 2.6, 4);
        ctx.fillStyle = hl(0.16 * hk);
        ctx.fill();
      }
    }

    rr(ctx, x + padX, ly, lw, lh, lh / 2);
    ctx.fillStyle = highlight.includes(i) && highlightK > 0.2 ? hl(0.85) : R.ink(0.95);
    ctx.fill();
  }
}

/** A pill chip with measured text. Returns nothing. */
function drawChip(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  text: string,
  bg: string,
  fg: string,
  scale: number,
  fontPx: number
) {
  if (scale <= 0.01) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.font = `700 ${fontPx}px -apple-system, system-ui, "Segoe UI", sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const tw = ctx.measureText(text).width;
  const padX = fontPx * 0.85;
  const w = tw + padX * 2;
  const h = fontPx * 2;
  softShadow(ctx, 12, 5, 0.08 * scale);
  rr(ctx, -w / 2, -h / 2, w, h, h / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = fg;
  ctx.fillText(text, -w / 2 + padX, 1);
  ctx.restore();
}

/** Circular score gauge. value 0..1. */
function drawGauge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  value: number,
  color: string,
  display: number
) {
  const lw = Math.max(8, radius * 0.13);
  const start = -Math.PI / 2;
  const end = start + value * Math.PI * 2;

  // track
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.lineWidth = lw;
  ctx.strokeStyle = C.track;
  ctx.lineCap = "round";
  ctx.stroke();

  // value arc
  if (value > 0.001) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, end);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();

    // glowing tip
    const tx = cx + Math.cos(end) * radius;
    const ty = cy + Math.sin(end) * radius;
    ctx.beginPath();
    ctx.arc(tx, ty, lw * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = color;
    softShadow(ctx, 16, 0, 0);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fill();
    noShadow(ctx);
  }

  // number
  ctx.fillStyle = C.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(radius * 0.7)}px "Playfair Display", Georgia, serif`;
  ctx.fillText(String(Math.round(display)), cx, cy - radius * 0.04);
  ctx.fillStyle = C.textFaint;
  ctx.font = `700 ${Math.round(radius * 0.18)}px -apple-system, system-ui, sans-serif`;
  ctx.fillText("MATCH SCORE", cx, cy + radius * 0.42);
}

function scoreColor(v: number): string {
  if (v >= 70) return C.green;
  if (v >= 50) return C.primary;
  return C.red;
}

// quadratic bezier point
function qbez(p0: number, p1: number, p2: number, t: number) {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

// ── stage presence (cross-fade envelope) ──────────────────────────────────────
function presence(p: number, start: number, end: number, isFirst: boolean, isLast: boolean) {
  const up = isFirst ? 1 : smoothstep(start, start + TR, p);
  const down = isLast ? 1 : 1 - smoothstep(end - TR, end, p);
  return Math.min(up, down);
}

// ── STAGE A — upload ───────────────────────────────────────────────────────────
function stageUpload(ctx: CanvasRenderingContext2D, L: Layout, t: number, time: number) {
  const { cx, cy, docW, docH } = L;
  const k1 = easeOut(smoothstep(0, 0.42, t)); // descend
  const k2 = smoothstep(0.44, 0.66, t);       // progress fill
  const k3 = smoothstep(0.64, 1, t);          // chips pop

  // drop zone
  const dzW = docW * 1.7;
  const dzH = docH * 1.18;
  ctx.save();
  ctx.setLineDash([10, 9]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = R.primary(0.4 - k3 * 0.25);
  rr(ctx, cx - dzW / 2, cy - dzH / 2, dzW, dzH, 18);
  ctx.stroke();
  ctx.restore();

  // descending document
  const docX = cx - docW / 2;
  const restY = cy - docH / 2;
  const docY = restY - (1 - k1) * (docH * 0.9 + 120);
  ctx.save();
  ctx.globalAlpha = clamp01(k1 * 1.2);
  drawDoc(ctx, docX, docY, docW, docH, {
    headerLabel: "RESUME.PDF",
    lines: 6,
    reveal: smoothstep(0.1, 0.5, t),
    shadow: 0.12 * k1,
  });
  ctx.restore();

  // progress bar
  if (k2 > 0) {
    const barW = docW;
    const barX = cx - barW / 2;
    const barY = restY + docH + 22;
    rr(ctx, barX, barY, barW, 7, 4);
    ctx.fillStyle = C.track;
    ctx.fill();
    rr(ctx, barX, barY, barW * easeOut(k2), 7, 4);
    ctx.fillStyle = C.primary;
    ctx.fill();
  }

  // skill chips popping out to the right
  if (k3 > 0) {
    const n = RESUME_SKILLS.length;
    const colX = cx + docW * 0.62;
    const startY = cy - docH * 0.42;
    const stepY = (docH * 0.84) / (n - 1);
    for (let i = 0; i < n; i++) {
      const local = easeOut(clamp01(k3 * (n + 1) - i));
      if (local <= 0) continue;
      const float = Math.sin(time / 620 + i) * 2;
      drawChip(
        ctx,
        colX + (1 - local) * -26 + 60,
        startY + i * stepY + float,
        RESUME_SKILLS[i],
        C.greenBg,
        C.greenText,
        local,
        12
      );
    }
  }
}

// ── STAGE B — job description ────────────────────────────────────────────────
function stageJD(ctx: CanvasRenderingContext2D, L: Layout, t: number) {
  const { cx, cy, docW, docH } = L;
  const slide = easeOut(smoothstep(0, 0.32, t));
  const reveal = smoothstep(0.22, 0.85, t);
  const hk = smoothstep(0.6, 0.96, t);

  const sw = docW * 0.82;   // small resume
  const sh = docH * 0.82;
  const gap = docW * 0.56;  // scales with doc size so panels never overlap

  // left: resume (already uploaded)
  const lx = cx - gap - sw / 2 + (1 - slide) * -40;
  const ly = cy - sh / 2;
  ctx.save();
  ctx.globalAlpha = 0.96;
  drawDoc(ctx, lx, ly, sw, sh, {
    headerLabel: "RESUME",
    lines: 6,
    reveal: 1,
    shadow: 0.1,
  });
  ctx.restore();

  // right: job description, text streaming in
  const jw = docW * 1.02;
  const jh = docH * 1.04;
  const jx = cx + gap - jw / 2 + (1 - slide) * 46;
  const jy = cy - jh / 2;
  ctx.save();
  ctx.globalAlpha = slide;
  drawDoc(ctx, jx, jy, jw, jh, {
    headerLabel: "JOB DESCRIPTION",
    lines: 9,
    reveal,
    highlight: [2, 5, 7],
    highlightK: hk,
    shadow: 0.12,
  });
  ctx.restore();
}

// ── STAGE C — analysis ───────────────────────────────────────────────────────
function stageAnalyze(ctx: CanvasRenderingContext2D, L: Layout, t: number, time: number) {
  const { cx, cy, docW, docH } = L;
  const sw = docW * 0.82;
  const sh = docH * 0.82;
  const gap = docW * 0.56;
  const leftCx = cx - gap;
  const rightCx = cx + gap;
  const lx = leftCx - sw / 2;
  const jx = rightCx - sw / 2;
  const py = cy - sh / 2;
  const intensity = smoothstep(0.05, 0.45, t);

  // both panels dimmed
  ctx.save();
  ctx.globalAlpha = 0.9;
  drawDoc(ctx, lx, py, sw, sh, { headerLabel: "RESUME", lines: 6, reveal: 1, shadow: 0.08 });
  drawDoc(ctx, jx, py, sw, sh, { headerLabel: "JOB DESC", lines: 7, reveal: 1, shadow: 0.08 });
  ctx.restore();

  // scanning beam over both panels
  const scan = (Math.sin(time / 900) * 0.5 + 0.5);
  const scanY = py + scan * sh;
  ctx.save();
  ctx.globalAlpha = intensity * 0.9;
  [lx, jx].forEach((bx) => {
    const grad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
    grad.addColorStop(0, R.primary(0));
    grad.addColorStop(0.5, R.primary(0.5));
    grad.addColorStop(1, R.primary(0));
    ctx.fillStyle = grad;
    ctx.fillRect(bx, scanY - 18, sw, 36);
    ctx.strokeStyle = R.primary(0.85);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx, scanY);
    ctx.lineTo(bx + sw, scanY);
    ctx.stroke();
  });
  ctx.restore();

  // particle streams from both panels into the core
  const N = 14;
  const ctrlY = cy - sh * 0.7;
  ctx.save();
  ctx.globalAlpha = intensity;
  for (let s = 0; s < 2; s++) {
    const srcX = s === 0 ? leftCx : rightCx;
    const srcY = py + sh * 0.5;
    for (let i = 0; i < N; i++) {
      const phase = ((time / 1600) + i / N + s * 0.5) % 1;
      const px = qbez(srcX, lerp(srcX, cx, 0.5), cx, phase);
      const py2 = qbez(srcY, ctrlY, cy, phase);
      const a = Math.sin(phase * Math.PI);
      ctx.beginPath();
      ctx.arc(px, py2, 2.4 * a + 0.6, 0, Math.PI * 2);
      ctx.fillStyle = R.primary(0.7 * a);
      ctx.fill();
    }
  }
  ctx.restore();

  // central core: pulsing rings + forming gauge arc
  const coreR = docW * 0.42;
  const pulse = (Math.sin(time / 520) * 0.5 + 0.5);
  ctx.save();
  ctx.globalAlpha = intensity;
  for (let i = 0; i < 3; i++) {
    const rad = coreR * (0.5 + i * 0.28) + pulse * 6;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.strokeStyle = R.primary(0.18 - i * 0.045);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  // forming arc teaser
  const arcVal = smoothstep(0.2, 1, t) * 0.78;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, -Math.PI / 2, -Math.PI / 2 + arcVal * Math.PI * 2);
  ctx.lineWidth = Math.max(7, coreR * 0.13);
  ctx.strokeStyle = C.primary;
  ctx.lineCap = "round";
  ctx.stroke();
  // core glyph
  ctx.fillStyle = C.primary;
  ctx.font = `700 ${Math.round(coreR * 0.5)}px "Playfair Display", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = intensity * (0.5 + pulse * 0.5);
  ctx.fillText("%", cx, cy + 1);
  ctx.restore();
}

// ── STAGE D — result ───────────────────────────────────────────────────────────
function stageResult(ctx: CanvasRenderingContext2D, L: Layout, t: number, time: number) {
  const { W, cx, cy, docW } = L;
  const scoreK = smoothstep(0, 0.55, t);
  const chipK = smoothstep(0.4, 1, t);
  const display = FINAL_SCORE * scoreK;
  const value = (FINAL_SCORE / 100) * scoreK;
  const col = scoreColor(display);

  const gaugeR = docW * 0.55;
  const gaugeCy = cy - docW * 0.22;
  drawGauge(ctx, cx, gaugeCy, gaugeR, value, col, display);

  // matched (left) and missing (right) columns of chips
  const baseY = gaugeCy + gaugeR + docW * 0.34;
  const colGap = Math.min(W * 0.18, 210);

  // column labels
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 13px -apple-system, system-ui, sans-serif`;
  ctx.globalAlpha = chipK;
  ctx.fillStyle = C.greenText;
  ctx.fillText("✓  MATCHED", cx - colGap, baseY - 30);
  ctx.fillStyle = C.redText;
  ctx.fillText("✕  GAPS TO CLOSE", cx + colGap, baseY - 30);
  ctx.globalAlpha = 1;

  const stepY = 36;
  MATCHED_SKILLS.forEach((s, i) => {
    const local = easeOut(clamp01(chipK * (MATCHED_SKILLS.length + 2) - i));
    const float = Math.sin(time / 700 + i) * 1.5;
    drawChip(ctx, cx - colGap, baseY + i * stepY + float, s, C.greenBg, C.greenText, local, 12);
  });
  MISSING_SKILLS.forEach((s, i) => {
    const local = easeOut(clamp01(chipK * (MISSING_SKILLS.length + 2) - i));
    const float = Math.sin(time / 700 + i + 2) * 1.5;
    drawChip(ctx, cx + colGap, baseY + i * stepY + float, s, C.redBg, C.redText, local, 12);
  });
}

// ── STAGE E — tailor / rebuild resume ─────────────────────────────────────────
function stageTailor(ctx: CanvasRenderingContext2D, L: Layout, t: number, time: number) {
  const { cx, cy, docW, docH } = L;
  const w = docW * 1.08;
  const h = docH * 1.06;
  const x = cx - w / 2;
  const y = cy - h / 2;

  const rewriteK = smoothstep(0.12, 0.6, t); // lines re-flow
  const insertK = smoothstep(0.42, 0.9, t);  // missing skills inserted (green)
  const scoreK = smoothstep(0.3, 0.92, t);   // score climbs 87 → 96
  const display = lerp(FINAL_SCORE, TAILORED_SCORE, scoreK);

  // missing-skill chips fly in from the right and merge into the doc
  MISSING_SKILLS.forEach((s, i) => {
    const local = clamp01(insertK * 1.6 - i * 0.35);
    if (local <= 0 || local >= 1) return;
    const fromX = cx + w * 0.95;
    const toX = cx + w * 0.1;
    const px = lerp(fromX, toX, easeInOut(local));
    const py = y + h * (0.6 + i * 0.12);
    const fade = Math.sin(local * Math.PI);
    ctx.save();
    ctx.globalAlpha = fade;
    drawChip(ctx, px, py, s, C.greenBg, C.greenText, 0.6 + 0.4 * fade, 12);
    ctx.restore();
  });

  // the resume, now with two newly-inserted (green) lines
  drawDoc(ctx, x, y, w, h, {
    headerLabel: "RESUME — TAILORED",
    lines: 8,
    reveal: 0.55 + 0.45 * rewriteK,
    highlight: [5, 7],
    highlightK: insertK,
    hl: R.green,
    accent: C.primary,
    shadow: 0.12,
  });

  // climbing score badge, pinned to the doc's top-right
  const bx = x + w - 6;
  const by = y - 2;
  ctx.save();
  ctx.translate(bx, by);
  const bw = 76;
  const bh = 34;
  softShadow(ctx, 14, 6, 0.12);
  rr(ctx, -bw, -bh / 2, bw, bh, bh / 2);
  ctx.fillStyle = C.green;
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = R.white(0.95);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 17px "Playfair Display", Georgia, serif`;
  ctx.fillText(`${Math.round(display)}%`, -bw / 2 - 6, 1);
  // up arrow
  ctx.font = `700 12px -apple-system, system-ui, sans-serif`;
  ctx.fillText("↑", -14, 0);
  ctx.restore();

  // sparkle accents around the doc while rewriting
  const sparkleA = Math.sin(t * Math.PI) * (1 - insertK * 0.4);
  if (sparkleA > 0.02) {
    const pts = [
      [x - 10, y + h * 0.2],
      [x + w + 8, y + h * 0.35],
      [x + w * 0.2, y - 12],
      [x + w * 0.85, y + h + 10],
    ];
    pts.forEach(([sx, sy], i) => {
      const tw = (Math.sin(time / 400 + i * 1.7) * 0.5 + 0.5) * sparkleA;
      const s = 3 + tw * 5;
      ctx.save();
      ctx.globalAlpha = tw;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sx - s, sy); ctx.lineTo(sx + s, sy);
      ctx.moveTo(sx, sy - s); ctx.lineTo(sx, sy + s);
      ctx.stroke();
      ctx.restore();
    });
  }
}

// ── master ───────────────────────────────────────────────────────────────────
export function drawWorkflow(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  progress: number,
  time: number
) {
  ctx.clearRect(0, 0, W, H);
  const L = computeLayout(W, H);
  const p = clamp01(progress);

  WORKFLOW_STAGES.forEach((st, i) => {
    const pres = presence(p, st.start, st.end, i === 0, i === WORKFLOW_STAGES.length - 1);
    if (pres <= 0.001) return;
    const t = clamp01((p - st.start) / (st.end - st.start));
    const s = 0.965 + 0.035 * pres;

    ctx.save();
    ctx.globalAlpha = pres;
    // settle-scale around the canvas centre
    ctx.translate(L.cx, L.cy);
    ctx.scale(s, s);
    ctx.translate(-L.cx, -L.cy);

    switch (st.key) {
      case "upload":  stageUpload(ctx, L, t, time); break;
      case "jd":      stageJD(ctx, L, t); break;
      case "analyze": stageAnalyze(ctx, L, t, time); break;
      case "result":  stageResult(ctx, L, t, time); break;
      case "tailor":  stageTailor(ctx, L, t, time); break;
    }
    ctx.restore();
  });
}

/** Which stage index is most present at progress p (for caption/step-rail sync). */
export function activeStage(p: number): number {
  const c = clamp01(p);
  for (let i = WORKFLOW_STAGES.length - 1; i >= 0; i--) {
    if (c >= WORKFLOW_STAGES[i].start) return i;
  }
  return 0;
}

export { easeInOut, easeOut, clamp01, lerp, smoothstep };
