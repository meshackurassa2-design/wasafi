import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Play, 
  Newspaper, 
  Calendar, 
  Radio, 
  Plus, 
  ChevronRight, 
  ArrowLeft,
  LayoutDashboard,
  Music as MusicIcon,
  Video as VideoIcon,
  Users,
  TrendingUp,
  BarChart3,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminVideos from './AdminVideos';
import AdminNews from './AdminNews';
import AdminEvents from './AdminEvents';
import AdminRadio from './AdminRadio';

const Studio = () => {
  const [activeTool, setActiveTool] = useState(null); // null, 'videos', 'news', 'events', 'radio'
  const [stats, setStats] = useState({
    videos: 0,
    news: 0,
    events: 0,
    tracks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [v, n, e, r] = await Promise.all([
          supabase.from('videos').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('radio_music').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          videos: v.count || 0,
          news: n.count || 0,
          events: e.count || 0,
          tracks: r.count || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (activeTool === 'videos') return <AdminVideos onBack={() => setActiveTool(null)} />;
  if (activeTool === 'news') return <AdminNews onBack={() => setActiveTool(null)} />;
  if (activeTool === 'events') return <AdminEvents onBack={() => setActiveTool(null)} />;
  if (activeTool === 'radio') return <AdminRadio onBack={() => setActiveTool(null)} />;

  return (
    <div className="fade-in" style={{ paddingBottom: '140px', color: 'white' }}>
      
      {/* Header Section */}
      <div style={{ padding: '60px 40px 40px', background: 'linear-gradient(to bottom, rgba(225,29,72,0.15) 0%, transparent 100%)' }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary-red)" />
                  <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--primary-red)', letterSpacing: '2px' }}>WCB WASAFI OFFICIAL</span>
               </div>
               <h1 style={{ fontSize: '42px', fontWeight: 950, letterSpacing: '-1.5px' }}>WASAFI <span style={{ color: 'var(--primary-red)' }}>STUDIO</span></h1>
               <p style={{ color: 'var(--text-gray)', fontWeight: 600, fontSize: '16px', marginTop: '10px' }}>Unified command center for TV, Radio, and News operations.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '15px 25px', textAlign: 'right' }}>
               <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)', marginBottom: '5px' }}>SYSTEM STATUS</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                  <span style={{ fontSize: '13px', fontWeight: 900 }}>OPERATIONAL</span>
               </div>
            </div>
         </div>
      </div>

      {/* Stats Quick Look */}
      <div style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '50px' }}>
         {[
           { label: 'TOTAL VIDEOS', value: stats.videos, icon: Play },
           { label: 'NEWS ARTICLES', value: stats.news, icon: Newspaper },
           { label: 'ACTIVE EVENTS', value: stats.events, icon: Calendar },
           { label: 'RADIO TRACKS', value: stats.tracks, icon: Radio }
         ].map((stat, i) => (
            <div key={i} className="glass-morphism" style={{ padding: '25px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <stat.icon size={20} color="var(--text-gray)" />
                  </div>
                  <TrendingUp size={16} color="#10B981" />
               </div>
               <div style={{ fontSize: '32px', fontWeight: 950 }}>{loading ? '...' : stat.value}</div>
               <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)', letterSpacing: '1px', marginTop: '5px' }}>{stat.label}</div>
            </div>
         ))}
      </div>

      {/* Management Cards */}
      <div style={{ padding: '0 40px' }}>
         <h2 style={{ fontSize: '20px', fontWeight: 950, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={22} color="var(--primary-red)" /> CONTROL CENTER
         </h2>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            
            {/* TV Management */}
            <motion.div 
               whileHover={{ y: -8 }}
               onClick={() => setActiveTool('videos')}
               className="glass-morphism" 
               style={{ padding: '35px', borderRadius: '35px', border: '1px solid rgba(225,29,72,0.15)', background: 'rgba(225,29,72,0.03)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
               <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary-red)', filter: 'blur(80px)', opacity: 0.1 }} />
               <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 15px 30px rgba(225,29,72,0.3)' }}>
                     <VideoIcon size={32} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '5px' }}>TV LIBRARY</h3>
                     <p style={{ color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>Upload music videos, exclusive interviews, and manage thumbnails.</p>
                  </div>
                  <Plus size={30} color="var(--primary-red)" />
               </div>
            </motion.div>

            {/* Radio Management */}
            <motion.div 
               whileHover={{ y: -8 }}
               onClick={() => setActiveTool('radio')}
               className="glass-morphism" 
               style={{ padding: '35px', borderRadius: '35px', border: '1px solid rgba(37,99,235,0.15)', background: 'rgba(37,99,235,0.03)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
               <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: '#2563EB', filter: 'blur(80px)', opacity: 0.1 }} />
               <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: '#2563EB', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 15px 30px rgba(37,99,235,0.3)' }}>
                     <Radio size={32} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '5px' }}>RADIO FM</h3>
                     <p style={{ color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>Push new tracks to Wasafi FM stream. Manage audio files and cover art.</p>
                  </div>
                  <Plus size={30} color="#2563EB" />
               </div>
            </motion.div>

            {/* News Management */}
            <motion.div 
               whileHover={{ y: -8 }}
               onClick={() => setActiveTool('news')}
               className="glass-morphism" 
               style={{ padding: '35px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
            >
               <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <Newspaper size={32} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '5px' }}>PRESS BUREAU</h3>
                     <p style={{ color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>Publish breaking news, entertainment updates, and lifestyle blogs.</p>
                  </div>
                  <Plus size={30} color="white" />
               </div>
            </motion.div>

            {/* Events Management */}
            <motion.div 
               whileHover={{ y: -8 }}
               onClick={() => setActiveTool('events')}
               className="glass-morphism" 
               style={{ padding: '35px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
            >
               <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <Calendar size={32} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '5px' }}>EVENTS PORTAL</h3>
                     <p style={{ color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>Post festival dates, stadium tours, and exclusive club showcases.</p>
                  </div>
                  <Plus size={30} color="white" />
               </div>
            </motion.div>

         </div>
      </div>

   </div>
  );
};

export default Studio;
