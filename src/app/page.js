'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Loader2 } from 'lucide-react';
import SubCategoryRibbon from '@/components/SubCategoryRibbon';
import SortFilterBar from '@/components/SortFilterBar';
import PackageGrid from '@/components/PackageGrid';
import TrustBadges from '@/components/TrustBadges';
import { packagesAPI } from '@/lib/api';
import { categories } from '@/lib/mockData'; // categories are static — no API needed

export default function HomePage() {
  const [packages,     setPackages]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeSubCat, setActiveSubCat] = useState(null);
  const [sort,         setSort]         = useState('popularity');

  // Fetch packages from real API on mount
  useEffect(() => {
    packagesAPI.getAll()
      .then(res => setPackages(res.data || []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = activeSubCat
      ? packages.filter(p => p.subCategory === activeSubCat)
      : [...packages];

    if (sort === 'popularity')  list.sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    if (sort === 'low-to-high') list.sort((a,b) => a.price - b.price);
    if (sort === 'high-to-low') list.sort((a,b) => b.price - a.price);

    return list;
  }, [packages, activeSubCat, sort]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[520px] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80"
          alt="Beautiful balloon decoration"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
          <div className="max-w-xl">
            {/* Pill label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-white text-xs font-semibold mb-5 animate-fade-in-up" style={{animationDelay:'0ms'}}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Patna&apos;s #1 Decoration Service
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 animate-fade-in-up" style={{animationDelay:'80ms'}}>
              Make Every Moment{' '}
              <span className="gradient-brand-text">Magical</span> ✨
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 animate-fade-in-up" style={{animationDelay:'160ms'}}>
              Premium balloon &amp; floral decorations for birthdays, anniversaries, weddings and beyond. Same-day delivery across Patna.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{animationDelay:'240ms'}}>
              <a href="#catalog" className="flex items-center justify-center gap-2 px-6 py-3.5 gradient-brand text-white font-bold rounded-2xl shadow-xl hover:opacity-90 transition-opacity text-sm">
                Explore Packages
                <ChevronRight size={16} />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-colors text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 text-xs animate-float">
          <span>scroll</span>
          <div className="w-0.5 h-8 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* ── Category quick links ─────────────────────────────────── */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <Link
                key={cat.value}
                href={`/category/${cat.value.toLowerCase().replace(' ', '-')}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-light text-brand rounded-full text-sm font-semibold hover:gradient-brand hover:text-white transition-all duration-200 shadow-sm"
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sub-category ribbon ──────────────────────────────────── */}
      <SubCategoryRibbon active={activeSubCat} onSelect={setActiveSubCat} />

      {/* ── Catalog ─────────────────────────────────────────────── */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SortFilterBar count={filtered.length} sort={sort} onSort={setSort} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={32} className="animate-spin text-brand" />
            <p className="text-gray-400 text-sm">Loading packages…</p>
          </div>
        ) : (
          <PackageGrid packages={filtered} />
        )}
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────── */}
      <TrustBadges />
    </>
  );
}