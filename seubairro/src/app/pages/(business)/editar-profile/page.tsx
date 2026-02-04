'use client'

import React from 'react'
import '@/styles/business/update-profile/update-profile.css'

export default function EditarProfilePage() {
    return (
        <div className="edit-profile-container">
            <header className="edit-header">
                <h1>Editar Perfil</h1>
                <p>Gerencie as informações que seus clientes veem.</p>
            </header>

            <form>
                {/* Identidade */}
                <section className="form-section">
                    <div className="section-title">
                        <i className="ri-store-2-line"></i> Identidade do Negócio
                    </div>

                    <div className="form-grid">
                        {/* Nome do negócio */}
                        <div className="form-group">
                            <label>Nome do Negócio</label>
                            <input type="text" className="form-input" placeholder="Ex: Mercadinho da Vila" defaultValue="Mercadinho da Vila" />
                        </div>

                        <div className="form-grid two-col">
                            {/* Categoria principal */}
                            <div className="form-group">
                                <label>Categoria Principal</label>
                                <select className="form-select">
                                    <option>Alimentação e Bebidas</option>
                                    <option>Serviços</option>
                                    <option>Varejo</option>
                                    <option>Beleza e Estética</option>
                                </select>
                            </div>

                            {/* WhatsApp para contato */}
                            <div className="form-group">
                                <label>WhatsApp (Link direto)</label>
                                <input type="tel" className="form-input" placeholder="(00) 00000-0000" defaultValue="(41) 99999-9999" />
                            </div>
                        </div>

                        {/* Sobre o negocio */}
                        <div className="form-group">
                            <label>Sobre o Negócio</label>
                            <textarea className="form-textarea" placeholder="Descreva seu negócio, diferenciais e história..." defaultValue="O melhor mercadinho da região! Temos produtos frescos, padaria própria e um atendimento que você só encontra aqui." link-reset></textarea>
                        </div>
                    </div>
                </section>

                {/* Aparencia do perfil */}
                <section className="form-section">
                    <div className="section-title">
                        <i className="ri-image-line"></i> Aparência
                    </div>

                    <div className="images-row">
                        {/* Logo */}
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Logo / Foto de Perfil</label>
                            <div className="image-upload-box upload-logo">
                                <i className="ri-camera-line upload-icon"></i>
                                <span className="upload-text">Alterar</span>
                            </div>
                        </div>

                        {/* Capa */}
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Imagem de Capa</label>
                            <div className="image-upload-box upload-cover">
                                <i className="ri-image-add-line upload-icon"></i>
                                <span className="upload-text">Alterar Capa</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Localização */}
                <section className="form-section">
                    <div className="section-title">
                        <i className="ri-map-pin-line"></i> Localização
                    </div>

                    <div className="form-grid two-col">
                        {/* CEP */}
                        <div className="form-group">
                            <label>CEP</label>
                            <input type="text" className="form-input" placeholder="00000-000" />
                        </div>
                        {/* Cidade */}
                        <div className="form-group">
                            <label>Cidade</label>
                            <input type="text" className="form-input" placeholder="Cidade" defaultValue="Colombo" />
                        </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: '16px' }}>
                        {/* Rua */}
                        <div className="form-group">
                            <label>Endereço</label>
                            <input type="text" className="form-input" placeholder="Rua, Avenida..." defaultValue="Rua das Flores" />
                        </div>

                        <div className="form-grid two-col">
                            {/* Número */}
                            <div className="form-group">
                                <label>Número</label>
                                <input type="text" className="form-input" placeholder="123" defaultValue="123" />
                            </div>
                            {/* Bairro */}
                            <div className="form-group">
                                <label>Bairro</label>
                                <input type="text" className="form-input" placeholder="Bairro" defaultValue="Centro" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Horario de funcionamento */}
                <section className="form-section">
                    <div className="section-title">
                        <i className="ri-time-line"></i> Horário de Funcionamento
                    </div>

                    {/* Botão para informar se a loja esta aberta ou fechada (Isso geralmente é automático ou toggle manual override) */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <div className="toggle-wrapper">
                            <span className="toggle-label">Loja Aberta Agora? (Manual)</span>
                            <label className="toggle-switch">
                                <input type="checkbox" className="toggle-input" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ marginBottom: '8px', display: 'block' }}>Horários Padrão</label>
                        {/* Dia da semana, Início, Fim - Simplificado para demo */}
                        <div className="form-grid two-col">
                            <div className="form-group">
                                <label>Dias da Semana</label>
                                <select className="form-select">
                                    <option>Segunda a Sexta</option>
                                    <option>Segunda a Sábado</option>
                                    <option>Todos os dias</option>
                                </select>
                            </div>
                            <div className="hours-grid">
                                <div className="form-group">
                                    <label>Abre às</label>
                                    <input type="time" className="form-input" defaultValue="08:00" />
                                </div>
                                <div className="form-group">
                                    <label>Fecha às</label>
                                    <input type="time" className="form-input" defaultValue="19:00" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="action-bar">
                    <button type="button" className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                </div>
            </form>
        </div>
    )
}