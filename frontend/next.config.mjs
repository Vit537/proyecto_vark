/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/login',
        destination: 'http://127.0.0.1:8000/api/accounts/login/',
      },
      {
        source: '/api/auth/register',
        destination: 'http://127.0.0.1:8000/api/accounts/registro/',
      },
      {
        source: '/api/:path*/',
        destination: 'http://127.0.0.1:8000/api/:path*/',
      },
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*/',
      },
    ];
  },
};

export default nextConfig;
