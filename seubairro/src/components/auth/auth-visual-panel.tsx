'use client';
import React, { useEffect, useState } from 'react'
import DotGrid from '@/components/ui/dot-grid'
import '@/styles/auth/auth-visual-panel.css'

interface AuthVisualPanelProps {
    title: string
    description: string
    mode?: 'client' | 'business' | 'recovery'
}

type Point = {
    icon: string
    label: string
    style?: React.CSSProperties
}

export default function AuthVisualPanel({
    title,
    description,
    mode = 'client'
}: AuthVisualPanelProps) {
    const isBusiness = mode === 'business'
    const [mounted, setMounted] = useState(false)
    const [displayPoints, setDisplayPoints] = useState<Point[]>([])

    const colors = {
        client: { base: '#2563EB', active: '#60A5FA' },
        business: { base: '#0F766E', active: '#2DD4BF' },
        recovery: { base: '#475569', active: '#94A3B8' }
    }

    const { base: baseColor, active: activeColor } = colors[mode] || colors.client

    const pointsConfig = {
        client: [
            { icon: 'ri-store-2-fill', label: 'Mercado' },
            { icon: 'ri-hammer-fill', label: 'Reformas' },
            { icon: 'ri-restaurant-2-fill', label: 'Lanches' }
        ],
        business: [
            { icon: 'ri-line-chart-fill', label: 'Vendas' },
            { icon: 'ri-user-star-fill', label: 'Clientes' },
            { icon: 'ri-store-3-fill', label: 'Sua Loja' }
        ],
        recovery: [
            { icon: 'ri-shield-check-line', label: 'Seguro' },
            { icon: 'ri-lock-unlock-line', label: 'Recuperação' },
            { icon: 'ri-mail-check-line', label: 'Verificação' }
        ]
    }

    const getFixedPosition = (index: number, total: number) => {
        const radius = 22;
        const angleStep = (2 * Math.PI) / total;
        const angle = -Math.PI / 2 + (index * angleStep);

        const left = 50 + radius * Math.cos(angle);
        const top = 50 + radius * Math.sin(angle);

        return {
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${index * 1.5}s`
        };
    }

    useEffect(() => {
        setMounted(true)
        const basePoints = pointsConfig[mode] || pointsConfig.client

        const pointsWithPos = basePoints.map((p, i) => ({
            ...p,
            style: getFixedPosition(i, basePoints.length)
        }))

        setDisplayPoints(pointsWithPos)
    }, [mode])

    return (
        <div className={`auth-visual-panel mode-${mode}`}>
            <DotGrid
                baseColor={baseColor}
                activeColor={activeColor}
                dotSize={4}
                gap={24}
                shockRadius={300}
                proximity={120}
            />

            <div className="radar-layer">
                <div className="radar-center">
                    <div className="radar-wave w1"></div>
                    <div className="radar-wave w2"></div>
                    <div className="logo-core">
                        <img src="/assets/logo-seubairro.svg" alt="Logo" width={40} height={40} onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }} />
                    </div>
                </div>

                {mounted && displayPoints.map((point, idx) => (
                    <div key={idx} className="app-point" style={point.style}>
                        <div className={`point-icon ${mode}`}>
                            <i className={point.icon}></i>
                        </div>
                        {point.label && <div className="point-label">{point.label}</div>}
                    </div>
                ))}
            </div>

            <div className="auth-visual-panel__gradient"></div>
            <div className="auth-visual-panel__text">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}
