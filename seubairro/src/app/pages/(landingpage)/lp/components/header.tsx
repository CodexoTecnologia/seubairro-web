'use client'
import Link from 'next/dist/client/link'
import SplitText from '@/components/ui/SplitText'
import { useState } from 'react'

export default function Header() {
    const [menuActive, setMenuActive] = useState(false)

    const toggleMenu = () => {
        setMenuActive(!menuActive)
    }

    const handleLinkClick = () => {
        setMenuActive(false)
    }

    return (
        <header id="header">
            <div className="container header-content">
                <a href="#" className="brand">
                    <img src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" className="nav-logo" />
                    <SplitText
                        text="SeuBairro"
                        className="brand-text"
                        delay={50}
                        duration={1.25}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 20 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                    />
                </a>

                <nav id="nav">
                    <button 
                        aria-label="Abrir Menu" 
                        id="btn-mobile"
                        onClick={toggleMenu}
                    >
                        <i className={menuActive ? 'ri-close-line' : 'ri-menu-3-line'}></i>
                    </button>

                    <ul id="menu" role="list" className={menuActive ? 'active' : ''}>
                        <li>
                            <a href="#proposito" className="nav-link" onClick={handleLinkClick}>
                                Propósito
                            </a>
                        </li>
                        <li>
                            <a href="#para-quem" className="nav-link" onClick={handleLinkClick}>
                                Para Quem É
                            </a>
                        </li>
                        <li className="menu-login-item">
                            <Link href="/pages/login" className="btn-login" onClick={handleLinkClick}>
                                <i className="ri-user-line"></i>
                                <span>Entrar</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <Link href="/pages/login" className="btn-login btn-login-desktop">
                    <i className="ri-user-line"></i>
                    <span>Entrar</span>
                </Link>
            </div>
        </header>
    )
}