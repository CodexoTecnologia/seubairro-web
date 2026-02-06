'use client'

export default function InfoBar() {
    return (
        <section className="info-bar">
            <div className="container info-grid">
                <div className="info-item">
                    <i className="ri-building-4-line"></i>
                    <div>
                        <strong>Identidade Local</strong>
                        <span>Focado na sua região</span>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="info-item">
                    <i className="ri-group-line"></i>
                    <div>
                        <strong>Sem Intermediários</strong>
                        <span>Conexão direta</span>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="info-item">
                    <i className="ri-rocket-line"></i>
                    <div>
                        <strong>Inovação Aberta</strong>
                        <span>Tecnologia acessível</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
