const r = (a, b) => a + Math.random() * (b - a);
const e = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
const c = () => `hsl(272 30% ${(79 + r(-4, 4)).toFixed(1)}%)`;

export function initLogoMotion(root) {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const ps = [...root.querySelectorAll("[data-letter] path")];
  if (!ps.length || mq.matches) return;

  const s = ps.map((el) => {
    const x = el.parentElement && el.parentElement.dataset.motion === "x";
    return {
      el, x, a: x ? r(2.2, 4) : r(1.8, 3), v: 0, f: 0, t: 0, ss: 0,
      sd: r(4200, 9000), nm: 700 + r(300, 1400), nc: 2300 + r(0, 1800),
    };
  });

  const stop = () => {
    for (const i of s) {
      i.el.style.transition = "";
      i.el.style.fill = "#cabad7";
      i.el.style.transform = "translate3d(0px,0px,0px)";
    }
  };
  const on = (m) => (m.matches ?? mq.matches) && stop();
  mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener && mq.addListener(on);

  let t0 = 0;
  const hold = 700;
  const fade = 2200;

  const tick = (t) => {
    if (mq.matches) return;
    if (!t0) t0 = t;
    const dt = t - t0;
    const g = dt < hold ? 0 : Math.min(1, (dt - hold) / fade);

    for (const i of s) {
      if (dt >= i.nm) {
        i.f = i.v;
        i.t = (Math.random() * 2 - 1) * i.a;
        i.ss = dt;
        i.sd = r(4200, 9000);
        i.nm = dt + i.sd + r(900, 2600);
      }
      i.v = i.f + (i.t - i.f) * e(Math.min(1, Math.max(0, (dt - i.ss) / i.sd)));
      const d = (i.v * g).toFixed(2);
      i.el.style.transform = i.x ? `translate3d(${d}px,0px,0px)` : `translate3d(0px,${d}px,0px)`;

      if (dt >= i.nc) {
        i.el.style.transition = `fill ${r(3000, 6000).toFixed(0)}ms ease-in-out`;
        i.el.style.fill = c();
        i.nc = dt + r(2800, 5600);
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
