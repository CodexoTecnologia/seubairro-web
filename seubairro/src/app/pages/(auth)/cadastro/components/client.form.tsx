'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserService } from '@/API/services/UserService'
import { authService } from '@/API/services/(Auth)/AuthInstance'
import type { CreateCustomerRequest } from '@/API/dtos/Request/client/CreateCustomerRequest'
import '@/styles/auth/cadastro/client-forms.css'

export const ClientForm: React.FC = () => {
    const router = useRouter()
    const [showClientPassword, setShowClientPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        birthDate: ''
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const nameParts = formData.fullName.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || null

        // Format birthDate to match 'date' format
        const birthDateFormatted = formData.birthDate
            ? new Date(formData.birthDate).toISOString()
            : new Date().toISOString()

        const request: CreateCustomerRequest = {
            firstName: firstName || null,
            lastName: lastName,
            email: formData.email,
            password: formData.password,
            birthDate: birthDateFormatted,
            taxId: null
        }

        try {
            await UserService.registerCustomer(request)

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
            <div className="flex-column">
                <label>Nome Completo</label>
            </div>
            <div className="inputForm">
                <i className="ri-user-line" style={{ fontSize: '20px' }}></i>
                <input
                    type="text"
                    className="input"
                    style={inputStyle}
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                />
            </div>

            <div className="flex-column">
                <label>E-mail</label>
            </div>
            <div className="inputForm">
                <i className="ri-mail-line" style={{ fontSize: '20px' }}></i>
                <input
                    type="email"
                    className="input"
                    style={inputStyle}
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    className="input"
                    style={{ ...inputStyle, WebkitAppearance: 'none' }}
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                />
            </div>

            <div className="flex-column">
                <label>Senha</label>
            </div>
            <div className="inputForm">
                <i className="ri-lock-line" style={{ fontSize: '20px' }}></i>
                <input
                    type={showClientPassword ? "text" : "password"}
                    className="input"
                    style={inputStyle}
                    placeholder="Crie uma senha forte"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowClientPassword(!showClientPassword)}
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
                    {showClientPassword ? <i className="ri-eye-line" style={{ fontSize: '20px' }}></i> : <i className="ri-eye-off-line" style={{ fontSize: '20px' }}></i>}
                </button>
            </div>

            {error && (
                <p className="error-message" style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                    {error}
                </p>
            )}

            <button type="submit" className="button-submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Conta Grátis'}
            </button>
        </form>
    )
}