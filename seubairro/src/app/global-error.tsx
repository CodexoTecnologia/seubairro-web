'use client'

// global-error renderiza FORA do RootLayout — tokens semânticos do global.css
// podem não estar disponíveis. Usamos os mesmos valores hexadecimais dos tokens
// (primary, danger, title, body) inline para manter consistência visual.
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          role="alert"
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '28rem',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '9999px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              fontSize: '1.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="ri-error-warning-line" aria-hidden />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Erro crítico
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
            {error.message || 'Não foi possível carregar a aplicação.'}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              height: '2.75rem',
              padding: '0 1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
