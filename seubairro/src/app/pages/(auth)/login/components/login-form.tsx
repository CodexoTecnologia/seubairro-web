'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/styles/auth/login/LoginForm.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.push('/pages/dashboad')
        }, 1500)
    }
    const togglePassword = () => {
        setShowPassword(!showPassword)
    }
    return (
        <div className="form-wrapper">
            <div className="auth-header">
                <Link href="/" className="logo-link">
                    <img
                        src="/assets/logo-seubairro.svg"
                        alt="SeuBairro"
                        className="logo-img"
                        width={32}
                        height={32}
                    />
                    <span className="logo-text">
                        Seu<span>Bairro</span>
                    </span>
                </Link>
                <h1>Bem-vindo de volta!</h1>
                <p>Acesse sua conta para conectar-se à vizinhança.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <Input
                    id="email"
                    label="E-mail"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<i className="ri-mail-line"></i>}
                />
                <div className="input-group">
                    <Input
                        id="password"
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={<i className="ri-lock-2-line"></i>}
                        rightElement={
                            <button
                                type="button"
                                onClick={togglePassword}
                                aria-label="Mostrar/ocultar senha"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                            </button>
                        }
                    />
                    <div className="forgot-link">
                        <Link href="/pages/recuperar-senha">Esqueceu a senha?</Link>
                    </div>
                </div>
                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    className="btn-submit-custom-class"
                >
                    Entrar na Plataforma
                </Button>
                <div className="divider">
                    <span>ou continue com</span>
                </div>
                <div className="social-login">
                    <button type="button" className="btn-social">
                        <img
                            src="https:
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Google
                    </button>
                </div>
            </form>
            <div className="auth-footer">
                <p>
                    Não tem uma conta? {' '}
                    <Link href="/cadastro">Cadastre-se gratuitamente</Link>
                </p>
            </div>
        </div>
    )
}

