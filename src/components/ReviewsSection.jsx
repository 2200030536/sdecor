'use client';
import { useState } from 'react';
import { Star, PenLine } from 'lucide-react';
import ReviewCard from './ReviewCard';

export default function ReviewsSection({ reviews = [], avgRating = 0, totalCount = 0 }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  };

  const fullStars = Math.round(avgRating);

  return (
    <section id="reviews" className="space-y-6">
      {/* Aggregate header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Big rating */}
          <div className="text-center">
            <div className="text-5xl font-black text-gray-900">{avgRating}</div>
            <div className="flex justify-center gap-0.5 my-1">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={s <= fullStars ? 'fill-gold text-gold' : 'text-gray-200'}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">{totalCount} reviews</p>
          </div>

          {/* Rating bars */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
            {[5,4,3,2,1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{star}</span>
                  <Star size={10} className="fill-gold text-gold flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-gold rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-5">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 gradient-brand text-white font-semibold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity self-start sm:self-center"
        >
          <PenLine size={16} />
          Write a Review
        </button>
      </div>

      {/* Write review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 border border-brand/30 shadow-sm space-y-4 animate-fade-in"
        >
          <h4 className="font-bold text-gray-900">Share Your Experience</h4>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({...form, rating: s})}
                  className="text-2xl transition-transform hover:scale-125"
                >
                  <Star
                    size={24}
                    className={s <= form.rating ? 'fill-gold text-gold' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Review</label>
            <textarea
              required
              rows={3}
              value={form.text}
              onChange={e => setForm({...form, text: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand resize-none"
              placeholder="Tell us about your experience..."
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 gradient-brand text-white font-semibold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity"
          >
            Submit Review
          </button>
        </form>
      )}

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-emerald-700 text-sm font-medium animate-fade-in">
          ✅ Thank you! Your review has been submitted for moderation.
        </div>
      )}

      {/* Review cards */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 text-sm">No reviews yet. Be the first to review!</div>
      )}
    </section>
  );
}
