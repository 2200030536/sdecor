// Next.js App Router dynamic OG image — served at /opengraph-image
// Uses the ImageResponse API to generate a branded 1200×630 PNG at request time.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SDecor — Premium Event Decorations in Patna';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #be185d 0%, #db2777 40%, #9333ea 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '120px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* Emoji row */}
        <div style={{ fontSize: 56, marginBottom: 24, display: 'flex', gap: 12 }}>
          🎂 💍 💒 🍼 💌
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.5px',
            marginBottom: 12,
          }}
        >
          SDecor
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: 24,
            maxWidth: 780,
          }}
        >
          Premium Event Decorations in Patna
        </div>

        {/* Sub-text */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 500,
            marginBottom: 40,
          }}
        >
          Birthdays · Anniversaries · Weddings · Baby Showers
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 100,
            padding: '14px 36px',
            fontSize: 24,
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          Same-day delivery · Lowest price guaranteed
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
