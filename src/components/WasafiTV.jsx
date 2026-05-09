import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, Heart, Share2, SkipForward, SkipBack, RotateCcw, RotateCw, Loader2, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';

const WasafiTV = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
    const saved = localStorage.getItem('wasafi_tv_index');
    return saved ? parseInt(saved) : 0;
  });
  const [progress, setProgress] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`;
    }
    return url;
  };

  const isYouTube = (url) => url?.includes('youtube.com') || url?.includes('youtu.be');
  const [user, setUser] = useState(null);
  const initialSeekDone = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // 1. Try fetching from Database (Primary)
        const { data: dbVideos, error: dbError } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbVideos && dbVideos.length > 0) {
          const mapped = dbVideos.map(v => ({
            id: v.id,
            title: v.title,
            url: v.video_url,
            thumb: v.thumbnail_url || "https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg",
            isExclusive: v.is_exclusive,
            description: `Official Wasafi Premium content: ${v.title}. Stay tuned for more exclusive updates.`
          }));
          setPlaylist(mapped);
        } else {
          // 2. Fallback to bucket listing if DB is empty
          const { data: files, error } = await supabase.storage
            .from('videos')
            .list('', { limit: 100, sortBy: { column: 'name', order: 'desc' } });

          if (files) {
            const formatted = files
              .filter(file => file.name !== '.emptyFolderPlaceholder')
              .map(file => {
                const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(file.name);
                const title = file.name.split('.')[0].replace(/_/g, ' ').toUpperCase();
                return {
                  id: file.id,
                  title,
                  url: publicUrl,
                  thumb: "https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg",
                  isExclusive: true,
                  description: `Broadcast via Wasafi Cloud: ${title}.`
                };
              });
            setPlaylist(formatted);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const currentVideo = playlist[currentVideoIndex];
  const nextVideo = playlist[(currentVideoIndex + 1) % playlist.length];

  useEffect(() => {
    if (!currentVideo) return;
    const fetchLikes = async () => {
      const { count } = await supabase.from('video_likes').select('*', { count: 'exact', head: true }).eq('video_id', currentVideo.id);
      setLikesCount(count || 0);
      if (user) {
        const { data } = await supabase.from('video_likes').select('id').eq('video_id', currentVideo.id).eq('user_id', user.id).single();
        setHasLiked(!!data);
      }
    };
    fetchLikes();
    const channel = supabase.channel(`video-likes-${currentVideo.id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'video_likes', filter: `video_id=eq.${currentVideo.id}` }, () => fetchLikes()).subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentVideo, user]);

  useEffect(() => {
    if (videoRef.current && currentVideo) {
      if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
      else videoRef.current.pause();
    }
  }, [isPlaying, currentVideoIndex, currentVideo]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const skipTime = (seconds) => { if (videoRef.current) videoRef.current.currentTime += seconds; };
  const handleNext = () => { 
    setCurrentVideoIndex((prev) => {
      const next = (prev + 1) % playlist.length;
      localStorage.setItem('wasafi_tv_index', next);
      localStorage.removeItem('wasafi_tv_time'); // Clear time for next video
      return next;
    }); 
    setIsPlaying(true); 
    initialSeekDone.current = false;
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) => {
      const next = prev === 0 ? playlist.length - 1 : prev - 1;
      localStorage.setItem('wasafi_tv_index', next);
      localStorage.removeItem('wasafi_tv_time'); // Clear time for prev video
      return next;
    });
    setIsPlaying(true);
    initialSeekDone.current = false;
  };

  const handleTimeUpdate = () => { 
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100); 
      
      // Save position every 5 seconds or so to avoid excessive writes, 
      // but here we just do it to meet the requirement "know where user ended"
      localStorage.setItem('wasafi_tv_time', currentTime);
    } 
  };

  // Handle Resume Position
  useEffect(() => {
    if (videoRef.current && playlist.length > 0 && !initialSeekDone.current) {
      const savedTime = localStorage.getItem('wasafi_tv_time');
      if (savedTime) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
      initialSeekDone.current = true;
    }
  }, [playlist, currentVideoIndex]);

  const toggleLike = async () => {
    if (!user) {
      alert("Please login to like videos! Click the profile icon to login.");
      return;
    }
    if (!currentVideo) return;
    if (hasLiked) await supabase.from('video_likes').delete().eq('video_id', currentVideo.id).eq('user_id', user.id);
    else await supabase.from('video_likes').insert([{ video_id: currentVideo.id, user_id: user.id }]);
  };

  if (loading) {
    return (
      <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary-red)" />
        <p style={{ color: 'var(--text-gray)', fontWeight: 700 }}>SYNCING WASAFI CLOUD...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto', background: 'linear-gradient(to bottom, #0f0f0f, #000)', minHeight: '100vh' }}>
      
      {/* Header Info (Visible on mobile/desktop) */}
      <div style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary-red)', paddingLeft: '15px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 950, color: 'white', marginBottom: '5px' }}>WASAFI PREMIUM TV</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 600 }}>EXCLUSIVE BROADCAST • 4K ULTRA HD</p>
      </div>

      <div className="tv-grid-container" style={{ display: 'grid', gap: '30px' }}>
        
        {/* LEFT COLUMN: Main Player */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="player-wrapper" style={{ width: '100%', backgroundColor: '#000', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
             <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                {isYouTube(currentVideo?.url) ? (
                   <iframe 
                      src={getEmbedUrl(currentVideo?.url)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                   />
                ) : (
                  <video 
                      ref={videoRef}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleNext}
                      src={currentVideo?.url}
                      poster={currentVideo?.thumb}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                
                {/* Floating "Exclusive" Badge on Player */}
                {currentVideo?.isExclusive && (
                    <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(225,29,72,0.9)', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 950, backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 10 }}>
                        EXCLUSIVE ON WASAFI TV
                    </div>
                )}

                {/* Custom Controls Overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)', padding: '40px 20px 20px', zIndex: 10 }}>
                    {/* Progress Bar */}
                    <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '20px', borderRadius: '2px', cursor: 'pointer' }} onClick={(e) => { if (videoRef.current) { const rect = e.currentTarget.getBoundingClientRect(); const p = (e.clientX - rect.left) / rect.width; videoRef.current.currentTime = p * videoRef.current.duration; } }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-red)', transition: 'width 0.1s linear', position: 'relative' }}>
                           <div style={{ position: 'absolute', right: -4, top: -4, width: '12px', height: '12px', borderRadius: '50%', background: 'white', boxShadow: '0 0 10px var(--primary-red)' }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                            <button onClick={togglePlay} style={{ background: 'white', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                                {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} style={{ marginLeft: '2px' }} />}
                            </button>
                            <button onClick={() => skipTime(-10)} style={{ color: 'white', opacity: 0.8 }}><RotateCcw size={22} /></button>
                            <button onClick={() => skipTime(10)} style={{ color: 'white', opacity: 0.8 }}><RotateCw size={22} /></button>
                            <button onClick={handleNext} style={{ color: 'white', opacity: 0.8 }}><SkipForward size={22} /></button>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <button onClick={handlePrevious} style={{ color: 'white', opacity: 0.8 }}><SkipBack size={22} /></button>
                            <Volume2 color="white" size={20} style={{ opacity: 0.8 }} />
                            <button onClick={() => videoRef.current.requestFullscreen()} style={{ color: 'white', opacity: 0.8 }}><Maximize size={20} /></button>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          <div className="video-info" style={{ padding: '10px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <div>
                   <h2 style={{ fontSize: '28px', fontWeight: 950, color: 'white', marginBottom: '8px', textTransform: 'uppercase' }}>{currentVideo?.title}</h2>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--primary-red)', fontWeight: 900 }}>WASAFI MEDIA NETWORK</span>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                      <span style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>PREMIUM BROADCAST</span>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                   <button onClick={toggleLike} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', color: hasLiked ? 'var(--primary-red)' : 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heart size={18} fill={hasLiked ? "currentColor" : "none"} /> {likesCount}
                   </button>
                   <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', color: 'white', fontWeight: 800 }}>
                      <Share2 size={18} />
                   </button>
                </div>
             </div>
             
             <div style={{ marginTop: '25px', padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{currentVideo?.description}</p>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Playlist */}
        <div className="playlist-sidebar">
           <div style={{ padding: '0 0 20px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 950, color: 'white' }}>UP NEXT</h3>
              <span style={{ fontSize: '11px', color: 'var(--primary-red)', fontWeight: 900 }}>{playlist.length} VIDEOS</span>
           </div>

           <div className="playlist-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {playlist.map((item, index) => (
                <div 
                  key={item.id} 
                  onClick={() => { setCurrentVideoIndex(index); setIsPlaying(true); }}
                  style={{ 
                    display: 'flex', gap: '15px', padding: '12px', borderRadius: '18px', alignItems: 'center', cursor: 'pointer',
                    background: currentVideoIndex === index ? 'linear-gradient(to right, rgba(225,29,72,0.15), transparent)' : 'rgba(255,255,255,0.03)',
                    border: currentVideoIndex === index ? '1px solid rgba(225,29,72,0.4)' : '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ width: '120px', height: '68px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#111' }}>
                    <img 
                      src={item.thumb} 
                      onError={(e) => { e.target.src = "https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg"; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: item.isExclusive ? 0.7 : 1 }} 
                    />
                    {item.isExclusive && (
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                          <span style={{ fontSize: '8px', fontWeight: 950, color: 'white', letterSpacing: '0.5px' }}>EXCLUSIVE</span>
                       </div>
                    )}
                    {currentVideoIndex === index && (
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(225,29,72,0.3)' }}>
                          <div className="pulse" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }}></div>
                       </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: currentVideoIndex === index ? 'var(--primary-red)' : 'white', lineHeight: '1.2', marginBottom: '5px' }}>{item.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-gray)', fontWeight: 700 }}>{index === currentVideoIndex ? 'NOW PLAYING' : 'OFFICIAL BROADCAST'}</div>
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tv-grid-container {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .tv-grid-container {
            grid-template-columns: 1fr 400px;
          }
          .playlist-sidebar {
             max-height: calc(100vh - 140px);
             position: sticky;
             top: 100px;
          }
          .playlist-scroll {
             max-height: calc(100vh - 220px);
             overflow-y: auto;
             padding-right: 10px;
          }
          .playlist-scroll::-webkit-scrollbar { width: 4px; }
          .playlist-scroll::-webkit-scrollbar-thumb { background: rgba(225,29,72,0.3); border-radius: 10px; }
        }
        .playlist-scroll > div:hover {
           background-color: rgba(255,255,255,0.07) !important;
           transform: translateX(5px);
        }
      `}} />
    </div>
  );
};

export default WasafiTV;
