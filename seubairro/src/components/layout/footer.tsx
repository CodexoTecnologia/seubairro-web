'use client'

export default function Footer() {
    return (
        <footer className="footer-modern">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col brand-col">
                        <div className="footer-brand">
                            <img src="/assets/logo-seubairro.svg" alt="Logo" className="footer-logo-img" />
                            <div className="brand-text">Seu<span>Bairro</span></div>
                        </div>
                        <p className="footer-desc">
                            A plataforma definitiva para conectar vizinhos e fortalecer a economia local. 
                            Tecnologia com propósito.
                        </p>

                        <div className="social-links">
                            <a href="https://instagram.com/codexotecnologia" target="_blank" aria-label="Instagram">
                                <i className="ri-instagram-line"></i>
                            </a>
                            <a href="https://linkedin.com/company/codexo-tecnologia" target="_blank" aria-label="LinkedIn">
                                <i className="ri-linkedin-fill"></i>
                            </a>
                            <a href="https://codexo.com.br" target="_blank" aria-label="Site">
                                <i className="ri-global-line"></i>
                            </a>
                        </div>
                    </div>

                    <div className="footer-col nav-col">
                        <h4>Explorar</h4>
                        <ul className="footer-nav-list">
                            <li><a href="#proposito">Propósito</a></li>
                            <li><a href="#para-quem">Para Moradores</a></li>
                            <li><a href="#para-quem">Para Negócios</a></li>
                            <li><a href="#roadmap">Trajetória</a></li>
                        </ul>
                    </div>

                    <div className="footer-col dev-col">
                        <h4>Tecnologia</h4>
                        <a href="https://codexo.com.br" target="_blank" className="codexo-badge">
                            <span className="dev-text">Desenvolvido por</span>
                            <img src="/assets/logo_codexo_nome_branco.svg" alt="Codexo" className="codexo-logo" />
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 SeuBairro. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
