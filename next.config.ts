import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export: no server at runtime, deployable to Vercel or any static host.
  // This is why locale routing uses [locale] segments + generateStaticParams
  // instead of middleware — middleware does not run under output: 'export'.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

// Tried and rejected: experimental.inlineCss. Inlining the ~7 KB stylesheet into
// every document removed the render-blocking request but pushed FCP from 777 ms
// to 953 ms on throttled mobile, because the HTML itself is the critical
// resource. A separately cached stylesheet measured better on every page.

export default nextConfig;
