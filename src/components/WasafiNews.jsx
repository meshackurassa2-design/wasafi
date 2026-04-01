import React, { useState } from 'react';
import { Newspaper, Flame, Music, Heart, Share2, Clock, ChevronRight, ArrowLeft, MoreHorizontal, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WasafiNews = () => {
  const [activeCategory, setActiveCategory] = useState('Hot');
  const [selectedNews, setSelectedNews] = useState(null);

  const categories = ['Hot', 'Music', 'Lifestyle', 'Sports'];

  const newsItems = [
    {
      id: 1,
      category: 'Hot',
      title: "EXCLUSIVE: Diamond Platnumz Announces 'Wasafi Festival 2026' Dates",
      summary: "The biggest music festival in East Africa is returning this August with a massive lineup including international guest stars.",
      fullContent: `
        <p>Tanzanian music mogul and WCB Wasafi CEO, Diamond Platnumz, has officially announced the return of the 'Wasafi Festival' for 2026. This year's edition promises to be the largest in the festival's history, expanding to five major cities across East Africa.</p>
        
        <p>Speaking at a press conference in Dar es Salaam, the 'Waah' hitmaker confirmed that the festival will kick off on August 15th at the Samia Suluhu Hassan Stadium in Arusha. "We are bringing a global standard of entertainment to our doorstep. This isn't just a concert; it's a celebration of our culture," Diamond stated.</p>
        
        <p>Sources close to WCB have hinted at a massive international lineup, with rumors suggesting collaborations with major US and West African stars. The festival will also serve as a platform for emerging Gen-Z artists to showcase their talent on the big stage.</p>
        
        <blockquote>"Our goal is to create a sustainable ecosystem for African music where every artist, big or small, has a chance to shine." - Diamond Platnumz</blockquote>
        
        <p>Tickets are expected to go on sale early next month via the Wasafi Premium app, offering exclusive early-bird discounts for loyal fans.</p>
      `,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
      time: "2h ago",
      readTime: "5 min",
      author: "Hadija Mwanzo",
      authorRole: "Senior Entertainment Editor"
    },
    {
      id: 2,
      category: 'Music',
      title: "Zuchu Drops New Single 'Paradise' - Fans React on Social Media",
      summary: "Within 30 minutes of release, the track has already hit over 100k views on YouTube, trending at #1 in Tanzania.",
      fullContent: `
        <p>The queen of WCB Wasafi, Zuchu, has once again proven her dominance in the Bongo Flava scene with the release of her latest single, 'Paradise'. The track, which combines soulful melodies with a catchy Afro-pop beat, has sent social media into a frenzy.</p>
        
        <p>Released at midnight, 'Paradise' garnered over 100,000 views on YouTube in less than 30 minutes, breaking her previous records. The music video, shot on the picturesque beaches of Zanzibar, features high-end fashion and stunning choreography that has fans calling it her best work yet.</p>
        
        <p>"I wanted to create something that feels like home but sounds like the world," Zuchu shared in a brief social media post. Her fans, known as the 'Zuchu Nation', have been trending the hashtag #ParadiseZuchu across Twitter and Instagram since the launch.</p>
        
        <p>Industry critics have praised the song's production quality, handled by the legendary Lizer Classic at Wasafi Studios. The track is already being tipped as the 'Anthem of the Summer' for 2026.</p>
      `,
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop",
      time: "5h ago",
      readTime: "3 min",
      author: "Bakari Juma",
      authorRole: "Music & Trends Desk"
    },
    {
      id: 3,
      category: 'Lifestyle',
      title: "Inside the WCB Wasafi Headquarters: A Glimpse into the Hit Making Factory",
      summary: "Step inside the state-of-the-art studio where your favorite Bongo Flava hits are born. Exclusive tour inside.",
      fullContent: `
        <p>Ever wondered where the magic happens? We take you behind the scenes of the WCB Wasafi Headquarters in Dar es Salaam, a multi-million-dollar facility that has become the epicenter of East African music production.</p>
        
        <p>The facility boasts three world-class recording studios, a video editing suite, and a creative hub for content creators. Every corner of the office reflects the 'Work Hard, Play Hard' mantra of the WCB family.</p>
        
        <p>"It's about the environment. When you have the best tools and a space that inspires you, the hits come naturally," says Producer Lizer Classic as he shows us the main console room.</p>
        
        <p>The headquarters also features a private gym for the artists, a luxury lounge, and a boardroom where the strategic decisions that move the industry are made. This tour reveals why WCB remains at the top of the game – it's a perfectly oiled machine of creativity and business.</p>
      `,
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
      time: "1d ago",
      readTime: "8 min",
      author: "Sara Ibrahim",
      authorRole: "Feature Storytelling"
    },
    {
      id: 4,
      category: 'Music',
      title: "D Voice Prepares for First Global Tour: London and New York Confirmed",
      summary: "The Singeli king is taking the Tanzanian sound to the world stage following the massive success of his debut album.",
      fullContent: `
        <p>D Voice, the newest sensation under the WCB Wasafi umbrella, is set to make history as the first Singeli artist to embark on a full-scale global tour. Titled 'The Singeli Takeover', the tour will feature stops in London, New York, Paris, and Dubai.</p>
        
        <p>Since his debut last year, D Voice has successfully brought the high-energy Singeli sound to the mainstream. "I want the world to feel the heartbeat of Tandale. This tour is for every young person in the streets dreaming of something bigger," D Voice said during his rehearsals.</p>
        
        <p>The tour is set to begin in October 2026, with tickets going on sale later this year. WCB management has promised a high-octane stage show that blends traditional Singeli elements with modern international production standards.</p>
      `,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
      time: "3h ago",
      readTime: "4 min",
      author: "WCB Updates",
      authorRole: "Official Press"
    }
  ];

  const filteredNews = activeCategory === 'Hot' ? newsItems : newsItems.filter(item => item.category === activeCategory);

  // --- Render News Detail View ---
  const renderNewsDetail = (news) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: 5000, backgroundColor: 'var(--bg-black)', 
        overflowY: 'auto', paddingBottom: '40px'
      }}
    >
      {/* Detail Header */}
      <div style={{ position: 'relative', height: '45vh', minHeight: '300px' }}>
        <img src={news.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, var(--bg-black), transparent)' }} />
        
        {/* Back Button */}
        <button 
          onClick={() => setSelectedNews(null)}
          style={{ position: 'absolute', top: '20px', left: '20px', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Share2 size={20} />
          </button>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Detail Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-block', background: 'var(--primary-red)', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
          {news.category}
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', color: 'white' }}>{news.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '30px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: 900 }}>W</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>{news.author}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{news.authorRole} • {news.time}</div>
          </div>
          <div style={{ display: 'flex', gap: '15px', color: 'var(--text-gray)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <Clock size={14} />
               <span style={{ fontSize: '11px', fontWeight: 700 }}>{news.readTime}</span>
            </div>
          </div>
        </div>

        <div 
          className="news-content-body"
          style={{ fontSize: '17px', color: '#E0E0E0', lineHeight: 1.8, fontWeight: 400 }}
          dangerouslySetInnerHTML={{ __html: news.fullContent }}
        />

        <div style={{ marginTop: '50px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', gap: '20px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <Heart size={20} />
               <span style={{ fontSize: '14px', fontWeight: 700 }}>1.2K</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <MessageSquare size={20} />
               <span style={{ fontSize: '14px', fontWeight: 700 }}>84</span>
             </div>
           </div>
           <button style={{ color: 'var(--primary-red)', fontSize: '14px', fontWeight: 800 }}>FOLLOW BUREAU</button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fade-in" style={{ padding: '0 0 140px 0', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <div style={{ padding: '30px 24px 10px', background: 'linear-gradient(to bottom, rgba(225,29,72,0.15) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: 'var(--primary-red)', padding: '6px', borderRadius: '8px' }}>
                <Newspaper size={20} color="white" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>WASAFI NEWS</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 600, maxWidth: '400px' }}>Premium updates from the frontlines of African entertainment, music, and culture.</p>
      </div>

      {/* Category Selection */}
      <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', overflowX: 'auto', position: 'sticky', top: 0, background: 'var(--bg-black)', zIndex: 100 }} className="no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              background: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat ? 'black' : 'white',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeCategory === cat ? '0 10px 25px rgba(255,255,255,0.1)' : 'none'
            }}
          >
            {cat === 'Hot' && <Flame size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div style={{ padding: '20px 24px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '30px' 
            }}
          >
            {filteredNews.map((news) => (
              <motion.div
                key={news.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedNews(news)}
                className="glass-morphism"
                style={{ 
                   borderRadius: '24px', 
                   overflow: 'hidden', 
                   cursor: 'pointer',
                   border: '1px solid rgba(255,255,255,0.05)',
                   background: 'rgba(255,255,255,0.02)',
                   transition: 'box-shadow 0.3s'
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={news.image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} alt={news.title} className="news-card-img" />
                  <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary-red)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 900 }}>
                    {news.category.toUpperCase()}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-gray)', fontSize: '11px', fontWeight: 700 }}>
                    <Clock size={12} />
                    <span>{news.time}</span>
                    <span>•</span>
                    <span>{news.readTime} read</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'white', lineHeight: '1.3', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.summary}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 900 }}>W</div>
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>{news.author}</span>
                    </div>
                    <div style={{ color: 'var(--primary-red)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Featured Compact Newsletter */}
      <div style={{ padding: '20px 24px' }}>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-morphism" 
          style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(225,29,72,0.1), transparent)', 
            border: '1px solid rgba(225,29,72,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>WASAFI INSIDER BULLETIN</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 500 }}>Join 50,000+ subscribers for daily exclusive news, backstage gossip, and official tour updates delivered straight to your account.</p>
          </div>
          <button style={{ 
            padding: '16px 32px', 
            borderRadius: '12px', 
            background: 'white', 
            color: 'black', 
            fontWeight: 900, 
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}>NOTIFY ME</button>
        </motion.div>
      </div>

      {/* Full News View Overlay */}
      <AnimatePresence>
        {selectedNews && renderNewsDetail(selectedNews)}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .news-content-body p { margin-bottom: 24px; }
        .news-content-body blockquote { 
          border-left: 4px solid var(--primary-red); 
          padding-left: 20px; 
          margin: 35px 0; 
          font-style: italic; 
          color: white; 
          font-weight: 700;
          font-size: 20px;
          line-height: 1.5;
        }
        .news-card-img:hover {
          transform: scale(1.05);
        }
      `}} />

    </div>
  );
};

export default WasafiNews;
