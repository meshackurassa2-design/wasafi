import React from 'react';
import { PlayCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const ArtistCircle = ({ name, image }) => (
  <motion.div whileTap={{ scale: 0.95 }} style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}>
    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-red)', marginBottom: '8px' }}>
      <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={name} />
    </div>
    <div style={{ fontSize: '12px', fontWeight: 700 }}>{name}</div>
  </motion.div>
);

const Home = ({ artists, trendingShows }) => {
  return (
    <main className="fade-in">
        <section style={{ padding: '20px', position: 'relative', height: '480px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--bg-black) 5%, transparent 60%), linear-gradient(to right, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.2) 100%), url("https://img.youtube.com/vi/qG5Ktb0lYsI/maxresdefault.jpg") center top / cover no-repeat', zIndex: -1 }}></div>
          <div style={{ zIndex: 1, paddingBottom: '10px' }}>
            <div style={{ display: 'inline-block', background: 'var(--primary-red)', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, marginBottom: '14px', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)' }}>
              <span className="pulse" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white', marginRight: '8px', verticalAlign: 'middle' }}></span>
              EXCLUSIVE LIVE NOW
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.8)', letterSpacing: '-0.5px' }}>
              DIAMOND PLATNUMZ <br/> <span style={{ color: 'var(--primary-red)' }}>TELLS ALL</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '24px', maxWidth: '85%', fontWeight: 500, lineHeight: 1.5, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Ana mengi ya kuzungumza. Tune in for the biggest, most intimate exclusive interview of the year on Wasafi Media.</p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button style={{ background: 'var(--primary-red)', padding: '14px 28px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(225,29,72,0.4)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <PlayCircle fill="white" size={22} color="var(--primary-red)" /> WATCH FEATURE
              </button>
              <button className="glass-morphism" style={{ padding: '14px 22px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', color: 'white', transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                <Info size={22} />
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: '30px 20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', textTransform: 'uppercase', color: 'var(--primary-red)', letterSpacing: '1px' }}>Top Tanzanian Artists</h3>
          <div style={{ display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
            {artists.map((art, i) => <ArtistCircle key={i} {...art} />)}
          </div>
        </section>

        <section style={{ padding: '30px 20px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
             <h3 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trending Now</h3>
             <span style={{ color: 'var(--primary-red)', fontSize: '12px', fontWeight: 800, cursor: 'pointer', paddingBottom: '3px' }}>SEE ALL</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trendingShows.map((vid, i) => (
              <motion.div key={i} whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.03)' }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '12px', background: i === 0 ? 'linear-gradient(90deg, rgba(225,29,72,0.1), transparent)' : 'transparent', border: i === 0 ? '1px solid rgba(225,29,72,0.2)' : '1px solid transparent', transition: 'all 0.3s ease' }}>
                <div style={{ width: '155px', height: '90px', borderRadius: '10px', overflow: 'hidden', position: 'relative', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                  <img src={vid.thumb} onError={(e) => { e.target.onerror = null; e.target.src = vid.thumb.replace('maxresdefault', 'hqdefault'); }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={vid.title} />
                  <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: vid.isLive ? 'var(--primary-red)' : 'rgba(15,15,15,0.85)', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px', backdropFilter: 'blur(4px)', boxShadow: vid.isLive ? '0 0 10px rgba(225,29,72,0.5)' : 'none' }}>
                     {vid.isLive && <span className="pulse" style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'white', marginRight: '6px', verticalAlign: 'middle' }}></span>}
                     {vid.duration}
                  </div>
                </div>
                <div style={{ flex: 1, paddingRight: '5px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: i === 0 ? 'white' : 'var(--text-gray)' }}>{vid.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(161, 161, 170, 0.8)', fontWeight: 600 }}>{vid.views} views • {vid.time} {vid.isLive ? '' : 'ago'}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
    </main>
  );
};

export default Home;
