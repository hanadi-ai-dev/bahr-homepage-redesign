import { gsap } from 'gsap';

/** A bounded surface deformation, rather than a cursor follower. */
export function createRippleField(canvas: HTMLCanvasElement, reduced: boolean) {
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  const ctx = context;
  const surface = { x: 0, y: 0, energy: 0 };
  const xTo = gsap.quickTo(surface, 'x', { duration: 1.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(surface, 'y', { duration: 1.4, ease: 'power3.out' });
  const energyTo = gsap.quickTo(surface, 'energy', { duration: 1.8, ease: 'power3.out' });
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const color = getComputedStyle(canvas).color;
  let width = 0;
  let height = 0;
  let visible = true;
  let attached = false;
  let elapsed = 0;
  let previousTime = 0;
  let lastFrame = 0;

  function draw(time = 0) {
    if (time && time - lastFrame < 1 / 30) return;
    const delta = previousTime ? Math.min(time - previousTime, 0.06) : 0;
    previousTime = time;
    lastFrame = time;
    elapsed += reduced ? 0 : delta;
    ctx.clearRect(0, 0, width, height);
    const mobile = width < 700;
    const centerX = width * (mobile ? 0.61 : 0.68);
    const centerY = height * (mobile ? 0.46 : 0.48);
    const radius = Math.min(width * (mobile ? 0.62 : 0.37), height * 0.59);
    const count = mobile ? 24 : 34;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    for (let ring = 0; ring < count; ring++) {
      const progress = ring / (count - 1);
      const r = radius * (0.19 + progress * 0.87);
      ctx.globalAlpha = 0.10 + Math.sin(progress * Math.PI) * 0.38;
      ctx.beginPath();
      for (let step = 0; step <= 160; step++) {
        const angle = step / 160 * Math.PI * 2;
        const wave = Math.sin(angle * 3 + progress * 5 + elapsed * 0.18) * 0.035;
        const pull = Math.cos(angle) * surface.x + Math.sin(angle) * surface.y;
        const tension = pull * Math.sin(progress * Math.PI) * 0.08;
        const localRadius = r * (1 + wave + tension);
        const x = centerX + Math.cos(angle) * localRadius * 1.05;
        const y = centerY + Math.sin(angle) * localRadius * (0.81 + surface.energy * 0.018);
        if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function move(event: PointerEvent) {
    if (reduced || !pointer.matches) return;
    const rect = canvas.getBoundingClientRect();
    xTo((event.clientX - rect.left) / rect.width * 2 - 1);
    yTo((event.clientY - rect.top) / rect.height * 2 - 1);
    energyTo(1);
  }
  function reset() { xTo(0); yTo(0); energyTo(0); }
  function sync() {
    const shouldRun = visible && !document.hidden && !reduced;
    if (shouldRun && !attached) { previousTime = 0; gsap.ticker.add(draw); attached = true; }
    if (!shouldRun && attached) { gsap.ticker.remove(draw); attached = false; }
  }
  const host = canvas.closest<HTMLElement>('section') ?? canvas;
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  const resizeObserver = new ResizeObserver(resize);
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  host.addEventListener('pointermove', move, { passive: true });
  host.addEventListener('pointerleave', reset);
  document.addEventListener('visibilitychange', sync);
  resize();
  sync();
  return () => {
    observer.disconnect();
    resizeObserver.disconnect();
    gsap.ticker.remove(draw);
    xTo.tween.kill(); yTo.tween.kill(); energyTo.tween.kill();
    host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerleave', reset);
    document.removeEventListener('visibilitychange', sync);
  };
}
