import { PageShell } from '@/design-system/layout'
import Footer from '@/features/shared/components/layout/footer'
import {
  Header,
  Hero,
  InfoBar,
  Purpose,
  ForWho,
  Roadmap,
} from '@/features/marketing/components'

export default function HomePage() {
  return (
    <PageShell context="client" navbar={<Header />} footer={<Footer />}>
      <main className="flex-1 w-full">
        <Hero />
        <InfoBar />
        <Purpose />
        <ForWho />
        <Roadmap />
      </main>
    </PageShell>
  )
}
