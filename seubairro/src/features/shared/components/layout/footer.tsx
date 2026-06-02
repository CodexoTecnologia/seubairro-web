'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-white/80 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/assets/logo-seubairro.svg" alt="Logo" width={36} height={36} />
              <span className="text-white font-bold text-lg">
                Seu<span className="text-[var(--color-primary)]">Bairro</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-prose mb-6">
              A plataforma definitiva para conectar vizinhos e fortalecer a economia local.
              Tecnologia com propósito.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: 'https://instagram.com/codexotecnologia', icon: 'ri-instagram-line', label: 'Instagram' },
                { href: 'https://linkedin.com/company/codexo-tecnologia', icon: 'ri-linkedin-fill', label: 'LinkedIn' },
                { href: 'https://codexo.com.br', icon: 'ri-global-line', label: 'Site' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="size-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <i className={`${s.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#proposito" className="hover:text-white transition-colors">Propósito</a></li>
              <li><a href="#para-quem" className="hover:text-white transition-colors">Para Moradores</a></li>
              <li><a href="#para-quem" className="hover:text-white transition-colors">Para Negócios</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Trajetória</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tecnologia</h4>
            <a
              href="https://codexo.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-xs uppercase tracking-wider text-white/60">Desenvolvido por</span>
              <Image src="/assets/logo_codexo_nome_branco.svg" alt="Codexo" width={120} height={24} className="h-6 w-auto" />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          <p>&copy; 2026 SeuBairro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
