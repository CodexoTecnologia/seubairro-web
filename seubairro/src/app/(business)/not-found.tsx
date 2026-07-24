import Link from 'next/link'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { Button } from '@/design-system/primitives/Button'

export default function BusinessNotFound() {
  return (
    <div className="flex items-center justify-center w-full py-10">
      <EmptyState
        icon={<i className="ri-compass-3-line" />}
        title="Página não encontrada"
        description="O conteúdo que você procura não existe ou foi movido."
        action={
          <Link href="/dashboard-business">
            <Button leftIcon={<i className="ri-dashboard-line" />}>Voltar para a visão geral</Button>
          </Link>
        }
      />
    </div>
  )
}
