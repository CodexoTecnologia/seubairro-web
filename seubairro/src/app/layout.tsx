import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/business-variables.css'
import '@/styles/client-variables.css'
import './global.css'
import ClickSpark from '@/components/ui/click-spark'
import GlobalLoader from '@/components/ui/global-loader'
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

            <body className={inter.className}>
                <ClickSpark
                    sparkColor="#2563EB"
                    sparkSize={10}
                    sparkRadius={15}
                    sparkCount={8}
                    duration={400}
                >
                    <GlobalLoader>
                        {children}
                    </GlobalLoader>
                </ClickSpark>
            </body>
        </html>
    )
}

