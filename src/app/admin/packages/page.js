'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink, Pencil, Trash2, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { packagesAPI } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export default function AdminPackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [deleting, setDeleting] = useState(null); // id being deleted

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch ALL packages (active + inactive) for admin view
      const res = await packagesAPI.getAll();
      setPackages(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Deactivate "${title}"? It will be hidden from the public catalog.`)) return;
    setDeleting(id);
    try {
      await packagesAPI.remove(id);
      setPackages(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Packages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading…' : `${packages.length} packages in database`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPackages}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/admin/packages/new"
            className="flex items-center gap-2 px-4 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add New
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
          <button onClick={fetchPackages} className="ml-auto text-red-500 hover:underline font-semibold">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-brand" />
          <p className="text-gray-400 text-sm">Fetching packages from database…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && packages.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="font-bold text-gray-900 mb-1">No packages yet</h3>
          <p className="text-gray-400 text-sm mb-4">Add your first decoration package to get started.</p>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus size={15} />
            Add First Package
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && packages.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Package</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub-cat</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Disc.</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badges</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packages.map(p => {
                  const disc = calculateDiscount(p.price, p.originalPrice);
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 line-clamp-1">{p.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">{p.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-brand-light text-brand text-xs font-semibold rounded-full whitespace-nowrap">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs whitespace-nowrap">{p.subCategory}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{formatPrice(p.price)}</div>
                        {p.originalPrice > 0 && (
                          <div className="text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {disc > 0
                          ? <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{disc}%</span>
                          : <span className="text-gray-300 text-xs">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">⭐ {p.rating || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {p.badges?.map(b => (
                            <span key={b} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">{b}</span>
                          ))}
                          {!p.badges?.length && <span className="text-gray-300 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/packages/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-brand transition-colors"
                            title="View on site"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <Link
                            href={`/admin/packages/${p._id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-violet-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.title)}
                            disabled={deleting === p._id}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Deactivate"
                          >
                            {deleting === p._id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Trash2 size={14} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
