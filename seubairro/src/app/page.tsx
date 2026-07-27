import { PageShell } from '@/design-system/layout'
import {
  Header,
  Hero,
  InfoBar,
  Purpose,
  ForWho,
  HowItWorks,
  Roadmap,
  Faq,
  Contact,
  MarketingFooter,
} from '@/features/marketing/components'
import { config } from '@/lib/config'

const SITE_URL = config.site.url

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SeuBairro',
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo-seubairro.svg`,
  email: 'codexotecnologia@gmail.com',
  sameAs: [
    'https://instagram.com/codexotecnologia',
    'https://linkedin.com/company/codexo-tecnologia',
  ],
}

export default function HomePage() {
  return (
    <PageShell context="client" navbar={<Header />} footer={<MarketingFooter />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main className="flex-1 w-full">
        <Hero />
        <InfoBar />
        <Purpose />
        <ForWho />
        <HowItWorks />
        <Roadmap />
        <Faq />
        <Contact />
      </main>
    </PageShell>
  )
}
