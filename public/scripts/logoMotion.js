const BASE = [202, 186, 215];
const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const hex = (n) => n.toString(16).padStart(2, "0");

function tint(shift) {
  const n = BASE.map((c) => shift < 0 ? c * (1 + shift) : c + (255 - c) * shift)
    .map((v) => Math.max(0, Math.min(255, Math.round(v))));
  return `#${hex(n[0])}${hex(n[1])}${hex(n[2])}`;
}

export function initLogoMotion(root) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const paths = [...root.querySelectorAll("[data-letter] path")];
  if (!paths.length) return;
  if (mq.matches) return;

  const items = paths.map((el) => {
    const axis = el.parentElement?.dataset.motion === "x" ? "x" : "y";
    return {
      el,
      axis,
      amp: axis === "x" ? rand(1.2, 4) : rand(1, 3),
      spd: rand(0.00011, 0.00023),
      phase: rand(0, TAU),
      nextColor: rand(0, 2600),
    };
  });

  const stop = () => {
    for (const it of items) {
      it.el.style.transition = "";
      it.el.style.fill = "#cabad7";
      it.el.style.transform = "translate3d(0px,0px,0)";
    }
  };

  const onMotionPref = (e) => e.matches && stop();
  mq.addEventListener?.("change", onMotionPref);

  const tick = (t) => {
    if (mq.matches) return;
    for (const it of items) {
      const n = Math.sin(t * it.spd + it.phase) + 0.33 * Math.sin(t * it.spd * 0.47 + it.phase * 1.6);
      const d = it.amp * 0.58 * n;
      const x = it.axis === "x" ? d : 0;
      const y = it.axis === "y" ? d : 0;
      it.el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      if (t >= it.nextColor) {
        it.el.style.transition = `fill ${rand(3000, 6000).toFixed(0)}ms ease-in-out`;
        it.el.style.fill = tint(rand(-0.04, 0.04));
        it.nextColor = t + rand(3200, 6400);
      }
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
