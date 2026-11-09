import { useEffect, useRef, useState } from 'react';

/** Smoothly tweens to a new value (skipped when the user prefers reduced motion). */
function useTween(target: number, ms = 350) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const duration = reduce ? 0 : ms;
    const start = performance.now();
    const begin = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      const v = begin + (target - begin) * eased;
      from.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

function slicePath(fraction: number, cx: number, cy: number, r: number) {
  const angle = fraction * 2 * Math.PI;
  const x = cx + r * Math.sin(angle);
  const y = cy - r * Math.cos(angle);
  const large = fraction > 0.5 ? 1 : 0;
  return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x} ${y} Z`;
}

/** Solid pie: navy slice for reaching 45°, Columbia blue for the rest. */
export function PieChart({ percent }: { percent: number | null }) {
  const target = percent === null ? 0 : Math.min(100, Math.max(0, percent)) / 100;
  const f = useTween(target);
  // Keep a hairline slice visible for very small nonzero risks so it never reads as zero.
  const shown = target > 0 ? Math.max(f, 0.006) : f;
  const r = 96;

  return (
    <svg className={`pie${percent === null ? ' pie--empty' : ''}`} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r={r} className="pie__rest" />
      {shown >= 0.9999 ? (
        <circle cx="100" cy="100" r={r} className="pie__slice" />
      ) : shown > 0 ? (
        <path d={slicePath(shown, 100, 100, r)} className="pie__slice" />
      ) : null}
    </svg>
  );
}
