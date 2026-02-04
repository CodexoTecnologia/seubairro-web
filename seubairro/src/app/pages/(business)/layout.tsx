'use client'
import React from 'react'
import '@/styles/business/layout.css'
import AppNavbar from '@/components/layout/navbar'
import { BusinessSidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ backgroundColor: 'var(--business-bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppNavbar />

            <div className="biz-layout">
                <BusinessSidebar />

                <main className="biz-content">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}
