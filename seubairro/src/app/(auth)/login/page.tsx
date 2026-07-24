'use client'

import LoginForm from './components/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-[var(--color-page)] p-6">
        <LoginForm />
      </div>

      <aside className="hidden lg:flex relative w-1/2 min-h-screen overflow-hidden text-white bg-[linear-gradient(135deg,#0B1226_0%,#0F1E45_45%,#1E3A8A_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15)_0,transparent_60%)]" />

        <div className="relative z-10 m-auto flex flex-col items-center gap-8 px-8">
          <div className="w-72 rounded-[var(--radius-card)] bg-white/95 text-[var(--color-title)] shadow-2xl overflow-hidden">
            <div className="h-32 bg-[linear-gradient(135deg,#2563EB,#60A5FA)] flex items-end p-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/90 text-[var(--color-primary)] px-2 py-1 rounded-full">
                <i className="ri-shopping-basket-2-line" /> Mercado
              </span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-[var(--color-title)]">Mercadinho da Vila</h3>
                <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400" />
                  ))}
                  <span className="ml-1">(48 avaliações)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                <span className="inline-flex items-center gap-1">
                  <i className="ri-map-pin-line" /> 0.5 km
                </span>
                <span className="inline-flex items-center gap-1 text-[var(--color-success)]">
                  <i className="ri-time-line" /> Aberto agora
                </span>
              </div>
              <button className="w-full h-9 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold">
                Ver Produtos
              </button>
            </div>
          </div>

          <div className="self-start -mt-32 ml-[-1rem] flex items-center gap-2 bg-white/95 text-[var(--color-title)] px-3 py-2 rounded-full shadow-lg text-xs">
            <span className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <i className="ri-chat-smile-2-fill" />
            </span>
            <span className="flex flex-col leading-tight">
              <strong>Ana (Vendedora)</strong>
              <span className="text-[var(--color-muted)]">Seu pedido já foi separado!</span>
            </span>
          </div>

          <div className="self-end mr-[-2rem] flex items-center gap-2 bg-white/95 text-[var(--color-title)] px-3 py-2 rounded-full shadow-lg text-xs">
            <span className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <i className="ri-map-2-fill" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[var(--color-muted)]">Você está em</span>
              <strong>Colombo, PR</strong>
            </span>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 z-10">
          <h2 className="text-3xl font-bold">Conecte-se ao que importa.</h2>
          <p className="mt-2 text-white/80">O comércio do seu bairro na palma da sua mão.</p>
        </div>
      </aside>
    </main>
  )
}
