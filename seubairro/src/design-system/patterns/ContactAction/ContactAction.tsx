import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const contactActionVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-semibold text-sm whitespace-nowrap',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  ],
  {
    variants: {
      channel: {
        whatsapp: 'bg-[#25D366] text-white hover:opacity-90 focus-visible:ring-[#25D366]',
        phone: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
        email: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] focus-visible:ring-[var(--color-accent)]',
        share: 'bg-transparent border border-[var(--color-border-default)] text-[var(--color-body)] hover:bg-[var(--color-input)] focus-visible:ring-[var(--color-primary)]',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-11 px-4',
        lg: 'h-12 px-6',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { size: 'md' },
  },
)

type Channel = NonNullable<VariantProps<typeof contactActionVariants>['channel']>

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<VariantProps<typeof contactActionVariants>, 'channel'> & {
    channel: Channel
    /** Telefone E.164 (whatsapp/phone), email (email), URL (share). */
    target: string
    label?: string
    message?: string
  }

const buildHref = (channel: Channel, target: string, message?: string) => {
  const cleanPhone = target.replace(/\D/g, '')
  switch (channel) {
    case 'whatsapp': {
      const text = message ? `?text=${encodeURIComponent(message)}` : ''
      return `https://wa.me/${cleanPhone}${text}`
    }
    case 'phone':
      return `tel:+${cleanPhone}`
    case 'email':
      return `mailto:${target}${message ? `?body=${encodeURIComponent(message)}` : ''}`
    case 'share':
      return target
  }
}

const iconFor: Record<Channel, string> = {
  whatsapp: 'ri-whatsapp-line',
  phone: 'ri-phone-line',
  email: 'ri-mail-line',
  share: 'ri-share-line',
}

const defaultLabel: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  phone: 'Ligar',
  email: 'Email',
  share: 'Compartilhar',
}

export const ContactAction = forwardRef<HTMLAnchorElement, Props>(
  ({ channel, target, label, message, size, fullWidth, className, ...rest }, ref) => {
    const href = buildHref(channel, target, message)
    const external = channel === 'whatsapp' || channel === 'share'
    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(contactActionVariants({ channel, size, fullWidth }), className)}
        {...rest}
      >
        <i className={iconFor[channel]} aria-hidden />
        <span>{label ?? defaultLabel[channel]}</span>
      </a>
    )
  },
)

ContactAction.displayName = 'ContactAction'
