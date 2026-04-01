import React from 'react';
import { RadioTower, Play, Pause, SkipForward, SkipBack, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const WasafiFM = ({ isPlaying, setIsPlaying }) => {
  return (
    <div className="fade-in" style={{ padding: '20px', paddingBottom: '140px', minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ marginTop: '30px', marginBottom: '40px', textAlign: 'center' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(225,29,72,0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(225,29,72,0.3)', marginBottom: '20px' }}>
            <RadioTower size={16} color="var(--primary-red)" className="pulse" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-red)', letterSpacing: '1px' }}>ON AIR NOW</span>
         </div>
         <h2 style={{ fontSize: '28px', fontWeight: 900 }}>WASAFI FM 98.4</h2>
         <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginTop: '5px' }}>Dume la Wasafi - The Hub of Information and Music</p>
      </div>

      {/* Rotating Album Art */}
      <motion.div 
        animate={{ rotate: isPlaying ? 360 : 0 }} 
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ width: '280px', height: '280px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-black), #1a1a1a)', border: '4px solid #222', boxShadow: isPlaying ? '0 0 50px rgba(225,29,72,0.3)' : '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', marginBottom: '50px' }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(225,29,72,0.5)', position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isPlaying ? 'none' : 'grayscale(0.5)' }} alt="Radio Live" />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.5) 100%)' }}></div>
        </div>
      </motion.div>

      {/* Audio Waveform Mockup */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px', marginBottom: '40px' }}>
        {[...Array(30)].map((_, i) => (
           <motion.div 
             key={i}
             animate={isPlaying ? { height: ['10px', `${Math.random() * 40 + 10}px`, '10px'] } : { height: '10px' }}
             transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
             style={{ width: '4px', background: isPlaying ? 'var(--primary-red)' : '#333', borderRadius: '4px' }}
           />
        ))}
      </div>

      {/* Huge Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
         <button><Heart size={28} color="var(--text-gray)" /></button>
         <button><SkipBack size={32} color="white" /></button>
         
         <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 30px rgba(225,29,72,0.4)', transition: 'transform 0.2s', transform: isPlaying ? 'scale(0.95)' : 'scale(1)' }}>
            {isPlaying ? <Pause fill="white" size={32} color="white" /> : <Play fill="white" size={32} color="white" style={{ marginLeft: '4px' }} />}
         </button>
         
         <button><SkipForward size={32} color="white" /></button>
         <button><RadioTower size={28} color="var(--text-gray)" /></button>
      </div>

    </div>
  );
};

export default WasafiFM;
