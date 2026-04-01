import React from 'react';
import { HelpCircle, MessageSquare, ShieldCheck, Mail, ChevronRight, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const Support = () => {
  const faqs = [
    { q: "How do I download music?", a: "Go to any Artist or Radio track and click the Download icon. Content will appear in your Vault." },
    { q: "Is Wasafi TV truly live?", a: "Yes! Our high-definition streaming is 24/7 with zero latency for premium members." },
    { q: "Can I manage multiple devices?", a: "Premium Plus members can connect up to 5 devices simultaneously." },
    { q: "How to update my subscription?", a: "Navigate to 'Account' and select 'Subscription Details' to upgrade or renew." }
  ];

  return (
    <div className="fade-in" style={{ padding: '0', paddingBottom: '140px', position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#0F0F0F' }}>
      
      {/* Live Animated Background 'Staffs' */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 5 + i * 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ 
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              background: i % 2 === 0 ? 'var(--primary-red)' : '#3B82F6',
              borderRadius: '8px',
              filter: 'blur(20px)',
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '40px 25px' }}>
        <header style={{ marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225,29,72,0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.2)', marginBottom: '15px' }}>
                <HelpCircle size={14} color="var(--primary-red)" />
                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary-red)', letterSpacing: '1px' }}>WASAFI SUPPORT</span>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 950, marginBottom: '8px', color: 'white' }}>How can we<br/>help you today?</h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>Find answers or get in touch with our team.</p>
        </header>

        {/* Quick Contact Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
            <motion.button whileTap={{ scale: 0.95 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <div style={{ background: 'var(--primary-red)', padding: '10px', borderRadius: '12px' }}>
                    <MessageSquare size={20} color="white" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>Live Chat</div>
                <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>Online Now</div>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <div style={{ background: '#3B82F6', padding: '10px', borderRadius: '12px' }}>
                    <Mail size={20} color="white" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>Email us</div>
                <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>Response in 2h</div>
            </motion.button>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', color: 'white' }}>Frequently Asked</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, i) => (
                    <motion.div 
                        key={i} 
                        initial={false}
                        className="glass-morphism" 
                        style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.02)' }}
                    >
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{faq.q}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)', lineHeight: '1.5', fontWeight: 500 }}>{faq.a}</div>
                    </motion.div>
                ))}
            </div>
        </div>

        <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary-red), #93122E)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PhoneCall size={20} color="white" />
                </div>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: 'white' }}>Call Support</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Mon-Fri (8AM - 10PM)</div>
                </div>
            </div>
            <ChevronRight size={20} color="white" />
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
