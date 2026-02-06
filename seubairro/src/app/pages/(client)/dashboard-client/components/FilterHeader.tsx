//Cabeçalho dos Filtros - pendente de consumir a API
//Por tipo (Todos, Produtos, Serviços)
//Por categoria (Alimentação, Serviços, Varejo, Beleza) - alterar depois com o que vem do banco de dados
//Tipo de visualização (Lista ou Mapa)

'use client'
import React from 'react'
import { Button } from '@/components/ui'

interface FilterHeaderProps {
    currentType: string
    currentCategory: string
    viewMode: 'list' | 'map'
    onTypeChange: (type: string) => void
    onCategoryChange: (category: string) => void
    onViewModeChange: (mode: 'list' | 'map') => void
}

export default function FilterHeader({
    currentType,
    currentCategory,
    viewMode,
    onTypeChange,
    onCategoryChange,
    onViewModeChange
}: FilterHeaderProps) {
    return (
        <header className="filters-header">
            <div className="container filters-container">
                <div className="type-selector-wrapper">
                    <div className="type-selector">
                        <Button
                            variant="ghost"
                            className={`type-btn ${currentType === 'all' ? 'active' : ''}`}
                            onClick={() => onTypeChange('all')}
                        >
                            Todos
                        </Button>
                        <Button
                            variant="ghost"
                            className={`type-btn ${currentType === 'product' ? 'active' : ''}`}
                            onClick={() => onTypeChange('product')}
                        >
                            Produtos
                        </Button>
                        <Button
                            variant="ghost"
                            className={`type-btn ${currentType === 'service' ? 'active' : ''}`}
                            onClick={() => onTypeChange('service')}
                        >
                            Serviços
                        </Button>
                    </div>
                </div>

                <div className="category-scroll">
                    <Button
                        variant="ghost"
                        className={`cat-pill ${currentCategory === 'all' ? 'active' : ''}`}
                        onClick={() => onCategoryChange('all')}
                    >
                        <i className="ri-apps-2-line"></i> Tudo
                    </Button>
                    <Button
                        variant="ghost"
                        className={`cat-pill ${currentCategory === 'alimentacao' ? 'active' : ''}`}
                        onClick={() => onCategoryChange('alimentacao')}
                    >
                        <i className="ri-restaurant-2-line"></i> Alimentação
                    </Button>
                    <Button
                        variant="ghost"
                        className={`cat-pill ${currentCategory === 'servicos' ? 'active' : ''}`}
                        onClick={() => onCategoryChange('servicos')}
                    >
                        <i className="ri-hammer-line"></i> Serviços
                    </Button>
                    <Button
                        variant="ghost"
                        className={`cat-pill ${currentCategory === 'varejo' ? 'active' : ''}`}
                        onClick={() => onCategoryChange('varejo')}
                    >
                        <i className="ri-shopping-bag-3-line"></i> Varejo
                    </Button>
                    <Button
                        variant="ghost"
                        className={`cat-pill ${currentCategory === 'beleza' ? 'active' : ''}`}
                        onClick={() => onCategoryChange('beleza')}
                    >
                        <i className="ri-scissors-cut-line"></i> Beleza
                    </Button>
                </div>

                <div className="view-toggle">
                    <Button
                        variant="ghost"
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('list')}
                    >
                        <i className="ri-list-check"></i>
                    </Button>
                    <Button
                        variant="ghost"
                        className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('map')}
                    >
                        <i className="ri-map-2-line"></i>
                    </Button>
                </div>
            </div>
        </header>
    )
}
