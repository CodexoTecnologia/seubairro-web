'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChatService } from '@/lib/api/services/ChatService'
import type { ConversationResponse, MessageResponse } from '@/lib/api/dtos/Response/index'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { EmptyState } from '@/design-system/patterns/EmptyState'
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

export default function ChatPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])

  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false)
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
        setActiveConversation((prev) => prev || items[0])
      }
    } catch {
      setError('Não foi possível carregar suas conversas no momento.')
    } finally {
      setLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setError('Usuário não autenticado.')
      setLoadingConversations(false)
      return
    }
    void loadConversations()
  }, [authLoading, isAuthenticated, loadConversations])

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true)
    try {
      const page = await ChatService.getMessages(conversationId, { pageSize: 50 })
      const items = Array.isArray(page?.items) ? page.items : []
      // API devolve em ordem decrescente, invertemos para ordem cronológica de chat
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

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUnread = filterUnreadOnly ? c.unreadCount > 0 : true
    return matchesSearch && matchesUnread
  })

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <PageHeader
        title="Mensagens"
        description="Responda dúvidas e converse diretamente com seus clientes em tempo real."
      />

      <Card padding="none" className="grid grid-cols-1 md:grid-cols-[340px_1fr] h-[680px] rounded-2xl overflow-hidden border-[var(--color-border-default)] shadow-xs">
        {/* Painel Esquerdo: Lista de Conversas */}
        <aside className="flex flex-col border-r border-[var(--color-border-default)] bg-[var(--color-surface)] h-full overflow-hidden">
          {/* Busca & Filtros */}
          <div className="p-3.5 flex flex-col gap-3 border-b border-[var(--color-border-default)] bg-[var(--color-page)]">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-2.5 text-[var(--color-muted)] text-sm" />
              <input
                type="text"
                placeholder="Buscar cliente ou conversa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilterUnreadOnly(false)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                  !filterUnreadOnly
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-input)]',
                )}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFilterUnreadOnly(true)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1',
                  filterUnreadOnly
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-input)]',
                )}
              >
                Não Lidas
                {conversations.some((c) => c.unreadCount > 0) && (
                  <span className="size-2 rounded-full bg-[var(--color-danger)]" />
                )}
              </button>
            </div>
          </div>

          {/* Lista de Conversas com Scroll */}
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
                <span className="text-xs font-semibold text-[var(--color-title)]">Nenhuma conversa encontrada</span>
                <span className="text-[11px]">As dúvidas dos clientes aparecerão aqui.</span>
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
                    {/* Avatar do Cliente */}
                    <div className="relative size-10 rounded-full overflow-hidden bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center shrink-0">
                      {conv.customerAvatarUrl ? (
                        <Image
                          src={conv.customerAvatarUrl}
                          alt={conv.customerName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        conv.customerName?.charAt(0).toUpperCase() || 'C'
                      )}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[var(--color-title)] truncate">
                          {conv.customerName}
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

        {/* Painel Direito: Histórico de Mensagens e Input */}
        <section className="flex flex-col h-full bg-[var(--color-page)] overflow-hidden">
          {activeConversation ? (
            <>
              {/* Cabeçalho da Conversa Ativa */}
              <header className="p-3.5 border-b border-[var(--color-border-default)] bg-[var(--color-surface)] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative size-9 rounded-full overflow-hidden bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center shrink-0">
                    {activeConversation.customerAvatarUrl ? (
                      <Image
                        src={activeConversation.customerAvatarUrl}
                        alt={activeConversation.customerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      activeConversation.customerName?.charAt(0).toUpperCase() || 'C'
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--color-title)]">
                      {activeConversation.customerName}
                    </span>
                    <span className="text-[11px] text-[var(--color-success)] flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-[var(--color-success)]" /> Cliente SeuBairro
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <i className="ri-shield-check-line text-[var(--color-primary)]" />
                  <span className="hidden sm:inline">Conversa Protegida</span>
                </div>
              </header>

              {/* Área de Histórico de Mensagens */}
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
                    <span className="text-xs font-semibold text-[var(--color-title)]">Nenhuma mensagem ainda</span>
                    <span className="text-xs">Escreva a primeira resposta para o cliente abaixo.</span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCustomerMessage = activeConversation?.customerUserId && msg.senderUserId === activeConversation.customerUserId
                    const isMine = !isCustomerMessage
                    const senderName = isMine ? 'Você (Empresa)' : (activeConversation?.customerName || 'Cliente')

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
                              title={msg.readAt ? 'Mensagem lida pelo cliente' : 'Mensagem enviada'}
                            />
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Caixa de Digitação de Mensagem */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-[var(--color-border-default)] bg-[var(--color-surface)] flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Escreva uma resposta para o cliente..."
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
                description="Escolha um cliente na lista ao lado para visualizar o histórico e responder às dúvidas."
              />
            </div>
          )}
        </section>
      </Card>
    </div>
  )
}
