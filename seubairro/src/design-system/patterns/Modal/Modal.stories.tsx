import type { Story } from '@ladle/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '@/design-system/primitives/Button'

const meta = { title: 'Design System / Patterns / Modal' }
export default meta

export const Default: Story = () => (
  <Modal
    trigger={<Button>Abrir modal</Button>}
    title="Confirmar ação"
    description="Tem certeza que deseja continuar?"
    footer={
      <>
        <Modal.Close asChild>
          <Button variant="outline">Cancelar</Button>
        </Modal.Close>
        <Button>Confirmar</Button>
      </>
    }
  />
)

export const Destructive: Story = () => (
  <Modal
    trigger={<Button variant="danger">Excluir anúncio</Button>}
    title="Excluir anúncio?"
    description="Esta ação não pode ser desfeita."
    footer={
      <>
        <Modal.Close asChild>
          <Button variant="outline">Manter</Button>
        </Modal.Close>
        <Button variant="danger">Excluir definitivamente</Button>
      </>
    }
  >
    <p>Todos os dados deste anúncio (fotos, descrição, histórico de visualizações) serão removidos.</p>
  </Modal>
)

export const Controlled: Story = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => setOpen(true)}>Abrir externo</Button>
      <span className="text-sm text-[var(--color-muted)]">Aberto? {open ? 'sim' : 'não'}</span>
      <Modal
        open={open}
        onOpenChange={setOpen}
        trigger={<span className="hidden" />}
        title="Modal controlado"
        description="O estado vive no componente pai."
      >
        <p>Use a prop <code>open</code> + <code>onOpenChange</code> para controlar externamente.</p>
      </Modal>
    </div>
  )
}

export const Sizes: Story = () => (
  <div className="flex gap-3">
    <Modal trigger={<Button size="sm">sm</Button>} title="Small" size="sm">
      <p>Largura máxima 28rem.</p>
    </Modal>
    <Modal trigger={<Button size="sm">md</Button>} title="Medium" size="md">
      <p>Largura máxima 32rem.</p>
    </Modal>
    <Modal trigger={<Button size="sm">lg</Button>} title="Large" size="lg">
      <p>Largura máxima 42rem.</p>
    </Modal>
  </div>
)
