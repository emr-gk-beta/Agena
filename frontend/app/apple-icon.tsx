import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #070F1A, #0A1625)',
          borderRadius: 40,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #22D3EE, #14B8A6, #22c55e)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: -4,
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size }
  );
}
