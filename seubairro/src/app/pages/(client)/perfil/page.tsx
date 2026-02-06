'use client'
import React, { useState } from 'react'
import '@/styles/client/perfil/perfil.css'
export default function ClientProfile() {
    const [activeTab, setActiveTab] = useState('personal')
    return (
        <>
            <div className="full-screen-layout">
                <aside className="sidebar-panel">
                    <div className="user-header">
                        <div className="avatar-large">G</div>
                        <h3>Gabriel Silva</h3>
                        <span className="user-email">gabriel@email.com</span>
                    </div>
                    <nav className="sidebar-menu">
                        <button
                            className={`menu-item ${activeTab === 'personal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            <div className="icon-wrap"><i className="ri-user-settings-line"></i></div>
                            <span>Dados Pessoais</span>
                            <i className="ri-arrow-right-s-line arrow"></i>
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'location' ? 'active' : ''}`}
                            onClick={() => setActiveTab('location')}
                        >
                            <div className="icon-wrap"><i className="ri-map-pin-line"></i></div>
                            <span>Meu Endereço</span>
                            <i className="ri-arrow-right-s-line arrow"></i>
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <div className="icon-wrap"><i className="ri-shield-key-line"></i></div>
                            <span>Segurança</span>
                            <i className="ri-arrow-right-s-line arrow"></i>
                        </button>
                        <div className="menu-divider"></div>
                        <a href="/login" className="menu-item danger">
                            <div className="icon-wrap"><i className="ri-logout-box-r-line"></i></div>
                            <span>Sair da conta</span>
                        </a>
                    </nav>
                </aside>
                <main className="content-panel">
                    {activeTab === 'personal' && (
                        <div id="tab-personal" className="tab-content active">
                            <div className="content-header">
                                <h1>Dados Pessoais</h1>
                                <p>Mantenha seus dados atualizados para uma melhor experiência.</p>
                            </div>
                            <form className="app-form">
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Nome Completo</label>
                                        <input type="text" defaultValue="Gabriel Silva" className="input-field" />
                                    </div>
                                    <div className="input-group">
                                        <label>Telefone / WhatsApp</label>
                                        <input type="tel" defaultValue="(41) 99999-9999" className="input-field" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Bio (Opcional)</label>
                                    <textarea className="input-field" rows={4} placeholder="Fale um pouco sobre você..."></textarea>
                                </div>
                                <div className="form-footer">
                                    <button type="button" className="btn-save">Salvar Alterações</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'location' && (
                        <div id="tab-location" className="tab-content active">
                            <div className="content-header">
                                <h1>Meu Endereço</h1>
                                <p>Defina onde você está para encontrar o melhor do bairro.</p>
                            </div>
                            <div className="current-address-card">
                                <div className="addr-icon"><i className="ri-home-4-fill"></i></div>
                                <div className="addr-info">
                                    <strong>Principal</strong>
                                    <span>Rua das Flores, 123 - Centro, Colombo - PR</span>
                                </div>
                                <button className="btn-icon"><i className="ri-pencil-line"></i></button>
                            </div>
                            <form className="app-form mt-30">
                                <div className="form-row">
                                    <div className="input-group sm">
                                        <label>CEP</label>
                                        <input type="text" className="input-field" placeholder="00000-000" />
                                    </div>
                                    <div className="input-group">
                                        <label>Cidade</label>
                                        <input type="text" className="input-field disabled" defaultValue="Colombo" readOnly />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-group lg">
                                        <label>Rua</label>
                                        <input type="text" className="input-field" />
                                    </div>
                                    <div className="input-group sm">
                                        <label>Número</label>
                                        <input type="text" className="input-field" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Bairro</label>
                                    <input type="text" className="input-field" />
                                </div>
                                <div className="form-footer">
                                    <button type="button" className="btn-save">Atualizar Endereço</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div id="tab-security" className="tab-content active">
                            <div className="content-header">
                                <h1>Segurança</h1>
                                <p>Proteja sua conta e altere sua senha.</p>
                            </div>
                            <form className="app-form">
                                <div className="input-group">
                                    <label>E-mail de Acesso</label>
                                    <input type="email" defaultValue="gabriel@email.com" className="input-field disabled" readOnly />
                                </div>
                                <div className="divider"></div>
                                <h3 className="sub-title">Alterar Senha</h3>
                                <div className="form-footer">
                                    <button type="button" className="btn-save secondary">Atualizar Senha</button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}

