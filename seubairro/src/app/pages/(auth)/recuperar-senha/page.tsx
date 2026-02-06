'use client'
import React from 'react'
import PasswordRecoveryForm from './components/password-recovery-form'
import '@/styles/auth/recuperar-senha/recuperar-senha.css'
export default function RecuperarSenhaPage() {
    return (
        <main className="login-container">
            <div className="login-form-side">
                <PasswordRecoveryForm />
            </div>
            <div className="login-visual-side">
                <div className="animation-layer">
                    <div className="map-background"></div>
                    <div className="radar-center">
                        <div className="radar-wave w1"></div>
                        <div className="radar-wave w2"></div>
                        <div className="logo-core">
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '40px', height: '40px', color: '#2563EB' }}>
                                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="app-point p1"><div className="point-icon"><i className="ri-shield-check-line"></i></div></div>
                    <div className="app-point p2"><div className="point-icon"><i className="ri-lock-unlock-line"></i></div></div>
                </div>
                <div className="visual-text-overlay">
                    <h2>Segurança em primeiro lugar.</h2>
                    <p>Recupere seu acesso de forma simples e rápida.</p>
                </div>
                <div className="rich-gradient-bg"></div>
            </div>
        </main>
    )
}

