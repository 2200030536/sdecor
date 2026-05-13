import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/lib/models/Review';
import { requireAdmin } from '@/lib/serverAuth';

// GET /api/reviews — admin only: all reviews
export async function GET(request) {
  try {
    await requireAdmin(request);
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: reviews.length, data: reviews });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') return errOrResponse;
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 500 });
  }
}
