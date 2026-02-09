export interface Category {
    id: string
    name: string
    icon: string
}

export const mockCategories: Category[] = [
    {
        id: 'all',
        name: 'Tudo',
        icon: 'ri-apps-2-line'
    },
    {
        id: 'alimentacao',
        name: 'Alimentação',
        icon: 'ri-restaurant-2-line'
    },
    {
        id: 'servicos',
        name: 'Serviços',
        icon: 'ri-hammer-line'
    },
    {
        id: 'varejo',
        name: 'Varejo',
        icon: 'ri-shopping-bag-3-line'
    },
    {
        id: 'beleza',
        name: 'Beleza',
        icon: 'ri-scissors-cut-line'
    },
    {
        id: 'saude',
        name: 'Saúde',
        icon: 'ri-heart-pulse-line'
    },
    {
        id: 'educacao',
        name: 'Educação',
        icon: 'ri-book-open-line'
    },
    {
        id: 'tecnologia',
        name: 'Tecnologia',
        icon: 'ri-computer-line'
    }
]
