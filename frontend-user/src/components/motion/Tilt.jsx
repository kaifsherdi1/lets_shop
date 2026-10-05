import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 3D perspective tilt that follows the pointer, with a moving glare highlight.
 * Children placed inside a `.ls-depth` element pop forward in Z.
 */
export default function Tilt({ children, max = 10, scale = 1.02, glare = true, className = '', style, radius = 20 }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const s = useSpring(1, spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)`;
  const glareOpacity = useSpring(0, spring);

  const onMove = (e) => {
    if (!canHover() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onEnter = () => {
    if (!canHover()) return;
    s.set(scale);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    s.set(1);
    glareOpacity.set(0);
  };

  return (
    <div style={{ perspective: 1100, height: '100%' }}>
      <motion.div
        ref={ref}
        className={`ls-tilt ${className}`}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{ ...style, rotateX, rotateY, scale: s, transformStyle: 'preserve-3d', height: '100%', borderRadius: radius, position: 'relative' }}
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden="true"
            className="ls-tilt-glare"
            style={{ background: glareBg, opacity: glareOpacity, borderRadius: radius }}
          />
        )}
      </motion.div>
    </div>
  );
}
