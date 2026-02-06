'use client'

export default function Hero() {
    return (
        <section className="hero">
            <div className="container hero-grid">
                <div className="hero-text">
                    <div className="status-badge">
                        <span className="pulse-dot"></span>
                        Projeto em Evolução (V2)
                    </div>
                    <h1>
                        A tecnologia a favor do <br/>
                        <span className="gradient-text">Comércio Local.</span>
                    </h1>
                    <p>
                        Nascido como um projeto acadêmico de destaque no <strong>IFPR</strong>, 
                        o SeuBairro está evoluindo para se tornar a principal ferramenta de 
                        conexão entre moradores e negócios locais. De vizinho para vizinho.
                    </p>
                    <div className="cta-group">
                        <a href="#contato" className="btn-primary glow-button">
                            Quero saber mais
                        </a>
                        <a href="#proposito" className="btn-text">
                            Entenda a visão <i className="ri-arrow-down-line"></i>
                        </a>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="radar-container">
                        <div className="radar-circle c1"></div>
                        <div className="radar-circle c2"></div>
                        <div className="radar-circle c3"></div>
                        <div className="radar-sweep"></div>

                        <div className="center-pin">
                            <img src="/assets/logo-seubairro.svg" alt="Logo" className="pin-logo" />
                        </div>

                        <div className="map-point p1" title="Mercado">
                            <i className="ri-store-2-fill"></i>
                        </div>
                        <div className="map-point p2" title="Serviços">
                            <i className="ri-hammer-fill"></i>
                        </div>
                        <div className="map-point p3" title="Lazer">
                            <i className="ri-restaurant-fill"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
