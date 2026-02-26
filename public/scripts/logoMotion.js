const BASE = [202, 186, 215];
const rand = (a, b) => a + Math.random() * (b - a);

function tint(shift) {
  const next = BASE.map((c) =>
    shift < 0 ? c * (1 + shift) : c + (255 - c) * shift
  ).map((v) => Math.max(0, Math.min(255, Math.round(v))));
  return `#${next.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function initLogoMotion(root) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return;

  const letters = [...root.querySelectorAll("[data-letter] path")];
  const colorState = letters.map((el) => ({ el, next: rand(0, 2400) }));

  for (const el of letters) {
    const axis = el.parentElement?.dataset.motion;
    const amp = axis === "x" ? rand(1.8, 4) : rand(1.4, 3);
    const signed = Math.random() > 0.5 ? amp : -amp;
    el.style.setProperty(axis === "x" ? "--x" : "--y", `${signed.toFixed(2)}px`);
    el.style.setProperty("--dur", `${rand(10.5, 19).toFixed(2)}s`);
    el.style.setProperty("--delay", `${(-rand(0, 16)).toFixed(2)}s`);
    el.style.setProperty("--c", tint(rand(-0.04, 0.04)));
  }

  const frame = (t) => {
    for (const s of colorState) {
      if (t < s.next) continue;
      const dur = rand(3000, 6000);
      s.el.style.setProperty("--color-dur", `${dur.toFixed(0)}ms`);
      s.el.style.setProperty("--c", tint(rand(-0.04, 0.04)));
      s.next = t + rand(3200, 6400);
    }
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}
