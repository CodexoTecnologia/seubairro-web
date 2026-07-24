import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './global.css'
import ClickSpark from '@/design-system/effects/click-spark'
import { AuthProvider } from '@/features/auth/context/AuthContext'

/**
 * Família única para títulos e corpo: o peso (não a família) constrói a
 * hierarquia. `--font-sans` do tema aponta para esta variável em global.css.
 */
const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-jakarta',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: 'SeuBairro - Conecte-se ao comércio local',
    description: 'O comércio do seu bairro na palma da sua mão. Encontre lojas, serviços e produtos próximos a você.',
    keywords: ['comércio local', 'bairro', 'lojas próximas', 'delivery local'],
    authors: [{ name: 'SeuBairro' }],
    icons: {
        icon: [
            { url: '/assets/logo-seubairro.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/assets/logo-seubairro.svg',
        apple: '/assets/logo-seubairro.svg',
    },
    alternates: { canonical: '/' },
    openGraph: {
        title: 'SeuBairro - Conecte-se ao comércio local',
        description: 'O comércio do seu bairro na palma da sua mão.',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'SeuBairro',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SeuBairro - Conecte-se ao comércio local',
        description: 'O comércio do seu bairro na palma da sua mão.',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className={jakarta.variable}>
            <body className={jakarta.className}>
                <AuthProvider>
                    <ClickSpark
                        sparkColor="#2563EB"
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                    >
                        {children}
                    </ClickSpark>
                </AuthProvider>
            </body>
        </html>
    )
}
