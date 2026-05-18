'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, X, ChevronLeft, CheckCircle2, Loader2, AlertCircle,
  Tag, DollarSign, Image, Palette, List, Info, Sparkles, Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { packagesAPI } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

/* ── Shared constants (must match Package.js enums) ──────────────────── */
const CATEGORIES = [
  'Birthday', 'Anniversary', 'Baby Shower', 'Wedding', 'Engagement',
  'Graduation', 'Romantic', 'Proposal', 'Corporate', 'Kids Birthday',
  'Home Decoration', 'Other',
];
const SUB_CATS = [
  'Room Decoration', 'Balloon Arch', 'Car Boot', 'Canopy',
  'Table Setup', 'Stage Decor', 'Photo Booth', 'Other',
  'Birthday', 'Anniversary', 'Baby Welcome', 'Baby Shower',
  'Bachelorette', 'Canopy Decor', 'Car Boot Decor', 'Ceremony Decor',
  'Room Decor', 'Kids Special', 'Corporate Events', 'Proposal Decor',
  'Balloon ring', 'Ring Decoration',
];
const BADGE_OPTIONS = [
  'Best Seller', 'Trending', 'Premium', 'Popular',
  'Premium Setup', 'Premium Balloon', 'Premium Flower',
  'Premium Lighting', 'Exclusive', 'Luxury', 'Custom',
];
// Quick-pick preset swatches
const COLORS_PRESET = [
  { hex: '#FF0000', name: 'Red' },
  { hex: '#FF69B4', name: 'Pink' },
  { hex: '#9B59B6', name: 'Purple' },
  { hex: '#3498DB', name: 'Blue' },
  { hex: '#FFD700', name: 'Gold' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#FFC0CB', name: 'Peach' },
  { hex: '#2ECC71', name: 'Green' },
  { hex: '#FF8C00', name: 'Orange' },
  { hex: '#ADD8E6', name: 'Light Blue' },
  { hex: '#FF4500', name: 'Deep Orange' },
  { hex: '#8B0000', name: 'Dark Red' },
  { hex: '#000000', name: 'Black' },
  { hex: '#C0C0C0', name: 'Silver' },
  { hex: '#40E0D0', name: 'Turquoise' },
  { hex: '#FF1493', name: 'Deep Pink' },
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
  return t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/* ── Reusable section card ─────────────────────────────────────────── */
function Section({ icon: Icon, title, accent = '#D62965', children }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{ border: '1px solid #f1f1f1' }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{
          borderLeft: `4px solid ${accent}`,
          background: 'linear-gradient(90deg, rgba(214,41,101,0.04) 0%, transparent 100%)',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}18` }}
        >
          <Icon size={15} style={{ color: accent }} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">{title}</h3>
      </div>

      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

/* ── Styled input class ─────────────────────────────────────────────── */
const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 ' +
  'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 ' +
  'transition-all placeholder:text-gray-400 bg-white';

function Field({ label, required, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-brand ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function NewPackagePage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [customColor, setCustomColor] = useState('#D62965');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleBadge = b =>
    set('badges', form.badges.includes(b) ? form.badges.filter(x => x !== b) : [...form.badges, b]);

  const toggleColor = hex =>
    set('colors', form.colors.includes(hex) ? form.colors.filter(x => x !== hex) : [...form.colors, hex]);

  const updateList = (key, idx, val) => { const arr = [...form[key]]; arr[idx] = val; set(key, arr); };
  const addToList = key => set(key, [...form[key], '']);
  const removeFromList = (key, idx) => set(key, form[key].filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      whatsIncluded: form.whatsIncluded.filter(Boolean),
      images: form.images.filter(Boolean),
      customizationOptions: { colors: form.colors },
    };
    try {
      await packagesAPI.create(payload);
      setSuccess(true);
      setTimeout(() => router.push('/admin/packages'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const discountPct =
    form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price)
      ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
      : null;

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8 p-8"
        style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #1F1050 100%)' }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #D62965, transparent)', transform: 'translate(30%,-30%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C3AED, transparent)', transform: 'translateY(50%)' }}
        />

        <div className="relative flex items-center gap-4">
          <Link
            href="/admin/packages"
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <ChevronLeft size={18} className="text-white" />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md gradient-brand flex items-center justify-center">
                <Sparkles size={10} className="text-white" />
              </div>
              <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                Admin › Packages › New
              </span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight">Add New Package</h1>
            <p className="text-white/40 text-xs mt-1">Fill in the details and hit Create — saves directly to the database.</p>
          </div>

          <div
            className="hidden sm:flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-xl text-emerald-300 text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <Plus size={12} />
            New Entry
          </div>
        </div>
      </div>

      {/* ── Toasts ──────────────────────────────────────────────────── */}
      {success && (
        <div
          className="flex items-center gap-3 mb-6 p-4 rounded-2xl border text-emerald-700 font-semibold text-sm animate-fade-in"
          style={{ background: '#ECFDF5', borderColor: '#6EE7B7' }}
        >
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          Package created! Redirecting to packages list…
        </div>
      )}
      {error && (
        <div
          className="flex items-center gap-3 mb-6 p-4 rounded-2xl border text-red-700 text-sm animate-fade-in"
          style={{ background: '#FEF2F2', borderColor: '#FECACA' }}
        >
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Basic Info ─────────────────────────────────────────────── */}
        <Section icon={Info} title="Basic Info" accent="#D62965">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Title" required>
                <input
                  required
                  value={form.title}
                  onChange={e => { set('title', e.target.value); set('slug', slugify(e.target.value)); }}
                  className={inputCls}
                  placeholder="e.g. Romantic Room Decoration"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Slug" hint="Auto-generated from title. Lowercase, hyphens only.">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                  <input
                    value={form.slug}
                    onChange={e => set('slug', slugify(e.target.value))}
                    className={`${inputCls} pl-7 font-mono text-gray-500 bg-gray-50`}
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </Field>
            </div>

            <Field label="Category" required>
              <select
                required
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputCls}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Sub-category" required>
              <select
                required
                value={form.subCategory}
                onChange={e => set('subCategory', e.target.value)}
                className={inputCls}
              >
                <option value="">Select sub-category…</option>
                {SUB_CATS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  className={`${inputCls} resize-none`}
                  placeholder="Short description of the package…"
                />
              </Field>
            </div>
          </div>
        </Section>

        {/* ── Pricing ────────────────────────────────────────────────── */}
        <Section icon={DollarSign} title="Pricing" accent="#10B981">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Selling Price (₹)" required>
              <input
                required type="number" min="0"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                className={inputCls}
                placeholder="e.g. 2499"
              />
            </Field>
            <Field label="Original / MRP (₹)">
              <input
                type="number" min="0"
                value={form.originalPrice}
                onChange={e => set('originalPrice', e.target.value)}
                className={inputCls}
                placeholder="e.g. 2999"
              />
            </Field>
          </div>

          {discountPct && (
            <div className="flex items-center gap-2 mt-1">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}
              >
                <CheckCircle2 size={12} />
                {discountPct}% OFF — Customers save ₹{Number(form.originalPrice) - Number(form.price)}
              </div>
            </div>
          )}
        </Section>

        {/* ── Badges ─────────────────────────────────────────────────── */}
        <Section icon={Tag} title="Badges" accent="#7C3AED">
          <div className="flex flex-wrap gap-2">
            {BADGE_OPTIONS.map(b => {
              const active = form.badges.includes(b);
              return (
                <button
                  key={b} type="button"
                  onClick={() => toggleBadge(b)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all hover:scale-105 active:scale-95"
                  style={
                    active
                      ? {
                          background: 'linear-gradient(135deg,#D62965,#7C3AED)',
                          color: '#fff',
                          border: 'transparent',
                          boxShadow: '0 4px 12px rgba(214,41,101,0.35)',
                        }
                      : { background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }
                  }
                >
                  {active && '✓ '}{b}
                </button>
              );
            })}
          </div>
          {form.badges.length > 0 && (
            <p className="text-[11px] text-gray-400">
              {form.badges.length} badge{form.badges.length > 1 ? 's' : ''} selected
            </p>
          )}
        </Section>

        {/* ── What's Included ────────────────────────────────────────── */}
        <Section icon={List} title="What's Included" accent="#F59E0B">
          <div className="space-y-2">
            {form.whatsIncluded.map((item, i) => (
              <div key={i} className="flex gap-2 items-center group">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}
                >
                  {i + 1}
                </span>
                <input
                  value={item}
                  onChange={e => updateList('whatsIncluded', i, e.target.value)}
                  className={`${inputCls} flex-1`}
                  placeholder={`Item ${i + 1}…`}
                />
                {form.whatsIncluded.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFromList('whatsIncluded', i)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all hover:bg-red-50 text-red-400 hover:text-red-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addToList('whatsIncluded')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', color: '#92400E', border: '1px solid #FCD34D' }}
          >
            <Plus size={13} /> Add item
          </button>
        </Section>

        {/* ── Images ─────────────────────────────────────────────────── */}
        <Section icon={Image} title="Images / Videos" accent="#3B82F6">
          <ImageUploader
            urls={form.images.filter(Boolean)}
            onChange={newUrls => set('images', newUrls)}
          />
        </Section>

        {/* ── Colour Options ──────────────────────────────────────────── */}
        <Section icon={Palette} title="Balloon Colour Options" accent="#EC4899">

          {/* Quick-pick presets */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Quick Picks</p>
            <div className="flex flex-wrap gap-3">
              {COLORS_PRESET.map(({ hex, name }) => {
                const active = form.colors.includes(hex);
                return (
                  <button
                    key={hex} type="button" title={name}
                    onClick={() => toggleColor(hex)}
                    className="relative flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className="w-10 h-10 rounded-full transition-all hover:scale-110"
                      style={{
                        backgroundColor: hex,
                        border: active ? '3px solid #D62965' : '2px solid #E5E7EB',
                        boxShadow: active
                          ? '0 0 0 3px rgba(214,41,101,0.2), 0 4px 12px rgba(0,0,0,0.15)'
                          : '0 2px 6px rgba(0,0,0,0.1)',
                        transform: active ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                    {active && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-brand drop-shadow-sm" />
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity w-14 text-center leading-tight">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom color picker */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Custom Color</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={e => setCustomColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200 p-0.5"
                  style={{ appearance: 'none', backgroundColor: 'transparent' }}
                  title="Pick any color"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">
                  Selected: <span className="font-mono font-bold text-gray-700">{customColor.toUpperCase()}</span>
                </p>
                <button
                  type="button"
                  onClick={() => { if (!form.colors.includes(customColor)) set('colors', [...form.colors, customColor]); }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{
                    background: customColor,
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    boxShadow: `0 4px 12px ${customColor}66`,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <Plus size={12} /> Add this color
                </button>
              </div>
            </div>
          </div>

          {/* Selected colors */}
          {form.colors.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Selected — {form.colors.length} colour{form.colors.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {form.colors.map(hex => (
                  <div
                    key={hex}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: hex, border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                    <span className="font-mono text-gray-600">{hex.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => set('colors', form.colors.filter(c => c !== hex))}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── Sticky Create Bar ───────────────────────────────────────── */}
        <div
          className="sticky bottom-6 flex gap-3 p-4 rounded-2xl shadow-2xl z-10"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(214,41,101,0.12)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }}
        >
          <Link
            href="/admin/packages"
            className="px-6 py-3 rounded-xl text-gray-600 font-semibold text-sm transition-all hover:bg-gray-100 border border-gray-200 flex items-center gap-2"
          >
            <X size={15} /> Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(16,185,129,0.4)',
            }}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Creating package…</>
            ) : (
              <><Rocket size={16} /> Create Package</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
