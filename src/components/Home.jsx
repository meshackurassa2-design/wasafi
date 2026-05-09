import React, { useState, useEffect } from 'react';
import { PlayCircle, Info, Radio, Tv, MapPin, Users, ChevronRight, Star, Award, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const ArtistCircle = ({ id, name, image, onArtistClick }) => (
  <motion.div 
    whileTap={{ scale: 0.95 }} 
    onClick={() => onArtistClick(id)}
    style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}
  >
    <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(225,29,72,0.3)', marginBottom: '8px', padding: '3px' }}>
      <img src={image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt={name} />
    </div>
    <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>{name}</div>
  </motion.div>
);

const SectionHeader = ({ title, subtitle, actionText }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'white' }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600, marginTop: '4px' }}>{subtitle}</p>}
    </div>
    {actionText && (
      <span style={{ color: 'var(--primary-red)', fontSize: '12px', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {actionText} <ChevronRight size={14} />
      </span>
    )}
  </div>
);

const Home = ({ artists, onArtistClick }) => {
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (data && Array.isArray(data)) {
          setTrendingVideos(data.slice(0, 4).map(v => ({
            id: v.id,
            title: v.title,
            views: (Math.random() * (2.5 - 0.5) + 0.5).toFixed(1) + 'M',
            time: 'NOW',
            duration: v.read_time || '5 min',
            thumb: v.image_url,
            artist: v.author_name
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);
  return (
    <main className="fade-in" style={{ paddingBottom: '100px' }}>
        {/* HERO SECTION - REFINED */}
        <section style={{ padding: '20px', position: 'relative', height: '520px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', borderRadius: '0 0 40px 40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--bg-black) 10%, transparent 70%), linear-gradient(to right, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.1) 100%), url("https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg") center top / cover no-repeat', zIndex: -1 }}></div>
          <div style={{ zIndex: 1, paddingBottom: '30px', maxWidth: '600px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(225,29,72,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(225,29,72,0.3)', padding: '6px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 950, marginBottom: '20px', color: 'var(--primary-red)' }}
            >
              <span className="pulse" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-red)', marginRight: '10px' }}></span>
              EXCLUSIVE BROADCAST
            </motion.div>
            <h2 style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 950, marginBottom: '16px', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.5)', letterSpacing: '-1.5px' }}>
              DIAMOND PLATNUMZ <br/> <span style={{ color: 'var(--primary-red)' }}>GLOBAL EXCLUSIVE</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 4vw, 16px)', color: 'rgba(255,255,255,0.7)', marginBottom: '30px', fontWeight: 500, lineHeight: 1.6 }}>The King of Bongo Flava sits down for an unfiltered conversation about the empire, the music, and the future of African entertainment.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: 'var(--primary-red)', padding: '16px 32px', borderRadius: '14px', fontWeight: 900, fontSize: '14px', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(225,29,72,0.4)', cursor: 'pointer' }}>
                <PlayCircle fill="white" size={20} color="var(--primary-red)" /> WATCH NOW
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="glass-morphism" style={{ padding: '16px 24px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                <Info size={20} />
              </motion.button>
            </div>
          </div>
        </section>

        {/* STORIES / ARTISTS QUICK LINKS */}
        <section style={{ padding: '30px 0 10px 20px' }}>
          <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '15px' }} className="no-scrollbar">
            {artists.map((art) => (
              <motion.div 
                key={`story-${art.id}`} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => onArtistClick(art.id)}
                style={{ flexShrink: 0, textAlign: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', marginBottom: '8px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '3px solid var(--bg-black)', overflow: 'hidden' }}>
                    <img src={art.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={art.name} />
                  </div>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{art.name.split(' ')[0]}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT US SECTION - PROFESSIONAL */}
        <section style={{ padding: '40px 20px' }}>
           <div className="glass-morphism" style={{ padding: '40px 30px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(225,29,72,0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--primary-red)', padding: '8px', borderRadius: '10px' }}>
                    <Star size={20} color="white" fill="white" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 950, letterSpacing: '-0.5px' }}>ABOUT <span style={{ color: 'var(--primary-red)' }}>WASAFI MEDIA</span></h3>
                </div>
                
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '30px', fontWeight: 500 }}>
                  We are a Tanzanian media powerhouse that offers both radio and television broadcasts. Founded by <b>Nasibu Abdul Juma Issaack (Diamond Platnumz)</b>, who serves as our CEO, Wasafi Media has revolutionized entertainment in East Africa.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Radio size={24} color="var(--primary-red)" style={{ marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '8px' }}>WASAFI FM</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.5' }}>Launched in 2018 with a focus on premium infotainment.</p>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Tv size={24} color="var(--primary-red)" style={{ marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '8px' }}>WASAFI TV</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.5' }}>The #1 destination for music and entertainment visuals.</p>
                   </div>
                </div>
              </div>
           </div>
        </section>

        {/* FOUNDER & CEO SECTION */}
        <section style={{ padding: '20px' }}>
           <SectionHeader title="THE VISIONARY" subtitle="Founder & CEO of Wasafi Media Network" />
           <div style={{ display: 'flex', gap: '25px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                 <img src="/artists/diamond.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Diamond Platnumz" />
              </div>
              <div>
                 <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '4px' }}>DIAMOND PLATNUMZ</h4>
                 <p style={{ fontSize: '12px', color: 'var(--primary-red)', fontWeight: 800, marginBottom: '12px', letterSpacing: '1px' }}>NASIBU ABDUL JUMA ISSAACK</p>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>ENTREPRENEUR</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>PHILANTHROPIST</div>
                 </div>
              </div>
           </div>
        </section>

        {/* REGIONAL PRESENCE */}
        <section style={{ padding: '40px 20px' }}>
           <SectionHeader title="REGIONAL PRESENCE" subtitle="Our headquarters and broadcast regions" />
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(225,29,72,0.05)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(225,29,72,0.1)' }}>
                 <MapPin size={24} color="var(--primary-red)" />
                 <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 900 }}>HEADQUARTERS</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Mbezi Beach, Dar es Salaam, Tanzania</p>
                 </div>
              </div>
              <div className="glass-morphism" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h5 style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-gray)', marginBottom: '15px', letterSpacing: '1px' }}>AVAILABLE IN:</h5>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {["ARUSHA", "MWANZA", "DODOMA", "MBEYA", "KAHAMA", "PWANI", "ZANZIBAR"].map(city => (
                      <div key={city} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, color: 'white' }}>
                        {city}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* TRENDING NOW - REFINED LIST */}
        <section style={{ padding: '20px' }}>
          <SectionHeader title="TRENDING NOW" actionText="SEE ALL" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={30} color="var(--primary-red)" />
              </div>
            ) : (
              trendingVideos.map((vid, i) => (
                <motion.div 
                  key={vid.id} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  style={{ display: 'flex', gap: '20px', padding: '12px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                >
                  <div style={{ width: '130px', height: '130px', borderRadius: '18px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <img src={vid.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={vid.title} />
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 900 }}>
                      {vid.duration}
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <TrendingUp size={12} color="var(--primary-red)" />
                      <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary-red)', letterSpacing: '1px' }}>TRENDING</span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 900, color: 'white', marginBottom: '8px', lineHeight: 1.3 }}>{vid.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>{vid.views} views</span>
                      <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                      <span style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>{vid.artist}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
    </main>
  );
};

export default Home;

