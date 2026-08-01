import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: true }];
  },
};

// Tried and rejected: experimental.inlineCss. Inlining the ~7 KB stylesheet into
// every document removed the render-blocking request but pushed FCP from 777 ms
// to 953 ms on throttled mobile, because the HTML itself is the critical
// resource. A separately cached stylesheet measured better on every page.

export default nextConfig;
