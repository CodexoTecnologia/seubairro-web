const QUESTIONS = [
  {
    q: 'O SeuBairro é gratuito?',
    a: 'Sim. Criar conta é gratuito tanto para moradores quanto para negócios. Não cobramos taxa de adesão nem comissão sobre o que você negocia.',
  },
  {
    q: 'Quando a plataforma será lançada?',
    a: 'O lançamento acontece primeiro em Colombo (PR), nossa casa, com um piloto junto a comércios selecionados. Depois disso, expandimos para toda a região.',
  },
  {
    q: 'Como cadastro meu negócio?',
    a: 'Crie uma conta de empreendedor e, logo em seguida, cadastre sua empresa: endereço, horários de funcionamento, nichos e anúncios. Em poucos minutos sua vitrine aparece para a vizinhança.',
  },
  {
    q: 'Vocês cobram comissão sobre vendas ou entregas?',
    a: 'Não. O SeuBairro facilita o contato direto entre vizinho e comerciante — a negociação, o pagamento e a entrega acontecem do jeito que vocês combinarem.',
  },
  {
    q: 'Posso usar como morador e como empreendedor ao mesmo tempo?',
    a: 'Pode. Uma mesma conta pode ter os dois perfis: você escolhe em qual espaço entrar a cada acesso e alterna entre eles a qualquer momento pelo menu.',
  },
  {
    q: 'Como falo com a equipe?',
    a: 'Para dúvidas, sugestões ou parcerias, escreva para codexotecnologia@gmail.com. Respondemos todo mundo.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-[var(--color-surface)] scroll-mt-20">
      <div className="max-w-[800px] mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-title)]">
            Dúvidas frequentes
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            O que a vizinhança mais pergunta antes de entrar.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {QUESTIONS.map((item) => (
            <details
              key={item.q}
              className="group rounded-[var(--radius-card)] bg-[var(--color-page)] border border-[var(--color-border-default)] open:border-[var(--color-primary)]/40 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 min-h-11 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-sm md:text-base font-semibold text-[var(--color-title)]">
                {item.q}
                <i
                  className="ri-arrow-down-s-line text-xl text-[var(--color-muted)] transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="px-5 pb-5 text-sm text-[var(--color-body)]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
