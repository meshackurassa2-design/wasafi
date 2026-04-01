import React from 'react';
import { UserCircle, Crown, Settings, LogOut, ChevronRight, Gift, Download, Clock, Star, Share2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../App';

const Profile = () => {
  return (
    <div className="fade-in" style={{ padding: '0', paddingBottom: '140px', background: 'var(--bg-black)' }}>
      
      {/* Header Dashboard Section */}
      <div style={{ background: 'linear-gradient(135deg, rgba(225,29,72,0.15) 0%, transparent 100%)', padding: '40px 25px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <UserCircle size={50} color="rgba(255,255,255,0.8)" />
                </div>
                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#F59E0B', borderRadius: '8px', padding: '4px', border: '2px solid var(--bg-black)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <Crown size={12} color="white" fill="white" />
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 950 }}>WASAFI VIP</h2>
                    <ShieldCheck size={18} color="#3B82F6" />
                </div>
                <p style={{ color: 'var(--text-gray)', fontWeight: 700, fontSize: '13px' }}>ID: #WASAFI-99321</p>
                <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <Star size={10} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.5px' }}>PREMIUM PLUS</span>
                </div>
            </div>
            <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Share2 size={18} color="white" />
            </button>
         </div>

         {/* VIP Progress Bar */}
         <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-gray)' }}>WASAFI LOYALTY STATUS</span>
                <span style={{ fontSize: '11px', fontWeight: 900, color: 'white' }}>85% TO PLATINUM</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: '85%' }} 
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(to right, var(--primary-red), #F59E0B)', borderRadius: '10px' }} 
                />
            </div>
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
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>12 Tracks Saved</div>
               </div>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }} className="glass-morphism" style={{ padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Clock size={20} color="var(--text-gray)" />
               </div>
               <div>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>HISTORY</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>Recents Only</div>
               </div>
            </motion.div>
         </div>

         {/* Settings Menu List */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
               { icon: Crown, label: 'Subscription Details', color: '#F59E0B', desc: 'Premium ends in 24 days' },
               { icon: Gift, label: 'Redeem Voucher', color: '#10B981', desc: 'Add credit to your wallet' },
               { icon: Settings, label: 'Device Management', color: 'var(--text-gray)', desc: '2 devices connected' },
               { icon: LogOut, label: 'Sign Out Account', color: 'var(--primary-red)', desc: 'Securely log out', border: false }
            ].map((item, i) => (
                <motion.div 
                    key={i} 
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

