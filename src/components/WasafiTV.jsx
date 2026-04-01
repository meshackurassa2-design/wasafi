import React from 'react';
import { Play, Pause, Maximize, Volume2, Settings, MessageSquare, Heart, Share2 } from 'lucide-react';

const WasafiTV = () => {
  return (
    <div className="fade-in" style={{ paddingBottom: '140px' }}>
      {/* Video Player Section */}
      <div id="video-container" style={{ width: '100%', position: 'sticky', top: '70px', zIndex: 100, backgroundColor: 'black', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
        <div className="aspect-video" style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
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
                    <button onClick={() => document.getElementById('video-container').requestFullscreen()}><Maximize color="white" size={20} /></button>
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

         {/* Show Description Section */}
         <div className="glass-morphism" style={{ borderRadius: '16px', padding: '20px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '10px', color: 'var(--primary-red)' }}>SHOW DESCRIPTION</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
               In this highly anticipated exclusive interview, the King of Bongo Flava, Diamond Platnumz, sits down with Wasafi Media to discuss his global musical journey, upcoming album, and the future of WCB Wasafi. He breaks his silence on recent controversies and shares his vision for the East African music industry on the world stage.
            </p>
         </div>

         {/* Up Next Section */}
         <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '15px' }}>UP NEXT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                    { title: "Zuchu: Behind the Scenes of 'Honey'", duration: "15:20", thumb: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop" },
                    { title: "Wasafi FM: The morning blast live recap", duration: "10:45", thumb: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" },
                ].map((item) => (
                    <div key={item.title} className="glass-morphism" style={{ display: 'flex', gap: '15px', padding: '10px', borderRadius: '12px', alignItems: 'center' }}>
                        <div style={{ width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={item.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: '1.2', color: 'white', marginBottom: '4px' }}>{item.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{item.duration}</div>
                        </div>
                        <Play size={16} color="var(--primary-red)" style={{ marginRight: '5px' }} />
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default WasafiTV;
