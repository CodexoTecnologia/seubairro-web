import React, { useState } from 'react'
import '@/styles/auth/login/LoginForm.css' // Importing Login styles to ensure exact match

interface ClientFormProps {
    onSubmit: (e: React.FormEvent) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
    const [showClientPassword, setShowClientPassword] = useState(false)

    const inputStyle = {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        width: '100%',
        height: '100%',
        color: 'inherit'
    };

    return (
        <form className="form" onSubmit={onSubmit} style={{ width: '100%', padding: 0, gap: '15px' }}>
            <div className="flex-column">
                <label>Nome Completo</label>
            </div>
            <div className="inputForm">
                <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                    <g id="Layer_3" data-name="Layer 3">
                        <circle cx="16" cy="16" r="15" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                        <path d="M16 17a7 7 0 1 0-7-7 7 7 0 0 0 7 7zm0-12a5 5 0 1 1-5 5 5 5 0 0 1 5-5zM27 28.5a1 1 0 0 0-1-1 11 11 0 0 0-20 0 1 1 0 0 0-1 1v.5h22z" />
                    </g>
                </svg>
                <input
                    type="text"
                    className="input"
                    style={inputStyle}
                    placeholder="Seu nome"
                    required
                />
            </div>

            <div className="flex-column">
                <label>E-mail</label>
            </div>
            <div className="inputForm">
                <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                    <g id="Layer_3" data-name="Layer 3">
                        <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                    </g>
                </svg>
                <input
                    type="email"
                    className="input"
                    style={inputStyle}
                    placeholder="seu@email.com"
                    required
                />
            </div>

            <div className="flex-column">
                <label>Senha</label>
            </div>
            <div className="inputForm">
                <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                    <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
                </svg>
                <input
                    type={showClientPassword ? "text" : "password"}
                    className="input"
                    style={inputStyle}
                    placeholder="Crie uma senha forte"
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
                        color: 'inherit' // Inherit color for the SVG icon
                    }}
                >
                    {showClientPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                    )}
                </button>
            </div>

            <button type="submit" className="button-submit">Criar Conta Grátis</button>
        </form>
    )
}