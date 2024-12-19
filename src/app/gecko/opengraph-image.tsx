import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'About Acme';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  // Font
  const interSemiBold = fetch(
    new URL('../../assets/Inter-SemiBold.woff', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          backgroundImage:
            'linear-gradient(to top right, #d7d2cc 0%, #304352 100%)',
          width: '100%',
          height: '100%',
          padding: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', marginTop: '80px' }}>
          <img
            alt="Vercel"
            height={180}
            src="data:image/svg+xml,%3Csvg width='116' height='100' fill='black' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
            width={180}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '48px',
            }}
          >
            <span
              style={{
                fontSize: '56px',
                color: '#222',
                paddingTop: '32px',
                fontWeight: 700,
              }}
            >
              Gecko 资源批量下载
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#222',
                fontWeight: 500,
              }}
            >
              继鹏的工具箱
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: '18px',
            color: '#222',
            fontWeight: 500,
          }}
        >
          生活服务 · 用户产品 · UGFE
        </span>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
