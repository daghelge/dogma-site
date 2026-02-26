const r = (a, b) => a + Math.random() * (b - a);
const e = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
const c = () => `hsl(${270 + r(-8, 8)} ${22 + r(-4, 8)}% ${31 + r(-6, 6)}%)`;

export function initContactMotion(root) {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const ls = [...root.querySelectorAll("[data-contact-letter]")];
  if (!ls.length || mq.matches) return;

  const s = ls.map((el) => ({
    el, v: 0, f: 0, t: 0, ss: 0, sd: r(3400, 7600), nm: r(500, 1800), nc: r(1200, 2800),
    ax: r(0.25, 1.05), ay: r(0.2, 0.8),
  }));
  let t0 = 0;

  const tick = (t) => {
    if (mq.matches) return;
    if (!t0) t0 = t;
    const dt = t - t0;
    for (const i of s) {
      if (dt >= i.nm) {
        i.f = i.v;
        i.t = Math.random() * 2 - 1;
        i.ss = dt;
        i.sd = r(3400, 7600);
        i.nm = dt + i.sd + r(900, 2400);
      }
      i.v = i.f + (i.t - i.f) * e(Math.min(1, Math.max(0, (dt - i.ss) / i.sd)));
      i.el.style.transform = `translate3d(${(i.v * i.ax).toFixed(2)}px,${(i.v * i.ay).toFixed(2)}px,0px)`;
      if (dt >= i.nc) {
        i.el.style.transition = `color ${r(3200, 6200).toFixed(0)}ms ease-in-out`;
        i.el.style.color = c();
        i.nc = dt + r(2600, 5600);
      }
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
