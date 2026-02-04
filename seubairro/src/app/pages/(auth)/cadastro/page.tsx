'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/styles/auth/cadastro/cadastro.css'

export default function CadastroPage() {
    type Mode = 'selection' | 'client' | 'business'
    const [mode, setMode] = useState<Mode>('selection')
    const [businessStep, setBusinessStep] = useState(1)

    const handleSelectClient = () => {
        setMode('client')
    }

    const handleSelectBusiness = () => {
        setMode('business')
        setBusinessStep(1)
    }

    const handleBack = () => {
        setMode('selection')
        setBusinessStep(1)
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
        // Simulate registration
        router.push('/pages/dashboad')
    }

    const handleBusinessRegister = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate registration
        router.push('/pages/dashboard')
    }

    return (
        <main className={containerClass}>

            <div className="login-form-side">
                <div className="form-wrapper">

                    <div className="auth-header">
                        <Link href="/" className="logo-link">
                            <img src="/assets/logo-seubairro.svg" alt="SeuBairro" className="logo-img" width={32} height={32} />
                            <span className="logo-text">Seu<span>Bairro</span></span>
                        </Link>

                        {mode !== 'selection' && (
                            <button className="btn-back" onClick={handleBack} type="button">
                                <i className="ri-arrow-left-line"></i> Voltar
                            </button>
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
                        <form className="hidden-form" onSubmit={handleClientRegister}>
                            <div className="input-group">
                                <label>Nome Completo</label>
                                <div className="input-field">
                                    <i className="ri-user-line icon-left"></i>
                                    <input type="text" placeholder="Seu nome" required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>E-mail</label>
                                <div className="input-field">
                                    <i className="ri-mail-line icon-left"></i>
                                    <input type="email" placeholder="seu@email.com" required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Senha</label>
                                <div className="input-field">
                                    <i className="ri-lock-2-line icon-left"></i>
                                    <input type="password" placeholder="Crie uma senha forte" required />
                                </div>
                            </div>
                            <button type="submit" className="btn-submit">Criar Conta Grátis</button>
                        </form>
                    )}

                    {mode === 'business' && (
                        <form className="hidden-form" onSubmit={handleBusinessRegister}>

                            <div className="stepper">
                                <div className={`step ${businessStep === 1 ? 'active' : ''}`}>1. Dados Pessoais</div>
                                <div className="step-line"></div>
                                <div className={`step ${businessStep === 2 ? 'active' : ''}`}>2. Seu Negócio</div>
                            </div>

                            {businessStep === 1 && (
                                <div id="busStep1">
                                    <div className="input-group">
                                        <label>Nome do Responsável</label>
                                        <div className="input-field">
                                            <i className="ri-user-star-line icon-left"></i>
                                            <input type="text" placeholder="Seu nome" required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>E-mail de Acesso</label>
                                        <div className="input-field">
                                            <i className="ri-mail-send-line icon-left"></i>
                                            <input type="email" placeholder="email@negocio.com" required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Senha</label>
                                        <div className="input-field">
                                            <i className="ri-lock-password-line icon-left"></i>
                                            <input type="password" placeholder="Senha segura" required />
                                        </div>
                                    </div>
                                    <button type="button" className="btn-submit btn-business" onClick={() => setBusinessStep(2)}>
                                        Continuar <i className="ri-arrow-right-line"></i>
                                    </button>
                                </div>
                            )}

                            {businessStep === 2 && (
                                <div id="busStep2" className="hidden-form">
                                    <div className="input-group">
                                        <label>Nome do Negócio</label>
                                        <div className="input-field">
                                            <i className="ri-store-2-line icon-left"></i>
                                            <input type="text" placeholder="Ex: Mercado do João" required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Categoria</label>
                                        <div className="input-field">
                                            <i className="ri-layout-grid-line icon-left"></i>
                                            <select required className="custom-select" defaultValue="">
                                                <option value="" disabled>Selecione uma categoria</option>
                                                <option value="alimentacao">Alimentação</option>
                                                <option value="servicos">Serviços</option>
                                                <option value="varejo">Varejo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>WhatsApp</label>
                                        <div className="input-field">
                                            <i className="ri-whatsapp-line icon-left"></i>
                                            <input type="tel" placeholder="(41) 99999-9999" required />
                                        </div>
                                    </div>

                                    <div className="buttons-row">
                                        <button type="button" className="btn-outline" onClick={() => setBusinessStep(1)}>Voltar</button>
                                        <button type="submit" className="btn-submit btn-business">Finalizar</button>
                                    </div>
                                </div>
                            )}

                        </form>
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
