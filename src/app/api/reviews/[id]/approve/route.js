import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/lib/models/Review';
import { requireAdmin } from '@/lib/serverAuth';

// PATCH /api/reviews/[id]/approve — admin: approve a review
export async function PATCH(request, { params }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { id } = await params;
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true, isVerified: true },
      { new: true }
    );
    if (!review) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: review });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') return errOrResponse;
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 500 });
  }
}
