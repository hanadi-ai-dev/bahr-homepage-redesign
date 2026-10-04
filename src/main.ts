import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createRippleField } from './ripple-field';

gsap.registerPlugin(ScrollTrigger);
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const motionButton = $<HTMLButtonElement>('.motion-toggle');
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
let manuallyPaused = false;
try { manuallyPaused = localStorage.getItem('bahr-motion') === 'paused'; } catch { /* Storage may be unavailable. */ }

// Build the same family of contour lines at three different scales.
const namespace = 'http://www.w3.org/2000/svg';
const serviceLines = $<SVGGElement>('.current-lines');
for (let i = 0; i < 22; i++) {
  const ellipse = document.createElementNS(namespace, 'ellipse');
  ellipse.setAttribute('cx', '250'); ellipse.setAttribute('cy', '250');
  ellipse.setAttribute('rx', String(60 + i * 8.5)); ellipse.setAttribute('ry', String(45 + i * 7.1));
  ellipse.setAttribute('stroke', 'currentColor'); ellipse.setAttribute('stroke-width', '.8');
  ellipse.setAttribute('transform', `rotate(${i * 1.2 - 13} 250 250)`);
  ellipse.setAttribute('opacity', String(.2 + Math.sin(i / 22 * Math.PI) * .6));
  serviceLines.append(ellipse);
}
const momentumLines = $<SVGGElement>('.momentum-lines');
for (let i = 0; i < 25; i++) {
  const path = document.createElementNS(namespace, 'path');
  const shift = i * 22;
  path.setAttribute('d', `M -100 ${850 - shift} C 400 ${1000 - shift}, 400 ${-300 + shift}, 800 ${50 + shift} S 1200 ${800 - shift}, 1500 ${-50 + shift}`);
  path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#242423');
  path.setAttribute('stroke-width', '.8');
  momentumLines.append(path);
}

const headerObserver = new IntersectionObserver(([entry]) => {
  $<HTMLElement>('.header').classList.toggle('is-scrolled', !entry.isIntersecting);
}, { rootMargin: '-100px 0px 0px 0px' });
headerObserver.observe($<HTMLElement>('.hero-topline'));

const menu = $<HTMLDialogElement>('#mobile-menu');
const menuToggle = $<HTMLButtonElement>('.menu-toggle');
const closeMenu = () => menu.close();
const openMenu = () => { menu.showModal(); menuToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
const onMenuClose = () => { menuToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuToggle.addEventListener('click', openMenu);
$<HTMLButtonElement>('.menu-close').addEventListener('click', closeMenu);
menu.addEventListener('close', onMenuClose);
const trapMenuFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;
  const controls = [...menu.querySelectorAll<HTMLElement>('button, a[href]')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
};
menu.addEventListener('keydown', trapMenuFocus);
const menuLinks = [...menu.querySelectorAll<HTMLAnchorElement>('a')];
const navigateMenu = (event: MouseEvent) => {
  event.preventDefault();
  const link = event.currentTarget as HTMLAnchorElement;
  closeMenu();
  const target = document.querySelector<HTMLElement>(link.hash);
  target?.scrollIntoView({ behavior: isReduced() ? 'instant' : 'smooth' });
  target?.setAttribute('tabindex', '-1');
  target?.focus({ preventScroll: true });
  history.replaceState(null, '', link.hash);
};
menuLinks.forEach(link => link.addEventListener('click', navigateMenu));
const menuBreakpoint = matchMedia('(min-width: 701px)');
const closeOnDesktop = () => { if (menuBreakpoint.matches && menu.open) closeMenu(); };
menuBreakpoint.addEventListener('change', closeOnDesktop);

const services = [...document.querySelectorAll<HTMLDetailsElement>('.current-item')];
function updateService(event: Event) {
  const selected = event.currentTarget as HTMLDetailsElement;
  if (!selected.open) return;
  services.forEach(item => { if (item !== selected) item.open = false; });
  const index = Number(selected.dataset.state);
  $<HTMLElement>('#current-number').textContent = `0${index + 1} / 03`;
  gsap.to(serviceLines, {
    rotation: index === 1 ? 65 : index === 2 ? -35 : 0,
    scaleX: index === 1 ? .65 : index === 2 ? 1.15 : 1,
    scaleY: index === 1 ? 1.15 : index === 2 ? .72 : 1,
    transformOrigin: '50% 50%', duration: isReduced() ? 0 : .85,
    ease: 'power3.inOut', overwrite: true,
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
services.forEach(item => item.addEventListener('toggle', updateService));

function isReduced() { return reducedQuery.matches || manuallyPaused; }
let cleanupMotion = () => {};
let firstEntrance = true;
function setupMotion() {
  cleanupMotion();
  const reduced = isReduced();
  document.documentElement.classList.toggle('motion-paused', reduced);
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.disabled = reducedQuery.matches;
  motionButton.title = reducedQuery.matches ? 'Reduced motion follows your device setting' : '';
  $<HTMLElement>('.motion-label').textContent = reducedQuery.matches ? 'Reduced motion' : reduced ? 'Resume motion' : 'Pause motion';
  $<HTMLElement>('.motion-icon').classList.toggle('is-paused', reduced);
  const fieldCleanup = createRippleField($<HTMLCanvasElement>('#ripple-field'), reduced);
  const media = gsap.matchMedia();
  const ctx = gsap.context(() => {
    gsap.to('.tide-fill', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    if (reduced) return;
    if (firstEntrance && (!location.hash || location.hash === '#top')) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
      intro.addLabel('zero', 0)
        .from('.header .wordmark', { y: -15, autoAlpha: 0, duration: .6 }, 'zero')
        .from('.hero-field', { scale: .4, autoAlpha: 0, duration: 1.8 }, 'zero+=.1')
        .from('.hero-line', { yPercent: 115, stagger: .14, duration: 1.35 }, 'zero+=.35')
        .from('.hero-side', { y: 20, autoAlpha: 0, duration: .8 }, 'zero+=.75')
        .from('.hero-bottom > *', { y: 20, autoAlpha: 0, stagger: .08, duration: .75 }, 'zero+=1');
    }
    gsap.from('.ripple-glyph i', { scale: .7, autoAlpha: 0, stagger: .12, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.idea', start: 'top 70%', once: true } });
    gsap.from('.idea-copy', { y: 45, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.idea-copy', start: 'top 90%', once: true } });
    gsap.from('.current-heading', { y: 35, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.current', start: 'top 75%', once: true } });
    gsap.timeline({ scrollTrigger: { trigger: '.momentum', start: 'top bottom', end: 'bottom top', scrub: .7 } })
      .fromTo('.momentum-art', { xPercent: -10, rotation: -7 }, { xPercent: 10, rotation: 7, ease: 'none' }, 0)
      .fromTo('.momentum-outline', { xPercent: -7 }, { xPercent: 5, ease: 'none' }, 0);
    gsap.from('.impact-rings i', { scale: .5, autoAlpha: 0, stagger: .09, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: '.impact', start: 'top 65%', once: true } });
  });
  if (!reduced) {
    media.add('(min-width: 1001px)', () => {
      const heroBreak = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=45%', pin: true, scrub: .7, invalidateOnRefresh: true } });
      heroBreak.to('.hero-title-wrap .type-mask:first-child', { xPercent: -12, ease: 'none' }, 0)
        .to('.hero-title-wrap .second-line', { xPercent: 12, ease: 'none' }, 0)
        .to('.hero-field canvas', { scaleX: 1.65, scaleY: .7, rotation: -12, ease: 'none' }, 0)
        .to('.hero-bottom', { autoAlpha: .2, y: 20, ease: 'none' }, 0);
    });
    media.add('(max-width: 1000px)', () => {
      gsap.to('.hero-field canvas', { scaleX: 1.2, rotation: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } });
    });
  }
  firstEntrance = false;
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  cleanupMotion = () => { fieldCleanup(); media.revert(); ctx.revert(); };
}
const toggleMotion = () => {
  manuallyPaused = !manuallyPaused;
  try { localStorage.setItem('bahr-motion', manuallyPaused ? 'paused' : 'on'); } catch { /* No persistence is needed to toggle motion. */ }
  setupMotion();
};
motionButton.addEventListener('click', toggleMotion);
reducedQuery.addEventListener('change', setupMotion);
setupMotion();
void document.fonts.ready.then(() => ScrollTrigger.refresh());

// Dispose all animation and event state when Vite replaces this module.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupMotion();
    headerObserver.disconnect();
    gsap.killTweensOf(serviceLines);
    services.forEach(item => item.removeEventListener('toggle', updateService));
    menuToggle.removeEventListener('click', openMenu);
    $<HTMLButtonElement>('.menu-close').removeEventListener('click', closeMenu);
    menu.removeEventListener('close', onMenuClose);
    menu.removeEventListener('keydown', trapMenuFocus);
    menuLinks.forEach(link => link.removeEventListener('click', navigateMenu));
    menuBreakpoint.removeEventListener('change', closeOnDesktop);
    motionButton.removeEventListener('click', toggleMotion);
    reducedQuery.removeEventListener('change', setupMotion);
    serviceLines.replaceChildren(); momentumLines.replaceChildren();
  });
}
