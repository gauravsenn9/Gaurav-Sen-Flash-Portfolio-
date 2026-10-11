import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Speedster } from './speedster';

const seenKey = 'gs-entrance-seen';
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** A single clock updates vector joints directly, without React renders per frame. */
export function Entrance() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [size, setSize] = useState({ w: 1000, h: 700 });
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<SVGSVGElement>(null);
  const enter = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);
  const finish = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setOpen(false); setRunning(false);
    try { sessionStorage.setItem(seenKey, 'yes'); } catch {}
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('.hero h1');
      heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
    });
  }, []);
  useEffect(() => {
    if (location.pathname !== '/' || location.hash) { setOpen(false); return; }
    try { if (!sessionStorage.getItem(seenKey)) setOpen(true); } catch { setOpen(true); }
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const replay = () => {
      if (window.location.pathname !== '/') return;
      cancelAnimationFrame(frame.current);
      window.scrollTo({ top: 0, behavior: 'instant' }); setRunning(false); setOpen(true);
    };
    window.addEventListener('gs-replay-intro', replay);
    return () => window.removeEventListener('gs-replay-intro', replay);
  }, []);
  useEffect(() => {
    if (!open) return;
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure(); window.addEventListener('resize', measure);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const content = [...document.querySelectorAll<HTMLElement>('.site-header,main,.site-footer,.skip-link')];
    const previousInert = content.map(el => el.inert);
    content.forEach(el => { el.inert = true; }); enter.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); finish(); }
      if (event.key !== 'Tab') return;
      const controls = [...(dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(frame.current); document.body.style.overflow = previous;
      content.forEach((el, i) => { el.inert = previousInert[i] ?? false; });
      window.removeEventListener('resize', measure); document.removeEventListener('keydown', key);
    };
  }, [open, finish]);
  useEffect(() => {
    const svg = stage.current;
    if (!open || !svg) return;
    const nodes = new Map<string, Element>();
    svg.querySelectorAll('[data-joint],[data-hand],[data-curtain],[data-character],[data-effect]').forEach(node => {
      for (const kind of ['joint', 'hand', 'curtain', 'character', 'effect']) {
        const value = node.getAttribute(`data-${kind}`); if (value) nodes.set(`${kind}:${value}`, node);
      }
    });
    const attr = (key: string, name: string, value: string | number) => nodes.get(key)?.setAttribute(name, String(value));
    const transform = (key: string, value: string) => attr(key, 'transform', value);
    const paint = (t: number) => {
      const { w, h } = size;
      const s = Math.min(1.5, w / 430, h / 650);
      const pull = smooth((t - 1050) / 850);
      const release = smooth((t - 1900) / 480);
      const depart = smooth((t - 2520) / 480);
      const x = running ? mix(-180 * s, w / 2, smooth(t / 700)) + depart * (w / 2 + 200 * s) : w / 2;
      const y = Math.min(h * .5, 640);
      const runWeight = running ? (1 - smooth((t - 500) / 200)) + smooth((t - 2500) / 180) : 0;
      const stride = Math.sin(t / 85) * runWeight;
      const reach = smooth((t - 720) / 280) * (1 - smooth((t - 1950) / 400));
      const spread = 108 * s * pull + (w / 2 + 40 - 108 * s) * release;
      transform('curtain:left', `translate(${-spread} 0)`);
      transform('curtain:right', `translate(${spread} 0)`);
      // No body bob while gripping: both hands and seam remain in identical coordinates.
      transform('character:speedster', `translate(${x} ${y + Math.abs(stride) * 4 * s}) scale(${s})`);
      for (const side of [-1, 1]) {
        const name = side < 0 ? 'left' : 'right';
        const shoulderX = side * 38, shoulderY = -122;
        const hx = mix(side * (48 + stride * 30), side * pull * 108, reach);
        const hy = mix(-8 - side * stride * 38, -58, reach);
        const dx = hx - shoulderX, dy = hy - shoulderY;
        const length = Math.min(125.8, Math.hypot(dx, dy));
        const base = Math.atan2(dy, dx);
        const bend = Math.acos(clamp((61 * 61 + length * length - 65 * 65) / (2 * 61 * length)));
        const upper = base - side * bend;
        const ex = shoulderX + Math.cos(upper) * 61, ey = shoulderY + Math.sin(upper) * 61;
        const lower = Math.atan2(hy - ey, hx - ex);
        const angle = upper * 180 / Math.PI - 90;
        transform(`joint:${name}-arm`, `translate(${shoulderX} ${shoulderY}) rotate(${angle})`);
        transform(`joint:${name}-forearm`, `translate(0 61) rotate(${(lower - upper) * 180 / Math.PI})`);
        // Hand is in its arm's coordinates but explicitly lands on the shared seam position.
        const localX = dx * Math.cos(angle * Math.PI / 180) + dy * Math.sin(angle * Math.PI / 180);
        const localY = -dx * Math.sin(angle * Math.PI / 180) + dy * Math.cos(angle * Math.PI / 180);
        transform(`hand:${name}`, `translate(${localX} ${localY}) rotate(${-angle})`);
        const thigh = side * stride * 46;
        transform(`joint:${name}-thigh`, `translate(${side * 17} -12) rotate(${thigh})`);
        transform(`joint:${name}-shin`, `translate(0 78) rotate(${Math.max(0, -side * stride) * 75})`);
      }
      transform('effect:trail', `translate(${x} ${y}) scale(${s})`);
      attr('effect:trail', 'opacity', runWeight * .65 * (1 - depart));
      attr('effect:sparks', 'opacity', t > 1050 && t < 1900 ? Math.sin(pull * Math.PI) * .65 : 0);
      transform('effect:sparks', `translate(${w / 2} ${y - 58 * s})`);
      svg.querySelectorAll('[data-spark-side]').forEach(node => {
        transformUnused(node, `translate(${Number(node.getAttribute('data-spark-side')) * spread} 0)`);
      });
      attr('effect:gesture', 'opacity', smooth((t - 2300) / 100) * (1 - smooth((t - 2470) / 100)));
    };
    paint(0);
    if (!running) return;
    const began = performance.now();
    const tick = (now: number) => {
      const t = now - began;
      if (t >= 3000 || document.documentElement.dataset['motion'] === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
      paint(t); frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [open, running, size, finish]);
  const start = () => {
    if (running) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset['motion'] === 'off') { finish(); return; }
    setRunning(true); dialog.current?.querySelector<HTMLButtonElement>('.intro-skip')?.focus();
  };
  if (!open) return null;
  const { w, h } = size;
  return <div ref={dialog} className={`portfolio-intro ${running ? 'intro-running' : ''}`} role="dialog" aria-modal="true" aria-labelledby="intro-title">
    <Button className="intro-skip" variant="ghost" onClick={finish}>Skip intro <span aria-hidden="true">↗</span></Button>
    <svg ref={stage} className="intro-stage" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id="speedster-suit"><stop stopColor="var(--intro-highlight)"/><stop offset=".45" stopColor="var(--intro-suit)"/><stop offset="1" stopColor="var(--intro-crimson)"/></linearGradient>
        <linearGradient id="curtain-shading"><stop stopColor="var(--intro-shadow)"/><stop offset=".42" stopColor="var(--intro-crimson)"/><stop offset=".7" stopColor="var(--intro-suit)"/><stop offset="1" stopColor="var(--intro-shadow)"/></linearGradient>
        <pattern id="curtain-folds" width="72" height="32" patternUnits="userSpaceOnUse"><rect width="72" height="32" fill="url(#curtain-shading)"/></pattern>
      </defs>
      <g data-curtain="left"><rect width={w / 2} height={h} fill="url(#curtain-folds)"/><path d={`M${w / 2} 0V${h}`} className="intro-seam"/></g>
      <g data-curtain="right"><rect x={w / 2} width={w / 2} height={h} fill="url(#curtain-folds)"/><rect x={w / 2} width={w / 2} height={h} fill="var(--intro-shadow)" opacity=".35"/><path d={`M${w / 2} 0V${h}`} className="intro-seam"/></g>
      <g data-effect="trail" opacity="0" fill="none" stroke="var(--intro-gold)" strokeLinecap="round">{[-95,-25,45].map((y,i)=><path key={y} d={`M-280 ${y}l75 -8 18 15 65 -15 34 6`} strokeWidth={3-i*.6}/>)}<path d="M-130-130L-165-60M-120 0L-150 90" stroke="var(--intro-highlight)" strokeWidth="20" opacity=".25"/></g>
      <Speedster/>
      <g data-effect="sparks" opacity="0" stroke="var(--intro-gold)" strokeWidth="2" fill="none">{[-1,1].map(side=><g key={side} data-spark-side={side}><path d={`M${side*15}-24l${side*9}-12M${side*12} 4l${side*13} 6M${side*7} 28l${side*6} 12`}/></g>)}</g>
      <g data-effect="gesture" opacity="0" transform={`translate(${w/2+75} ${Math.min(h*.5,640)-60})`} fill="none" stroke="var(--intro-gold)" strokeWidth="3"><path d="M0 0H30L23-7M30 0L23 7"/></g>
    </svg>
    {!running ? <div className="intro-copy"><h2 id="intro-title">GAURAV SEN</h2><Button ref={enter} size="lg" onClick={start}>Enter Portfolio <span aria-hidden="true">⚡</span></Button></div> : <h2 id="intro-title" className="sr-only">Revealing Gaurav Sen’s portfolio</h2>}
  </div>;
}
function transformUnused(node: Element, value: string) { node.setAttribute('transform', value); }
