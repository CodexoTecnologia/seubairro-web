import type { MetadataRoute } from 'next'
import { config } from '@/lib/config'

const SITE_URL = config.site.url

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/cadastro`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/login`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
