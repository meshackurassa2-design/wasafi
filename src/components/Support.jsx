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
    <div className="fade-in" style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#0F0F0F', color: 'white' }}>
      
      {/* Background Accents */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(225,29,72,0.05) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', zIndex: 0 }}></div>

      <div className="support-container" style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '60px 25px' }}>
        
        <header style={{ marginBottom: '60px', textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225,29,72,0.1)', padding: '8px 16px', borderRadius: '40px', border: '1px solid rgba(225,29,72,0.2)', marginBottom: '20px' }}>
                <HelpCircle size={16} color="var(--primary-red)" />
                <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary-red)', letterSpacing: '2px' }}>HELP CENTER</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 950, marginBottom: '15px', lineHeight: 1.1 }}>How can we help you today?</h1>
            <p style={{ color: 'var(--text-gray)', fontSize: '18px', fontWeight: 600, maxWidth: '600px' }}>Access 24/7 premium support, manage your subscription, or troubleshoot technical issues with our dedicated Wasafi team.</p>
        </header>

        <div className="support-grid" style={{ display: 'grid', gap: '40px' }}>
            
            {/* Left Column: Contact Methods */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={20} color="var(--primary-red)" /> GET IN TOUCH
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px', cursor: 'pointer', transition: 'background 0.3s' }}>
                        <div style={{ background: 'var(--primary-red)', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(225,29,72,0.2)' }}>
                            <MessageSquare size={24} color="white" />
                        </div>
                        <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '5px' }}>Live Concierge</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '20px' }}>Real-time assistance for account and billing issues.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>ONLINE NOW</span>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px', cursor: 'pointer' }}>
                        <div style={{ background: '#3B82F6', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(59,130,246,0.2)' }}>
                            <Mail size={24} color="white" />
                        </div>
                        <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '5px' }}>Email Support</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '20px' }}>Send us a detailed inquiry for technical feedback.</p>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-gray)' }}>AVERAGE RESPONSE: 2H</span>
                    </motion.div>
                </div>

                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    style={{ padding: '30px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(225,29,72,0.1), rgba(15,15,15,0.1))', border: '1px solid rgba(225,29,72,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <PhoneCall size={22} color="var(--primary-red)" />
                        </div>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: 900 }}>Wasafi Priority Line</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 600 }}>Toll-Free for Premium Plus Members</div>
                        </div>
                    </div>
                    <ChevronRight size={24} color="var(--primary-red)" />
                </motion.div>
            </div>

            {/* Right Column: FAQ Section */}
            <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '32px', padding: '40px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={22} color="var(--primary-red)" /> FREQUENTLY ASKED
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {faqs.map((faq, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ background: 'rgba(255,255,255,0.04)' }}
                            style={{ padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            <div style={{ fontSize: '15px', fontWeight: 900, color: 'white', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {faq.q}
                                <ChevronRight size={16} color="var(--primary-red)" />
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', fontWeight: 500 }}>{faq.a}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .support-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .support-grid {
            grid-template-columns: 1fr 500px;
          }
        }
      `}} />
    </div>
  );
};

export default Support;
