import React from 'react'
import DotGrid from '@/components/ui/dot-grid'
import '@/styles/auth/recuperar-senha/recovery-animation.css'

export default function RecoveryAnimation() {
    return (
        <div className="login-visual-side">
            <DotGrid
                baseColor="#2563EB"
                activeColor="#60A5FA"
                dotSize={4}
                gap={24}
                shockRadius={300}
                proximity={100}
            />
            <div className="visual-text-overlay">
                <h2>Segurança em primeiro lugar.</h2>
                <p>Recupere seu acesso de forma simples e rápida.</p>
            </div>
            <div className="rich-gradient-bg"></div>
        </div>
    )
}
