import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Package from '@/lib/models/Package';
import { requireAdmin } from '@/lib/serverAuth';

// GET /api/packages — public (with optional ?category= filter)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = { isActive: true };
    if (category) filter.category = category;

    const packages = await Package.find(filter).sort({ popularity: -1 }).lean();
    return NextResponse.json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST /api/packages — admin only
export async function POST(request) {
  try {
    await requireAdmin(request);
    await connectDB();
    const body = await request.json();
    const pkg  = await Package.create(body);
    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') {
      return errOrResponse;
    }
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 400 });
  }
}
