import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, Instagram, Youtube, Users, Music, Star, Share2 } from 'lucide-react';

const ArtistsList = ({ artists, initialArtistId, onClearArtist }) => {
  const [selectedArtist, setSelectedArtist] = useState(null);

  React.useEffect(() => {
    if (initialArtistId) {
      const artist = artists.find(a => a.id === initialArtistId);
      if (artist) setSelectedArtist(artist);
    }
  }, [initialArtistId, artists]);

  const handleBack = () => {
    setSelectedArtist(null);
    if (onClearArtist) onClearArtist();
  };

  const renderArtistDetail = (artist) => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: 5000, backgroundColor: 'var(--bg-black)', 
        overflowY: 'auto', paddingBottom: '40px'
      }}
    >
      {/* Background Hero */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '350px' }}>
        <img src={artist.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(to top, var(--bg-black) 0%, transparent 60%, rgba(0,0,0,0.6) 100%)' }} />
        
        {/* Navigation */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <button 
            onClick={handleBack}
            style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Share2 size={18} />
          </button>
        </div>

        {/* Hero Info */}
        <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ background: 'var(--primary-red)', width: '10px', height: '10px', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '12px', fontWeight: 900, color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>WCB Wasafi Official</span>
           </div>
           <h1 style={{ fontSize: 'clamp(40px, 12vw, 64px)', fontWeight: 950, lineHeight: 0.9, marginBottom: '15px' }}>{artist.name}</h1>
           <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Users size={16} color="var(--primary-red)" />
                 <span style={{ fontSize: '16px', fontWeight: 800 }}>{artist.followers}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Music size={16} color="var(--primary-red)" />
                 <span style={{ fontSize: '16px', fontWeight: 800 }}>120+ Tracks</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Detail */}
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: 'clamp(30px, 5vw, 60px) 20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px' 
      }}>
         <section>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={20} color="var(--primary-red)" /> BIOGRAPHY
            </h2>
            <div 
              style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: artist.fullBio }}
            />
            
            <a 
              href={artist.boomplay} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', marginTop: '30px', background: 'var(--primary-red)', width: '100%', maxWidth: '300px', padding: '16px 30px', borderRadius: '40px', color: 'white', fontWeight: 900, fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 15px 30px rgba(225,29,72,0.3)' }}
            >
              <Play fill="white" size={18} /> START LISTENING
            </a>
         </section>

         <aside>
            <div className="glass-morphism" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
               <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '20px' }}>SIGNATURE HITS</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {artist.signatureHits.map((hit, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)' }}>
                       <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary-red)', width: '15px' }}>{index + 1}</div>
                       <div style={{ flex: 1, fontSize: '13px', fontWeight: 700 }}>{hit}</div>
                       <Play size={12} fill="var(--text-gray)" color="var(--text-gray)" />
                    </div>
                  ))}
               </div>

               <h3 style={{ fontSize: '16px', fontWeight: 900, marginTop: '35px', marginBottom: '15px' }}>FOLLOW</h3>
               <div style={{ display: 'flex', gap: '12px' }}>
                  <a 
                    href={artist.socials.ig} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href={artist.socials.yt} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}
                  >
                    <Youtube size={18} />
                  </a>
               </div>
            </div>
         </aside>
      </div>
    </motion.div>
  );

  return (
    <div className="fade-in" style={{ padding: '0 0 140px 0', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ padding: 'clamp(20px, 5vw, 40px) clamp(20px, 5vw, 40px) 20px', background: 'linear-gradient(to bottom, rgba(225,29,72,0.1) 0%, transparent 100%)' }}>
          <h2 style={{ fontSize: 'clamp(30px, 8vw, 42px)', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '10px' }}>WASAFI <span style={{ color: 'var(--primary-red)' }}>ROSTER</span></h2>
          <p style={{ color: 'var(--text-gray)', fontWeight: 600, fontSize: 'clamp(13px, 3vw, 15px)', maxWidth: '500px' }}>The powerhouse behind contemporary Bongo Flava. Discover the artists shaping the future of African music.</p>
      </div>

      {/* Responsive Grid */}
      <div style={{ 
        padding: '20px clamp(15px, 5vw, 40px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 380px), 1fr))',
        gap: 'clamp(20px, 5vw, 40px)'
      }}>
        {artists.map((artist) => (
          <motion.div 
            key={artist.id}
            whileHover={{ y: -10 }}
            onClick={() => setSelectedArtist(artist)}
            className="glass-morphism"
            style={{ 
              height: '520px', 
              borderRadius: '32px', 
              overflow: 'hidden', 
              cursor: 'pointer',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <img src={artist.image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} className="artist-card-img" />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(15,15,15,0.95) 15%, rgba(15,15,15,0.4) 40%, transparent 100%)' }} />
            
            <div style={{ position: 'absolute', bottom: 'clamp(20px, 5vw, 40px)', left: 'clamp(20px, 5vw, 40px)', right: 'clamp(20px, 5vw, 40px)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--primary-red)', fontWeight: 900, fontSize: '12px', letterSpacing: '1.5px' }}>
                  <Star size={14} fill="var(--primary-red)" /> {artist.followers.toUpperCase()}
               </div>
               <h3 style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 950, color: 'white', lineHeight: 1.1, marginBottom: '15px' }}>{artist.name}</h3>
               <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{artist.bio}</p>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '25px' }}>
                  <button style={{ background: 'var(--primary-red)', padding: '10px 20px', borderRadius: '30px', color: 'white', fontWeight: 900, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Play fill="white" size={14} /> VIEW PROFILE
                  </button>
                  <div style={{ color: 'white', fontSize: '12px', fontWeight: 800, opacity: 0.7 }}>{artist.signatureHits.length} Hits</div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Artist Profile Overlay */}
      <AnimatePresence>
        {selectedArtist && renderArtistDetail(selectedArtist)}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .artist-card-img:hover {
          transform: scale(1.08);
        }
      `}} />
    </div>
  );
};

export default ArtistsList;
