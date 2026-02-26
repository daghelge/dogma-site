const r = (a, b) => a + Math.random() * (b - a);
const e = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
const c = () => `hsl(${270 + r(-6, 6)} ${36 + r(-4, 6)}% ${78 + r(-6, 6)}%)`;

export function initLogoMotion(root) {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const ps = [...root.querySelectorAll("[data-letter] path")];
  if (!ps.length || mq.matches) return;

  const s = ps.map((el) => {
    const k = el.parentElement && el.parentElement.dataset.key;
    return {
      el, k, y: k === "d" || k === "g" || k === "a",
      ay: r(2.3, 3), vy: 0, fy: 0, ty: 0, yss: 0,
      ysd: r(3800, 8200), ynm: 700 + r(300, 1400), nc: 1900 + r(0, 1400),
    };
  });
  const og = { v: 0, f: 0, t: 0, ss: 0, sd: r(3600, 7600), nm: 700 + r(300, 1200), a: r(2.9, 4) };
  const mx = { v: 0, f: 0, t: 0, ss: 0, sd: r(3800, 8200), nm: 900 + r(500, 1500), a: r(2.8, 4) };

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
    if (dt >= og.nm) {
      og.f = og.v;
      og.t = (Math.random() * 2 - 1) * og.a;
      og.ss = dt;
      og.sd = r(3600, 7600);
      og.nm = dt + og.sd + r(800, 2200);
    }
    og.v = og.f + (og.t - og.f) * e(Math.min(1, Math.max(0, (dt - og.ss) / og.sd)));
    if (dt >= mx.nm) {
      mx.f = mx.v;
      mx.t = (Math.random() * 2 - 1) * mx.a;
      mx.ss = dt;
      mx.sd = r(3800, 8200);
      mx.nm = dt + mx.sd + r(1000, 2600);
    }
    mx.v = mx.f + (mx.t - mx.f) * e(Math.min(1, Math.max(0, (dt - mx.ss) / mx.sd)));

    for (const i of s) {
      if (i.y && dt >= i.ynm) {
        i.fy = i.vy;
        i.ty = (Math.random() * 2 - 1) * i.ay;
        i.yss = dt;
        i.ysd = r(3800, 8200);
        i.ynm = dt + i.ysd + r(900, 2200);
      }
      i.vy = i.fy + (i.ty - i.fy) * e(Math.min(1, Math.max(0, (dt - i.yss) / i.ysd)));
      const x = i.k === "o" || i.k === "g" ? og.v : i.k === "m" ? mx.v : 0;
      const y = i.y ? i.vy : 0;
      i.el.style.transform = `translate3d(${(x * g).toFixed(2)}px,${(y * g).toFixed(2)}px,0px)`;

      if (dt >= i.nc) {
        i.el.style.transition = `fill ${r(3000, 6000).toFixed(0)}ms ease-in-out`;
        i.el.style.fill = c();
        i.nc = dt + r(2600, 5200);
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
