import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Music, Tv, ShieldCheck, Heart } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [favoriteSong, setFavoriteSong] = useState(null);
  const [favoriteShow, setFavoriteShow] = useState(null);

  const songs = [
    { title: "Waah!", artist: "Diamond Platnumz" },
    { title: "Sukari", artist: "Zuchu" },
    { title: "Hodari", artist: "Mbosso" },
    { title: "Kwaru", artist: "Zuchu" }
  ];

  const shows = [
    "The Story Book",
    "Mashamsham",
    "Sports Arena",
    "Refresh"
  ];

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
            <Music size={48} color="var(--primary-red)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: 'clamp(20px, 6vw, 24px)', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase' }}>WASAFI ANTHEM</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: '30px', fontSize: '14px' }}>Which Wasafi hit defines your vibe?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {songs.map((song) => (
                <button
                  key={song.title}
                  onClick={() => setFavoriteSong(song.title)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: favoriteSong === song.title ? '2px solid var(--primary-red)' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: favoriteSong === song.title ? 'rgba(225,29,72,0.1)' : 'transparent',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontSize: '13px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                  <div style={{ fontSize: '9px', color: favoriteSong === song.title ? 'var(--primary-red)' : 'var(--text-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
            <Tv size={48} color="var(--primary-red)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: 'clamp(20px, 6vw, 24px)', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase' }}>DAILY FIX</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: '30px', fontSize: '14px' }}>Where do you get your daily Wasafi fix?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {shows.map((show) => (
                <button
                  key={show}
                  onClick={() => setFavoriteShow(show)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: favoriteShow === show ? '2px solid var(--primary-red)' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: favoriteShow === show ? 'rgba(225,29,72,0.1)' : 'transparent',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {show}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" style={{ textAlign: 'center' }}>
            <Heart size={48} color="var(--primary-red)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: 'clamp(20px, 6vw, 24px)', fontWeight: 900, marginBottom: '10px' }}>WCB LIONS FAMILY</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: '20px', maxWidth: '300px', fontSize: '14px' }}>
              Welcome to the inner circle. Exclusive access to the Simba world starts now.
            </p>
            <div className="glass-morphism" style={{ padding: '15px', borderRadius: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '20px' }}>
               "Hii ni kwa ajili ya mashabiki wa kweli wa Wasafi Media."
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-black)', padding: '20px' }}>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ width: s === step ? '20px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: s === step ? 'var(--primary-red)' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s' }}></div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={nextStep}
        disabled={(step === 1 && !favoriteSong) || (step === 2 && !favoriteShow)}
        style={{
          marginTop: '40px',
          padding: '15px 30px',
          borderRadius: '50px',
          backgroundColor: ((step === 1 && !favoriteSong) || (step === 2 && !favoriteShow)) ? 'rgba(255,255,255,0.05)' : 'var(--primary-red)',
          color: ((step === 1 && !favoriteSong) || (step === 2 && !favoriteShow)) ? 'var(--text-gray)' : 'white',
          border: 'none',
          fontSize: '14px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: ((step === 1 && !favoriteSong) || (step === 2 && !favoriteShow)) ? 'none' : '0 10px 20px rgba(225,29,72,0.3)',
          width: '100%',
          maxWidth: '300px',
          justifyContent: 'center'
        }}
      >
        {step === 3 ? 'JOIN THE FAMILY' : 'CONTINUE'} <ChevronRight size={20} />
      </motion.button>
    </div>
  );
};

export default Onboarding;
