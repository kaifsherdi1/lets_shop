import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/**
 * Counts from 0 to the numeric part of `value` when scrolled into view.
 * Non-numeric values (e.g. "24/7", "—") are rendered as-is.
 */
export default function CountUp({ value, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = /^([^\d]*)([\d,]+)(.*)$/.exec(String(value));
  const target = match && !String(value).includes('/') ? Number(match[2].replace(/,/g, '')) : null;
  const [display, setDisplay] = useState(target != null ? 0 : value);

  useEffect(() => {
    if (target == null) {
      setDisplay(value);
      return undefined;
    }
    if (!inView) return undefined;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, value, duration]);

  return (
    <span ref={ref}>
      {target != null ? `${match[1]}${display.toLocaleString()}${match[3]}` : display}
    </span>
  );
}
