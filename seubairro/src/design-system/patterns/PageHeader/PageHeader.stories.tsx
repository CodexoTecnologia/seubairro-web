import type { Story } from '@ladle/react'
import { PageHeader } from './PageHeader'
import { Button } from '@/design-system/primitives/Button'

const meta = { title: 'Design System / Patterns / PageHeader' }
export default meta

export const Simples: Story = () => <PageHeader title="Pedidos" />

export const ComDescricao: Story = () => (
  <PageHeader title="Pedidos" description="Acompanhe e gerencie os pedidos do seu negócio." />
)

export const ComAcoes: Story = () => (
  <PageHeader
    title="Seus Anúncios"
    description="Gerencie o que seu negócio oferece."
    actions={<Button leftIcon={<i className="ri-add-line" />}>Criar anúncio</Button>}
  />
)

export const ComEyebrow: Story = () => (
  <PageHeader
    eyebrow="Padaria do João"
    title="Minha Empresa"
    description="Dados públicos, endereço e horários do seu negócio."
    actions={
      <Button variant="outline" leftIcon={<i className="ri-external-link-line" />}>
        Ver perfil público
      </Button>
    }
  />
)

export const TituloLongo: Story = () => (
  <PageHeader
    title="Configurações de horário de funcionamento do seu negócio"
    description="Um título longo deve quebrar de forma equilibrada e a descrição não deve ultrapassar a medida de leitura confortável, mesmo em telas largas."
  />
)
