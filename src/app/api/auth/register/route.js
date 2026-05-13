import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();
    if (!name || !email || !password)
      return NextResponse.json({ success: false, message: 'Name, email and password are required.' }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ success: false, message: 'Email already registered. Please login.' }, { status: 400 });

    const user = await User.create({ name, email, password, role: 'user' });
    const token = signToken(user._id);
    return NextResponse.json(
      { success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
