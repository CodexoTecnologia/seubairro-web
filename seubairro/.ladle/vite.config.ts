import { fileURLToPath } from 'node:url'

/**
 * Config Vite carregada apenas pelo Ladle (via `viteConfig` em `config.mjs`).
 * Aliasa `next/image` para um mock que renderiza `<img>` simples, já que o
 * Ladle não tem o otimizador `/_next/image` do Next.
 */
const ladleViteConfig = {
  resolve: {
    alias: {
      'next/image': fileURLToPath(new URL('./next-image-mock.tsx', import.meta.url)),
    },
  },
}

export default ladleViteConfig
