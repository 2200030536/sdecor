/**
 * src/lib/serverAuth.js
 * JWT guard helpers for Next.js Route Handlers.
 * Usage: const user = await requireAuth(request);
 *        const admin = await requireAdmin(request);
 * Both throw a Response on failure (catch and return it).
 */
import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import User from './models/User';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

// Extract and verify JWT from the Authorization header
async function getUser(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).lean();
    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

// Requires any logged-in user
export async function requireAuth(request) {
  const user = await getUser(request);
  if (!user) {
    throw NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  return user;
}

// Requires admin role
export async function requireAdmin(request) {
  const user = await getUser(request);
  if (!user) {
    throw NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    throw NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }
  return user;
}

// Sign a JWT
export function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
