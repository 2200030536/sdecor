'use client';

const SORT_OPTIONS = [
  { label: '⭐ Popularity', value: 'popularity' },
  { label: '💰 Low to High', value: 'low-to-high' },
  { label: '📉 High to Low', value: 'high-to-low' },
];

export default function SortFilterBar({ count, sort, onSort }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
      <p className="text-sm text-gray-500 font-medium">
        <span className="text-gray-900 font-bold">{count}</span> packages found
      </p>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium hidden sm:block">Sort by:</span>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSort(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                sort === opt.value
                  ? 'gradient-brand text-white border-transparent shadow-md scale-105'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
