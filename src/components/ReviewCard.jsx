import { Star, BadgeCheck } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">{review.userName}</span>
              {review.isVerified && (
                <BadgeCheck size={14} className="text-brand" />
              )}
            </div>
            {review.isVerified && (
              <span className="text-[10px] text-emerald-600 font-semibold">Verified Customer</span>
            )}
          </div>
        </div>

        {/* Star pill */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gold/10 rounded-full">
          <Star size={11} className="fill-gold text-gold" />
          <span className="text-xs font-bold text-gray-800">{review.rating}.0</span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
    </div>
  );
}
