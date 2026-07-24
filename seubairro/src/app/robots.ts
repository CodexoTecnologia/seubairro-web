import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard-client',
        '/dashboard-business',
        '/perfil',
        '/minha-empresa',
        '/criar-anuncio',
        '/listar-anuncio',
        '/pedidos',
        '/chat',
        '/anuncio/',
        '/detalhes-anuncio',
        '/busca',
        '/choose-profile',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
