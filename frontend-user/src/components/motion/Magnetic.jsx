import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Wrapper that gently pulls its child toward the cursor. */
export default function Magnetic({ children, strength = 0.35, style }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.5 });

  const onMove = (e) => {
    if (!ref.current || !window.matchMedia('(hover: hover)').matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ display: 'inline-flex', x, y, ...style }}
    >
      {children}
    </motion.div>
  );
}
