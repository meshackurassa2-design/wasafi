import React, { useState } from 'react';
import { Play, Tv, Radio, Search, Bell, Home as HomeIcon, UserCircle, X, Pause, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './components/Home';
import WasafiTV from './components/WasafiTV';
import WasafiFM from './components/WasafiFM';
import ArtistsList from './components/ArtistsList';
import Profile from './components/Profile';

// --- Logo Component ---
const Logo = ({ size = 40 }) => (
  <svg width={size * 2.5} height={size} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10L20 5L35 15L20 35L5 10Z" fill="url(#blue_grad)" />
    <path d="M35 10L50 5L65 15L50 35L35 10Z" fill="url(#red_grad)" />
    <path d="M65 10L80 5L95 15L80 35L65 10Z" fill="url(#grey_grad)" />
    <defs>
      <linearGradient id="blue_grad" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#1E40AF" />
      </linearGradient>
      <linearGradient id="red_grad" x1="35" y1="5" x2="65" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E11D48" />
        <stop offset="1" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="grey_grad" x1="65" y1="5" x2="95" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#94A3B8" />
        <stop offset="1" stopColor="#475569" />
      </linearGradient>
    </defs>
  </svg>
);

// --- Sub-components ---
const BottomNav = ({ active, setActive }) => (
  <nav className="glass-morphism" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 10px', zIndex: 2000, borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -4px 30px rgba(0,0,0,0.5)', background: 'rgba(15, 15, 15, 0.88)' }}>
    {[
      { id: 'home', label: 'Home', icon: HomeIcon },
      { id: 'tv', label: 'Wasafi TV', icon: Tv },
      { id: 'fm', label: 'Wasafi FM', icon: Radio },
      { id: 'artists', label: 'Artists', icon: Music },
      { id: 'profile', label: 'Account', icon: UserCircle },
    ].map((item) => {
      const isActive = active === item.id;
      return (
        <button 
          key={item.id} 
          onClick={() => setActive(item.id)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: isActive ? 'var(--primary-red)' : 'var(--text-gray)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '60px', position: 'relative', transform: isActive ? 'translateY(-2px)' : 'translateY(0)' }}
        >
          <item.icon size={24} color={isActive ? 'var(--primary-red)' : 'rgba(161, 161, 170, 0.7)'} style={{ filter: isActive ? 'drop-shadow(0px 2px 8px rgba(225, 29, 72, 0.5))' : 'none' }} />
          <span style={{ fontSize: '10px', fontWeight: isActive ? 800 : 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
          {isActive && (
            <motion.div layoutId="nav-indicator" style={{ position: 'absolute', bottom: '-10px', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary-red)', boxShadow: '0 0 8px var(--primary-red)' }} />
          )}
        </button>
      );
    })}
  </nav>
);

const MiniPlayer = ({ currentItem, isPlaying, setIsPlaying }) => (
  <AnimatePresence>
    {currentItem && (
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
        className="glass-morphism" 
        style={{ position: 'fixed', bottom: '85px', left: '15px', right: '15px', height: '65px', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 15px', zIndex: 1900, boxShadow: '0 -10px 30px rgba(0,0,0,0.6)', border: '1px solid rgba(225,29,72,0.4)', background: 'rgba(15,15,15,0.95)' }}
      >
        <div style={{ width: '45px', height: '45px', borderRadius: '8px', overflow: 'hidden', marginRight: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          <img src={currentItem.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{currentItem.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--primary-red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="pulse" style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></span>
            LIVE ON AIR
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', paddingLeft: '10px' }}>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'var(--primary-red)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(225,29,72,0.4)' }}>
            {isPlaying ? <Pause size={18} fill="white" color="white" /> : <Play size={18} fill="white" color="white" style={{ marginLeft: '2px' }} />}
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentMedia, setCurrentMedia] = useState({ title: "Wasafi FM 98.4 - Dume la Wasafi", thumb: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" });
  const [isPlaying, setIsPlaying] = useState(true);

  const artists = [
    { name: "Diamond Platnumz", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop" },
    { name: "Zuchu", image: "https://images.unsplash.com/photo-1520127877037-385d83f738a5?q=80&w=2070&auto=format&fit=crop" },
    { name: "Harmonize", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop" },
    { name: "Rayvanny", image: "https://images.unsplash.com/photo-1514525253361-bee8d41dfb7a?q=80&w=1964&auto=format&fit=crop" },
    { name: "Ali Kiba", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" },
  ];

  const trendingShows = [
    { title: "🔴#LIVE: EXCLUSIVE - DIAMOND PLATNUMZ | WASAFI MEDIA", views: "1.2M", time: "NOW", duration: "LIVE", thumb: "https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg", isLive: true },
    { title: "Mashamsham: LIVE Performance at Samia Stadium", views: "1.1M", time: "5h", duration: "3:30", thumb: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop", isLive: false },
    { title: "The Story Book: History of Tandale", views: "850K", time: "1w", duration: "1:15:00", thumb: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop", isLive: false },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home artists={artists} trendingShows={trendingShows} />;
      case 'tv':
        return <WasafiTV />;
      case 'fm':
        return <WasafiFM isPlaying={isPlaying} setIsPlaying={setIsPlaying} />;
      case 'artists':
        return <ArtistsList artists={artists} />;
      case 'profile':
        return <Profile />;
      default:
        return <Home artists={artists} trendingShows={trendingShows} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      {activeTab !== 'tv' && (
      <header className="glass-morphism" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(15,15,15,0.8)' }}>
         <Logo size={35} />
         <div style={{ display: 'flex', gap: '20px' }}>
            <Search size={22} color="white" cursor="pointer" />
            <div style={{ position: 'relative' }}>
               <Bell size={22} color="white" cursor="pointer" />
               <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--primary-red)', borderRadius: '50%' }}></div>
            </div>
         </div>
      </header>
      )}

      {/* Dynamic Screen Content */}
      {renderContent()}

      {/* Sticky Bottom Elements */}
      {activeTab !== 'tv' && activeTab !== 'fm' && (
        <MiniPlayer currentItem={currentMedia} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      )}
      <BottomNav active={activeTab} setActive={setActiveTab} />
    </div>
  );
}

export default App;
