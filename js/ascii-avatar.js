/**
 * Renders the profile photo as ASCII art: samples the image onto a small
 * canvas, maps per-cell luminance to a density ramp, colors it with the
 * same dim->bright green duotone as the liquid background. Falls back to
 * the plain <img> if the canvas read fails (e.g. CORS).
 */
(function () {
  "use strict";

  const CONFIG = {
    cols: 72,
    ramp: " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    fontSizePx: 5.5,
    colorDim: [10, 40, 26],
    colorBright: [150, 255, 190],
    shadowLift: 0.12, // keeps dark facial detail (eyes/brows/mouth) from vanishing into the background
  };

  const img = document.getElementById("avatar-source");
  const pre = document.getElementById("ascii-avatar");
  if (!img || !pre) return;

  function measureCharAspect(fontSizePx) {
    const span = document.createElement("span");
    span.style.cssText = `position:absolute; visibility:hidden; white-space:pre; font-family:${getComputedStyle(pre).fontFamily}; font-size:${fontSizePx}px; line-height:1;`;
    span.textContent = "M".repeat(20);
    document.body.appendChild(span);
    const w = span.getBoundingClientRect().width / 20;
    document.body.removeChild(span);
    return w / fontSizePx; // char width / char height (line-height:1)
  }

  function render() {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    const charAspect = measureCharAspect(CONFIG.fontSizePx);
    const cols = CONFIG.cols;
    const rows = Math.max(1, Math.round(cols * (ih / iw) * charAspect));

    const canvas = document.createElement("canvas");
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, cols, rows);

    let data;
    try {
      data = ctx.getImageData(0, 0, cols, rows).data;
    } catch (e) {
      return; // tainted canvas — keep the plain <img> fallback
    }

    const ramp = CONFIG.ramp;
    const rampLen = ramp.length;
    const [dr, dg, db] = CONFIG.colorDim;
    const [br, bg, bb] = CONFIG.colorBright;
    const cellCount = cols * rows;

    // Per-cell luminance, then a percentile-based contrast stretch so the
    // face's actual tonal range (not the theoretical 0..255 range) fills
    // the ramp — otherwise a photo with a narrow range renders as mush.
    const lums = new Float32Array(cellCount);
    for (let c = 0; c < cellCount; c++) {
      const i = c * 4;
      lums[c] = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    }
    const sorted = Array.from(lums).sort((a, b) => a - b);
    const lo = sorted[Math.floor(cellCount * 0.03)];
    const hi = sorted[Math.floor(cellCount * 0.97)];
    const range = Math.max(0.05, hi - lo);

    let html = "";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const c = y * cols + x;
        const i = c * 4;
        const alpha = data[i + 3] / 255;
        let v = (lums[c] - lo) / range;
        v = Math.max(0, Math.min(1, v));
        // lift shadows a touch so eyes/brows/mouth stay visible instead of
        // crushing to the same "blank" as the background
        v = CONFIG.shadowLift + v * (1 - CONFIG.shadowLift);
        v *= alpha;

        const idx = Math.min(rampLen - 1, Math.floor(v * rampLen));
        const ch = ramp[idx];
        if (ch === " ") {
          html += " ";
          continue;
        }
        const r = Math.round(dr + (br - dr) * v);
        const g = Math.round(dg + (bg - dg) * v);
        const b = Math.round(db + (bb - db) * v);
        html += `<span style="color:rgb(${r},${g},${b})">${ch}</span>`;
      }
      html += "\n";
    }

    pre.innerHTML = html;
    pre.style.fontSize = CONFIG.fontSizePx + "px";
    pre.classList.add("ready");
    img.classList.add("ascii-replaced");
  }

  if (img.complete && img.naturalWidth) {
    render();
  } else {
    img.addEventListener("load", render);
  }
})();
