import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';

const BADGE_STYLES = {
  'Best Seller': 'bg-emerald-500 text-white',
  'Trending':    'bg-orange-500 text-white',
};

export default function PackageCard({ pkg }) {
  const discount = calculateDiscount(pkg.price, pkg.originalPrice);

  return (
    <Link href={`/packages/${pkg.slug}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {pkg.images?.[0] ? (
            <Image
              src={pkg.images[0]}
              alt={pkg.title}
              fill
              className="object-contain transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl">
              🎀
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Badges */}
          {pkg.badges?.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {pkg.badges.map((b) => (
                <span
                  key={b}
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase shadow ${BADGE_STYLES[b] || 'bg-brand text-white'}`}
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Discount pill */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category tag */}
          <span className="text-[10px] font-semibold text-brand uppercase tracking-widest mb-1">
            {pkg.subCategory}
          </span>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-snug">
            {pkg.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={s <= Math.round(pkg.rating) ? 'fill-gold text-gold' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700">{pkg.rating}</span>
            <span className="text-xs text-gray-400">({pkg.reviewCount})</span>
          </div>

          {/* Pricing */}
          <div className="mt-auto flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-gray-900">{formatPrice(pkg.price)}</span>
                {pkg.originalPrice > pkg.price && (
                  <span className="text-xs text-gray-400 line-through font-medium">
                    {formatPrice(pkg.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Inclusive of all taxes</p>
            </div>

            <div className="px-3 py-1.5 gradient-brand text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
              Book Now
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
