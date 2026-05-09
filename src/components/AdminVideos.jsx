import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Loader2, Play, Image as ImageIcon, Star, Edit, Trash2, List, ArrowLeft, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminVideos = ({ onBack }) => {
  const [view, setView] = useState('manage'); // 'manage' or 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    is_exclusive: false,
    category: 'music'
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);

  useEffect(() => {
    if (view === 'manage') {
      fetchVideos();
    }
  }, [view]);

  const fetchVideos = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      artist_name: video.artist_name || '',
      is_exclusive: video.is_exclusive || false,
      category: video.category || 'music'
    });
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting video: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !videoFile && !formData.title) {
      setError("Please provide at least a title and a video file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let videoUrl = null;
      let thumbUrl = null;

      // 1. Handle Video Upload (if new file)
      if (videoFile) {
        const videoExt = videoFile.name.split('.').pop();
        const videoPath = `${Date.now()}_video.${videoExt}`;
        const { error: videoError } = await supabase.storage
          .from('videos')
          .upload(videoPath, videoFile);

        if (videoError) throw videoError;
        const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(videoPath);
        videoUrl = publicUrl;
      }

      // 2. Handle Thumbnail Upload (if new file)
      if (thumbFile) {
        const thumbExt = thumbFile.name.split('.').pop();
        const thumbPath = `${Date.now()}_thumb.${thumbExt}`;
        const { error: thumbError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbPath, thumbFile);
        
        if (thumbError) throw thumbError;
        const { data: { publicUrl: tUrl } } = supabase.storage.from('thumbnails').getPublicUrl(thumbPath);
        thumbUrl = tUrl;
      }

      // 3. Save to Database
      const dataToSave = {
        title: formData.title,
        artist_name: formData.artist_name,
        is_exclusive: formData.is_exclusive,
        category: formData.category
      };

      if (videoUrl) dataToSave.video_url = videoUrl;
      if (thumbUrl) dataToSave.thumbnail_url = thumbUrl;

      if (editingId) {
        const { error: dbError } = await supabase
          .from('videos')
          .update(dataToSave)
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from('videos')
          .insert([dataToSave]);
        if (dbError) throw dbError;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEditingId(null);
        setVideoFile(null);
        setThumbFile(null);
        setView('manage');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.artist_name && v.artist_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (success) {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <CheckCircle2 size={80} color="#10B981" />
         </motion.div>
         <h2 style={{ fontSize: '24px', fontWeight: 900, marginTop: '20px' }}>{editingId ? 'UPDATE COMPLETE' : 'UPLOAD COMPLETE'}</h2>
         <p style={{ color: 'var(--text-gray)', marginTop: '10px' }}>The video has been synchronized with Wasafi TV.</p>
      </div>
    );
  }

  if (view === 'manage') {
    return (
      <div className="fade-in" style={{ padding: '25px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
           <div>
              <h2 style={{ fontSize: '24px', fontWeight: 950 }}>TV <span style={{ color: 'var(--primary-red)' }}>LIBRARY</span></h2>
              <p style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '4px' }}>Manage and monitor your video content</p>
           </div>
           <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', artist_name: '', is_exclusive: false, category: 'music' });
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
             placeholder="Search library..." 
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
            {filteredVideos.map(video => (
              <div key={video.id} className="glass-morphism" style={{ padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '80px', height: '45px', borderRadius: '8px', overflow: 'hidden', background: '#111', flexShrink: 0 }}>
                  <img src={video.thumbnail_url || 'https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600 }}>{video.artist_name || 'Various Artists'} • {video.category.toUpperCase()}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(video)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(video.id)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(225,29,72,0.1)', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {filteredVideos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                <Play size={40} style={{ opacity: 0.1, marginBottom: '15px' }} />
                <div style={{ fontWeight: 800 }}>NO VIDEOS FOUND</div>
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
            <h2 style={{ fontSize: '24px', fontWeight: 950 }}>{editingId ? 'EDIT' : 'UPLOAD'} <span style={{ color: 'var(--primary-red)' }}>MEDIA</span></h2>
         </div>
         <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
         </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-gray)' }}>VIDEO TITLE</label>
            <input 
               type="text" 
               required
               placeholder="e.g. Diamond Platnumz - Komasava"
               value={formData.title}
               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
            />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-gray)' }}>ARTIST NAME</label>
            <input 
               type="text" 
               placeholder="e.g. Diamond Platnumz"
               value={formData.artist_name}
               onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '15px', color: 'white', outline: 'none' }}
            />
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-gray)' }}>VIDEO FILE {editingId && '(OPTIONAL)'}</label>
               <div style={{ position: 'relative', height: '120px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                  />
                  {videoFile ? (
                    <div style={{ textAlign: 'center' }}>
                       <Play size={20} color="var(--primary-red)" style={{ margin: '0 auto 8px' }} />
                       <div style={{ fontSize: '10px', fontWeight: 800, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{videoFile.name}</div>
                    </div>
                  ) : (
                    <Upload size={24} color="rgba(255,255,255,0.2)" />
                  )}
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-gray)' }}>THUMBNAIL (OPTIONAL)</label>
               <div style={{ position: 'relative', height: '120px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setThumbFile(e.target.files[0])}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                  />
                  {thumbFile ? (
                    <div style={{ textAlign: 'center' }}>
                       <ImageIcon size={20} color="#3B82F6" style={{ margin: '0 auto 8px' }} />
                       <div style={{ fontSize: '10px', fontWeight: 800, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thumbFile.name}</div>
                    </div>
                  ) : (
                    <ImageIcon size={24} color="rgba(255,255,255,0.2)" />
                  )}
               </div>
            </div>
         </div>

         <div 
           onClick={() => setFormData({ ...formData, is_exclusive: !formData.is_exclusive })}
           style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: formData.is_exclusive ? '1px solid var(--primary-red)' : '1px solid rgba(255,255,255,0.05)' }}
         >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <Star size={18} color={formData.is_exclusive ? 'var(--primary-red)' : 'var(--text-gray)'} fill={formData.is_exclusive ? 'var(--primary-red)' : 'none'} />
               <div>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>Mark as Exclusive</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>Adds "EXCLUSIVE ON WASAFI TV" branding</div>
               </div>
            </div>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {formData.is_exclusive && <div style={{ width: '10px', height: '10px', background: 'var(--primary-red)', borderRadius: '2px' }}></div>}
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
                  {editingId ? 'UPDATING...' : 'SYNCING TO CLOUD...'}
               </>
            ) : (
               <>
                  {editingId ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                  {editingId ? 'SAVE CHANGES' : 'UPLOAD & SYNC TO TV'}
               </>
            )}
         </button>

      </form>
    </div>
  );
};

export default AdminVideos;

