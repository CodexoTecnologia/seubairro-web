'use client'

export default function ParaQuem() {
    return (
        <section id="para-quem" className="section-padding">
            <div className="container">
                <div className="section-header">
                    <h2>Um ecossistema, duas soluções</h2>
                    <p>Conectamos as pontas soltas do bairro. Veja como o SeuBairro ajuda você.</p>
                </div>

                <div className="ecosystem-grid">
                    <div className="eco-card user-side">
                        <div className="eco-icon">
                            <i className="ri-user-smile-line"></i>
                        </div>
                        <h3>Para Moradores</h3>
                        <ul>
                            <li>
                                <i className="ri-check-line"></i> 
                                Encontre serviços e produtos a poucos metros de casa.
                            </li>
                            <li>
                                <i className="ri-check-line"></i> 
                                Descubra promoções exclusivas da vizinhança.
                            </li>
                            <li>
                                <i className="ri-check-line"></i> 
                                Valorize o que é nosso e economize tempo de deslocamento.
                            </li>
                        </ul>
                    </div>

                    <div className="eco-card business-side">
                        <div className="eco-badge">Oportunidade</div>
                        <div className="eco-icon">
                            <i className="ri-store-3-line"></i>
                        </div>
                        <h3>Para Negócios Locais</h3>
                        <ul>
                            <li>
                                <i className="ri-check-line"></i> 
                                Sua vitrine digital focada em quem realmente compra de você.
                            </li>
                            <li>
                                <i className="ri-check-line"></i> 
                                Ferramenta simples: cadastre-se e apareça no mapa.
                            </li>
                            <li>
                                <i className="ri-check-line"></i> 
                                Sem taxas de adesão abusivas. Feito para o pequeno crescer.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
