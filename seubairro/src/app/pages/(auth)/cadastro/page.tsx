'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SplitText from '@/components/ui/SplitText'
import '@/styles/auth/cadastro/cadastro.css'
import { ClientForm } from './components/client.form'
import { BusinessForm } from './components/business.form'
import BackButton from '@/components/ui/BackButton'

export default function Cadastro() {

    type Mode = 'selection' | 'client' | 'business'
    const [mode, setMode] = useState<Mode>('selection')

    const handleSelectClient = () => {
        setMode('client')
    }

    const handleSelectBusiness = () => {
        setMode('business')
    }

    const handleBack = () => {
        setMode('selection')
    }

    const containerClass = `login-container ${mode === 'business' ? 'theme-business' : ''}`
    const getPageTitle = () => {
        if (mode === 'client') return 'Cadastro de Vizinho'
        if (mode === 'business') return 'Cadastro de Negócio'
        return 'Crie sua conta'
    }

    const getPageDesc = () => {
        if (mode === 'client') return 'Preencha seus dados para acessar.'
        if (mode === 'business') return 'Vamos criar sua vitrine digital.'
        return 'Escolha como você deseja usar a plataforma.'
    }

    const router = useRouter()
    const handleClientRegister = (e: React.FormEvent) => {
        e.preventDefault()
        router.push('/pages/(client)/dashboard-client')
    }

    const handleBusinessRegister = (e: React.FormEvent) => {
        e.preventDefault()
        router.push('/pages/(business)/dashboard-business')
    }

    return (
        <main className={containerClass}>
            <div className="login-form-side">
                <div className="form-wrapper">
                    <div className="auth-header">
                        <Link href="/" className="logo-link">
                            <img src="/assets/logo-seubairro.svg" alt="SeuBairro" className="logo-img" width={40} height={40} />
                            <SplitText
                                text="SeuBairro"
                                className="logo-text-animated"
                                delay={50}
                                duration={1.25}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-100px"
                                textAlign="left"
                            />
                        </Link>
                        {mode !== 'selection' && (
                            <div style={{ marginBottom: '20px' }}>
                                <BackButton onClick={handleBack} />
                            </div>
                        )}
                        <h1>{getPageTitle()}</h1>
                        <p>{getPageDesc()}</p>
                    </div>
                    {mode === 'selection' && (
                        <div className="profile-selection">
                            <div className="selection-card client" onClick={handleSelectClient}>
                                <div className="card-icon"><i className="ri-user-smile-line"></i></div>
                                <div className="card-text">
                                    <h3>Sou Vizinho / Cliente</h3>
                                    <p>Quero encontrar produtos e serviços perto de mim.</p>
                                </div>
                                <div className="card-arrow"><i className="ri-arrow-right-line"></i></div>
                            </div>
                            <div className="selection-card business" onClick={handleSelectBusiness}>
                                <div className="card-icon"><i className="ri-store-3-line"></i></div>
                                <div className="card-text">
                                    <h3>Sou Empreendedor</h3>
                                    <p>Quero divulgar meu negócio e vender na região.</p>
                                </div>
                                <div className="card-arrow"><i className="ri-arrow-right-line"></i></div>
                            </div>
                            <div className="auth-footer">
                                <p>Já tem uma conta? <Link href="/login">Fazer Login</Link></p>
                            </div>
                        </div>
                    )}
                    {mode === 'client' && (
                        <ClientForm onSubmit={handleClientRegister} />
                    )}
                    {mode === 'business' && (
                        <BusinessForm onSubmit={handleBusinessRegister} />
                    )}
                </div>
            </div>
            <div className="login-visual-side">
                <div className="animation-layer">
                    <div className="map-background"></div>
                    <div className="radar-center">
                        <div className="radar-wave w1"></div>
                        <div className="radar-wave w2"></div>
                        <div className="radar-wave w3"></div>
                        <div className="logo-core">
                            <img src="/assets/logo-seubairro.svg" alt="Logo" width={40} height={40} />
                        </div>
                    </div>
                    <div className="app-point p1">
                        <div className="point-icon"><i className="ri-store-2-fill"></i></div>
                        <div className="point-label">Mercado</div>
                    </div>
                    <div className="app-point p2">
                        <div className="point-icon color-2"><i className="ri-hammer-fill"></i></div>
                        <div className="point-label">Reformas</div>
                    </div>
                    <div className="app-point p3">
                        <div className="point-icon color-3"><i className="ri-restaurant-2-fill"></i></div>
                        <div className="point-label">Lanches</div>
                    </div>
                    <div className="app-point p4">
                        <div className="point-icon color-4"><i className="ri-scissors-cut-fill"></i></div>
                        <div className="point-label">Salão</div>
                    </div>
                </div>
                <div className="rich-gradient-bg"></div>
            </div>
        </main>
    )
}

