import Link from 'next/link'

export default function Contact() {
  return (
    <section
      id="contato"
      className="py-16 md:py-24 bg-[var(--color-surface)] border-t border-[var(--color-border-default)] scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-8 md:p-12 flex flex-col items-center text-center gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Pronto para descobrir o seu bairro?
            </h2>
            <p className="text-lg text-white/90">
              Crie sua conta grátis e encontre produtos e serviços a poucos metros de casa — ou
              cadastre seu negócio e apareça para a vizinhança.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[var(--color-primary)] font-semibold hover:opacity-95 active:opacity-90 transition-opacity"
            >
              <i className="ri-user-add-line" aria-hidden />
              Criar conta grátis
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-white/70 text-white font-semibold hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              Já tenho conta
            </Link>
          </div>

          <p className="text-sm text-white/85">
            Dúvidas, sugestões ou parcerias?{' '}
            <a
              href="mailto:codexotecnologia@gmail.com"
              className="underline font-medium hover:text-white"
            >
              codexotecnologia@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
