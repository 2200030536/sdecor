import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Package from '@/lib/models/Package';
import { requireAdmin } from '@/lib/serverAuth';
import mongoose from 'mongoose';

// Detect if identifier is a MongoDB ObjectId or a slug string
function isObjectId(str) {
  return /^[a-f\d]{24}$/i.test(str);
}

// GET /api/packages/[identifier] — public (by slug or _id)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { identifier } = await params;
    const pkg = isObjectId(identifier)
      ? await Package.findById(identifier).lean()
      : await Package.findOne({ slug: identifier, isActive: true }).lean();

    if (!pkg) return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: pkg });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT /api/packages/[identifier] — admin only
export async function PUT(request, { params }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { identifier } = await params;
    const body = await request.json();
    const pkg = await Package.findByIdAndUpdate(identifier, body, { new: true, runValidators: true });
    if (!pkg) return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: pkg });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') return errOrResponse;
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 400 });
  }
}

// DELETE /api/packages/[identifier] — admin only (soft-delete)
export async function DELETE(request, { params }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { identifier } = await params;
    await Package.findByIdAndUpdate(identifier, { isActive: false });
    return NextResponse.json({ success: true, message: 'Package deactivated' });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') return errOrResponse;
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 500 });
  }
}
