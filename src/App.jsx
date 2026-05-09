import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, Radio, Search, Bell, Home as HomeIcon, UserCircle, X, Pause, Music, Download, Star, Newspaper, HelpCircle, ShieldCheck } from 'lucide-react';
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
import Studio from './components/Studio';
import { supabase } from './lib/supabase';

import Logo from './components/Logo';

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('wasafi_active_tab') || 'home');
  
  useEffect(() => {
    localStorage.setItem('wasafi_active_tab', activeTab);
  }, [activeTab]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [currentMedia, setCurrentMedia] = useState({ title: "Kamwambie - Diamond Platnumz", thumb: "/icon.png" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [isPlayerDismissed, setIsPlayerDismissed] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setOnboardingComplete(true);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoggedIn(true);
        setOnboardingComplete(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setOnboardingComplete(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      setIsPlayerDismissed(false); // Show player when music starts
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (activeTab === 'fm') {
      setIsPlayerDismissed(false); // Reset dismissal when entering FM tab
    }
  }, [activeTab]);

  const artists = [
    { 
      id: 'diamond',
      name: "Diamond Platnumz", 
      image: "/artists/diamond.png",
      followers: "16M+ Followers",
      bio: "Naseeb Abdul Juma Issack, known as Diamond Platnumz, is the king of Bongo Flava and founder of WCB Wasafi.",
      fullBio: `
        <p><b>Naseeb Abdul Juma Issack</b>, popularly known by his stage name <b>Diamond Platnumz</b>, is a Tanzanian bongo flava recording artist, dancer, philanthropist and a businessman of Ha heritage. He was born and raised in Tandale, Dar es Salaam.</p>
        <p>Diamond is the founder and CEO of <b>WCB Wasafi</b> Record Label, Zoom Extra, Wasafi TV and Wasafi FM. He is among the most popular artists in East and Central Africa and has become the first Africa-based artist to reach a combined total of 900 million YouTube views.</p>
        <p>His breakthrough came in 2010 with the hit single "Kamwambie," which won three Tanzania Music Awards. Since then, he has collaborated with international stars like Rick Ross, Ne-Yo, and Alicia Keys, cementing his status as a global icon.</p>
      `,
      signatureHits: ["Waah!", "Baba Lao", "Number One", "Jeje"],
      socials: { ig: "https://www.instagram.com/diamondplatnumz/", yt: "https://www.youtube.com/@dplatnumz" },
      boomplay: "https://www.boomplay.com/artists/377"
    },
    { 
      id: 'zuchu',
      name: "Zuchu", 
      image: "/artists/zuchu.png",
      followers: "6M+ Followers",
      bio: "Zuhura Othman Soud, known as Zuchu, is the breakout queen of WCB Wasafi and Bongo Flava.",
      fullBio: `
        <p><b>Zuhura Othman Soud</b>, better known by her stage name <b>Zuchu</b>, is a Tanzanian singer and songwriter born in Zanzibar. She is currently based in Dar es Salaam and signed to the WCB Wasafi record label.</p>
        <p>Zuchu is the daughter of the legendary Taarab musician <b>Khadija Kopa</b>. She made her official debut in April 2020 with the EP "I Am Zuchu," which became an instant sensation across Africa.</p>
        <p>She has broken numerous records, including becoming the first female artist in East Africa to hit 1 million subscribers on YouTube. Her hit single "Sukari" has garnered over 100 million views, making her one of the most influential female voices in modern African music.</p>
      `,
      signatureHits: ["Sukari", "Mtasubiri", "Honey", "Kwikwi"],
      socials: { ig: "https://www.instagram.com/officialzuchu/", yt: "https://www.youtube.com/@officialzuchu" },
      boomplay: "https://www.boomplay.com/artists/11497950"
    },
    { 
      id: 'd-voice',
      name: "D Voice", 
      image: "/artists/dvoice.png",
      followers: "2M+ Followers",
      bio: "Abdul Hamisi Mtambo, known as D Voice, is the latest WCB sensation blending Singeli and Bongo Flava.",
      fullBio: `
        <p><b>Abdul Hamisi Mtambo</b>, known professionally as <b>D Voice</b>, is a rising Tanzanian star who was officially signed to WCB Wasafi in November 2023.</p>
        <p>Born in Temeke, Dar es Salaam, D Voice gained popularity in the underground <b>Singeli</b> scene before transitioning to the mainstream with his unique blend of high-energy rhythms and soulful Bongo Flava melodies.</p>
        <p>His debut album under Wasafi, <b>"Swahili Kid,"</b> has been met with critical acclaim, featuring collaborations with label mates like Diamond Platnumz and Zuchu. He represents the new generation of Tanzanian music, bringing fresh energy to the global stage.</p>
      `,
      signatureHits: ["Swahili Kid", "Kuachana", "Bam Bam"],
      socials: { ig: "https://www.instagram.com/dvoice_ginnii/", yt: "https://www.youtube.com/@itsdvoice" },
      boomplay: "https://www.boomplay.com/artists/14732645"
    },
  ];

  const filteredArtists = artists.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        // Admin check
        if (session.user.email === 'meshackurassa2@gmail.com') {
          setIsAdmin(true);
        } else {
          const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
          if (data?.is_admin) setIsAdmin(true);
        }
      }
    };
    checkUser();
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'tv', label: 'Wasafi TV', icon: Tv },
    { id: 'fm', label: 'Wasafi FM', icon: Radio },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'events', label: 'Events', icon: Star },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'artists', label: 'Artists', icon: Music },
    { id: 'profile', label: 'Account', icon: UserCircle },
    ...(isAdmin ? [{ id: 'studio', label: 'Studio', icon: ShieldCheck }] : []),
  ];

  const renderContent = () => {
    if (!splashDone) return null; // Splash renders separately
    if (!onboardingComplete) return <Onboarding onComplete={() => setOnboardingComplete(true)} />;
    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

    const handleArtistClick = (id) => {
      setSelectedArtistId(id);
      setActiveTab('artists');
    };

    switch (activeTab) {
      case 'home': return <Home artists={filteredArtists} searchQuery={searchQuery} onArtistClick={handleArtistClick} />;
      case 'tv': return <WasafiTV />;
      case 'fm': return <WasafiFM isPlaying={isPlaying} setIsPlaying={setIsPlaying} />;
      case 'news': return <WasafiNews />;
      case 'support': return <Support />;
      case 'events': return <Events />;
      case 'artists': return <ArtistsList artists={filteredArtists} initialArtistId={selectedArtistId} onClearArtist={() => setSelectedArtistId(null)} />;
      case 'profile': return <Profile />;
      case 'studio': return isAdmin ? <Studio /> : <Profile />;
      default: return <Home artists={filteredArtists} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}>
      {/* Persistent hidden audio player */}
      <audio ref={audioRef} src="/kamwambie.mp3" loop preload="auto" />

      {/* Splash screen — shown first */}
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}

      {/* DESKTOP SIDEBAR */}
      {splashDone && onboardingComplete && isLoggedIn && isDesktop && (
        <aside style={{ 
          width: '280px', 
          height: '100vh', 
          position: 'sticky', 
          top: 0, 
          background: 'rgba(10,10,10,0.98)', 
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: '30px 20px',
          zIndex: 4000
        }}>
          <div style={{ marginBottom: '50px', paddingLeft: '10px' }}>
            <Logo size={35} />
          </div>

          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  background: activeTab === item.id ? 'rgba(225,29,72,0.1)' : 'transparent',
                  border: 'none',
                  color: activeTab === item.id ? 'var(--primary-red)' : 'var(--text-gray)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
              >
                <item.icon size={22} color={activeTab === item.id ? 'var(--primary-red)' : 'currentColor'} />
                <span style={{ fontSize: '14px', fontWeight: 850, letterSpacing: '0.5px' }}>{item.label.toUpperCase()}</span>
              </button>
            ))}
          </nav>

        </aside>
      )}

      {/* MAIN VIEWPORT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {onboardingComplete && isLoggedIn && splashDone && (
          <header className="glass-morphism" style={{ 
            height: '80px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 40px', 
            position: 'sticky', 
            top: 0, 
            zIndex: 3000, 
            background: 'rgba(15,15,15,0.95)', 
            borderBottom: '1px solid rgba(255,255,255,0.08)' 
          }}>
             {!isDesktop ? (
                <Logo size={28} />
             ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star size={18} color="var(--primary-red)" />
                   </div>
                   <div style={{ fontSize: '14px', fontWeight: 900 }}>WASAFI <span style={{ color: 'var(--primary-red)' }}>HQ</span></div>
                </div>
             )}

             <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <div className="glass-morphism" style={{ padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <Search size={18} color="rgba(255,255,255,0.5)" />
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search premium content..." 
                     style={{ background: 'none', border: 'none', color: 'white', fontSize: '13px', outline: 'none', width: isDesktop ? '350px' : '150px' }} 
                   />
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', cursor: 'pointer' }}>
                   <Bell size={20} color="white" />
                   <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--primary-red)', borderRadius: '50%', border: '2px solid #000' }}></div>
                </div>
                <UserCircle size={28} color="white" cursor="pointer" onClick={() => setActiveTab('profile')} />
             </div>
          </header>
        )}

        <main style={{ paddingBottom: isDesktop ? '0' : '100px', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={onboardingComplete ? (isLoggedIn ? activeTab : 'login') : 'onboarding'}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {onboardingComplete && isLoggedIn && isPlaying && !isPlayerDismissed && activeTab !== 'tv' && activeTab !== 'fm' && activeTab !== 'support' && activeTab !== 'events' && activeTab !== 'news' && (
        <AnimatePresence>
          <motion.div 
            initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 200, opacity: 0 }}
            className="glass-morphism" 
            style={{ 
              position: 'fixed', 
              bottom: isDesktop ? '40px' : '95px', 
              right: isDesktop ? '20px' : '10px', 
              left: isDesktop ? 'auto' : '10px',
              width: isDesktop ? '320px' : 'auto', 
              height: '65px', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 15px', 
              zIndex: 1900, 
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
              border: '1px solid rgba(225,29,72,0.4)', 
              background: 'rgba(15,15,15,0.95)' 
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', marginRight: '12px' }}>
              <img src={currentMedia.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{currentMedia.title}</div>
              <div style={{ fontSize: '10px', color: 'var(--primary-red)', fontWeight: 800 }}>LIVE ON AIR</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'var(--primary-red)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isPlaying ? <Pause size={16} fill="white" color="white" /> : <Play size={16} fill="white" color="white" style={{ marginLeft: '1px' }} />}
              </button>
              <button onClick={() => setIsPlayerDismissed(true)} style={{ background: 'rgba(255,255,255,0.05)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <X size={14} color="white" />
              </button>
            </div>
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
