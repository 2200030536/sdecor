'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { packagesAPI } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

const CATEGORIES    = ['Birthday','Anniversary','Baby Shower','Wedding','Engagement'];
const SUB_CATS      = ['Room Decoration','Balloon Arch','Car Boot','Canopy','Table Setup','Stage Decor','Photo Booth'];
const BADGE_OPTIONS = ['Best Seller','Trending'];

const COLORS_PRESET = [
  { hex:'#FF0000', name:'Red' },
  { hex:'#FF69B4', name:'Pink' },
  { hex:'#9B59B6', name:'Purple' },
  { hex:'#3498DB', name:'Blue' },
  { hex:'#FFD700', name:'Gold' },
  { hex:'#FFFFFF', name:'White' },
  { hex:'#FFC0CB', name:'Peach' },
  { hex:'#2ECC71', name:'Green' },
  { hex:'#FF8C00', name:'Orange' },
  { hex:'#ADD8E6', name:'Light Blue' },
];

const emptyForm = {
  title: '', slug: '', category: '', subCategory: '',
  price: '', originalPrice: '',
  badges: [],
  description: '',
  whatsIncluded: [''],
  images: [''],
  colors: [],
};

function slugify(t) {
  return t.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
}

export default function NewPackagePage() {
  const router = useRouter();
  const [form, setForm]       = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleBadge = (b) =>
    set('badges', form.badges.includes(b) ? form.badges.filter(x=>x!==b) : [...form.badges, b]);

  const toggleColor = (hex) =>
    set('colors', form.colors.includes(hex) ? form.colors.filter(x=>x!==hex) : [...form.colors, hex]);

  const updateList    = (key, idx, val) => { const arr = [...form[key]]; arr[idx] = val; set(key, arr); };
  const addToList     = (key) => set(key, [...form[key], '']);
  const removeFromList = (key, idx) => set(key, form[key].filter((_,i)=>i!==idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      ...form,
      price:         Number(form.price),
      originalPrice: Number(form.originalPrice),
      whatsIncluded: form.whatsIncluded.filter(Boolean),
      images:        form.images.filter(Boolean),
      customizationOptions: { colors: form.colors },
    };
    try {
      // packagesAPI.create auto-attaches the admin JWT from localStorage
      await packagesAPI.create(payload);
      setSuccess(true);
      setTimeout(() => router.push('/admin/packages'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/packages" className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Package</h1>
          <p className="text-gray-500 text-sm mt-0.5">Fill in the details — submits to backend API</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-semibold text-sm animate-fade-in">
          <CheckCircle2 size={18} /> Package created! Redirecting…
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Basic Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
              <input required value={form.title} onChange={e => { set('title',e.target.value); set('slug', slugify(e.target.value)); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                placeholder="e.g. Romantic Room Decoration" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Slug</label>
              <input value={form.slug} onChange={e => set('slug', slugify(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-500 focus:outline-none focus:border-brand bg-gray-50"
                placeholder="auto-generated-from-title" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sub-category *</label>
              <select required value={form.subCategory} onChange={e => set('subCategory', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                <option value="">Select…</option>
                {SUB_CATS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand resize-none"
                placeholder="Short description of the package…" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (₹) *</label>
              <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                placeholder="e.g. 2499" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Original / MRP (₹)</label>
              <input type="number" min="0" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                placeholder="e.g. 2999" />
            </div>
          </div>
          {form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
            <p className="text-xs text-emerald-600 font-semibold">
              ✅ Discount: {Math.round((1 - form.price/form.originalPrice)*100)}% OFF
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Badges</h3>
          <div className="flex gap-3">
            {BADGE_OPTIONS.map(b => (
              <button key={b} type="button" onClick={() => toggleBadge(b)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  form.badges.includes(b) ? 'gradient-brand text-white border-transparent shadow' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                }`}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">What&apos;s Included</h3>
          <div className="space-y-2">
            {form.whatsIncluded.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={e => updateList('whatsIncluded', i, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                  placeholder={`Item ${i+1}…`} />
                {form.whatsIncluded.length > 1 && (
                  <button type="button" onClick={() => removeFromList('whatsIncluded', i)}
                    className="p-2.5 text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addToList('whatsIncluded')}
            className="flex items-center gap-1.5 text-brand text-sm font-semibold hover:underline">
            <Plus size={14} /> Add item
          </button>
        </div>

        {/* Images — drag-and-drop uploader */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">📸 Images / Videos</h3>
          <ImageUploader
            urls={form.images.filter(Boolean)}
            onChange={(newUrls) => set('images', newUrls)}
          />
        </div>

        {/* Colors */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Balloon Colour Options</h3>
          <div className="flex flex-wrap gap-3">
            {COLORS_PRESET.map(({ hex, name }) => (
              <button key={hex} type="button" title={name} onClick={() => toggleColor(hex)}
                className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 shadow-sm ${
                  form.colors.includes(hex) ? 'border-brand scale-110 shadow-md' : 'border-gray-200'
                }`}
                style={{ backgroundColor: hex }} />
            ))}
          </div>
          {form.colors.length > 0 && (
            <p className="text-xs text-gray-500">Selected {form.colors.length} colour(s)</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-4">
          <button type="submit" disabled={loading}
            className="flex-1 py-3.5 gradient-brand text-white font-bold text-sm rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? 'Saving…' : '🚀 Create Package'}
          </button>
          <Link href="/admin/packages"
            className="px-6 py-3.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
