import { EmptyState } from '@/design-system/patterns/EmptyState'

export default function ChatPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Chat</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Conversas com seus clientes em um só lugar.
        </p>
      </header>
      <EmptyState
        icon={<i className="ri-chat-3-line" />}
        title="Funcionalidade em breve"
        description="O chat com clientes está sendo desenvolvido e estará disponível em uma próxima atualização."
      />
    </div>
  )
}
