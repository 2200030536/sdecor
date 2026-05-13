import { notFound } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import WhatsIncluded from '@/components/WhatsIncluded';
import ColorPicker from '@/components/ColorPicker';
import ReviewsSection from '@/components/ReviewsSection';
import TrustBadges from '@/components/TrustBadges';
import StickyBookingBar from '@/components/StickyBookingBar';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Use absolute URL for server-side fetch (Next.js requires it in RSC)
const API = process.env.NEXT_PUBLIC_API_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');


// Fetch package by slug directly on the server
async function getPackage(slug) {
  try {
    const res = await fetch(`${API}/api/packages/${slug}`, {
      next: { revalidate: 60 }, // revalidate every 60s
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

// Fetch reviews for a package
async function getReviews(packageId) {
  try {
    const res = await fetch(`${API}/api/reviews/${packageId}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.title} | SDecor Patna`,
    description: pkg.description,
  };
}

export default async function PackageDetailPage({ params }) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const pkgReviews = await getReviews(pkg._id);
  const discount   = calculateDiscount(pkg.price, pkg.originalPrice);

  return (
    <div className="pt-16 pb-24 md:pb-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/category/${pkg.category.toLowerCase().replace(' ','-')}`} className="hover:text-brand transition-colors">{pkg.category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{pkg.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Gallery + Details ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-4">
              <ImageGallery images={pkg.images} title={pkg.title} />
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              {/* Badge + Category */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-brand-light text-brand text-xs font-bold rounded-full">
                  {pkg.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  {pkg.subCategory}
                </span>
                {pkg.badges?.map(b => (
                  <span key={b} className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    {b}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-black text-gray-900 leading-snug">{pkg.title}</h1>

              {/* Rating row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 rounded-full">
                  <Star size={14} className="fill-gold text-gold" />
                  <span className="text-sm font-bold text-gray-800">{pkg.rating || '—'}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {pkg.reviewCount || pkgReviews.length} verified reviews
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-4xl font-black text-gray-900">{formatPrice(pkg.price)}</span>
                {pkg.originalPrice > pkg.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-medium">{formatPrice(pkg.originalPrice)}</span>
                    <span className="px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full shadow">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 -mt-3">Inclusive of all taxes</p>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {pkg.description}
              </p>
            </div>

            {/* What's included */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <WhatsIncluded items={pkg.whatsIncluded} />
            </div>

            {/* Color Picker */}
            {pkg.customizationOptions?.colors?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <ColorPicker colors={pkg.customizationOptions.colors} />
              </div>
            )}

            {/* FAQs */}
            {pkg.faqs?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
                <div className="divide-y divide-gray-100">
                  {pkg.faqs.map((faq, i) => (
                    <div key={i} className="py-4">
                      <p className="text-sm font-semibold text-gray-800 mb-1">❓ {faq.q}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewsSection
              reviews={pkgReviews}
              avgRating={pkg.rating}
              totalCount={pkg.reviewCount || pkgReviews.length}
            />
          </div>

          {/* ── Right: Sticky Booking ── */}
          <div className="lg:col-span-1">
            <StickyBookingBar pkg={pkg} />
          </div>
        </div>
      </div>

      {/* Trust section */}
      <div className="mt-16">
        <TrustBadges />
      </div>
    </div>
  );
}
