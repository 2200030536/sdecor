import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/serverAuth';

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    return NextResponse.json({ success: true, user });
  } catch (errResponse) {
    return errResponse;
  }
}
