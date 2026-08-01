import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Static export: no server at runtime, deployable to Vercel or any static host.
  // This is why locale routing uses [locale] segments + generateStaticParams
  // instead of middleware — middleware does not run under output: 'export'.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },

  // In production, "/" is public/index.html — a hand-written redirect that
  // reads the stored locale before any framework JavaScript runs. The dev server
  // serves that file at /index.html but not at /, so "/" would 404 in dev only.
  //
  // This redirect fixes that. It is gated on NODE_ENV because `redirects` is not
  // supported under output: 'export' and declaring it unconditionally puts a
  // warning on every build. `next dev` sets development, `next build` sets
  // production, so the exported site never sees this.
  ...(isDev
    ? {
        async redirects() {
          return [{ source: '/', destination: '/en/', permanent: false }];
        },
      }
    : {}),
};

// Tried and rejected: experimental.inlineCss. Inlining the ~7 KB stylesheet into
// every document removed the render-blocking request but pushed FCP from 777 ms
// to 953 ms on throttled mobile, because the HTML itself is the critical
// resource. A separately cached stylesheet measured better on every page.

export default nextConfig;
