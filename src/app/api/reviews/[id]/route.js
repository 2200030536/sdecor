import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/lib/models/Review';
import Package from '@/lib/models/Package';
import { requireAdmin } from '@/lib/serverAuth';
import mongoose from 'mongoose';

function isObjectId(str) {
  return /^[a-f\d]{24}$/i.test(str);
}

// GET /api/reviews/[id]
// - If `id` looks like an ObjectId AND it's a packageId: return approved reviews for that package
// - Always returns approved reviews for the given packageId
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    // Treat id as packageId for public review listing
    const reviews = await Review.find({ packageId: id, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST /api/reviews/[id] — public: submit a review (id = packageId)
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const pkg = await Package.findById(id);
    if (!pkg) return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });

    const { userName, rating, text } = await request.json();
    const review = await Review.create({ packageId: id, userName, rating, text });

    // Recalculate average
    const approved = await Review.find({ packageId: id, isApproved: true });
    if (approved.length > 0) {
      pkg.rating      = Math.round((approved.reduce((s,r) => s + r.rating, 0) / approved.length) * 10) / 10;
      pkg.reviewCount = approved.length;
      await pkg.save();
    }

    return NextResponse.json(
      { success: true, message: 'Review submitted for moderation.', data: review },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

// DELETE /api/reviews/[id] — admin: delete a review (id = reviewId)
export async function DELETE(request, { params }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { id } = await params;
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') return errOrResponse;
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 500 });
  }
}
