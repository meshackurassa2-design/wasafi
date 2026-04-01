import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Chrome, Apple, UserCircle } from 'lucide-react';
import { Logo } from '../App';

const Login = ({ onLogin }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg-black)', 
        color: 'white',
        padding: '20px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Logo size={80} />
        <div style={{ marginTop: '20px' }}>
          {"WELCOME TO WASAFI PREMIUM".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ display: 'inline-block', marginRight: '8px', fontSize: '26px', fontWeight: 950, letterSpacing: '3px', color: 'white' }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: '11px', letterSpacing: '2px', marginTop: '10px' }}>
          THE ULTIMATE MEDIA EXPERIENCE
        </motion.p>
      </div>

      <div style={{ width: '100%', maxWidth: '350px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isSigningUp ? 'signup' : 'login'}
            initial={{ opacity: 0, x: isSigningUp ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSigningUp ? -20 : 20 }}
          >
            {isSigningUp && (
              <div style={{ marginBottom: '15px', position: 'relative' }}>
                <UserCircle size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '16px 16px 16px 45px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }} 
                />
              </div>
            )}

            <div style={{ marginBottom: '15px', position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 45px', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }} 
              />
            </div>

            <div style={{ marginBottom: '25px', position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 45px', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }} 
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-red)',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(225,29,72,0.4)',
            marginBottom: '30px',
            letterSpacing: '1px'
          }}
        >
          {isSigningUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '15px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
          <span style={{ fontSize: '10px', color: 'var(--text-gray)', fontWeight: 800, letterSpacing: '0.5px' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <motion.div whileTap={{ scale: 0.9 }} className="glass-morphism" style={{ padding: '15px', borderRadius: '15px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Chrome size={22} />
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }} className="glass-morphism" style={{ padding: '15px', borderRadius: '15px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Apple size={22} />
          </motion.div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: '40px', fontSize: '13px', color: 'var(--text-gray)', fontWeight: 500 }}>
        {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <span 
          onClick={() => setIsSigningUp(!isSigningUp)} 
          style={{ color: 'var(--primary-red)', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSigningUp ? 'SIGN IN' : 'SIGN UP'}
        </span>
      </div>
    </motion.div>
  );
};

export default Login;
