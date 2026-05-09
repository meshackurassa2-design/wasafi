import React, { useState, useEffect } from 'react';
import { RadioTower, Play, Pause, SkipForward, SkipBack, Heart, Music as MusicIcon, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const WasafiFM = ({ isPlaying, setIsPlaying }) => {
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = React.useRef(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await supabase
        .from('radio_music')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setTracks(data);
      } else {
        // Fallback tracks
        setTracks([
          { 
            title: "Kamwambie", 
            artist: "Diamond Platnumz", 
            audio_url: "/kamwambie.mp3", 
            cover_url: "https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg" 
          }
        ]);
      }
    };
    fetchTracks();
  }, []);

  const currentTrack = tracks[currentIndex] || { 
    title: "Connecting...", 
    artist: "Wasafi Radio", 
    audio_url: "/kamwambie.mp3",
    cover_url: "https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg"
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <div className="fade-in" style={{ padding: '20px', paddingBottom: '140px', minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.audio_url} 
        preload="auto" 
        onEnded={handleNext}
      />

      <div style={{ marginTop: '30px', marginBottom: '40px', textAlign: 'center' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(225,29,72,0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(225,29,72,0.3)', marginBottom: '20px' }}>
            <RadioTower size={16} color="var(--primary-red)" className="pulse" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-red)', letterSpacing: '1px' }}>ON AIR NOW</span>
         </div>
         <h2 style={{ fontSize: '28px', fontWeight: 950 }}>WCB RADIO</h2>
         <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginTop: '5px', fontWeight: 700 }}>Now Playing: <span style={{ color: 'white' }}>{currentTrack.title}</span> - {currentTrack.artist}</p>
      </div>

      {/* Rotating Album Art / Logo */}
      <motion.div 
        animate={{ rotate: isPlaying ? 360 : 0 }} 
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'clamp(200px, 70vw, 280px)', height: 'clamp(200px, 70vw, 280px)', borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-black), #1a1a1a)', border: '4px solid #222', boxShadow: isPlaying ? '0 0 50px rgba(225,29,72,0.3)' : '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', marginBottom: 'clamp(30px, 8vw, 50px)' }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(225,29,72,0.5)', position: 'relative', background: isPlaying ? 'white' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isPlaying ? (
             <Logo size={120} />
          ) : (
             <img src="https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) opacity(0.3)' }} />
          )}
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

       {/* Large Controls and Lyrics Toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '30px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <button><Heart size={28} color="var(--text-gray)" /></button>
            <button><SkipBack size={32} color="white" /></button>
            
            <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 40px rgba(225,29,72,0.4)', transition: 'transform 0.2s', transform: isPlaying ? 'scale(0.95)' : 'scale(1)' }}>
               {isPlaying ? <Pause fill="white" size={36} color="white" /> : <Play fill="white" size={36} color="white" style={{ marginLeft: '4px' }} />}
            </button>
            
            <button><SkipForward size={32} color="white" /></button>
            <button style={{ position: 'relative' }}>
               <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary-red)', fontSize: '8px', padding: '2px 4px', borderRadius: '4px', fontWeight: 900 }}>HI-FI</div>
               <RadioTower size={28} color="white" />
            </button>
         </div>

         {/* Virtual Lyrics Display */}
         <AnimatePresence>
           {isPlaying && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               style={{ width: '100%', maxWidth: '320px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}
             >
               <div style={{ color: 'var(--primary-red)', fontSize: '11px', fontWeight: 900, marginBottom: '10px', letterSpacing: '2px' }}>LIVE LYRICS</div>
               <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', lineHeight: '1.4' }}>
                   "Kamwambie kwa nini, nasumbuka na yeye..."
               </div>
               <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)', marginTop: '8px', opacity: 0.5 }}>
                  Next: Wasafi records baby!
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

    </div>
  );
};

export default WasafiFM;
