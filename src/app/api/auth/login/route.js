import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });

    if (!user.isActive)
      return NextResponse.json({ success: false, message: 'Account deactivated. Contact support.' }, { status: 403 });

    const token = signToken(user._id);
    return NextResponse.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
