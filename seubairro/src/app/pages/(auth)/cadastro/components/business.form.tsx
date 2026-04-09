'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserService } from '@/API/services/UserService'
import { authService } from '@/API/services/(Auth)/AuthInstance'
import type { CreateEntrepeneurRequest } from '@/API/dtos/Request/business/CreateEntrepeneurRequest'
import '@/styles/auth/cadastro/business-forms.css'

export const BusinessForm: React.FC = () => {
    const router = useRouter()
    const [businessStep, setBusinessStep] = useState(1)
    const [showBusinessPassword, setShowBusinessPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        birthDate: '',
        businessName: '',
        category: '',
        whatsapp: ''
    })

    const inputStyle = {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        width: '100%',
        height: '100%',
        color: 'inherit'
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const nameParts = formData.fullName.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || null

        // Default valid dates for dummy requirements
        const birthDateFormatted = formData.birthDate
            ? new Date(formData.birthDate).toISOString()
            : new Date().toISOString()

        const request: CreateEntrepeneurRequest = {
            firstName: firstName || null,
            lastName: lastName,
            email: formData.email,
            password: formData.password,
            birthDate: birthDateFormatted,
            taxId: null,
            business: {
                ownerId: '00000000-0000-0000-0000-000000000000', // Backend handles this
                businessName: formData.businessName,
                legalName: formData.businessName,
                taxId: null,
                description: null,
                logoUrl: null,
                coverImageUrl: null,
                publicPhone: formData.whatsapp,
                instagramUrl: null
            }
        }

        try {
            await UserService.registerEntrepeneur(request)

            // Login after success
            await authService.login({ email: formData.email, password: formData.password })
            router.push('/pages/choose-profile')
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta. Verifique os dados e tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} style={{ width: '100%', padding: 0, gap: '15px' }}>
            <div className="stepper">
                <div className={`step ${businessStep === 1 ? 'active' : ''}`}>1. Dados Pessoais</div>
                <div className="step-line"></div>
                <div className={`step ${businessStep === 2 ? 'active' : ''}`}>2. Seu Negócio</div>
            </div>

            {businessStep === 1 && (
                <div id="busStep1" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>

                    <div className="flex-column">
                        <label>Nome do Responsável</label>
                    </div>
                    <div className="inputForm">
                        <i className="ri-user-line" style={{ fontSize: '20px' }}></i>
                        <input
                            type="text"
                            name="fullName"
                            className="input"
                            style={inputStyle}
                            placeholder="Seu nome completo"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex-column">
                        <label>E-mail de Acesso</label>
                    </div>
                    <div className="inputForm">
                        <i className="ri-mail-line" style={{ fontSize: '20px' }}></i>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            style={inputStyle}
                            placeholder="email@negocio.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex-column">
                        <label>Data de Nascimento</label>
                    </div>
                    <div className="inputForm" style={{ height: '40px', padding: '0 10px' }}>
                        <i className="ri-calendar-line" style={{ fontSize: '20px' }}></i>
                        <input
                            type="date"
                            name="birthDate"
                            className="input"
                            style={{ ...inputStyle, WebkitAppearance: 'none' }}
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex-column">
                        <label>Senha</label>
                    </div>
                    <div className="inputForm">
                        <i className="ri-lock-line" style={{ fontSize: '20px' }}></i>
                        <input
                            type={showBusinessPassword ? "text" : "password"}
                            name="password"
                            className="input"
                            style={inputStyle}
                            placeholder="Senha segura"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowBusinessPassword(!showBusinessPassword)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'inherit'
                            }}
                        >
                            {showBusinessPassword ? <i className="ri-eye-line" style={{ fontSize: '20px' }}></i> : <i className="ri-eye-off-line" style={{ fontSize: '20px' }}></i>}
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn-submit btn-business"
                        onClick={() => {
                            if (formData.fullName && formData.email && formData.password && formData.birthDate) {
                                setBusinessStep(2)
                            } else {
                                alert("Preencha todos os campos antes de continuar.")
                            }
                        }}
                        style={{ marginTop: '10px' }}>
                        Continuar <i className="ri-arrow-right-line"></i>
                    </button>
                </div>
            )}

            {businessStep === 2 && (
                <div id="busStep2" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }} className="hidden-form">

                    <div className="flex-column">
                        <label>Nome do Negócio</label>
                    </div>
                    <div className="inputForm">
                        <i className="ri-store-2-line" style={{ fontSize: '20px' }}></i>
                        <input
                            type="text"
                            name="businessName"
                            className="input"
                            style={inputStyle}
                            placeholder="Ex: Mercado do João"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex-column">
                        <label>Categoria principal</label>
                    </div>
                    <div className="inputForm">
                        <i className="ri-layout-grid-line" style={{ fontSize: '20px' }}></i>
                        <select
                            name="category"
                            required
                            className="input"
                            style={inputStyle}
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Selecione uma categoria</option>
                            <option value="alimentacao">Alimentação</option>
                            <option value="servicos">Serviços</option>
                            <option value="varejo">Varejo</option>
                        </select>
                    </div>

                    <div className="flex-column">
                        <label>WhatsApp</label>
                    </div>
                    <div className="inputForm">
                        <i className="ri-whatsapp-line" style={{ fontSize: '20px' }}></i>
                        <input
                            type="tel"
                            name="whatsapp"
                            className="input"
                            style={inputStyle}
                            placeholder="(41) 99999-9999"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <p className="error-message" style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <div className="buttons-row">
                        <button type="button" className="btn-outline" onClick={() => setBusinessStep(1)}>Voltar</button>
                        <button type="submit" className="btn-submit btn-business" disabled={isLoading}>
                            {isLoading ? 'Finalizando...' : 'Finalizar'}
                        </button>
                    </div>
                </div>
            )}
        </form>
    )
}