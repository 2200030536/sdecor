'use client';
import Link from 'next/link';
import { MessageCircle, CalendarCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function StickyBookingBar({ pkg }) {
  const waMessage = encodeURIComponent(
    `Hi SDecor! I'm interested in booking: ${pkg.title} (₹${pkg.price}). Please share more details.`
  );

  return (
    <>
      {/* Desktop inline CTA (visible md+) */}
      <div className="hidden md:block sticky top-20">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4">
          {/* Price block */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">{formatPrice(pkg.price)}</span>
              {pkg.originalPrice > pkg.price && (
                <span className="text-gray-400 line-through text-sm">{formatPrice(pkg.originalPrice)}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Inclusive of all taxes</p>
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/919999999999?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>

          {/* Book Now */}
          <button className="flex items-center justify-center gap-2 w-full py-3 gradient-brand text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity animate-pulse-ring">
            <CalendarCheck size={18} />
            Book Now
          </button>

          <p className="text-center text-xs text-gray-400">
            ⚡ Same-day service available · Free cancellation
          </p>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
        <div className="flex gap-3">
          <a
            href={`https://wa.me/919999999999?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 gradient-brand text-white font-bold rounded-xl text-sm shadow-md">
            <CalendarCheck size={16} />
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
