'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useProfileMode } from '@/contexts/ProfileModeContext'
import { useAuthContext } from '@/contexts/AuthContext'
import '@/styles/layout/navbar.css'

export default function Navbar() {
    const { profileMode, setProfileMode } = useProfileMode()
    const { user } = useAuthContext()
    const router = useRouter()
    const isBusiness = profileMode === 'business'

    const switchToClient = () => {
        setProfileMode('client')
        router.push('/pages/dashboard-client')
    }

    const switchToBusiness = () => {
        setProfileMode('business')
        router.push('/pages/dashboard-business')
    }

    const initial = user?.name?.charAt(0).toUpperCase() ?? '?'

    if (isBusiness) {
        return (
            <nav className="app-navbar navbar-business">
                <div className="nav-container">
                    <Link href="/pages/dashboard-business" className="nav-logo">
                        <Image src="/assets/logo-seubairro.svg" alt="SeuBairro" width={28} height={28} />
                        <span>Seu<strong>Bairro</strong></span>
                    </Link>

                    <div className="nav-actions">
                        <button onClick={switchToClient} className="navbar-switch-btn">
                            <i className="ri-user-heart-line"></i>
                            <span>Modo Vizinho</span>
                        </button>
                        
                        <div className="navbar-business-user">
                            <div className="navbar-business-avatar">{initial}</div>
                            <span className="navbar-business-name">{user?.name ?? ''}</span>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="app-navbar theme-client">
            <div className="nav-container">
                <Link href="/pages/dashboard-client" className="nav-logo">
                    <Image src="/assets/logo-seubairro.svg" alt="SeuBairro" width={28} height={28} />
                    <span>Seu<span>Bairro</span></span>
                </Link>

                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                        <i className="ri-search-line"></i>
                        <input type="text" placeholder="Buscar produtos ou serviços..." />
                    </div>
                    <div className="location-badge">
                        <i className="ri-map-pin-user-fill"></i>
                        <span>Colombo, PR</span>
                    </div>
                </div>

                <div className="nav-actions">
                    <button onClick={switchToBusiness} className="switch-mode-btn">
                        <i className="ri-store-2-line"></i>
                        <span>Modo Empresa</span>
                    </button>
                    <button className="icon-btn" title="Notificações">
                        <i className="ri-notification-3-line"></i>
                    </button>
                    <Link href="/pages/perfil" className="user-profile">
                        <div className="avatar-circle">{initial}</div>
                        <span className="user-name">{user?.name ?? ''}</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
