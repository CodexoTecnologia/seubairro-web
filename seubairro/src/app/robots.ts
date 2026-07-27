import type { MetadataRoute } from 'next'
import { config } from '@/lib/config'

const SITE_URL = config.site.url

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
