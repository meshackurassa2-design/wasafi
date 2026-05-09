import React, { useState, useEffect } from 'react';
import { UserCircle, Crown, Settings, LogOut, ChevronRight, Gift, Download, Clock, Star, Share2, ShieldCheck, Loader2, Camera, Edit3, Play, Calendar, Radio, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { supabase } from '../lib/supabase';
import AdminVideos from './AdminVideos';
import AdminNews from './AdminNews';
import AdminEvents from './AdminEvents';
import AdminRadio from './AdminRadio';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('main'); // 'main', 'admin-videos', 'admin-news', 'admin-events', 'admin-radio'

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`profile-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles', 
        filter: `id=eq.${userId}` 
      }, (payload) => {
        setProfile(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-black)' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary-red)" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-black)', gap: '20px' }}>
         <UserCircle size={60} color="var(--text-gray)" />
         <p style={{ color: 'white', fontWeight: 900 }}>SESSION EXPIRED</p>
         <button onClick={() => window.location.reload()} style={{ background: 'var(--primary-red)', padding: '12px 25px', borderRadius: '30px', color: 'white', border: 'none', fontWeight: 950 }}>RELOGIN</button>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0].toUpperCase() || 'USER';

  if (view === 'admin-videos') return <AdminVideos onBack={() => setView('main')} />;
  if (view === 'admin-news') return <AdminNews onBack={() => setView('main')} />;
  if (view === 'admin-events') return <AdminEvents onBack={() => setView('main')} />;
  if (view === 'admin-radio') return <AdminRadio onBack={() => setView('main')} />;

  return (
    <div className="fade-in" style={{ padding: '0', paddingBottom: '140px', background: 'var(--bg-black)' }}>
      
      {/* Header Dashboard Section */}
      <div style={{ background: 'linear-gradient(135deg, rgba(225,29,72,0.15) 0%, transparent 100%)', padding: '40px 25px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <UserCircle size={50} color="rgba(255,255,255,0.8)" />
                    )}
                </div>
                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#F59E0B', borderRadius: '8px', padding: '4px', border: '2px solid var(--bg-black)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <Crown size={12} color="white" fill="white" />
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 950, textTransform: 'uppercase' }}>{displayName}</h2>
                    {profile?.is_verified && <ShieldCheck size={18} color="#3B82F6" />}
                </div>
                <p style={{ color: 'var(--text-gray)', fontWeight: 700, fontSize: '13px' }}>WASAFI VIP • ID: #{user.id.slice(0, 5).toUpperCase()}</p>
                <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <Star size={10} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.5px' }}>
                      {(profile?.is_admin || user?.email === 'meshackurassa2@gmail.com') ? 'ADMIN ACCESS' : 'PREMIUM PLUS'}
                    </span>
                 </div>
            </div>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${displayName} Wasafi Profile`,
                    url: window.location.href
                  }).catch(console.error);
                }
              }}
              style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
            >
                <Share2 size={18} color="white" />
            </button>
         </div>

      </div>

      <div style={{ padding: '25px' }}>
         
         {/* Action Quick Grid */}
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <motion.div whileTap={{ scale: 0.96 }} className="glass-morphism" style={{ padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(225,29,72,0.2)', background: 'rgba(225,29,72,0.03)' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Download size={20} color="white" />
               </div>
               <div>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>DOWNLOADS</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{profile?.study_minutes || 0} Tracks</div>
               </div>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }} className="glass-morphism" style={{ padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Edit3 size={20} color="var(--text-gray)" />
               </div>
               <div>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>BIO</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{profile?.bio || 'No bio set'}</div>
               </div>
            </motion.div>
         </div>

         {/* Admin Tools Section */}
         {(profile?.is_admin || user?.email === 'meshackurassa2@gmail.com') && (
            <div style={{ marginBottom: '30px' }}>
               <h3 style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary-red)', letterSpacing: '1.5px', marginBottom: '15px' }}>ADMINISTRATION DASHBOARD</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  
                  <motion.div 
                     onClick={() => setView('admin-videos')}
                     whileTap={{ scale: 0.98 }} 
                     style={{ padding: '18px', borderRadius: '22px', background: 'rgba(225,29,72,0.05)', border: '1px solid rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                  >
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Play size={18} color="white" fill="white" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 900 }}>TV Library</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Videos & Thumbnails</div>
                     </div>
                     <ChevronRight size={18} color="var(--primary-red)" />
                  </motion.div>

                  <motion.div 
                     onClick={() => setView('admin-news')}
                     whileTap={{ scale: 0.98 }} 
                     style={{ padding: '18px', borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                  >
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Newspaper size={18} color="white" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 900 }}>Wasafi News</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Publish Articles</div>
                     </div>
                     <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                  </motion.div>

                  <motion.div 
                     onClick={() => setView('admin-events')}
                     whileTap={{ scale: 0.98 }} 
                     style={{ padding: '18px', borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                  >
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Calendar size={18} color="white" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 900 }}>Event Portal</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Post Tours & Shows</div>
                     </div>
                     <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                  </motion.div>

                  <motion.div 
                     onClick={() => setView('admin-radio')}
                     whileTap={{ scale: 0.98 }} 
                     style={{ padding: '18px', borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                  >
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Radio size={18} color="white" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 900 }}>Radio FM</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Manage Tracks</div>
                     </div>
                     <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                  </motion.div>

               </div>
            </div>
         )}

         {/* Settings Menu List */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
               { icon: Settings, label: 'Account Settings', color: 'var(--text-gray)', desc: user.email },
               { icon: LogOut, label: 'Sign Out Account', color: 'var(--primary-red)', desc: 'Securely log out', action: handleSignOut }
            ].map((item, i) => (
                <motion.div 
                    key={i} 
                    onClick={item.action}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }} 
                    style={{ padding: '15px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                         <item.icon size={18} color={item.color} />
                      </div>
                      <div>
                         <span style={{ fontSize: '14px', fontWeight: 800, color: i === 3 ? 'var(--primary-red)' : 'white' }}>{item.label}</span>
                         <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{item.desc}</div>
                      </div>
                   </div>
                   {i !== 3 && <ChevronRight size={16} color="rgba(255,255,255,0.2)" />}
                </motion.div>
            ))}
         </div>

         <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.3 }}>
            <Logo size={30} />
            <div style={{ fontSize: '10px', fontWeight: 900, marginTop: '10px', letterSpacing: '2px', color: 'white' }}>
               V8.1.0 PREMIUM EDITION
            </div>
         </div>
      </div>

    </div>
  );
};

export default Profile;
