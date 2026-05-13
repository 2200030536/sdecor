'use client';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { subCategories } from '@/lib/mockData';

export default function SubCategoryRibbon({ active, onSelect }) {
  const scrollRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center py-4 gap-2">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll(-1)}
              className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full border border-gray-200 hover:border-brand hover:text-brand transition-colors flex-shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-2"
          >
            {/* "All" pill */}
            <button
              onClick={() => onSelect(null)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 group`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                  active === null
                    ? 'gradient-brand shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-brand-light group-hover:scale-105'
                }`}
              >
                🎉
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap ${
                  active === null ? 'text-brand' : 'text-gray-500'
                }`}
              >
                All
              </span>
            </button>

            {subCategories.map((sub) => (
              <button
                key={sub.value}
                onClick={() => onSelect(sub.value === active ? null : sub.value)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                    active === sub.value
                      ? 'gradient-brand shadow-lg scale-105'
                      : 'bg-gray-100 hover:bg-brand-light group-hover:scale-105'
                  }`}
                >
                  {sub.icon}
                </div>
                <span
                  className={`text-[10px] font-semibold whitespace-nowrap ${
                    active === sub.value ? 'text-brand' : 'text-gray-500'
                  }`}
                >
                  {sub.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll(1)}
              className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full border border-gray-200 hover:border-brand hover:text-brand transition-colors flex-shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
