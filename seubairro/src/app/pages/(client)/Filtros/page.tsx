'use client'
import React, { useState } from 'react'
import '@/styles/client/filtro/filtro.css'
import { useRouter } from 'next/navigation'
export default function FiltrosPage() {
    const router = useRouter()
    const [type, setType] = useState('all')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [viewMode, setViewMode] = useState('list')
    const allCategories = [
        "Alimentação", "Serviços", "Varejo", "Beleza", "Educação", "Saúde"
    ]
    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat))
        } else {
            setSelectedCategories([...selectedCategories, cat])
        }
    }
    const handleApply = () => {
        console.log({ type, selectedCategories, viewMode })
        router.back()
    }
    return (
        <div className="filtros-container">
            <header className="filters-header">
                <h1>Filtros</h1>
            </header>
            <section className="filter-section">
                <span className="fs-title">Tipo de Anúncio</span>
                <div className="chips-grid">
                    <button
                        className={`filter-chip ${type === 'all' ? 'active' : ''}`}
                        onClick={() => setType('all')}
                    >Todos</button>
                    <button
                        className={`filter-chip ${type === 'products' ? 'active' : ''}`}
                        onClick={() => setType('products')}
                    >Produtos</button>
                    <button
                        className={`filter-chip ${type === 'services' ? 'active' : ''}`}
                        onClick={() => setType('services')}
                    >Serviços</button>
                </div>
            </section>
            <section className="filter-section">
                <span className="fs-title">Categorias</span>
                <div className="checkbox-list">
                    {allCategories.map(cat => (
                        <label key={cat} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>
            </section>
            <section className="filter-section">
                <span className="fs-title">Visualização</span>
                <div className="view-options">
                    <button
                        className={`view-option-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <i className="ri-list-check"></i>
                        <span>Lista</span>
                    </button>
                    <button
                        className={`view-option-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <i className="ri-grid-fill"></i>
                        <span>Grade</span>
                    </button>
                    <button
                        className={`view-option-btn ${viewMode === 'map' ? 'active' : ''}`}
                        onClick={() => setViewMode('map')}
                    >
                        <i className="ri-map-2-line"></i>
                        <span>Mapa</span>
                    </button>
                </div>
            </section>
            <div className="bottom-actions">
                <button className="btn-clear" onClick={() => {
                    setType('all')
                    setSelectedCategories([])
                    setViewMode('list')
                }}>Limpar</button>
                <button className="btn-apply" onClick={handleApply}>Aplicar Filtros</button>
            </div>
        </div>
    )
}

