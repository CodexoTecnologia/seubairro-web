import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Domínios de imagens externas. Adicione conforme o backend evoluir.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Redirects 301 dos paths antigos /pages/X para /X.
  // Mantém e-mails/QR antigos funcionando durante a transição.
  async redirects() {
    return [
      {
        source: '/pages/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
