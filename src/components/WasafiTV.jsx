import React from 'react';
import { Play, Pause, Maximize, Volume2, Settings, MessageSquare, Heart, Share2 } from 'lucide-react';

const WasafiTV = () => {
  return (
    <div className="fade-in" style={{ paddingBottom: '140px' }}>
      {/* Video Player Mockup */}
      <div style={{ width: '100%', position: 'sticky', top: '70px', zIndex: 100, backgroundColor: 'black', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
        <div className="aspect-video" style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
            {/* Direct interview image used as mockup video background */}
            <img src="https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Live TV" />
            
            {/* Live Indicator */}
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary-red)', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px' }}>
               <span className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }}></span>
               LIVE
            </div>

            {/* Controls Overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '20px 15px 15px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button><Pause fill="white" size={24} color="white" /></button>
                    <button><Volume2 color="white" size={20} /></button>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>12:45 / LIVE</span>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button><Settings color="white" size={20} /></button>
                    <button><Maximize color="white" size={20} /></button>
                </div>
            </div>
        </div>
      </div>

      {/* Info & Chat Section */}
      <div style={{ padding: '20px' }}>
         <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '5px' }}>🔴 EXCLUSIVE: Diamond Platnumz Interview</h2>
         <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '20px' }}>45K Watching • Wasafi Media Network</p>
         
         <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <button className="glass-morphism" style={{ flex: 1, padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'white' }}>
                <Heart size={18} /> Like
            </button>
            <button className="glass-morphism" style={{ flex: 1, padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'white' }}>
                <Share2 size={18} /> Share
            </button>
         </div>

         {/* Mock Chat */}
         <div className="glass-morphism" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', height: '350px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="var(--primary-red)" />
                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Live Chat</h3>
            </div>
            
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                    { user: 'Juma55', msg: '🔥🔥 Simba amewasha moto!', color: '#E11D48' },
                    { user: 'BongoFan', msg: 'Tunakusikiliza mkuu tupo pamoja', color: '#3B82F6' },
                    { user: 'Salma_K', msg: 'The best interview so far 👏🏾', color: '#10B981' },
                    { user: 'WasafiDieHard', msg: 'WCB For Life!! 🌍 Number one', color: '#F59E0B' },
                    { user: 'Mangi', msg: 'Chibu Dangote 🦁', color: '#8B5CF6' },
                ].map((chat, i) => (
                    <div key={i} style={{ fontSize: '13px', lineHeight: 1.4 }}>
                        <span style={{ color: chat.color, fontWeight: 700, marginRight: '8px' }}>{chat.user}</span>
                        <span style={{ color: 'var(--text-white)' }}>{chat.msg}</span>
                    </div>
                ))}
            </div>

            <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '10px 15px', display: 'flex', alignItems: 'center' }}>
                    <input type="text" placeholder="Chat publicly as guest..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1, fontSize: '13px' }} disabled />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WasafiTV;
