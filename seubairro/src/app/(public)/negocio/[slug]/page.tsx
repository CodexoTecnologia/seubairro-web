import { notFound } from 'next/navigation'
import { PublicBusinessService } from '@/lib/api/services/PublicBusinessService'
import { ApiClientError } from '@/lib/api/Client/ApiClientError'
import PublicBusinessProfileView from '@/features/business/components/PublicBusinessProfileView/PublicBusinessProfileView'

type Params = { slug: string }

export const revalidate = 60

async function loadBusinessData(slug: string) {
  try {
    return await Promise.all([
      PublicBusinessService.getBySlug(slug),
      PublicBusinessService.getListingsBySlug(slug),
    ])
  } catch (err) {
    if (err instanceof ApiClientError && err.statusCode === 404) {
      notFound()
    }
    throw err
  }
}

export default async function PublicBusinessProfilePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const [business, listings] = await loadBusinessData(slug)

  return (
    <PublicBusinessProfileView
      slug={slug}
      business={business}
      listings={Array.isArray(listings) ? listings : []}
    />
  )
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  try {
    const business = await PublicBusinessService.getBySlug(slug)
    return {
      title: business.businessName ?? 'Negócio | SeuBairro',
      description: business.description ?? 'Confira este negócio local no SeuBairro.',
      openGraph: {
        title: business.businessName ?? 'SeuBairro',
        description: business.description ?? undefined,
        images: business.coverImageUrl ? [business.coverImageUrl] : undefined,
        type: 'website',
      },
    }
  } catch {
    return { title: 'Negócio | SeuBairro' }
  }
}
