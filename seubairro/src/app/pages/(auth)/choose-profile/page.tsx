'use client'
import Link from 'next/link'
import '@/styles/auth/choose-profile/choose-profile.css'

export default function ChooseProfilePage() {
    return (
        <div className="choose-profile-container">
            <img src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" className="choose-profile-logo" />
            <h1 className="choose-profile-heading">Como você quer entrar?</h1>
            <p className="choose-profile-sub">Escolha o perfil que melhor representa você.</p>
            <div className="choose-profile-cards">
                <Link href="/pages/dashboard-client" className="profile-card client">
                    <div className="profile-card-icon">
                        <i className="ri-user-heart-line"></i>
                    </div>
                    <span className="profile-card-title">Sou Vizinho</span>
                    <span className="profile-card-desc">Quero descobrir produtos e serviços perto de mim.</span>
                    <i className="ri-arrow-right-line profile-card-arrow"></i>
                </Link>
                <Link href="/pages/dashboard-business" className="profile-card business">
                    <div className="profile-card-icon">
                        <i className="ri-store-2-line"></i>
                    </div>
                    <span className="profile-card-title">Sou Empreendedor</span>
                    <span className="profile-card-desc">Quero divulgar meu negócio no bairro.</span>
                    <i className="ri-arrow-right-line profile-card-arrow"></i>
                </Link>
            </div>
        </div>
    )
}
