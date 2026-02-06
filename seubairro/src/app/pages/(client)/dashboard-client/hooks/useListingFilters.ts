import { useState, useMemo } from 'react'
import { ListingData } from '../components'

export function useListingFilters(listings: ListingData[]) {
    const [currentType, setCurrentType] = useState('all')
    const [currentCategory, setCurrentCategory] = useState('all')
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

    const filteredData = useMemo(() => {
        return listings
            .filter(item => {
                const matchType = currentType === 'all' || item.type === currentType
                const matchCat = currentCategory === 'all' || item.category === currentCategory
                return matchType && matchCat
            })
            .sort((a, b) => a.distance - b.distance)
    }, [listings, currentType, currentCategory])

    return {
        currentType,
        currentCategory,
        viewMode,
        filteredData,
        setCurrentType,
        setCurrentCategory,
        setViewMode
    }
}
