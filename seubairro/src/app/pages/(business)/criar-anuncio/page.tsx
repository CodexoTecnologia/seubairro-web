'use client'

import React, { useState } from 'react'
import '@/styles/business/create-anuncio/create-anuncio.css'

export default function CriarAnuncioPage() {
    const [adType, setAdType] = useState<'product' | 'service'>('product')

    return (
        <div className="create-ad-container">
            <header className="page-header">
                <h1>Criar Novo Anúncio</h1>
            </header>

            <div className="type-selector">
                <button
                    className={`type-btn ${adType === 'product' ? 'active' : ''}`}
                    onClick={() => setAdType('product')}
                >
                    <i className="ri-shopping-bag-3-line"></i> Produto
                </button>
                <button
                    className={`type-btn ${adType === 'service' ? 'active' : ''}`}
                    onClick={() => setAdType('service')}
                >
                    <i className="ri-hammer-line"></i> Serviço
                </button>
            </div>

            <form>
                {adType === 'product' ? (
                    <>
                        <section className="form-section">
                            <div className="section-title">Informações do Produto</div>
                            <div className="form-grid">
                                {/* Titulo */}
                                <div className="form-group">
                                    <label>Título do Produto</label>
                                    <input type="text" className="form-input" placeholder="Ex: Cesta de Café da Manhã" />
                                </div>

                                <div className="two-col">
                                    {/* Categoria */}
                                    <div className="form-group">
                                        <label>Categoria</label>
                                        <select className="form-select">
                                            <option>Alimentação</option>
                                            <option>Eletrônicos</option>
                                            <option>Moda</option>
                                            <option>Outros</option>
                                        </select>
                                    </div>
                                    {/* Preço */}
                                    <div className="form-group">
                                        <label>Preço (R$)</label>
                                        <input type="text" className="form-input" placeholder="0,00" />
                                    </div>
                                </div>

                                <div className="two-col">
                                    {/* Estoque */}
                                    <div className="form-group">
                                        <label>Estoque Disponível</label>
                                        <input type="number" className="form-input" placeholder="0" />
                                    </div>
                                    {/* Unidade */}
                                    <div className="form-group">
                                        <label>Unidade</label>
                                        <select className="form-select">
                                            <option>Unidade (un)</option>
                                            <option>Quilo (kg)</option>
                                            <option>Litro (L)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="form-group">
                                    <label>Descrição Detalhada</label>
                                    <textarea className="form-textarea" placeholder="Descreva os detalhes do seu produto..."></textarea>
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <div className="section-title">Imagens</div>
                            {/* Imagens */}
                            <div className="upload-area">
                                <i className="ri-image-add-line upload-icon"></i>
                                <p className="upload-hint">Clique para adicionar fotos do seu produto</p>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="form-section">
                            <div className="section-title">Informações do Serviço</div>
                            <div className="form-grid">
                                {/* Titulo */}
                                <div className="form-group">
                                    <label>Título do Serviço</label>
                                    <input type="text" className="form-input" placeholder="Ex: Manutenção Elétrica" />
                                </div>

                                <div className="two-col">
                                    {/* Categoria */}
                                    <div className="form-group">
                                        <label>Categoria</label>
                                        <select className="form-select">
                                            <option>Reparos</option>
                                            <option>Beleza</option>
                                            <option>Transporte</option>
                                            <option>Outros</option>
                                        </select>
                                    </div>
                                    {/* Preço */}
                                    <div className="form-group">
                                        <label>Preço Base (R$)</label>
                                        <input type="text" className="form-input" placeholder="0,00" />
                                    </div>
                                </div>

                                <div className="two-col">
                                    {/* Tempo estimado */}
                                    <div className="form-group">
                                        <label>Tempo Estimado</label>
                                        <input type="text" className="form-input" placeholder="Ex: 2 horas" />
                                    </div>
                                    {/* Cobrança */}
                                    <div className="form-group">
                                        <label>Tipo de Cobrança</label>
                                        <select className="form-select">
                                            <option>Por Serviço</option>
                                            <option>Por Hora</option>
                                            <option>A Combinar</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="form-group">
                                    <label>Descrição do Serviço</label>
                                    <textarea className="form-textarea" placeholder="Descreva o que está incluso no serviço..."></textarea>
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <div className="section-title">Portfólio</div>
                            {/* Imagens */}
                            <div className="upload-area">
                                <i className="ri-image-add-line upload-icon"></i>
                                <p className="upload-hint">Adicione fotos de trabalhos anteriores</p>
                            </div>
                        </section>
                    </>
                )}

                {/* Botão de criar ou salvar rascunho */}
                <div className="action-bar">
                    <button type="button" className="btn btn-secondary">Salvar Rascunho</button>
                    <button type="submit" className="btn btn-primary">Publicar Anúncio</button>
                </div>
            </form>
        </div>
    )
}