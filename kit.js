// SwipeRefined shared behaviors. Link with <script src="kit.js" defer></script>
(function () {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function init() {
    // Sticky nav shadow
    const nav = document.querySelector('nav.sr-nav');
    if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

    // Staggered reveal
    const reveals = document.querySelectorAll('.reveal');
    if (reduce) { reveals.forEach(el => el.classList.add('in')); }
    else {
      const io = new IntersectionObserver((es) => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }), { threshold: 0.14 });
      reveals.forEach(el => io.observe(el));
    }

    // Animate score rings: <div class="ring" data-val="74" data-col="#F26B5B">
    //   <svg ...><circle class="ring-track".../><circle class="ring-fg".../></svg><span class="val">0</span>
    document.querySelectorAll('.ring[data-val]').forEach((ring) => {
      const fg = ring.querySelector('.ring-fg');
      const val = ring.querySelector('.val');
      const target = +ring.dataset.val;
      if (!fg) { if (val) val.textContent = target; return; }
      const r = +fg.getAttribute('r');
      const C = 2 * Math.PI * r;
      fg.style.strokeDasharray = C;
      fg.style.strokeDashoffset = C;
      if (ring.dataset.col) fg.setAttribute('stroke', ring.dataset.col);

      const run = () => {
        if (reduce) { fg.style.strokeDashoffset = C * (1 - target / 100); if (val) val.textContent = target; return; }
        fg.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,.61,.36,1)';
        requestAnimationFrame(() => fg.style.strokeDashoffset = C * (1 - target / 100));
        if (val) { let n = 0; const step = () => { n += 2; if (n >= target) { val.textContent = target; return; } val.textContent = n; requestAnimationFrame(step); }; setTimeout(step, 180); }
      };
      const vo = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { vo.unobserve(e.target); run(); } }), { threshold: 0.5 });
      vo.observe(ring);
    });

    // Animate horizontal bars: <div class="bar"><span style="--w:62%"></span></div>
    document.querySelectorAll('.bar > span[style*="--w"]').forEach((b) => {
      const w = getComputedStyle(b).getPropertyValue('--w').trim() || '0%';
      b.style.width = '0%';
      b.style.transition = 'width 1.1s cubic-bezier(.22,.61,.36,1)';
      const bo = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { bo.unobserve(e.target); requestAnimationFrame(() => b.style.width = reduce ? w : w); } }), { threshold: 0.4 });
      if (reduce) b.style.width = w; else bo.observe(b);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
