'use client'
import React from 'react'
import Link from 'next/link'
export function Footer() {
    const currentYear = new Date().getFullYear()
    return (
        <footer style={{
            marginTop: 'auto',
            borderTop: '1px solid #E2E8F0',
            padding: '2rem 1rem',
            backgroundColor: '#fff',
            textAlign: 'center',
            color: '#64748B',
            fontSize: '0.875rem'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                    <img src="/assets/logo-seubairro.svg" alt="SeuBairro" style={{ height: '24px', opacity: 0.8 }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>SeuBairro</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <Link href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Sobre</Link>
                    <Link href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Termos de Uso</Link>
                    <Link href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Privacidade</Link>
                    <Link href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Contato</Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                    <a href="#" style={{ fontSize: '1.2rem', color: '#64748B' }}><i className="ri-instagram-line"></i></a>
                    <a href="#" style={{ fontSize: '1.2rem', color: '#64748B' }}><i className="ri-facebook-circle-line"></i></a>
                    <a href="#" style={{ fontSize: '1.2rem', color: '#64748B' }}><i className="ri-twitter-x-line"></i></a>
                </div>
                <p>&copy; {currentYear} SeuBairro - Conectando vizinhos e negócios locais.</p>
            </div>
        </footer>
    )
}

