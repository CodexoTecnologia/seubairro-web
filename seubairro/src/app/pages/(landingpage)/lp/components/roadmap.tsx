'use client'

export default function Roadmap() {
    return (
        <section id="roadmap" className="section-padding">
            <div className="container">
                <div className="section-header">
                    <h2>Do Conceito à Realidade</h2>
                    <p>O SeuBairro não é apenas uma ideia. É um projeto com base sólida e um plano claro de execução.</p>
                </div>

                <div className="timeline-wrapper">
                    <div className="timeline-line"></div>

                    <div className="timeline-grid">
                        <div className="timeline-card done">
                            <div className="timeline-icon">
                                <i className="ri-book-open-line"></i>
                            </div>
                            <span className="step-label">A Fundação</span>
                            <h3>Validado no IFPR</h3>
                            <p>
                                O projeto nasceu como TCC, onde a ideia, a viabilidade econômica 
                                e a necessidade do comércio de Colombo foram pesquisadas e validadas 
                                com nota máxima.
                            </p>
                        </div>

                        <div className="timeline-card active">
                            <div className="timeline-badge">Estamos Aqui</div>
                            <div className="timeline-icon">
                                <i className="ri-code-s-slash-line"></i>
                            </div>
                            <span className="step-label">O Desenvolvimento</span>
                            <h3>Construção da V2</h3>
                            <p>
                                Deixamos o código acadêmico para trás. Estamos reescrevendo a 
                                plataforma com arquitetura escalável, foco em segurança e design profissional.
                            </p>
                        </div>

                        <div className="timeline-card future">
                            <div className="timeline-icon">
                                <i className="ri-rocket-2-line"></i>
                            </div>
                            <span className="step-label">O Lançamento</span>
                            <h3>Piloto em Colombo</h3>
                            <p>
                                O lançamento oficial acontecerá primeiro em nossa casa. Um teste 
                                piloto com comércios selecionados antes da expansão para toda a região.
                            </p>
                        </div>
                    </div>
                </div>

                <div id="participar" className="roadmap-footer">
                    <p>Quer fazer parte do grupo de teste piloto?</p>
                    <a href="mailto:codexotecnologia@gmail.com" className="link-highlight">
                        Entre em contato conosco <i className="ri-arrow-right-line"></i>
                    </a>
                </div>
            </div>
        </section>
    )
}
