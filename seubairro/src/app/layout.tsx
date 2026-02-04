import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/business-variables.css'
import '@/styles/client-variables.css'
import './global.css'
const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
})
export const metadata: Metadata = {
    title: 'SeuBairro - Conecte-se ao comércio local',
    description: 'O comércio do seu bairro na palma da sua mão. Encontre lojas, serviços e produtos próximos a você.',
    keywords: ['comércio local', 'bairro', 'lojas próximas', 'delivery local'],
    authors: [{ name: 'SeuBairro' }],
    openGraph: {
        title: 'SeuBairro - Conecte-se ao comércio local',
        description: 'O comércio do seu bairro na palma da sua mão.',
        type: 'website',
        locale: 'pt_BR',
    },
}
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <head>
                <link
                    href="https:
                    rel="stylesheet"
                />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    )
}

