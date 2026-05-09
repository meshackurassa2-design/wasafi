import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Loader2, Calendar, MapPin, DollarSign, Tag, Image as ImageIcon, Edit, Trash2, List, ArrowLeft, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminEvents = ({ onBack }) => {
  const [view, setView] = useState('manage'); // 'manage' or 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '',
    location: '',
    price: '',
    status: 'SELLING FAST',
    description: '',
    venue_info: ''
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (view === 'manage') {
      fetchEvents();
    }
  }, [view]);

  const fetchEvents = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      event_date: event.event_date || '',
      event_time: event.event_time || '',
      location: event.location || '',
      price: event.price || '',
      status: event.status || 'SELLING FAST',
      description: event.description || '',
      venue_info: event.venue_info || ''
    });
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting event: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) {
      setError("Please provide at least a title and date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_event.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const dataToSave = {
        title: formData.title,
        event_date: formData.event_date,
        event_time: formData.event_time,
        location: formData.location,
        price: formData.price,
        status: formData.status,
        description: formData.description,
        venue_info: formData.venue_info
      };

      if (imageUrl) dataToSave.image_url = imageUrl;

      if (editingId) {
        const { error: dbError } = await supabase
          .from('events')
          .update(dataToSave)
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        if (!imageUrl) dataToSave.image_url = "https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg";
        const { error: dbError } = await supabase
          .from('events')
          .insert([dataToSave]);
        if (dbError) throw dbError;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEditingId(null);
        setImageFile(null);
        setView('manage');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (success) {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <CheckCircle2 size={80} color="#10B981" />
         </motion.div>
         <h2 style={{ fontSize: '24px', fontWeight: 900, marginTop: '20px' }}>{editingId ? 'EVENT UPDATED' : 'EVENT POSTED'}</h2>
         <p style={{ color: 'var(--text-gray)', marginTop: '10px' }}>The event is now visible to all Wasafi users.</p>
      </div>
    );
  }

  if (view === 'manage') {
    return (
      <div className="fade-in" style={{ padding: '25px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
           <div>
              <h2 style={{ fontSize: '24px', fontWeight: 950 }}>EVENTS <span style={{ color: 'var(--primary-red)' }}>PORTAL</span></h2>
              <p style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '4px' }}>Manage festival dates and tours</p>
           </div>
           <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', event_date: '', event_time: '', location: '', price: '', status: 'SELLING FAST', description: '', venue_info: '' });
                  setView('add');
                }} 
                style={{ background: 'var(--primary-red)', border: 'none', padding: '12px 20px', borderRadius: '12px', color: 'white', fontWeight: 900, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <Upload size={18} /> POST EVENT
              </button>
              <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '12px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
                 <X size={20} />
              </button>
           </div>
        </div>

        <div className="glass-morphism" style={{ padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
           <Search size={18} color="rgba(255,255,255,0.4)" />
           <input 
             type="text" 
             placeholder="Search events..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', outline: 'none', width: '100%' }} 
           />
        </div>

        {fetching ? (
          <div style={{ height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader2 className="animate-spin" size={30} color="var(--primary-red)" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredEvents.map(event => (
              <div key={event.id} className="glass-morphism" style={{ padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '80px', height: '45px', borderRadius: '8px', overflow: 'hidden', background: '#111', flexShrink: 0 }}>
                  <img src={event.image_url || 'https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{event.event_date} • {event.location}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(event)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(event.id)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(225,29,72,0.1)', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                <Calendar size={40} style={{ opacity: 0.1, marginBottom: '15px' }} />
                <div style={{ fontWeight: 800 }}>NO EVENTS FOUND</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '25px', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setView('manage')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
               <ArrowLeft size={24} />
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: 950 }}>{editingId ? 'EDIT' : 'POST'} <span style={{ color: 'var(--primary-red)' }}>EVENT</span></h2>
         </div>
         <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
         </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>EVENT TITLE</label>
            <input 
               type="text" 
               required
               placeholder="e.g. Wasafi Festival 2026"
               value={formData.title}
               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
            />
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>DATE</label>
               <input 
                  type="text" 
                  placeholder="e.g. August 28, 2026"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
               />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>TIME</label>
               <input 
                  type="text" 
                  placeholder="e.g. 18:00 - LATE"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
               />
            </div>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>LOCATION</label>
               <input 
                  type="text" 
                  placeholder="e.g. Dar Es Salaam"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
               />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>STARTING PRICE</label>
               <input 
                  type="text" 
                  placeholder="e.g. 50,000 TZS"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
               />
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>EVENT STATUS / BADGE</label>
            <select 
               value={formData.status}
               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
            >
               <option value="SELLING FAST">SELLING FAST</option>
               <option value="LIMITED TICKETS">LIMITED TICKETS</option>
               <option value="VIP ONLY">VIP ONLY</option>
               <option value="SOLD OUT">SOLD OUT</option>
               <option value="COMING SOON">COMING SOON</option>
            </select>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>EVENT DESCRIPTION (HTML SUPPORTED)</label>
            <textarea 
               rows="4"
               placeholder="Full event details and highlights..."
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none', resize: 'vertical' }}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>EVENT POSTER {editingId && '(OPTIONAL)'}</label>
            <div style={{ position: 'relative', height: '140px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => setImageFile(e.target.files[0])}
                 style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
               />
               {imageFile ? (
                 <div style={{ textAlign: 'center' }}>
                    <CheckCircle2 size={24} color="#10B981" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800 }}>{imageFile.name}</div>
                 </div>
               ) : (
                 <>
                    <Upload size={24} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '8px' }}>{editingId ? 'Change Event Poster' : 'Upload Event Poster'}</span>
                 </>
               )}
            </div>
         </div>

         {error && (
            <div style={{ color: 'var(--primary-red)', fontSize: '12px', fontWeight: 700, textAlign: 'center', padding: '10px', background: 'rgba(225,29,72,0.1)', borderRadius: '10px' }}>
               {error.toUpperCase()}
            </div>
         )}

         <button 
           disabled={loading}
           type="submit"
           style={{ marginTop: '10px', background: 'var(--primary-red)', padding: '18px', borderRadius: '40px', color: 'white', fontWeight: 950, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 15px 30px rgba(225,29,72,0.3)' }}
         >
            {loading ? (
               <>
                  <Loader2 className="animate-spin" size={20} />
                  {editingId ? 'UPDATING EVENT...' : 'POSTING EVENT...'}
               </>
            ) : (
               <>
                  {editingId ? <CheckCircle2 size={20} /> : <Calendar size={20} />}
                  {editingId ? 'SAVE CHANGES' : 'POST TO EVENTS'}
               </>
            )}
         </button>

      </form>
    </div>
  );
};

export default AdminEvents;

