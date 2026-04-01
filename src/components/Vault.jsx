import React from 'react';
import { Download, Music, Video, Heart, Trash2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Vault = () => {
  const downloads = [
    { id: 1, title: "Zuchu - Paradise (Full Album)", type: "music", size: "124MB", count: "12 Tracks" },
    { id: 2, title: "Diamond Platnumz Live at Samia Stadium", type: "video", size: "850MB", duration: "1:45:00" },
    { id: 3, title: "Wasafi FM - The Morning Blast (Mar 30)", type: "music", size: "45MB", count: "Podcast" }
  ];

  return (
    <div className="fade-in" style={{ padding: '20px', paddingBottom: '140px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900 }}>MY VAULT</h2>
        <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>Your premium offline collection</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div className="glass-morphism" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(225,29,72,0.3)', background: 'linear-gradient(135deg, rgba(225,29,72,0.1), transparent)' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary-red)' }}>1.2 GB</div>
          <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 700 }}>STORAGE USED</div>
        </div>
        <div className="glass-morphism" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ fontSize: '24px', fontWeight: 900 }}>15</div>
          <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 700 }}>OFFLINE ITEMS</div>
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>DOWNLOADED CONTENT</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {downloads.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ x: 5 }}
            className="glass-morphism" 
            style={{ padding: '15px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '15px' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {item.type === 'music' ? <Music size={24} color="var(--primary-red)" /> : <Video size={24} color="#3B82F6" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{item.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{item.size} • {item.count || item.duration}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Play size={16} fill="white" color="white" />
              </button>
              <button style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(225,29,72,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Trash2 size={16} color="var(--primary-red)" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Vault;
