import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

const words = ["WASAFI", "MEDIA", "PREMIUM"];
const tagline = "East Africa's #1 Entertainment Platform";

const Splash = ({ onDone }) => {
  const [phase, setPhase] = useState('words'); // words -> tagline -> exit

  useEffect(() => {
    // After words animate in (1.8s), show tagline, then exit at 3.5s
    const t1 = setTimeout(() => setPhase('tagline'), 1800);
    const t2 = setTimeout(() => setPhase('exit'), 3200);
    const t3 = setTimeout(() => onDone(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'linear-gradient(160deg, #0F0F0F 0%, #1a0008 50%, #0F0F0F 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Animated background glow */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute', width: '300px', height: '300px',
              background: 'radial-gradient(circle, #E11D48 0%, transparent 70%)',
              borderRadius: '50%', filter: 'blur(40px)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            style={{ marginBottom: '40px', position: 'relative', zIndex: 2 }}
          >
            <Logo size={55} />
          </motion.div>

          {/* Word-by-word animation */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(8px, 3vw, 16px)', 
            position: 'relative', 
            zIndex: 2, 
            marginBottom: '24px',
            padding: '0 20px',
            width: '100%'
          }}>
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.25 + 0.3, duration: 0.6, ease: 'easeOut' }}
                style={{
                  fontSize: 'clamp(24px, 8vw, 32px)', 
                  fontWeight: 950, 
                  letterSpacing: 'clamp(2px, 1vw, 4px)',
                  color: i === 1 ? '#E11D48' : 'white',
                  textShadow: i === 1 ? '0 0 30px rgba(225,29,72,0.6)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Tagline fade in */}
          <AnimatePresence>
            {phase === 'tagline' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'relative', zIndex: 2,
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '13px', fontWeight: 600,
                  letterSpacing: '1px', textAlign: 'center',
                }}
              >
                {tagline}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <motion.div
            style={{
              position: 'absolute', bottom: '60px', width: '120px',
              height: '2px', background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px', overflow: 'hidden', zIndex: 2,
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.2, ease: 'linear' }}
              style={{ height: '100%', background: '#E11D48', borderRadius: '2px' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Splash;
