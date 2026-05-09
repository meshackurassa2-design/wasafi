import React, { useState, useEffect } from 'react';
import { Newspaper, Flame, Heart, Share2, Clock, ChevronRight, ArrowLeft, MoreHorizontal, MessageSquare, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const WasafiNews = () => {
  const [activeCategory, setActiveCategory] = useState('Hot');
  const [selectedNews, setSelectedNews] = useState(null);
  const [dbNews, setDbNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [likesMap, setLikesMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [userLikes, setUserLikes] = useState({});

  const categories = ['Hot', 'Music', 'Lifestyle', 'Sports'];

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          const formatted = data.map(item => ({
            id: item.id,
            category: item.category,
            title: item.title,
            summary: item.summary,
            image: item.image_url,
            imageUrls: item.news_images || [],
            tags: item.news_tags || [],
            time: getTimeAgo(item.created_at),
            author: item.author_name,
            authorRole: item.author_role,
            readTime: item.read_time,
            fullContent: item.content
          }));
          setDbNews(formatted);
          
          // Fetch likes and comments for each
          data.forEach(item => {
            fetchStats(item.id);
          });
        }
      } catch (err) {
        console.error("News fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Subscribe to news changes
    const channel = supabase.channel('news-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => fetchNews())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchStats = async (newsId) => {
    // Likes count
    const { count: likeCount } = await supabase.from('news_likes').select('*', { count: 'exact', head: true }).eq('news_id', newsId);
    setLikesMap(prev => ({ ...prev, [newsId]: likeCount || 0 }));

    // Comments count
    const { count: commentCount } = await supabase.from('news_comments').select('*', { count: 'exact', head: true }).eq('news_id', newsId);
    setCommentsMap(prev => ({ ...prev, [newsId]: commentCount || 0 }));

    // User liked
    if (user) {
      const { data } = await supabase.from('news_likes').select('id').eq('news_id', newsId).eq('user_id', user.id).single();
      setUserLikes(prev => ({ ...prev, [newsId]: !!data }));
    }
  };

  // Real-time listeners for stats
  useEffect(() => {
    if (dbNews.length === 0) return;
    
    const channels = dbNews.map(news => {
      return supabase.channel(`stats-${news.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'news_likes', filter: `news_id=eq.${news.id}` }, () => fetchStats(news.id))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'news_comments', filter: `news_id=eq.${news.id}` }, () => fetchStats(news.id))
        .subscribe();
    });

    return () => channels.forEach(c => supabase.removeChannel(c));
  }, [dbNews, user]);

  const toggleLike = async (newsId) => {
    if (!user) {
      alert("Please login to like articles! Click the profile icon to login.");
      return;
    }
    const isLiked = userLikes[newsId];
    if (isLiked) {
      await supabase.from('news_likes').delete().eq('news_id', newsId).eq('user_id', user.id);
    } else {
      await supabase.from('news_likes').insert([{ news_id: newsId, user_id: user.id }]);
    }
    fetchStats(newsId);
  };

  const filteredNews = activeCategory === 'Hot' ? dbNews : dbNews.filter(item => item.category === activeCategory);

  // --- News Detail with Comments ---
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchFullComments = async (newsId) => {
    setLoadingComments(true);
    const { data } = await supabase
      .from('news_comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('news_id', newsId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
    setLoadingComments(false);
  };

  useEffect(() => {
    if (selectedNews) {
      fetchFullComments(selectedNews.id);
      // Real-time for full comments
      const channel = supabase.channel(`full-comments-${selectedNews.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'news_comments', filter: `news_id=eq.${selectedNews.id}` }, () => fetchFullComments(selectedNews.id))
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [selectedNews]);

  const postComment = async () => {
    if (!user) {
      alert("Please login to join the conversation! Click the profile icon to login.");
      return;
    }
    if (!newComment.trim() || !selectedNews) return;
    const { error } = await supabase.from('news_comments').insert([
      { news_id: selectedNews.id, user_id: user.id, content: newComment.trim() }
    ]);
    if (!error) {
      setNewComment('');
      fetchFullComments(selectedNews.id);
    }
  };

  const renderNewsDetail = (news) => (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: 5000, backgroundColor: 'var(--bg-black)', 
        overflowY: 'auto'
      }}
    >
      <div style={{ position: 'relative', height: '45vh', minHeight: '320px', backgroundColor: '#000' }}>
        {news.imageUrls && news.imageUrls.length > 1 ? (
          <div style={{ display: 'flex', overflowX: 'auto', height: '100%', scrollSnapType: 'x mandatory' }} className="no-scrollbar">
            {news.imageUrls.map((url, i) => (
              <img key={i} src={url} style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0, scrollSnapAlign: 'start' }} alt={`${news.title} ${i+1}`} />
            ))}
          </div>
        ) : (
          <img src={news.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={news.title} />
        )}
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-black) 0%, transparent 60%), linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%)', pointerEvents: 'none' }} />
        
        {news.imageUrls && news.imageUrls.length > 1 && (
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 900, backdropFilter: 'blur(10px)', color: 'white' }}>
            SWIPE FOR MORE ({news.imageUrls.length})
          </div>
        )}

        <button 
          onClick={() => setSelectedNews(null)}
          style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225,29,72,0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(225,29,72,0.2)', marginBottom: '20px' }}>
          <Flame size={12} color="var(--primary-red)" />
          <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary-red)', textTransform: 'uppercase' }}>{news.category}</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 950, lineHeight: 1.2, marginBottom: '20px' }}>{news.title}</h1>

        {news.tags && news.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' }}>
            {news.tags.map((tag, i) => (
              <span key={i} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '10px', fontWeight: 800, color: 'var(--text-gray)', border: '1px solid rgba(255,255,255,0.05)' }}>
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '15px', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: 900 }}>W</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>{news.author}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>{news.authorRole} • {news.time}</div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleLike(news.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: userLikes[news.id] ? 'var(--primary-red)' : 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
               <Heart size={22} fill={userLikes[news.id] ? "var(--primary-red)" : "none"} />
               <span style={{ fontWeight: 800 }}>{likesMap[news.id] || 0}</span>
            </motion.button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
               <MessageSquare size={22} />
               <span style={{ fontWeight: 800 }}>{commentsMap[news.id] || 0}</span>
            </div>
          </div>
        </div>

        <div 
          className="news-content-body"
          style={{ fontSize: '17px', color: '#BBB', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: news.fullContent }}
        />

        {/* Comments Section */}
        <div style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '25px' }}>COMMENTS ({comments.length})</h3>
           
           <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', color: 'white', fontSize: '14px', minHeight: '100px', resize: 'none' }}
                />
                <button 
                  onClick={postComment}
                  style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'var(--primary-red)', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: 'none' }}
                >
                  <Send size={16} />
                </button>
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {loadingComments ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" color="var(--primary-red)" /></div>
              ) : comments.map(comment => (
                <div key={comment.id} style={{ display: 'flex', gap: '15px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      {comment.profiles?.avatar_url && <img src={comment.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                         <span style={{ fontSize: '14px', fontWeight: 800 }}>{comment.profiles?.full_name || 'User'}</span>
                         <span style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{getTimeAgo(comment.created_at)}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{comment.content}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fade-in" style={{ padding: '0 0 140px 0', minHeight: '100vh' }}>
      <div style={{ padding: '40px 24px 20px', background: 'linear-gradient(to bottom, rgba(225,29,72,0.1) 0%, transparent 100%)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 950, letterSpacing: '-0.5px' }}>WASAFI NEWS</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: 600 }}>Exclusive updates from the WCB Bureau.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', padding: '0 24px 20px', overflowX: 'auto' }} className="no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              background: activeCategory === cat ? 'var(--primary-red)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} color="var(--primary-red)" /></div>
      ) : (
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredNews.map((news) => (
            <motion.div
              key={news.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedNews(news)}
              className="glass-morphism"
              style={{ borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}
            >
              <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                <img src={news.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={news.title} />
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary-red)', textTransform: 'uppercase' }}>{news.category}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-gray)', fontWeight: 700 }}>{news.time}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, lineHeight: 1.3, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-gray)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                         <Heart size={14} fill={userLikes[news.id] ? "var(--primary-red)" : "none"} color={userLikes[news.id] ? "var(--primary-red)" : "currentColor"} />
                         <span style={{ fontSize: '12px', fontWeight: 700 }}>{likesMap[news.id] || 0}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                         <MessageSquare size={14} />
                         <span style={{ fontSize: '12px', fontWeight: 700 }}>{commentsMap[news.id] || 0}</span>
                      </div>
                   </div>
                   <span style={{ fontSize: '11px', fontWeight: 700 }}>{news.readTime} read</span>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredNews.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-gray)' }}>
               <Newspaper size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
               <p style={{ fontWeight: 700 }}>No news published yet.</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedNews && renderNewsDetail(selectedNews)}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .news-content-body p { margin-bottom: 20px; }
        .news-content-body blockquote { 
          border-left: 4px solid var(--primary-red); 
          padding-left: 20px; 
          margin: 30px 0; 
          font-style: italic; 
          color: white; 
          font-weight: 700;
          font-size: 18px;
        }
      `}} />
    </div>
  );
};

export default WasafiNews;
