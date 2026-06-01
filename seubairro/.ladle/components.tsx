import type { GlobalProvider } from '@ladle/react'
import '../src/app/global.css'
import 'remixicon/fonts/remixicon.css'

/**
 * Provider global do Ladle.
 * - Carrega o `global.css` do app (Tailwind + tokens + @theme).
 * - Default `data-context="client"` (azul). Para ver business em uma story,
 *   envolva o conteúdo com <div data-context="business"> dentro da story.
 */
export const Provider: GlobalProvider = ({ children }) => (
  <div data-context="client" className="min-h-screen bg-[var(--color-page)] text-[var(--color-body)] p-6">
    {children}
  </div>
)
