/**
 * ASCII Liquid Pixel Background
 * Canvas2D, no WebGL: a grid of monospace characters whose glyph and
 * brightness are driven by a flowing, domain-warped noise field, plus
 * mouse ripples. Pure JS noise (no external libs), safe on any GPU/driver
 * since it never touches a WebGL context.
 */
(function () {
  "use strict";

  const CONFIG = {
    cellSize: 15,          // px per character cell
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
    ramp: " .:-=+*#%@",   // dark -> light density
    speed: 0.4,            // flow speed
    scale: 0.012,          // noise frequency (lower = larger blobs)
    warp: 3.0,             // domain-warp strength
    rippleStrength: 1.1,
    fps: 30,                // throttle for consistent perf
    colorDim: [10, 40, 26],     // rgb, low-density glyph color
    colorBright: [120, 255, 170], // rgb, high-density glyph color
    background: "rgb(4, 8, 6)",
    scanlineOpacity: 0.035,
  };

  const canvas = document.getElementById("ascii-liquid-bg");
  const ctx = canvas.getContext("2d");

  // ---- tiny 2D simplex noise (public-domain style, self-contained) ----
  const GRAD = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];
  const PERM = new Uint8Array(512);
  (function seedPerm(seed) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed >>> 0 || 1;
    const rand = () => {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = p[i]; p[i] = p[j]; p[j] = t;
    }
    for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
  })(1337);

  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  function simplex2(xin, yin) {
    let n0, n1, n2;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t, Y0 = j - t;
    const x0 = xin - X0, y0 = yin - Y0;
    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    const g0 = GRAD[PERM[ii + PERM[jj]] & 7];
    const g1 = GRAD[PERM[ii + i1 + PERM[jj + j1]] & 7];
    const g2 = GRAD[PERM[ii + 1 + PERM[jj + 1]] & 7];

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * (g0[0] * x0 + g0[1] * y0));
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * (g1[0] * x1 + g1[1] * y1));
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * (g2[0] * x2 + g2[1] * y2));

    return 70 * (n0 + n1 + n2); // roughly -1..1
  }

  function fbm(x, y) {
    let total = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < 3; i++) {
      total += simplex2(x * freq, y * freq) * amp;
      freq *= 2;
      amp *= 0.5;
    }
    return total;
  }

  // ---- layout ----
  let cols = 0, rows = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CONFIG.cellSize) + 1;
    rows = Math.ceil(h / CONFIG.cellSize) + 1;
    ctx.font = `${CONFIG.cellSize}px ${CONFIG.fontFamily}`;
    ctx.textBaseline = "top";
  }

  window.addEventListener("resize", resize);
  resize();

  // ---- mouse / touch ----
  // Ripple strength ramps up with how far the pointer has actually moved
  // (not just "did it move"), and eases toward that target over time, so a
  // 1px jitter doesn't snap the ripple to full strength instantly.
  const MOVE_ACTIVATE_PX = 90; // cumulative movement to reach full ripple
  const mouse = { x: -9999, y: -9999, lastX: null, lastY: null, activity: 0, targetActivity: 0 };
  function setMouse(clientX, clientY) {
    if (mouse.lastX !== null) {
      const dx = clientX - mouse.lastX;
      const dy = clientY - mouse.lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouse.targetActivity = Math.min(1, mouse.targetActivity + dist / MOVE_ACTIVATE_PX);
    }
    mouse.lastX = clientX;
    mouse.lastY = clientY;
    mouse.x = clientX;
    mouse.y = clientY;
  }
  window.addEventListener("pointermove", (e) => setMouse(e.clientX, e.clientY));
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ramp = CONFIG.ramp;
  const rampLen = ramp.length;
  const [dr, dg, db] = CONFIG.colorDim;
  const [br, bg, bb] = CONFIG.colorBright;

  let t = 0;
  let lastFrame = performance.now();
  const frameInterval = 1000 / CONFIG.fps;
  let accumulator = 0;

  function render() {
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const cell = CONFIG.cellSize;
    const scale = CONFIG.scale;
    const flow = t * CONFIG.speed;

    for (let row = 0; row < rows; row++) {
      const py = row * cell;
      const ny = py * scale;
      for (let col = 0; col < cols; col++) {
        const px = col * cell;
        const nx = px * scale;

        const wx = fbm(nx + flow * 0.3, ny - flow * 0.2);
        const wy = fbm(nx - flow * 0.25 + 4.7, ny + flow * 0.3 + 1.9);
        let field = fbm(nx + wx * CONFIG.warp * 0.15, ny + wy * CONFIG.warp * 0.15 + flow * 0.15);

        if (mouse.activity > 0.01) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ripple =
            Math.sin(dist * 0.08 - t * 4.0) *
            Math.exp(-dist * 0.006) *
            mouse.activity *
            CONFIG.rippleStrength;
          field += ripple;
        }

        let v = Math.max(0, Math.min(1, (field + 1) * 0.5));
        v = Math.pow(v, 1.7); // more contrast: clearer voids, punchier peaks
        if (v < 0.22) continue; // skip near-empty cells, saves draw calls

        const charIdx = Math.min(rampLen - 1, Math.floor(v * rampLen));
        const ch = ramp[charIdx];
        if (ch === " ") continue;

        const r = Math.round(dr + (br - dr) * v);
        const g = Math.round(dg + (bg - dg) * v);
        const b = Math.round(db + (bb - db) * v);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(ch, px, py);
      }
    }

    // subtle scanlines for a terminal/CRT feel
    if (CONFIG.scanlineOpacity > 0) {
      ctx.fillStyle = `rgba(0,0,0,${CONFIG.scanlineOpacity})`;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
    }
  }

  function frame(now) {
    const dt = now - lastFrame;
    lastFrame = now;
    accumulator += dt;

    mouse.targetActivity = Math.max(0, mouse.targetActivity - dt * 0.0005);
    const ease = 1 - Math.exp(-dt / 140); // smooth rise/fall, ~140ms time constant
    mouse.activity += (mouse.targetActivity - mouse.activity) * ease;

    if (accumulator >= frameInterval) {
      t += (prefersReducedMotion ? 0.15 : 1.0) * (accumulator / 1000);
      accumulator = 0;
      render();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
