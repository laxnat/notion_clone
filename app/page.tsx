'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

const TITLE = 'AEGIS'
const EASE = [0.22, 1, 0.36, 1] as const

const slashVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: { duration: 0.4, delay: i * 0.08, ease: EASE },
  }),
}

const letterVariants: Variants = {
  hidden: { y: 80, opacity: 0, skewY: 6 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    skewY: 0,
    transition: { duration: 0.5, delay: 0.3 + i * 0.07, ease: EASE },
  }),
}

const fadeUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.8 + i * 0.1, ease: EASE },
  }),
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-secondary overflow-hidden flex flex-col items-center justify-center">

      {/* Background diagonal slashes */}
      {[
        { top: '8%',  left: '-5%',  w: '55%', h: '3px', bg: 'bg-primary',   rot: '-6deg', delay: 0 },
        { top: '12%', left: '-5%',  w: '40%', h: '8px', bg: 'bg-highlight', rot: '-6deg', delay: 1 },
        { top: '17%', left: '-5%',  w: '25%', h: '3px', bg: 'bg-primary',   rot: '-6deg', delay: 2 },
        { top: '80%', right: '-5%', w: '55%', h: '3px', bg: 'bg-accent',    rot: '-6deg', delay: 3 },
        { top: '85%', right: '-5%', w: '35%', h: '8px', bg: 'bg-highlight', rot: '-6deg', delay: 4 },
        { top: '89%', right: '-5%', w: '20%', h: '3px', bg: 'bg-primary',   rot: '-6deg', delay: 5 },
      ].map((s, i) => (
        <motion.div
          key={i}
          custom={s.delay}
          variants={slashVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.w,
            height: s.h,
            transform: `rotate(${s.rot})`,
            transformOrigin: s.left ? 'left center' : 'right center',
          }}
          className={s.bg}
        />
      ))}

      {/* Corner accent boxes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
        className="absolute top-6 left-6 w-4 h-4 bg-highlight"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: EASE }}
        className="absolute bottom-6 right-6 w-4 h-4 bg-primary"
      />
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        className="absolute top-0 left-16 w-0.5 h-32 bg-primary origin-top"
      />
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
        className="absolute bottom-0 right-16 w-0.5 h-32 bg-highlight origin-bottom"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">

        {/* Eyebrow label */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-ui text-primary text-sm tracking-[0.4em] uppercase"
        >
          Your workspace. Personified.
        </motion.p>

        {/* Title */}
        <div className="overflow-hidden flex" aria-label={TITLE}>
          {TITLE.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-[12rem] leading-none text-white"
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Highlight bar under title */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.5, ease: EASE }}
          className="h-2 w-48 bg-highlight origin-left -mt-6"
        />

        {/* Subtitle */}
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-ui text-accent text-xl tracking-wide max-w-md"
        >
          A bold new way to capture ideas, organize docs,<br />and move with intention.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex gap-4 mt-2"
        >
          <Link
            href="/signup"
            className="relative font-display text-2xl text-secondary bg-highlight px-8 py-3 tracking-widest overflow-hidden group"
          >
            <span className="relative z-10">GET STARTED</span>
            <span className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-white translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-20 tracking-widest">GET STARTED</span>
          </Link>
          <Link
            href="/login"
            className="relative font-display text-2xl text-white border-2 border-white px-8 py-3 tracking-widest overflow-hidden group"
          >
            <span className="relative z-10">LOG IN</span>
            <span className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-secondary translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-20 tracking-widest">LOG IN</span>
          </Link>
        </motion.div>

      </div>

      {/* Bottom label */}
      <motion.p
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-ui text-xs text-primary/40 tracking-[0.3em] uppercase"
      >
        Aegis &mdash; 2026
      </motion.p>
    </div>
  )
}
