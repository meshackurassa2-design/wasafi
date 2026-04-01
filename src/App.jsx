import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, Radio, Search, Bell, Home as HomeIcon, UserCircle, X, Pause, Music, Download, Star, Newspaper, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './components/Home';
import WasafiTV from './components/WasafiTV';
import WasafiFM from './components/WasafiFM';
import ArtistsList from './components/ArtistsList';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Support from './components/Support';
import Events from './components/Events';
import WasafiNews from './components/WasafiNews';
import Splash from './components/Splash';

// --- Universal 3-Diamond Logo ---
export const Logo = ({ size = 40 }) => (
  <svg width={size * 2.5} height={size} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blue Diamond */}
    <path d="M5 10L18 5L31 15L18 35L5 10Z" fill="#2563EB" />
    {/* Red Diamond */}
    <path d="M36 10L49 5L62 15L49 35L36 10Z" fill="#E11D48" />
    {/* Grey Diamond */}
    <path d="M67 10L80 5L93 15L80 35L67 10Z" fill="#64748B" />
  </svg>
);

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [currentMedia, setCurrentMedia] = useState({ title: "Kamwambie - Diamond Platnumz", thumb: "/icon.png" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef(null);

  // Responsive & Fullscreen logic
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    try {
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        const { StatusBar } = window.Capacitor.Plugins;
        if (StatusBar) StatusBar.hide();
      }
    } catch (e) {}
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktop]);

  // Persistent audio — plays across all tabs
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const artists = [
    { 
      id: 'diamond',
      name: "Diamond Platnumz", 
      image: "/artists/diamond.png",
      followers: "16M+ Followers",
      bio: "Naseeb Abdul Juma Issack, known as Diamond Platnumz, is the king of Bongo Flava.",
      fullBio: `
        <p>Diamond Platnumz is a multi-award-winning Tanzanian artist and the founder of WCB Wasafi. He is globally recognized for revolutionizing Bongo Flava and bringing East African music to the international stage.</p>
        <p>With a career spanning over a decade, Diamond has collaborated with major stars including Ne-Yo, Rick Ross, and Alicia Keys. His influence extends beyond music into media and business, making him one of Africa's most successful entrepreneurs.</p>
      `,
      signatureHits: ["Waah!", "Baba Lao", "Number One", "Jeje"],
      socials: { ig: "@diamondplatnumz", yt: "DiamondPlatnumz" }
    },
    { 
      id: 'zuchu',
      name: "Zuchu", 
      image: "/artists/zuchu.png",
      followers: "6M+ Followers",
      bio: "Breakout star of WCB Wasafi and the first East African female to reach 1M YouTube subs.",
      fullBio: `
        <p>Zuchu is the princess of WCB Wasafi. Since her debut in 2020, she has dominated the charts with hits like 'Sukari' and 'Nisamehe'.</p>
        <p>She is known for her unique vocal style and songwriting ability, often touching on themes of love, life, and empowerment. Her rapid rise to stardom has made her a role model for aspiring female artists across the continent.</p>
      `,
      signatureHits: ["Sukari", "Mtasubiri", "Honey", "Kwikwi"],
      socials: { ig: "@officialzuchu", yt: "ZuchuOfficial" }
    },
    { 
      id: 'd-voice',
      name: "D Voice", 
      image: "/artists/dvoice.png",
      followers: "2M+ Followers",
      bio: "The newest WCB sensation, blending Singeli and Bongo Flava at high energy.",
      fullBio: `
        <p>D Voice is the latest addition to the Wasafi family, bringing the high-octane Singeli energy to the mainstream Bongo Flava sound.</p>
        <p>His debut album 'Swahili Kid' has garnered millions of streams, proving his immense appeal to the younger generation and his ability to innovate within traditional Tanzanian sounds.</p>
      `,
      signatureHits: ["Swahili Kid", "Kuachana", "Bam Bam"],
      socials: { ig: "@dvoice", yt: "DVoice" }
    },
  ];

  const trendingShows = [
    { id: 'exclusive-diamond', title: "🔴#LIVE: EXCLUSIVE - DIAMOND PLATNUMZ | WASAFI MEDIA", views: "1.2M", time: "NOW", duration: "LIVE", thumb: "https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg", isLive: true },
    { id: 'mashamsham', title: "Mashamsham: LIVE Performance at Samia Stadium", views: "1.1M", time: "5h", duration: "3:30", thumb: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop", isLive: false },
    { id: 'story-book', title: "The Story Book: History of Tandale", views: "850K", time: "1w", duration: "1:15:00", thumb: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop", isLive: false },
  ];

  const filteredArtists = artists.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredShows = trendingShows.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'tv', label: 'Wasafi TV', icon: Tv },
    { id: 'fm', label: 'Wasafi FM', icon: Radio },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'events', label: 'Events', icon: Star },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'artists', label: 'Artists', icon: Music },
    { id: 'profile', label: 'Account', icon: UserCircle },
  ];

  const renderContent = () => {
    if (!splashDone) return null; // Splash renders separately
    if (!onboardingComplete) return <Onboarding onComplete={() => setOnboardingComplete(true)} />;
    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

    switch (activeTab) {
      case 'home': return <Home artists={filteredArtists} trendingShows={filteredShows} searchQuery={searchQuery} />;
      case 'tv': return <WasafiTV />;
      case 'fm': return <WasafiFM isPlaying={isPlaying} setIsPlaying={setIsPlaying} />;
      case 'news': return <WasafiNews />;
      case 'support': return <Support />;
      case 'events': return <Events />;
      case 'artists': return <ArtistsList artists={filteredArtists} />;
      case 'profile': return <Profile />;
      default: return <Home artists={filteredArtists} trendingShows={filteredShows} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', position: 'relative' }}>
      {/* Persistent hidden audio player */}
      <audio ref={audioRef} src="/kamwambie.mp3" loop preload="auto" />

      {/* Splash screen — shown first */}
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      {onboardingComplete && isLoggedIn && (
        <header className="glass-morphism" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 3000, background: 'rgba(15,15,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <Logo size={40} />
              {isDesktop && (
                <div style={{ display: 'flex', gap: '30px' }}>
                  {navItems.map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => setActiveTab(item.id)}
                      style={{ background: 'none', border: 'none', color: activeTab === item.id ? 'var(--primary-red)' : 'var(--text-gray)', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'color 0.3s' }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
           </div>

           <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
              <div className="glass-morphism" style={{ padding: '8px 15px', borderRadius: '20px', display: isDesktop ? 'flex' : 'none', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)' }}>
                 <Search size={18} color="rgba(255,255,255,0.5)" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search premium content..." 
                   style={{ background: 'none', border: 'none', color: 'white', fontSize: '12px', outline: 'none', width: '200px' }} 
                 />
              </div>
              <Bell size={22} color="white" cursor="pointer" />
              {!isDesktop && <UserCircle size={22} color="white" onClick={() => setActiveTab('profile')} />}
           </div>
        </header>
      )}

      <main style={{ paddingBottom: isDesktop ? '0' : '100px' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={onboardingComplete ? (isLoggedIn ? activeTab : 'login') : 'onboarding'}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {onboardingComplete && isLoggedIn && activeTab !== 'tv' && activeTab !== 'fm' && activeTab !== 'support' && activeTab !== 'events' && activeTab !== 'news' && (
        <AnimatePresence>
          <motion.div 
            initial={{ x: 200 }} animate={{ x: 0 }}
            className="glass-morphism" 
            style={{ position: 'fixed', bottom: isDesktop ? '40px' : '95px', right: '20px', width: '320px', height: '65px', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 15px', zIndex: 1900, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(225,29,72,0.4)', background: 'rgba(15,15,15,0.95)' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', marginRight: '12px' }}>
              <img src={currentMedia.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{currentMedia.title}</div>
              <div style={{ fontSize: '10px', color: 'var(--primary-red)', fontWeight: 800 }}>LIVE ON AIR</div>
            </div>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'var(--primary-red)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isPlaying ? <Pause size={16} fill="white" color="white" /> : <Play size={16} fill="white" color="white" style={{ marginLeft: '1px' }} />}
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {onboardingComplete && isLoggedIn && !isDesktop && (
        <nav className="glass-morphism" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 3000, borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,15,0.95)' }}>
          {navItems.filter(item => ['home', 'tv', 'fm', 'news', 'support'].includes(item.id)).map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: activeTab === item.id ? 'var(--primary-red)' : 'var(--text-gray)' }}>
              <item.icon size={22} />
              <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;
