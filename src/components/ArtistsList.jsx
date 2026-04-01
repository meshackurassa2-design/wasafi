import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const ArtistsList = ({ artists }) => {
  return (
    <div className="fade-in" style={{ padding: '20px', paddingBottom: '140px' }}>
      <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '25px', letterSpacing: '-0.5px' }}>WASAFI <span style={{ color: 'var(--primary-red)' }}>ROSTER</span></h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {artists.map((artist, i) => (
          <motion.div whileTap={{ scale: 0.96 }} key={i} style={{ position: 'relative', height: '220px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
            <img src={artist.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={artist.name} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}></div>
            
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{artist.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>1.2M Monthly Listeners</div>
            </div>

            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(225,29,72,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
                <Play fill="white" size={14} color="white" style={{ marginLeft: '2px' }} />
            </div>
          </motion.div>
        ))}
        {/* Placeholder for more */}
         <motion.div whileTap={{ scale: 0.96 }} style={{ position: 'relative', height: '220px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>+</div>
             <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-gray)' }}>DISCOVER MORE</span>
         </motion.div>
      </div>
    </div>
  );
};

export default ArtistsList;
