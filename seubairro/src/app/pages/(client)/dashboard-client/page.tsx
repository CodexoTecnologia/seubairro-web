'use client'
import React from 'react'
import { FilterHeader, ListView, MapView } from './components'
import { useListingFilters } from './hooks/useListingFilters'
import { mockListings } from './data/mockListings'
import '@/styles/client/dashboard/dashboard.css'

export default function ClientDashboard() {
    const {
        currentType,
        currentCategory,
        viewMode,
        filteredData,
        setCurrentType,
        setCurrentCategory,
        setViewMode
    } = useListingFilters(mockListings)

    return (
        <>
            <FilterHeader
                currentType={currentType}
                currentCategory={currentCategory}
                viewMode={viewMode}
                onTypeChange={setCurrentType}
                onCategoryChange={setCurrentCategory}
                onViewModeChange={setViewMode}
            />

            <main className="main-content container">
                {viewMode === 'list' ? (
                    <ListView listings={filteredData} />
                ) : (
                    <MapView listings={filteredData} />
                )}
            </main>
        </>
    )
}
