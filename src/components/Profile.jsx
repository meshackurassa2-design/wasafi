import React from 'react';
import { UserCircle, Crown, Settings, LogOut, ChevronRight, Gift, Download, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  return (
    <div className="fade-in" style={{ padding: '0', paddingBottom: '140px' }}>
      
      {/* Header Profile Section */}
      <div style={{ background: 'linear-gradient(to bottom, rgba(225,29,72,0.2) 0%, transparent 100%)', padding: '40px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '15px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-black)', border: '4px solid var(--primary-red)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 20px rgba(225,29,72,0.3)' }}>
               <UserCircle size={60} color="white" />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#F59E0B', borderRadius: '50%', padding: '6px', border: '3px solid var(--bg-black)' }}>
               <Crown size={14} color="white" fill="white" />
            </div>
         </div>
         <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '5px' }}>WASAFI VIP</h2>
         <p style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: '13px', letterSpacing: '1px' }}>PREMIUM MEMBER</p>
      </div>

      <div style={{ padding: '20px' }}>
         
         {/* Action Cards */}
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <motion.div whileTap={{ scale: 0.95 }} className="glass-morphism" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', border: '1px solid rgba(225,29,72,0.3)', background: 'linear-gradient(135deg, rgba(225,29,72,0.1), transparent)' }}>
               <Download size={24} color="var(--primary-red)" />
               <span style={{ fontSize: '13px', fontWeight: 700 }}>Downloads</span>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} className="glass-morphism" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
               <Clock size={24} color="var(--text-gray)" />
               <span style={{ fontSize: '13px', fontWeight: 700 }}>History</span>
            </motion.div>
         </div>

         {/* Settings Menu */}
         <div className="glass-morphism" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            {[
               { icon: Crown, label: 'Manage Subscription', color: '#F59E0B' },
               { icon: Gift, label: 'Redeem Promo Code', color: '#10B981' },
               { icon: Settings, label: 'App Settings', color: 'var(--text-gray)' },
               { icon: LogOut, label: 'Sign Out', color: 'var(--primary-red)', border: false }
            ].map((item, i) => (
                <motion.div key={i} whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }} style={{ padding: '16px 20px', borderBottom: item.border !== false ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <item.icon size={20} color={item.color} />
                      <span style={{ fontSize: '15px', fontWeight: 700, color: i === 3 ? 'var(--primary-red)' : 'white' }}>{item.label}</span>
                   </div>
                   {i !== 3 && <ChevronRight size={18} color="var(--text-gray)" />}
                </motion.div>
            ))}
         </div>

         <div style={{ textAlign: 'center', marginTop: '30px', color: 'rgba(161, 161, 170, 0.4)', fontSize: '12px', fontWeight: 600 }}>
             App Version: V8.0.0 (Premium) <br/>
             © 2026 Wasafi Media
         </div>
      </div>

    </div>
  );
};

export default Profile;
