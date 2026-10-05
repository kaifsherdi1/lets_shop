import React from 'react';
import { motion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

const directions = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: 56 },
  right: { x: -56 },
  zoom: { scale: 0.88 },
  flip: { rotateX: -35, y: 40, transformPerspective: 900 },
};

/** Fades + slides its children in once they scroll into view. */
export function Reveal({ children, from = 'up', delay = 0, duration = 0.9, amount = 0.2, as = 'div', className, style }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, ...directions[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** Parent that staggers the entrance of every <StaggerItem> inside it. */
export function Stagger({ children, gap = 0.1, delay = 0, amount = 0.15, className, style, as = 'div' }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 50, rotateX: -18, transformPerspective: 1000 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: EASE } },
};

export function StaggerItem({ children, className, style, as = 'div' }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} style={style} variants={staggerItem}>
      {children}
    </Tag>
  );
}

/**
 * Splits a heading into words that flip up in 3D one after another.
 * `highlight` words get the brand gradient.
 */
export function SplitText({ text, as = 'h2', className, style, delay = 0, highlight = [], inView = true }) {
  const Tag = motion[as] || motion.h2;
  const words = String(text).split(' ');
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } }
    : { initial: 'hidden', animate: 'show' };

  return (
    <Tag
      className={className}
      style={{ ...style, perspective: 800 }}
      aria-label={text}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="ls-word-mask">
          <motion.span
            className={`ls-word${highlight.includes(word.replace(/[^\w&-]/g, '')) ? ' ls-text-gradient' : ''}`}
            variants={{
              hidden: { y: '110%', rotateX: -80, opacity: 0 },
              show: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
