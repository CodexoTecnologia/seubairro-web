'use client'

export default function Proposito() {
    return (
        <section id="proposito" className="section-padding">
            <div className="container">
                <div className="section-header">
                    <h2>Mais que um mapa, uma comunidade</h2>
                    <p>
                        Enquanto grandes plataformas focam apenas em rotas e trânsito, 
                        nós focamos nas pessoas e nos negócios que fazem o bairro acontecer.
                    </p>
                </div>

                <div className="grid-cards">
                    <div className="glass-card">
                        <div className="icon-box">
                            <i className="ri-map-pin-user-line"></i>
                        </div>
                        <h3>Visibilidade Real</h3>
                        <p>
                            Muitos serviços locais excelentes ficam escondidos nos mapas genéricos. 
                            O <strong>SeuBairro</strong> dá destaque igualitário para o pequeno empreendedor.
                        </p>
                    </div>
                    <div className="glass-card highlight">
                        <div className="icon-box">
                            <i className="ri-hand-heart-line"></i>
                        </div>
                        <h3>Economia Circular</h3>
                        <p>
                            Nossa missão é manter o dinheiro circulando na comunidade. 
                            Quando você compra do vizinho, todo o bairro se desenvolve.
                        </p>
                    </div>
                    <div className="glass-card">
                        <div className="icon-box">
                            <i className="ri-shake-hands-line"></i>
                        </div>
                        <h3>Relacionamento Direto</h3>
                        <p>
                            Sem algoritmos complexos ou taxas abusivas de entrega. 
                            Facilitamos o contato direto para você negociar como preferir.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
