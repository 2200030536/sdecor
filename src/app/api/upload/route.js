import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/serverAuth';

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload a Buffer to Cloudinary via upload_stream
function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

// Must opt-out of Next.js body parsing — we handle it via formData()
export const config = { api: { bodyParser: false } };

// POST /api/upload — admin only
export async function POST(request) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();
    const file     = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    // Check type
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$|^video\/(mp4|mov|avi|webm)$/;
    if (!allowed.test(file.type)) {
      return NextResponse.json({ success: false, message: 'Only images and videos are allowed.' }, { status: 400 });
    }

    // File size check — 4 MB max (Vercel hobby limit)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large. Max 4 MB on Vercel free plan.' }, { status: 400 });
    }

    const isVideo      = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, {
      folder:        'sdecor/packages',
      resource_type: resourceType,
      ...(isVideo ? {} : { quality: 'auto', fetch_format: 'auto' }),
    });

    return NextResponse.json({
      success:      true,
      url:          result.secure_url,
      publicId:     result.public_id,
      resourceType: result.resource_type,
      width:        result.width,
      height:       result.height,
      format:       result.format,
      bytes:        result.bytes,
    });
  } catch (errOrResponse) {
    if (errOrResponse instanceof Response || errOrResponse?.constructor?.name === 'NextResponse') return errOrResponse;
    console.error('Upload error:', errOrResponse.message);
    return NextResponse.json({ success: false, message: errOrResponse.message }, { status: 500 });
  }
}
