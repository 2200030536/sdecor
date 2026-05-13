'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Star, Plus, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { packagesAPI, reviewsAPI } from '@/lib/api';

export default function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, revRes] = await Promise.all([
        packagesAPI.getAll(),
        reviewsAPI.getAll(),
      ]);
      setPackages(pkgRes.data  || []);
      setReviews(revRes.data   || []);
    } catch {
      // fail silently — keep empty arrays
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const avgRating = packages.length
    ? (packages.reduce((s,p) => s + (p.rating || 0), 0) / packages.length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Total Packages', value: packages.length, icon: Package,    color: 'text-brand',   bg: 'bg-brand-light' },
    { label: 'Total Reviews',  value: reviews.length,  icon: Star,       color: 'text-gold',    bg: 'bg-yellow-50'   },
    { label: 'Best Sellers',   value: packages.filter(p => p.badges?.includes('Best Seller')).length, icon: TrendingUp, color: 'text-emerald', bg: 'bg-emerald-50' },
    { label: 'Avg Rating',     value: avgRating + '★', icon: Star,       color: 'text-violet',  bg: 'bg-violet-50'   },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 size={32} className="animate-spin text-brand" />
        <p className="text-gray-400 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your SDecor platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            href="/admin/packages/new"
            className="flex items-center gap-2 px-4 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add Package
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent packages table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Packages</h3>
          <Link href="/admin/packages" className="text-brand text-sm font-semibold hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {packages.slice(0,6).map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/packages/${p.slug}`} target="_blank" className="font-medium text-gray-900 hover:text-brand transition-colors line-clamp-1">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-brand-light text-brand text-xs font-semibold rounded-full">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">₹{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-gold font-semibold">⭐ {p.rating || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {p.badges?.map(b => (
                        <span key={b} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">{b}</span>
                      ))}
                      {!p.badges?.length && <span className="text-gray-300 text-xs">—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Reviews</h3>
        </div>
        {reviews.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">No reviews yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.slice(0,4).map(r => (
              <div key={r._id} className="px-6 py-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.userName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{r.userName}</span>
                    <span className="text-xs text-gold font-bold">{'★'.repeat(r.rating)}</span>
                    {!r.isApproved && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
