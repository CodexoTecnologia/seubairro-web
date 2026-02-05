'use client'
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
                    <div className="brand-text">Seu<span>Bairro</span></div>
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
                        <li>
                            <a href="#participar" className="btn-primary btn-header" onClick={handleLinkClick}>
                                Avisar Lançamento <i className="ri-notification-3-line"></i>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
