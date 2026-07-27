'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ChatService } from '@/lib/api/services/ChatService'
import { OrderService } from '@/lib/api/services/OrderService'
import { OrderStatusEnum } from '@/lib/api/enums/OrderStatusEnum'
import type { ConversationResponse, MessageResponse, OrderResponse } from '@/lib/api/dtos/Response/index'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { OrderPaymentModal } from '@/features/client/components/OrderPaymentModal/OrderPaymentModal'
import { CreateServiceReviewModal } from '@/features/client/components/CreateServiceReviewModal/CreateServiceReviewModal'
import { cn } from '@/lib/utils/cn'

function formatMessageTime(isoDate: string | null): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatConversationDate(isoDate: string | null): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

export default function ClientMensagensPage() {
  const searchParams = useSearchParams()
  const initialConvId = searchParams.get('conversationId')
  const initialOrderId = searchParams.get('orderId')

  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])

  const [activeOrder, setActiveOrder] = useState<OrderResponse | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true)
    setError(null)
    try {
      const result = await ChatService.getConversations({ pageSize: 50 })
      const items = Array.isArray(result?.items) ? result.items : []
      setConversations(items)

      if (items.length > 0) {
        setActiveConversation((prev) => {
          if (initialConvId) {
            const target = items.find((c) => c.id === initialConvId)
            return target || prev || items[0]
          }
          return prev || items[0]
        })
      }
    } catch {
      setError('Não foi possível carregar suas conversas no momento.')
    } finally {
      setLoadingConversations(false)
    }
  }, [initialConvId])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setError('Faça login para visualizar suas mensagens.')
      setLoadingConversations(false)
      return
    }
    void loadConversations()
  }, [authLoading, isAuthenticated, loadConversations])

  const loadOrder = useCallback(async (orderIdStr?: string | null) => {
    if (!orderIdStr) {
      setActiveOrder(null)
      return
    }
    try {
      const ord = await OrderService.getById(Number(orderIdStr))
      setActiveOrder(ord)
    } catch {
      setActiveOrder(null)
    }
  }, [])

  useEffect(() => {
    if (initialOrderId) {
      void loadOrder(initialOrderId)
    }
  }, [initialOrderId, loadOrder])

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true)
    try {
      const page = await ChatService.getMessages(conversationId, { pageSize: 50 })
      const items = Array.isArray(page?.items) ? page.items : []
      setMessages([...items].reverse())

      await ChatService.markAsRead(conversationId).catch(() => {})

      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
      )
    } catch {
      // Falha ao carregar: a conversa permanece com as mensagens já exibidas.
    } finally {
      setLoadingMessages(false)
      setTimeout(scrollToBottom, 100)
    }
  }, [])

  useEffect(() => {
    if (activeConversation?.id) {
      void loadMessages(activeConversation.id)
    }
  }, [activeConversation?.id, loadMessages])

  useEffect(() => {
    if (!activeConversation?.id) return
    const handleFocus = () => {
      void loadMessages(activeConversation.id)
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [activeConversation?.id, loadMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConversation || sending) return

    const text = messageInput.trim()
    setMessageInput('')
    setSending(true)

    try {
      const newMsg = await ChatService.sendMessage(activeConversation.id, text)
      setMessages((prev) => [...prev, newMsg])

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, lastMessagePreview: text, lastMessageAt: newMsg.createdAt }
            : c,
        ),
      )

      setTimeout(scrollToBottom, 50)
    } catch {
      setMessageInput(text)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter((c) =>
    c.businessName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isPendingPayment =
    activeOrder?.status === OrderStatusEnum.AwaitingPayment ||
    activeOrder?.status === OrderStatusEnum.Pending
  const isOrderCompleted =
    activeOrder?.status === OrderStatusEnum.Completed ||
    activeOrder?.status === OrderStatusEnum.Accepted ||
    activeOrder?.status === OrderStatusEnum.Ready

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <PageHeader
        title="Minhas Mensagens & Negociações"
        description="Converse diretamente com o estabelecimento, alinhe os detalhes do serviço, efetue o pagamento e conclua o atendimento."
      />

      <Card padding="none" className="grid grid-cols-1 md:grid-cols-[340px_1fr] h-[680px] rounded-2xl overflow-hidden border-[var(--color-border-default)] shadow-xs">
        {/* Lado Esquerdo: Lojas com quem conversa */}
        <aside className="flex flex-col border-r border-[var(--color-border-default)] bg-[var(--color-surface)] h-full overflow-hidden">
          <div className="p-3.5 border-b border-[var(--color-border-default)] bg-[var(--color-page)]">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-2.5 text-[var(--color-muted)] text-sm" />
              <input
                type="text"
                placeholder="Buscar por loja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-default)]">
            {loadingConversations ? (
              <div className="p-3 flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton variant="circle" width={40} height={40} className="shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <Skeleton variant="text" width="60%" className="h-3.5" />
                      <Skeleton variant="text" width="90%" className="h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-xs text-[var(--color-danger)] flex flex-col items-center gap-1">
                <i className="ri-error-warning-line text-lg" />
                {error}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-[var(--color-muted)]">
                <i className="ri-chat-voice-line text-3xl" />
                <span className="text-xs font-semibold text-[var(--color-title)]">Nenhuma mensagem disponível</span>
                <span className="text-[11px]">Você poderá trocar mensagens ao solicitar ordens de serviço.</span>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConversation(conv)}
                    className={cn(
                      'w-full p-3.5 flex items-start gap-3 text-left transition-colors relative',
                      isActive
                        ? 'bg-[var(--color-primary)]/10 border-l-4 border-l-[var(--color-primary)]'
                        : 'hover:bg-[var(--color-page)]',
                    )}
                  >
                    {/* Logo da Loja */}
                    <div className="relative size-10 rounded-full overflow-hidden bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center shrink-0">
                      {conv.businessLogoUrl ? (
                        <Image
                          src={conv.businessLogoUrl}
                          alt={conv.businessName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        conv.businessName?.charAt(0).toUpperCase() || 'L'
                      )}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[var(--color-title)] truncate">
                          {conv.businessName}
                        </span>
                        <span className="text-[10px] text-[var(--color-muted)] shrink-0">
                          {formatConversationDate(conv.lastMessageAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <span className="text-xs text-[var(--color-muted)] truncate">
                          {conv.lastMessagePreview || 'Conversa iniciada'}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="size-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Lado Direito: Área de Chat com a Loja */}
        <section className="flex flex-col h-full bg-[var(--color-page)] overflow-hidden relative">
          {activeConversation ? (
            <>
              {/* Header com dados da Loja */}
              <header className="p-3.5 border-b border-[var(--color-border-default)] bg-[var(--color-surface)] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative size-9 rounded-full overflow-hidden bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center shrink-0">
                    {activeConversation.businessLogoUrl ? (
                      <Image
                        src={activeConversation.businessLogoUrl}
                        alt={activeConversation.businessName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      activeConversation.businessName?.charAt(0).toUpperCase() || 'L'
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--color-title)]">
                      {activeConversation.businessName}
                    </span>
                    <span className="text-[11px] text-[var(--color-success)] flex items-center gap-1 font-medium">
                      <i className="ri-shield-check-line" /> Estabelecimento Parceiro
                    </span>
                  </div>
                </div>

                {isOrderCompleted ? (
                  <span className="text-xs font-bold text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-1 rounded-full border border-[var(--color-success)]/20 flex items-center gap-1">
                    <i className="ri-checkbox-circle-fill" /> Atendimento Concluído
                  </span>
                ) : (
                  <span className="text-xs text-[var(--color-muted)] bg-[var(--color-page)] px-2.5 py-1 rounded-full border border-[var(--color-border-default)]">
                    Em Atendimento
                  </span>
                )}
              </header>

              {/* Card Banner da Ordem de Serviço Ativa no Chat */}
              {activeOrder && (
                <div className="mx-4 mt-3 p-3 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-surface)] to-emerald-500/10 border border-[var(--color-primary)]/30 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                      <i className="ri-file-list-3-line" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-title)] truncate">
                          Ordem de Serviço #{activeOrder.id}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                            isPendingPayment && 'bg-amber-500/10 text-amber-600 border border-amber-500/30',
                            isOrderCompleted && 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/30',
                          )}
                        >
                          {isPendingPayment ? 'Aguardando Pagamento' : 'Pedido Concluído'}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-body)] truncate mt-0.5">
                        {activeOrder.items?.[0]?.quantity}x {activeOrder.items?.[0]?.listingTitle} &bull; Total:{' '}
                        <strong className="text-[var(--color-primary)]">
                          {formatCurrency(activeOrder.totalValue, activeOrder.currencyCode)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPendingPayment && (
                      <Button
                        size="sm"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="font-bold text-xs shadow-xs"
                        leftIcon={<i className="ri-bank-card-line text-sm" />}
                      >
                        Pagar Ordem de Serviço
                      </Button>
                    )}

                    {isOrderCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsReviewModalOpen(true)}
                        className="font-bold text-xs text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                        leftIcon={<i className="ri-star-fill text-amber-500 text-sm" />}
                      >
                        Avaliar Atendimento
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Balões de Mensagem */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gradient-to-b from-transparent to-[var(--color-surface)]/30">
                {loadingMessages ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton variant="rect" width="50%" height={40} className="rounded-2xl self-start" />
                    <Skeleton variant="rect" width="60%" height={48} className="rounded-2xl self-end" />
                    <Skeleton variant="rect" width="40%" height={40} className="rounded-2xl self-start" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[var(--color-muted)] text-center">
                    <i className="ri-message-3-line text-3xl text-[var(--color-primary)]" />
                    <span className="text-xs font-semibold text-[var(--color-title)]">Nenhuma mensagem enviada</span>
                    <span className="text-xs">Escreva sua dúvida ou alinhamento sobre o serviço abaixo.</span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = Boolean(
                      (user?.id && msg.senderUserId === user.id) ||
                      (activeConversation?.customerUserId && msg.senderUserId === activeConversation.customerUserId)
                    )
                    const senderName = isMine ? 'Você' : (activeConversation?.businessName || 'Empresa')

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex flex-col max-w-[80%] sm:max-w-[70%]',
                          isMine ? 'self-end items-end' : 'self-start items-start',
                        )}
                      >
                        <span className={cn('text-[10px] font-bold mb-0.5 px-1', isMine ? 'text-[var(--color-primary)]' : 'text-[var(--color-title)]')}>
                          {senderName}
                        </span>

                        <div
                          className={cn(
                            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-2xs break-words',
                            isMine
                              ? 'bg-[var(--color-primary)] text-white rounded-br-none'
                              : 'bg-[var(--color-surface)] text-[var(--color-title)] border border-[var(--color-border-default)] rounded-bl-none',
                          )}
                        >
                          {msg.content}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-[var(--color-muted)]">
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {isMine && (
                            <i
                              className={cn(
                                'text-xs',
                                msg.readAt
                                  ? 'ri-check-double-line text-[var(--color-primary)] font-bold'
                                  : 'ri-check-line text-[var(--color-muted)]',
                              )}
                              title={msg.readAt ? 'Mensagem lida pela loja' : 'Mensagem enviada'}
                            />
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Caixa de Digitação */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-[var(--color-border-default)] bg-[var(--color-surface)] flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder={
                    isOrderCompleted
                      ? 'Atendimento finalizado. Você pode enviar novas mensagens se precisar...'
                      : 'Escreva sua mensagem para alinhar o serviço...'
                  }
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={sending}
                  className="flex-1 h-11 px-4 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
                <Button
                  type="submit"
                  disabled={sending || !messageInput.trim()}
                  isLoading={sending}
                  leftIcon={<i className="ri-send-plane-2-fill text-base" />}
                >
                  Enviar
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                icon={<i className="ri-chat-message-line text-4xl text-[var(--color-primary)]" />}
                title="Selecione uma conversa"
                description="Escolha uma loja na lista ao lado para enviar e visualizar mensagens."
              />
            </div>
          )}
        </section>
      </Card>

      {/* Modais acionados dentro do Chat */}
      {activeOrder && (
        <OrderPaymentModal
          isOpen={isPaymentModalOpen}
          order={activeOrder}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={() => {
            setIsPaymentModalOpen(false)
            if (activeOrder?.id) {
              void loadOrder(String(activeOrder.id))
            }
          }}
        />
      )}

      {activeOrder && (
        <CreateServiceReviewModal
          isOpen={isReviewModalOpen}
          orderId={activeOrder.id}
          sellerBusinessName={activeOrder.sellerBusinessName}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false)
            if (activeOrder?.id) {
              void loadOrder(String(activeOrder.id))
            }
          }}
        />
      )}
    </div>
  )
}
