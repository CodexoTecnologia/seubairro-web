'use client'
import LoginForm from './components/login-form'
import '@/styles/auth/login/login.css'
export default function LoginPage() {
    return (
        <main className="login-container">
            <div className="login-form-side">
                <LoginForm />
            </div>
            <div className="login-visual-side">
                <div className="rich-gradient-bg"></div>
                <div className="grid-pattern-overlay"></div>
                <div className="ui-showcase-container">
                    <div className="ui-card">
                        <div className="card-header-img">
                            <div className="category-tag">
                                <i className="ri-shopping-basket-2-line"></i> Mercado
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="store-info">
                                <h3>Mercadinho da Vila</h3>
                                <div className="rating-row">
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <i className="ri-star-fill"></i>
                                    <span>(48 avaliações)</span>
                                </div>
                            </div>
                            <div className="store-meta">
                                <div className="meta-item">
                                    <i className="ri-map-pin-line"></i> <span>0.5 km</span>
                                </div>
                                <div className="meta-item open">
                                    <i className="ri-time-line"></i> <span>Aberto agora</span>
                                </div>
                            </div>
                            <div className="card-action-btn">Ver Produtos</div>
                        </div>
                    </div>
                    <div className="ui-floating-pill message-pill">
                        <div className="pill-icon">
                            <i className="ri-chat-smile-2-fill"></i>
                        </div>
                        <div className="pill-text">
                            <strong>Ana (Vendedora)</strong>
                            <span>Seu pedido já foi separado!</span>
                        </div>
                    </div>
                    <div className="ui-floating-pill location-pill">
                        <div className="pill-icon map">
                            <i className="ri-map-2-fill"></i>
                        </div>
                        <div className="pill-text">
                            <span>Você está em</span>
                            <strong>Colombo, PR</strong>
                        </div>
                    </div>
                </div>
                <div className="visual-text-overlay">
                    <h2>Conecte-se ao que importa.</h2>
                    <p>O comércio do seu bairro na palma da sua mão.</p>
                </div>
            </div>
        </main>
    )
}

