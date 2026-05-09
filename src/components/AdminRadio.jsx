import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Loader2, Music, Mic2, Disc, Image as ImageIcon, Edit, Trash2, List, ArrowLeft, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminRadio = ({ onBack }) => {
  const [view, setView] = useState('manage'); // 'manage' or 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    duration: '3:45'
  });

  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [audioUrlInput, setAudioUrlInput] = useState('');
  const [coverUrlInput, setCoverUrlInput] = useState('');

  useEffect(() => {
    if (view === 'manage') {
      fetchTracks();
    }
  }, [view]);

  const fetchTracks = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('radio_music')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTracks(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleEdit = (track) => {
    setEditingId(track.id);
    setFormData({
      title: track.title,
      artist: track.artist || '',
      duration: track.duration || '3:45'
    });
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this track? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('radio_music')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTracks(tracks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting track: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && (!formData.title || !formData.artist || !audioFile)) {
      setError("Please provide title, artist, and audio file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let audioUrl = null;
      let coverUrl = null;

      // Upload Audio (file takes priority over URL)
      if (audioFile) {
        const audioExt = audioFile.name.split('.').pop();
        const audioName = `${Date.now()}_radio.${audioExt}`;
        const { error: audioUploadError } = await supabase.storage
          .from('radio')
          .upload(audioName, audioFile);
        if (audioUploadError) throw new Error('Audio upload failed: ' + audioUploadError.message);
        const { data: { publicUrl: audioPub } } = supabase.storage.from('radio').getPublicUrl(audioName);
        audioUrl = audioPub;
      } else if (audioUrlInput.trim()) {
        audioUrl = audioUrlInput.trim();
      }

      // Upload Cover (file takes priority over URL)
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop();
        const coverName = `${Date.now()}_cover.${coverExt}`;
        const { error: coverUploadError } = await supabase.storage
          .from('thumbnails')
          .upload(coverName, coverFile);
        if (coverUploadError) throw new Error('Cover upload failed: ' + coverUploadError.message);
        const { data: { publicUrl: coverPub } } = supabase.storage.from('thumbnails').getPublicUrl(coverName);
        coverUrl = coverPub;
      } else if (coverUrlInput.trim()) {
        coverUrl = coverUrlInput.trim();
      }

      const dataToSave = {
        title: formData.title,
        artist: formData.artist,
        duration: formData.duration
      };

      if (audioUrl) dataToSave.audio_url = audioUrl;
      if (coverUrl) dataToSave.cover_url = coverUrl;

      if (editingId) {
        const { error: dbError } = await supabase
          .from('radio_music')
          .update(dataToSave)
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        if (!coverUrl) dataToSave.cover_url = "https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg";
        const { error: dbError } = await supabase
          .from('radio_music')
          .insert([dataToSave]);
        if (dbError) throw dbError;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEditingId(null);
        setAudioFile(null);
        setCoverFile(null);
        setAudioUrlInput('');
        setCoverUrlInput('');
        setView('manage');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.artist && t.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (success) {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <CheckCircle2 size={80} color="#10B981" />
         </motion.div>
         <h2 style={{ fontSize: '24px', fontWeight: 900, marginTop: '20px' }}>{editingId ? 'TRACK UPDATED' : 'RADIO TRACK LIVE'}</h2>
         <p style={{ color: 'var(--text-gray)', marginTop: '10px' }}>The song is now playing on Wasafi FM.</p>
      </div>
    );
  }

  if (view === 'manage') {
    return (
      <div className="fade-in" style={{ padding: '25px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
           <div>
              <h2 style={{ fontSize: '24px', fontWeight: 950 }}>RADIO <span style={{ color: 'var(--primary-red)' }}>LIBRARY</span></h2>
              <p style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '4px' }}>Manage Wasafi FM tracks</p>
           </div>
           <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', artist: '', duration: '3:45' });
                  setView('add');
                }} 
                style={{ background: 'var(--primary-red)', border: 'none', padding: '12px 20px', borderRadius: '12px', color: 'white', fontWeight: 900, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <Upload size={18} /> UPLOAD NEW
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
             placeholder="Search tracks..." 
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
            {filteredTracks.map(track => (
              <div key={track.id} className="glass-morphism" style={{ padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', background: '#111', flexShrink: 0 }}>
                  <img src={track.cover_url || 'https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{track.artist} • {track.duration}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(track)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(track.id)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(225,29,72,0.1)', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {filteredTracks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                <Music size={40} style={{ opacity: 0.1, marginBottom: '15px' }} />
                <div style={{ fontWeight: 800 }}>NO TRACKS FOUND</div>
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
            <h2 style={{ fontSize: '24px', fontWeight: 950 }}>{editingId ? 'EDIT' : 'UPLOAD'} <span style={{ color: 'var(--primary-red)' }}>RADIO</span></h2>
         </div>
         <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
         </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>SONG TITLE</label>
            <input 
               type="text" 
               required
               placeholder="Enter song name..."
               value={formData.title}
               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>ARTIST NAME</label>
            <input 
               type="text" 
               required
               placeholder="Enter artist name..."
               value={formData.artist}
               onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>AUDIO FILE (MP3) {editingId && '(OPTIONAL)'}</label>
            <div style={{ position: 'relative', height: '100px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
               <input 
                 type="file" 
                 accept="audio/*" 
                 onChange={(e) => setAudioFile(e.target.files[0])}
                 style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
               />
               {audioFile ? (
                 <div style={{ textAlign: 'center' }}>
                    <Music size={24} color="#10B981" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800 }}>{audioFile.name}</div>
                 </div>
               ) : (
                 <>
                    <Mic2 size={24} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '8px' }}>{editingId ? 'Change MP3 Track' : 'Upload MP3 Track'}</span>
                 </>
               )}
            </div>
            <label style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>OR PASTE AUDIO URL</label>
            <input
              type="url"
              placeholder="https://... (mp3 link)"
              value={audioUrlInput}
              onChange={e => setAudioUrlInput(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px', color: 'white', fontSize: '13px', outline: 'none' }}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-gray)' }}>COVER ART {editingId && '(OPTIONAL)'}</label>
            <div style={{ position: 'relative', height: '100px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => setCoverFile(e.target.files[0])}
                 style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
               />
               {coverFile ? (
                 <div style={{ textAlign: 'center' }}>
                    <CheckCircle2 size={24} color="#10B981" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800 }}>{coverFile.name}</div>
                 </div>
               ) : (
                 <>
                    <ImageIcon size={24} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '8px' }}>{editingId ? 'Change Cover Image' : 'Upload Cover Image'}</span>
                 </>
               )}
            </div>
            <label style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>OR PASTE IMAGE URL</label>
            <input
              type="url"
              placeholder="https://... (image link)"
              value={coverUrlInput}
              onChange={e => setCoverUrlInput(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px', color: 'white', fontSize: '13px', outline: 'none' }}
            />
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
                  {editingId ? 'UPDATING TRACK...' : 'UPLOADING TRACK...'}
               </>
            ) : (
               <>
                  {editingId ? <CheckCircle2 size={20} /> : <Disc size={20} />}
                  {editingId ? 'SAVE CHANGES' : 'POST TO WASAFI FM'}
               </>
            )}
         </button>

      </form>
    </div>
  );
};

export default AdminRadio;

