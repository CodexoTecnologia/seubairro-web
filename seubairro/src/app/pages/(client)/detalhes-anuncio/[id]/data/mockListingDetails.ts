import { ListingDetails } from '../hooks';

export const mockListingDetails: ListingDetails[] = [
  {
    id: '1',
    title: 'Cesta Básica Completa - Entrega Grátis',
    price: 120.00,
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1000&q=80',
    ],
    description: [
      'Cesta básica completa com produtos de primeira qualidade selecionados para sua família. Contém arroz 5kg, feijão 1kg, açúcar, café, óleo, macarrão e produtos de limpeza básicos.',
      'Entregamos em todo o bairro Centro e arredores sem taxa adicional. Ideal para quem busca economia e qualidade no dia a dia.',
    ],
    features: [
      { icon: 'ri-check-line', label: 'Produtos frescos' },
      { icon: 'ri-truck-line', label: 'Entrega rápida' },
      { icon: 'ri-bank-card-line', label: 'Aceita PIX' },
    ],
    postedAt: 'Há 2 horas',
    category: 'Alimentação',
    business: {
      id: 'business-1',
      name: 'Mercadinho da Vila',
      logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=60',
      rating: 4.8,
      whatsappNumber: '5541999887766',
    },
    location: {
      address: 'Centro, Colombo - PR',
      distance: 0.3,
      coordinates: {
        lat: -25.2917,
        lng: -49.2242,
      },
    },
  },
  {
    id: '2',
    title: 'Corte de Cabelo Masculino - Barbeiro Profissional',
    price: 35.00,
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80',
    ],
    description: [
      'Corte de cabelo masculino profissional com barbeiro experiente. Trabalhamos com as melhores técnicas e tendências do momento.',
      'Atendimento com hora marcada para evitar espera. Ambiente climatizado e higienizado.',
    ],
    features: [
      { icon: 'ri-scissors-line', label: 'Equipamentos profissionais' },
      { icon: 'ri-time-line', label: 'Agendamento online' },
      { icon: 'ri-hand-sanitizer-line', label: 'Ambiente higienizado' },
    ],
    postedAt: 'Há 1 dia',
    category: 'Serviços',
    business: {
      id: 'business-2',
      name: 'Barbearia Estilo',
      logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=100&q=60',
      rating: 4.9,
      whatsappNumber: '5541988776655',
    },
    location: {
      address: 'Vila São José, Colombo - PR',
      distance: 0.8,
      coordinates: {
        lat: -25.2927,
        lng: -49.2252,
      },
    },
  },
  {
    id: '3',
    title: 'Aula Particular de Matemática - Ensino Médio',
    price: 60.00,
    images: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?auto=format&fit=crop&w=1000&q=80',
    ],
    description: [
      'Aulas particulares de matemática para estudantes do ensino médio. Professor formado pela UFPR com 8 anos de experiência.',
      'Metodologia personalizada de acordo com a necessidade de cada aluno. Preparação para vestibulares e ENEM.',
    ],
    features: [
      { icon: 'ri-file-text-line', label: 'Material incluso' },
      { icon: 'ri-home-line', label: 'Aula presencial ou online' },
      { icon: 'ri-trophy-line', label: '95% de aprovação' },
    ],
    postedAt: 'Há 3 dias',
    category: 'Educação',
    business: {
      id: 'business-3',
      name: 'Prof. Carlos Silva',
      logo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=100&q=60',
      rating: 5.0,
      whatsappNumber: '5541977665544',
    },
    location: {
      address: 'Jardim das Américas, Colombo - PR',
      distance: 1.2,
      coordinates: {
        lat: -25.2937,
        lng: -49.2262,
      },
    },
  },
];
