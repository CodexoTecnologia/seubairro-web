import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

type FooterContext = 'client' | 'business'

type Props = {
  /** Workspace do shell — define as colunas de navegação. */
  context?: FooterContext
  className?: string
}

type FooterLink = { href: string; label: string }
type FooterColumn = { title: string; links: FooterLink[] }

/** Institucional — âncoras reais da landing page. */
const INSTITUTIONAL: FooterColumn = {
  title: 'SeuBairro',
  links: [
    { href: '/#proposito', label: 'Nosso propósito' },
    { href: '/#como-funciona', label: 'Como funciona' },
    { href: '/#faq', label: 'Dúvidas frequentes' },
    { href: '/#contato', label: 'Contato' },
  ],
}

const COLUMNS: Record<FooterContext, FooterColumn[]> = {
  client: [
    {
      title: 'Navegue',
      links: [
        { href: '/dashboard-client', label: 'Início' },
        { href: '/mensagens', label: 'Mensagens' },
        { href: '/perfil', label: 'Meu perfil' },
      ],
    },
    INSTITUTIONAL,
    {
      title: 'Para negócios',
      links: [
        { href: '/cadastro?perfil=business', label: 'Anuncie seu negócio' },
        { href: '/#para-quem', label: 'Para quem é' },
        { href: '/#roadmap', label: 'Nossa trajetória' },
      ],
    },
  ],
  business: [
    {
      title: 'Gerencie',
      links: [
        { href: '/dashboard-business', label: 'Visão geral' },
        { href: '/listar-anuncio', label: 'Meus anúncios' },
        { href: '/pedidos', label: 'Pedidos' },
        { href: '/minha-empresa', label: 'Minha empresa' },
      ],
    },
    INSTITUTIONAL,
    {
      title: 'Atalhos',
      links: [
        { href: '/criar-anuncio', label: 'Criar anúncio' },
        { href: '/chat', label: 'Mensagens' },
      ],
    },
  ],
}

/** Rodapé compacto dos shells autenticados: marca, navegação e créditos. */
export default function AppFooter({ context = 'client', className }: Props) {
  return (
    <footer
      className={cn(
        'mt-auto border-t border-[var(--color-border-default)] bg-[var(--color-surface)]',
        className,
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-4 md:py-5 grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 md:gap-6">
        {/* Marca */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Image src="/assets/logo-seubairro.svg" alt="" width={24} height={24} aria-hidden />
            <span className="text-base font-bold text-[var(--color-title)]">
              Seu<span className="text-[var(--color-primary)]">Bairro</span>
            </span>
          </div>
          <p className="text-xs text-[var(--color-muted)] max-w-60 leading-tight">
            O comércio do seu bairro na palma da sua mão. Perto de você, do seu jeito.
          </p>
        </div>

        {COLUMNS[context].map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-title)]">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-1 text-xs">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[var(--color-border-default)]">
        <div className="max-w-[1200px] mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-[var(--color-muted)]">
          <p>&copy; 2026 SeuBairro. Todos os direitos reservados.</p>
          <a
            href="https://codexo.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-body)] transition-colors"
          >
            Desenvolvido por <strong className="font-semibold">Codexo</strong>
          </a>
        </div>
      </div>
    </footer>
  )
}
