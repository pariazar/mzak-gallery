"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const PAINT_SRC = "/covers/paint.jpeg";
/** Native pixel size of paint.jpeg */
const IMG_W = 704;
const IMG_H = 1495;

const STAGES = [
  { at: 0, label: "01 · Blank paper", copy: "Empty cotton. No mark yet." },
  { at: 0.08, label: "02 · Contours", copy: "Her true outline begins to appear." },
  { at: 0.22, label: "03 · Pencil study", copy: "Eyes, lips, freckles — the face is found." },
  { at: 0.4, label: "04 · First color", copy: "Brush finds skin and light." },
  { at: 0.58, label: "05 · Building form", copy: "Pink feathers bloom around her." },
  { at: 0.78, label: "06 · Detail", copy: "The portrait comes into focus." },
  { at: 0.92, label: "07 · Complete", copy: "Behind closed eyes, a universe lives…" },
];

type Stroke = { x: number; y: number; rx: number; ry: number; rot: number };

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dw: number,
  dh: number,
  srcW: number,
  srcH: number,
) {
  const scale = Math.max(dw / srcW, dh / srcH);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (srcW - sw) / 2;
  // Bias slightly upward so the face stays centered in crop
  const sy = Math.max(0, (srcH - sh) * 0.22);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
}

/** Sobel pencil sketch from the real portrait — exact facial lines. */
function createPencilSketch(
  img: HTMLImageElement,
  w: number,
  h: number,
): HTMLCanvasElement {
  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  const sctx = src.getContext("2d", { willReadFrequently: true })!;
  drawImageCover(sctx, img, w, h, img.naturalWidth, img.naturalHeight);

  const { data } = sctx.getImageData(0, 0, w, h);
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] =
      data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114;
  }

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d")!;
  const imgData = octx.createImageData(w, h);
  const d = imgData.data;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx =
        -gray[i - w - 1] -
        2 * gray[i - 1] -
        gray[i + w - 1] +
        gray[i - w + 1] +
        2 * gray[i + 1] +
        gray[i + w + 1];
      const gy =
        -gray[i - w - 1] -
        2 * gray[i - w] -
        gray[i - w + 1] +
        gray[i + w - 1] +
        2 * gray[i + w] +
        gray[i + w + 1];
      const mag = Math.sqrt(gx * gx + gy * gy);
      // Paper white with dark portrait contours
      const line = mag > 22 ? Math.max(20, 255 - mag * 1.65) : 255;
      const o = i * 4;
      d[o] = d[o + 1] = d[o + 2] = line;
      d[o + 3] = 255;
    }
  }
  octx.putImageData(imgData, 0, 0);
  return out;
}

/** Face-first brush stamps for color reveal. */
function buildStrokes(w: number, h: number, count: number): Stroke[] {
  const strokes: Stroke[] = [];
  const faceX = w * 0.5;
  const faceY = h * 0.32;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const spread = Math.pow(t, 0.55);
    const angle = (i * 2.399 + t * 9) % (Math.PI * 2);
    const radius = spread * Math.max(w, h) * 0.7;
    const jx = Math.sin(i * 19.1) * 18;
    const jy = Math.cos(i * 13.7) * 16;
    strokes.push({
      x: faceX + Math.cos(angle) * radius * (0.5 + t * 0.75) + jx,
      y: faceY + Math.sin(angle) * radius * 0.95 + jy,
      rx: 14 + (1 - t) * 28 + (i % 4) * 6,
      ry: 5 + (1 - t) * 12 + (i % 3) * 3,
      rot: angle * 0.4 + (i % 5) * 0.15,
    });
  }

  for (let i = 0; i < 96; i++) {
    const col = i % 8;
    const row = Math.floor(i / 8);
    strokes.push({
      x: ((col + 0.5) / 8) * w,
      y: ((row + 0.5) / 12) * h,
      rx: w / 7,
      ry: h / 11,
      rot: 0.1,
    });
  }
  return strokes;
}

/**
 * Blank paper → real facial pencil contours (from paint.jpeg edges)
 * → brush-painted color until the portrait is complete.
 */
export function ScrollPainting() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      let strokes: Stroke[] = [];
      let img: HTMLImageElement | null = null;
      let sketch: HTMLCanvasElement | null = null;
      let ready = false;
      let lastCount = 0;
      let cssW = 0;
      let cssH = 0;
      let dpr = 1;
      const state = { progress: 0 };

      const maskCanvas = document.createElement("canvas");
      const maskCtx = maskCanvas.getContext("2d")!;
      const layerCanvas = document.createElement("canvas");
      const layerCtx = layerCanvas.getContext("2d")!;
      const sketchMaskCanvas = document.createElement("canvas");
      const sketchMaskCtx = sketchMaskCanvas.getContext("2d")!;
      let lastSketchCount = 0;

      const paperFill = () => {
        const g = ctx.createLinearGradient(0, 0, cssW, cssH);
        g.addColorStop(0, "#f3ebe0");
        g.addColorStop(0.5, "#e9dfd0");
        g.addColorStop(1, "#ddd2c0");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, cssW, cssH);
        ctx.fillStyle = "rgba(70,50,30,0.03)";
        for (let i = 0; i < 220; i++) {
          ctx.fillRect((i * 97) % cssW, (i * 53) % cssH, 1.1, 1.1);
        }
      };

      const resetMask = (
        mctx: CanvasRenderingContext2D,
        mcanvas: HTMLCanvasElement,
      ) => {
        mctx.setTransform(1, 0, 0, 1, 0, 0);
        mctx.clearRect(0, 0, mcanvas.width, mcanvas.height);
        mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const stamp = (
        mctx: CanvasRenderingContext2D,
        from: number,
        to: number,
        scale = 1,
      ) => {
        mctx.fillStyle = "#fff";
        for (let i = from; i < to; i++) {
          const s = strokes[i];
          mctx.save();
          mctx.translate(s.x, s.y);
          mctx.rotate(s.rot);
          mctx.beginPath();
          mctx.ellipse(0, 0, s.rx * scale, s.ry * scale, 0, 0, Math.PI * 2);
          mctx.fill();
          mctx.globalAlpha = 0.3;
          mctx.beginPath();
          mctx.ellipse(
            0,
            0,
            s.rx * scale * 1.4,
            s.ry * scale * 1.4,
            0,
            0,
            Math.PI * 2,
          );
          mctx.fill();
          mctx.restore();
          mctx.globalAlpha = 1;
        }
      };

      const compositeMasked = (
        source: CanvasImageSource,
        mask: HTMLCanvasElement,
      ) => {
        layerCtx.setTransform(1, 0, 0, 1, 0, 0);
        layerCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
        layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (source instanceof HTMLCanvasElement) {
          layerCtx.drawImage(source, 0, 0, cssW, cssH);
        } else if (img) {
          drawImageCover(
            layerCtx,
            source,
            cssW,
            cssH,
            img.naturalWidth,
            img.naturalHeight,
          );
        }
        layerCtx.globalCompositeOperation = "destination-in";
        layerCtx.setTransform(1, 0, 0, 1, 0, 0);
        layerCtx.drawImage(mask, 0, 0);
        layerCtx.globalCompositeOperation = "source-over";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(layerCanvas, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const sizeCanvas = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        cssW = Math.max(1, Math.floor(rect.width));
        cssH = Math.max(1, Math.floor(rect.height));

        for (const c of [canvas, maskCanvas, layerCanvas, sketchMaskCanvas]) {
          c.width = Math.floor(cssW * dpr);
          c.height = Math.floor(cssH * dpr);
        }
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        strokes = buildStrokes(cssW, cssH, 280);
        lastCount = 0;
        lastSketchCount = 0;
        resetMask(maskCtx, maskCanvas);
        resetMask(sketchMaskCtx, sketchMaskCanvas);

        if (img && ready) {
          // Rebuild sketch at display size for sharp facial lines
          const sw = Math.min(cssW, 520);
          const sh = Math.round(sw * (IMG_H / IMG_W));
          sketch = createPencilSketch(img, sw, sh);
        }
        paint(state.progress);
      };

      const paint = (progress: number) => {
        if (!cssW || !cssH) return;
        paperFill();
        if (!img || !ready || !sketch) return;

        // —— Pencil phase: reveal real facial contours ——
        const sketchStart = 0.04;
        const sketchEnd = 0.36;
        const sketchP = Math.max(
          0,
          Math.min(1, (progress - sketchStart) / (sketchEnd - sketchStart)),
        );
        const sketchCount = Math.floor(Math.pow(sketchP, 0.75) * strokes.length);

        if (sketchCount < lastSketchCount) {
          resetMask(sketchMaskCtx, sketchMaskCanvas);
          stamp(sketchMaskCtx, 0, sketchCount, 0.85);
        } else if (sketchCount > lastSketchCount) {
          stamp(sketchMaskCtx, lastSketchCount, sketchCount, 0.85);
        }
        lastSketchCount = sketchCount;

        if (sketchCount > 0) {
          // Draw sketch with multiply so lines sit on paper
          layerCtx.setTransform(1, 0, 0, 1, 0, 0);
          layerCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
          layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          layerCtx.fillStyle = "#fff";
          layerCtx.fillRect(0, 0, cssW, cssH);
          layerCtx.drawImage(sketch, 0, 0, cssW, cssH);
          layerCtx.globalCompositeOperation = "destination-in";
          layerCtx.setTransform(1, 0, 0, 1, 0, 0);
          layerCtx.drawImage(sketchMaskCanvas, 0, 0);
          layerCtx.globalCompositeOperation = "source-over";

          ctx.globalCompositeOperation = "multiply";
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.globalAlpha = progress < 0.55 ? 1 : Math.max(0.08, 1 - (progress - 0.55) * 2.2);
          ctx.drawImage(layerCanvas, 0, 0);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // Soft full sketch peek near mid pencil stage
        if (progress > 0.2 && progress < 0.45) {
          ctx.save();
          ctx.globalAlpha = Math.min(0.2, (progress - 0.2) * 0.6);
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(sketch, 0, 0, cssW, cssH);
          ctx.restore();
        }

        // —— Color paint phase ——
        const paintStart = 0.32;
        const paintEnd = 0.95;
        const paintP = Math.max(
          0,
          Math.min(1, (progress - paintStart) / (paintEnd - paintStart)),
        );
        const count = Math.floor(Math.pow(paintP, 0.8) * strokes.length);

        if (count < lastCount) {
          resetMask(maskCtx, maskCanvas);
          stamp(maskCtx, 0, count, 1);
        } else if (count > lastCount) {
          stamp(maskCtx, lastCount, count, 1);
        }
        lastCount = count;

        if (count > 0) {
          compositeMasked(img, maskCanvas);
          if (brushRef.current) {
            const s = strokes[Math.min(count - 1, strokes.length - 1)];
            gsap.set(brushRef.current, {
              opacity: paintP < 0.98 ? 1 : 0,
              left: s.x,
              top: s.y,
              rotate: (s.rot * 180) / Math.PI,
            });
          }
        }
      };

      const setStage = (progress: number) => {
        let idx = 0;
        for (let i = 0; i < STAGES.length; i++) {
          if (progress >= STAGES[i].at) idx = i;
        }
        if (stageRef.current) stageRef.current.textContent = STAGES[idx].label;
        if (copyRef.current) copyRef.current.textContent = STAGES[idx].copy;
        if (progressRef.current) {
          progressRef.current.style.width = `${Math.round(progress * 100)}%`;
        }
      };

      img = new Image();
      img.src = PAINT_SRC;
      img.onload = () => {
        ready = true;
        sizeCanvas();
        if (reducedMotion) {
          state.progress = 1;
          // Full final image
          paperFill();
          drawImageCover(
            ctx,
            img!,
            cssW,
            cssH,
            img!.naturalWidth,
            img!.naturalHeight,
          );
          setStage(1);
          if (brushRef.current) gsap.set(brushRef.current, { opacity: 0 });
        }
      };

      sizeCanvas();
      const onResize = () => sizeCanvas();
      window.addEventListener("resize", onResize);

      if (reducedMotion) {
        return () => window.removeEventListener("resize", onResize);
      }

      const proxy = { p: 0 };
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=560%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            state.progress = self.progress;
            setStage(self.progress);
            paint(self.progress);
          },
        },
      }).to(proxy, { p: 1, duration: 1 });

      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === root) st.kill();
        });
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      className="relative z-10 bg-[#1a1410]"
      aria-label="Scroll to draw the painting"
    >
      <div className="flex h-svh flex-col text-[#f3ebe3]">
        <div className="container-x flex items-end justify-between gap-6 pt-24 pb-3 md:pt-28">
          <div>
            <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#f3ebe3]/55">
              Scroll to draw
            </p>
            <h2 className="font-display text-3xl italic md:text-4xl">
              From blank paper to portrait
            </h2>
          </div>
          <p
            ref={stageRef}
            className="hidden text-[0.72rem] uppercase tracking-[0.18em] text-[#e8b4a0] md:block"
          >
            {STAGES[0].label}
          </p>
        </div>

        <div className="relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-[var(--gutter)] py-2">
          <div className="relative w-full max-w-full">
            <div
              className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(255,200,140,0.18),transparent_65%)]"
              aria-hidden="true"
            />

            <div
              className="relative mx-auto overflow-hidden rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-[#c9a66b]/35"
              style={{
                width: "min(100%, calc(66svh * 704 / 1495))",
                aspectRatio: `${IMG_W} / ${IMG_H}`,
              }}
            >
              <div className="relative h-full w-full bg-[#e9dfd0]">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                />
                <div
                  ref={brushRef}
                  className="pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0"
                  aria-hidden="true"
                >
                  <span className="block h-2.5 w-7 rounded-full bg-[#c43c2e]/9 shadow-[0_0_12px_rgba(196,60,46,0.55)]" />
                </div>
              </div>
            </div>

            <p className="mt-4 text-center font-display text-sm italic text-[#f3ebe3]/45">
              Behind closed eyes, a universe lives…
            </p>
          </div>
        </div>

        <div className="container-x pb-8 pt-1">
          <p
            ref={copyRef}
            className="min-h-[1.5em] font-display text-xl italic text-[#f3ebe3]/85 md:text-2xl"
          >
            {STAGES[0].copy}
          </p>
          <div className="mt-4 h-px w-full overflow-hidden bg-[#f3ebe3]/15">
            <div
              ref={progressRef}
              className="h-full bg-[linear-gradient(90deg,#c9a66b,#c43c2e,#e8b4a0)]"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
