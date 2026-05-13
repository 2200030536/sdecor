'use client';
import { useState, useEffect, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { use } from 'react';
import SubCategoryRibbon from '@/components/SubCategoryRibbon';
import SortFilterBar from '@/components/SortFilterBar';
import PackageGrid from '@/components/PackageGrid';
import TrustBadges from '@/components/TrustBadges';
import { packagesAPI } from '@/lib/api';
import { categories } from '@/lib/mockData';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';

export default function CategoryPage({ params }) {
  const { category } = use(params);
  const catData = categories.find(
    c => c.value.toLowerCase().replace(' ', '-') === category
  );

  const [packages,     setPackages]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeSubCat, setActiveSubCat] = useState(null);
  const [sort,         setSort]         = useState('popularity');

  useEffect(() => {
    if (!catData) return;
    // Fetch packages filtered by category from the API
    packagesAPI.getAll({ category: catData.value })
      .then(res => setPackages(res.data || []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [catData]);

  const catPackages = useMemo(() => {
    let list = [...packages];
    if (activeSubCat) list = list.filter(p => p.subCategory === activeSubCat);
    if (sort === 'popularity')  list.sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    if (sort === 'low-to-high') list.sort((a,b) => a.price - b.price);
    if (sort === 'high-to-low') list.sort((a,b) => b.price - a.price);
    return list;
  }, [packages, activeSubCat, sort]);

  if (!catData) return notFound();

  return (
    <div className="pt-16">
      {/* Category Hero Banner */}
      <div className="gradient-brand py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-white/70 text-xs mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium">{catData.label} Decorations</span>
          </nav>
          <div className="text-6xl mb-3">{catData.emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {catData.label} Decorations
          </h1>
          <p className="text-white/80 text-sm max-w-lg">
            Hand-picked premium decoration packages for your {catData.label.toLowerCase()} celebration in Patna.
          </p>
        </div>
      </div>

      {/* Sub-category ribbon */}
      <SubCategoryRibbon active={activeSubCat} onSelect={setActiveSubCat} />

      {/* Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SortFilterBar count={catPackages.length} sort={sort} onSort={setSort} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={32} className="animate-spin text-brand" />
            <p className="text-gray-400 text-sm">Loading packages…</p>
          </div>
        ) : (
          <PackageGrid packages={catPackages} />
        )}
      </section>

      {/* Trust */}
      <TrustBadges />
    </div>
  );
}
