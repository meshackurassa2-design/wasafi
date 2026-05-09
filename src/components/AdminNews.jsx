import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, X, CheckCircle2, Loader2, Newspaper, Plus,
  Image as ImageIcon, Tag, Clock, AlignLeft, User, Briefcase,
  Trash2, Edit, Search, LayoutList, Upload
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Music', 'Sports', 'Lifestyle', 'Entertainment', 'Politics', 'Business'];
const DEFAULT_COVER = 'https://www.wasafimedia.com/wp-content/uploads/2021/04/wasafi-media.jpg';

// ── Reusable field wrapper ──────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{
      fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)',
      letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '6px'
    }}>
      {Icon && <Icon size={12} />}
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  padding: '14px 16px',
  color: 'white',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

// ── Main Component ──────────────────────────────────────────────────────────
const AdminNews = ({ onBack }) => {
  const [view, setView] = useState('manage'); // 'manage' | 'add' | 'edit'
  const [articles, setArticles] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // form state
  const [form, setForm] = useState({
    title: '',
    category: 'Music',
    author_name: 'Wasafi News Bureau',
    author_role: 'Lead Editor',
    read_time: '3 min',
    summary: '',
    content: '',
    tagInput: '',
    tags: [],
  });
  const [images, setImages] = useState([]); // File[]
  const [uploadProgress, setUploadProgress] = useState(null);

  // ── Fetch articles ──────────────────────────────────────────────────────
  const fetchArticles = async () => {
    setFetching(true);
    const { data, error: err } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (!err) setArticles(data || []);
    setFetching(false);
  };

  useEffect(() => {
    if (view === 'manage') fetchArticles();
  }, [view]);

  // ── Reset form ──────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm({
      title: '', category: 'Music', author_name: 'Wasafi News Bureau',
      author_role: 'Lead Editor', read_time: '3 min',
      summary: '', content: '', tagInput: '', tags: [],
    });
    setImages([]);
    setEditingId(null);
    setError(null);
    setUploadProgress(null);
  };

  const openAdd = () => { resetForm(); setView('add'); };
  const openEdit = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title || '',
      category: article.category || 'Music',
      author_name: article.author_name || 'Wasafi News Bureau',
      author_role: article.author_role || 'Lead Editor',
      read_time: article.read_time || '3 min',
      summary: article.summary || '',
      content: article.content || '',
      tagInput: '',
      tags: article.news_tags || [],
    });
    setImages([]);
    setError(null);
    setView('edit');
  };

  // ── Tag helpers ─────────────────────────────────────────────────────────
  const addTag = () => {
    const t = form.tagInput.trim().replace(/\s+/g, '');
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t], tagInput: '' }));
    } else {
      setForm(f => ({ ...f, tagInput: '' }));
    }
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  // ── Image file picker ───────────────────────────────────────────────────
  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 6)); // max 6 images
  };

  // ── Upload images to news-images bucket ────────────────────────────────
  const uploadImages = async (files) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Uploading image ${i + 1}/${files.length}...`);
      const ext = files[i].name.split('.').pop();
      const path = `${Date.now()}_${i}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('news-images')
        .upload(path, files[i], { contentType: files[i].type });
      if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(path);
      urls.push(publicUrl);
    }
    setUploadProgress(null);
    return urls;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.summary.trim()) { setError('Summary is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }

    setLoading(true);
    setError(null);

    try {
      // Upload new images
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }

      const payload = {
        title: form.title.trim(),
        category: form.category,
        author_name: form.author_name.trim(),
        author_role: form.author_role.trim(),
        read_time: form.read_time.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        news_tags: form.tags,
        ...(imageUrls.length > 0 && {
          image_url: imageUrls[0],
          news_images: imageUrls,
        }),
      };

      if (editingId) {
        const { error: dbErr } = await supabase
          .from('news')
          .update(payload)
          .eq('id', editingId);
        if (dbErr) throw dbErr;
      } else {
        if (!payload.image_url) {
          payload.image_url = DEFAULT_COVER;
          payload.news_images = [DEFAULT_COVER];
        }
        const { error: dbErr } = await supabase
          .from('news')
          .insert([payload]);
        if (dbErr) throw dbErr;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
        setView('manage');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    const { error: err } = await supabase.from('news').delete().eq('id', id);
    if (!err) setArticles(prev => prev.filter(a => a.id !== id));
    else alert('Delete failed: ' + err.message);
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', color: 'white' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <CheckCircle2 size={80} color="#10B981" />
        </motion.div>
        <h2 style={{ fontSize: '24px', fontWeight: 950 }}>{editingId ? 'ARTICLE UPDATED' : 'ARTICLE PUBLISHED'}</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Your article is now live on Wasafi News.</p>
      </div>
    );
  }

  // ── MANAGE view ─────────────────────────────────────────────────────────
  if (view === 'manage') {
    const filtered = articles.filter(a =>
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <div className="fade-in" style={{ padding: '25px', color: 'white' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 950 }}>PRESS <span style={{ color: 'var(--primary-red)' }}>BUREAU</span></h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Manage all Wasafi News articles</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={openAdd}
              style={{ background: 'var(--primary-red)', border: 'none', padding: '12px 20px', borderRadius: '12px', color: 'white', fontWeight: 900, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> NEW ARTICLE
            </button>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '12px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Search size={16} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', outline: 'none', width: '100%' }}
          />
        </div>

        {fetching ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Loader2 className="animate-spin" size={30} color="var(--primary-red)" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(article => (
              <div key={article.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '60px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                  <img src={article.image_url || DEFAULT_COVER} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{article.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{article.category} · {new Date(article.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => openEdit(article)} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Edit size={15} />
                  </button>
                  <button onClick={() => handleDelete(article.id)} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(225,29,72,0.08)', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
                <Newspaper size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
                <p style={{ fontWeight: 700 }}>No articles yet. Click NEW ARTICLE to publish your first one.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── ADD / EDIT Form ─────────────────────────────────────────────────────
  return (
    <div className="fade-in" style={{ padding: '25px', color: 'white', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setView('manage')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 950 }}>{editingId ? 'EDIT' : 'NEW'} <span style={{ color: 'var(--primary-red)' }}>ARTICLE</span></h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>All fields marked are required</p>
          </div>
        </div>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* Title */}
        <Field label="ARTICLE TITLE *" icon={Newspaper}>
          <input
            type="text"
            required
            placeholder="e.g. Diamond Platnumz Breaks Afrobeats Record..."
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={inputStyle}
          />
        </Field>

        {/* Category + Read Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Field label="CATEGORY *" icon={LayoutList}>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="READ TIME" icon={Clock}>
            <input
              type="text"
              placeholder="e.g. 3 min"
              value={form.read_time}
              onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Author Name + Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Field label="AUTHOR NAME" icon={User}>
            <input
              type="text"
              placeholder="e.g. Wasafi News Bureau"
              value={form.author_name}
              onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
              style={inputStyle}
            />
          </Field>
          <Field label="AUTHOR ROLE" icon={Briefcase}>
            <input
              type="text"
              placeholder="e.g. Lead Editor"
              value={form.author_role}
              onChange={e => setForm(f => ({ ...f, author_role: e.target.value }))}
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Tags */}
        <Field label="TAGS" icon={Tag}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Type tag and press Add..."
              value={form.tagInput}
              onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button type="button" onClick={addTag} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', padding: '0 16px', borderRadius: '14px', color: 'white', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + ADD
            </button>
          </div>
          {form.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {form.tags.map(tag => (
                <span key={tag} onClick={() => removeTag(tag)} style={{ padding: '5px 12px', background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(225,29,72,0.3)', borderRadius: '20px', fontSize: '11px', fontWeight: 800, color: 'var(--primary-red)', cursor: 'pointer' }}>
                  #{tag} ×
                </span>
              ))}
            </div>
          )}
        </Field>

        {/* Images */}
        <Field label="IMAGES (UP TO 6)" icon={ImageIcon}>
          <label style={{ display: 'block', cursor: 'pointer' }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              style={{ display: 'none' }}
            />
            <div style={{ border: '2px dashed rgba(255,255,255,0.12)', borderRadius: '18px', padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <ImageIcon size={28} color="rgba(255,255,255,0.2)" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                {images.length > 0 ? `${images.length} image(s) selected` : 'Click to select images'}
              </div>
              {images.length > 0 && (
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
                  {images.map(f => f.name).join(', ')}
                </div>
              )}
            </div>
          </label>
          {images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={URL.createObjectURL(img)} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} alt="" />
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--primary-red)', border: 'none', color: 'white', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </Field>

        {/* Summary */}
        <Field label="SUMMARY *" icon={AlignLeft}>
          <textarea
            required
            rows={3}
            placeholder="Write a brief summary of the article..."
            value={form.summary}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
          />
        </Field>

        {/* Full Content */}
        <Field label="FULL ARTICLE CONTENT *" icon={AlignLeft}>
          <textarea
            required
            rows={10}
            placeholder="Write the full article content here. You can use basic HTML like <b>bold</b>, <i>italic</i>, <br/> for new lines..."
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '220px' }}
          />
        </Field>

        {/* Upload progress */}
        {uploadProgress && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
            ⬆ {uploadProgress}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: 'var(--primary-red)' }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '10px', background: loading ? 'rgba(225,29,72,0.5)' : 'var(--primary-red)', padding: '18px', borderRadius: '40px', color: 'white', fontWeight: 950, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 15px 30px rgba(225,29,72,0.25)' }}
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> {uploadProgress || (editingId ? 'SAVING...' : 'PUBLISHING...')}</>
          ) : (
            <><Newspaper size={20} /> {editingId ? 'SAVE CHANGES' : 'PUBLISH NOW'}</>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminNews;
