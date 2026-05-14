'use client';
import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import SubCategoryRibbon from '@/components/SubCategoryRibbon';
import SortFilterBar from '@/components/SortFilterBar';
import PackageGrid from '@/components/PackageGrid';
import { packagesAPI } from '@/lib/api';

/**
 * CatalogSection — interactive client component.
 * Keeps all stateful/data-fetching logic here so the parent page.js
 * can remain a Server Component (critical for SEO crawlability).
 */
export default function CatalogSection() {
  const [packages,     setPackages]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeSubCat, setActiveSubCat] = useState(null);
  const [sort,         setSort]         = useState('popularity');

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

    if (sort === 'popularity')  list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    if (sort === 'low-to-high') list.sort((a, b) => a.price - b.price);
    if (sort === 'high-to-low') list.sort((a, b) => b.price - a.price);

    return list;
  }, [packages, activeSubCat, sort]);

  return (
    <>
      <SubCategoryRibbon active={activeSubCat} onSelect={setActiveSubCat} />

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
    </>
  );
}
