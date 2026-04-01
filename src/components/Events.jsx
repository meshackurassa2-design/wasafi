import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, ChevronRight, Users, Star, ArrowLeft, Share2, Clock, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { 
      id: 1, 
      title: "Wasafi Festival 2026: The Homecoming", 
      date: "August 28-30, 2026", 
      time: "18:00 - LATE",
      location: "Samia Suluhu Hassan Stadium, Arusha", 
      price: "150,000 TZS", 
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
      status: "VIP ONLY",
      description: `
        <p>The legendary Wasafi Festival returns for its most ambitious edition yet. Over three unforgettable nights, Arusha will become the epicenter of African music, featuring the entire WCB Wasafi roster alongside global surprise guests.</p>
        <p>Experience world-class production, immersive stage designs, and the true spirit of Bongo Flava. This is more than a festival; it's a movement.</p>
      `,
      tiers: [
        { name: "General Admission", price: "50,000 TZS", status: "Available" },
        { name: "VIP Experience", price: "150,000 TZS", status: "Limited" },
        { name: "VVIP / Royal Box", price: "500,000 TZS", status: "Sold Out" }
      ],
      venueInfo: "State-of-the-art sports arena with a capacity of 60,000+. Premium parking and security provided."
    },
    { 
      id: 2, 
      title: "Zuchu: Queen of Bongo World Tour - Finale", 
      date: "September 15, 2026", 
      time: "20:00 - 23:30",
      location: "Mlimani City Hall, Dar Es Salaam", 
      price: "85,000 TZS", 
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop",
      status: "SELLING FAST",
      description: `
        <p>Witness history as Zuchu wraps up her record-breaking 'Queen of Bongo' World Tour with a spectacular homecoming finale in Dar Es Salaam.</p>
        <p>The night features a fully choreographed stage show, exclusive live band arrangements of her biggest hits, and special guest appearances from the WCB family. Don't miss the musical event of the year.</p>
      `,
      tiers: [
        { name: "Student Special", price: "30,000 TZS", status: "Available" },
        { name: "Standard", price: "85,000 TZS", status: "Available" },
        { name: "Front Row VIP", price: "250,000 TZS", status: "Last Few" }
      ],
      venueInfo: "Dar Es Salaam's premier indoor venue. Air-conditioned with premium acoustic treatments."
    }
  ];

  const renderEventDetail = (event) => (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: 5000, backgroundColor: 'var(--bg-black)', 
        overflowY: 'auto', paddingBottom: '40px'
      }}
    >
      {/* Event Header */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '350px' }}>
        <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(to top, var(--bg-black) 0%, rgba(15,15,15,0.4) 50%, rgba(15,15,15,0.8) 100%)' }} />
        
        {/* Navigation */}
        <div style={{ position: 'absolute', top: '25px', left: '25px', right: '25px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <button 
            onClick={() => setSelectedEvent(null)}
            style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft size={24} />
          </button>
          <button style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Share2 size={22} />
          </button>
        </div>

        {/* Hero Info */}
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px' }}>
           <div style={{ display: 'inline-block', background: 'var(--primary-red)', padding: '5px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: 950, color: 'white', marginBottom: '15px' }}>
             {event.status}
           </div>
           <h1 style={{ fontSize: '48px', fontWeight: 950, lineHeight: 1, marginBottom: '20px' }}>{event.title}</h1>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Calendar size={20} color="var(--primary-red)" />
                 <span style={{ fontSize: '16px', fontWeight: 800 }}>{event.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <MapPin size={20} color="var(--primary-red)" />
                 <span style={{ fontSize: '16px', fontWeight: 800 }}>{event.location}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: '60px' }}>
         <section>
            <h2 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <Info size={24} color="var(--primary-red)" /> EVENT DESCRIPTION
            </h2>
            <div 
              style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: event.description }}
            />

            <h2 style={{ fontSize: '24px', fontWeight: 950, marginTop: '50px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <MapPin size={24} color="var(--primary-red)" /> VENUE INFORMATION
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{event.venueInfo}</p>
         </section>

         <aside>
            <div className="glass-morphism" style={{ padding: '30px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: '100px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Ticket size={20} color="var(--primary-red)" /> TICKETS & TIERS
               </h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {event.tiers.map((tier, index) => (
                    <div key={index} style={{ padding: '20px', borderRadius: '20px', background: tier.status === 'Sold Out' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', opacity: tier.status === 'Sold Out' ? 0.5 : 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-gray)' }}>{tier.name.toUpperCase()}</span>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: tier.status === 'Sold Out' ? 'var(--text-gray)' : 'var(--primary-red)' }}>{tier.status.toUpperCase()}</span>
                       </div>
                       <div style={{ fontSize: '20px', fontWeight: 950 }}>{tier.price}</div>
                       <button 
                         disabled={tier.status === 'Sold Out'}
                         style={{ 
                           width: '100%', marginTop: '15px', padding: '12px', borderRadius: '12px', 
                           background: tier.status === 'Sold Out' ? 'rgba(255,255,255,0.05)' : 'white', 
                           color: 'black', fontWeight: 900, fontSize: '13px', border: 'none', cursor: tier.status === 'Sold Out' ? 'default' : 'pointer' 
                         }}
                       >
                         {tier.status === 'Sold Out' ? 'NOT AVAILABLE' : 'SELECT TICKET'}
                       </button>
                    </div>
                  ))}
               </div>

               <div style={{ marginTop: '30px', padding: '15px', borderRadius: '15px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', gap: '12px' }}>
                  <CheckCircle size={20} color="#3B82F6" />
                  <span style={{ fontSize: '12px', color: '#93C5FD', fontWeight: 600 }}>Secure checkout. Instant e-tickets sent to your profile and email.</span>
               </div>
            </div>
         </aside>
      </div>
    </motion.div>
  );

  return (
    <div className="fade-in" style={{ padding: '0 0 140px 0', minHeight: '100vh' }}>
      
      {/* Header Area */}
      <div style={{ padding: '50px 40px 20px', background: 'linear-gradient(to bottom, rgba(225,29,72,0.15) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <Calendar size={28} color="var(--primary-red)" />
            <h2 style={{ fontSize: '38px', fontWeight: 950, letterSpacing: '-1px' }}>OFFICIAL <span style={{ color: 'var(--primary-red)' }}>EVENTS</span></h2>
          </div>
          <p style={{ color: 'var(--text-gray)', fontWeight: 600, fontSize: '16px', maxWidth: '600px' }}>Join the movement. From massive stadium tours to exclusive intimate showcases, catch the Wasafi experience live.</p>
      </div>

      {/* Events Grid */}
      <div style={{ 
        padding: '30px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '40px'
      }}>
        {events.map((event) => (
          <motion.div 
            key={event.id}
            whileHover={{ y: -12 }}
            onClick={() => setSelectedEvent(event)}
            className="glass-morphism"
            style={{ 
              borderRadius: '32px', 
              overflow: 'hidden', 
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <div style={{ aspectRatio: '16/10', position: 'relative', overflow: 'hidden' }}>
               <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} className="event-card-img" />
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(15,15,15,0.9) 10%, transparent 60%)' }} />
               <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--primary-red)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 950, color: 'white', letterSpacing: '1px' }}>
                  {event.status}
               </div>
            </div>
            
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-red)', fontSize: '12px', fontWeight: 900, marginBottom: '12px' }}>
                 <Clock size={14} /> {event.time}
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 950, color: 'white', lineHeight: 1.2, marginBottom: '20px' }}>{event.title}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 700 }}>
                   <Calendar size={18} color="rgba(255,255,255,0.2)" /> {event.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 700 }}>
                   <MapPin size={18} color="rgba(255,255,255,0.2)" /> {event.location}
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                 <div>
                   <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)', textTransform: 'uppercase' }}>Starting From</span>
                   <div style={{ fontSize: '22px', fontWeight: 950, color: 'white' }}>{event.price}</div>
                 </div>
                 <button className="glass-morphism" style={{ padding: '14px 28px', borderRadius: '16px', background: 'var(--primary-red)', color: 'white', fontWeight: 950, fontSize: '14px', border: 'none' }}>
                    BOOK NOW
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event Details Overlay */}
      <AnimatePresence>
        {selectedEvent && renderEventDetail(selectedEvent)}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .event-card-img:hover {
          transform: scale(1.1);
        }
      `}} />
    </div>
  );
};

export default Events;
