# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Antes de responder qualquer pergunta sobre este projeto, consulte estes dois arquivos como fonte de verdade:**

- Princípios, convenções de nomenclatura, regras de estilo, segurança e formato de commit: [docs/guideliness.md](docs/guideliness.md).
- Padrões de implementação por camada (página, layout, feature, hook, service, DTO, ApiClient, Design System): [docs/code-pattern.md](docs/code-pattern.md).

Qualquer sugestão, refactor, criação de arquivo ou revisão deve estar alinhado a esses dois documentos. Se uma instrução do usuário conflita com eles, aponte o conflito antes de implementar.

---

## Project Overview

SeuBairro Web é o frontend do marketplace local SeuBairro, construído em Next.js 16 (App Router) com React 19, TypeScript, Tailwind v4 e Zod. Consome a API ASP.NET Core do projeto irmão `SeuBairro/`. Atende três perfis de usuário (público, cliente autenticado e negócio autenticado), cada um com seu próprio grupo de rotas, layout e shell visual.

---

## Commands

```bash
# Desenvolvimento (NODE_OPTIONS=--use-system-ca já configurado)
npm run dev

# Build de produção
npm run build

# Start de produção
npm start

# Lint
npm run lint

# Ladle (sandbox de componentes do Design System)
npm run ladle
npm run ladle:build
```

---

## Architecture

Dependências apontam apenas para dentro. `app/` consome `features/`, `design-system/` e `lib/`. `features/` consome `design-system/` e `lib/`. `design-system/` é puro e não conhece `features/` nem `app/` (regra garantida pelo ESLint em `eslint.config.mjs`). Dentro do Design System, `primitives/` é a camada mais baixa e não pode importar de `patterns/` nem `layout/`.

| Camada | Papel |
|--------|-------|
| `src/app` | Rotas (App Router), layouts de grupo `(auth)`, `(business)`, `(client)`, `(public)`, `loading.tsx`, `error.tsx`. Sem lógica de negócio. |
| `src/features` | Lógica por domínio: `auth`, `business`, `client`, `marketing`, `shared`. Cada feature tem `components/`, `hooks/`, `schemas/`, e `context/` quando aplicável. |
| `src/design-system` | UI agnóstica de domínio em três camadas: `primitives/`, `patterns/`, `layout/`. Tokens via `var(--color-*)` e variantes via CVA em arquivos `.variants.ts`. |
| `src/lib/api` | Comunicação com o backend: `Client/` (ApiClient único), `services/` (estendem `BaseService`), `dtos/Request/` e `dtos/Response/`, `enums/`, `helper/`, `Interfaces/`. |
| `src/lib/utils` | Helpers genéricos (`cn()` baseado em clsx + tailwind-merge). |

Fluxo de uma interação: página renderiza componente de feature → componente chama hook da feature → hook valida com Zod e chama Service → Service delega ao `apiClient` → `apiClient` anexa auth, trata erros, retorna DTO. Componentes nunca usam `fetch` direto.

---

## Authentication

Token JWT é mantido em `localStorage` via `LocalStorageService` e em memória no `ApiClient`. `authService` (`lib/api/services/(Auth)/AuthInstance.ts`) faz login/logout. `useAuth` (`features/auth/hooks/`) é a fonte única de estado do usuário, exposto via `AuthProvider` em `src/app/layout.tsx`. Rotas protegidas usam `AuthGuard` (`features/shared/components/AuthGuard/`). Roles vêm do JWT via `RoleHelper` e definem o redirect pós-login (cliente → `dashboard-client`, negócio → `dashboard-business`).

---

## Forms

Padrão único: React Hook Form + `zodResolver` + schema Zod em `features/<domínio>/schemas/*.schema.ts`. O tipo do form é inferido com `z.infer` — nunca declarado à mão. Inputs vêm do Design System (`design-system/primitives/Input`) e recebem `error` direto do `formState.errors`. Submissão chama um hook de feature; o componente trata apenas loading inline e mensagens de servidor com `role="alert"`.

---

## Styling

Tailwind v4 com tokens semânticos em CSS variables (`var(--color-primary)`, `var(--color-body)`, etc.) declaradas em `app/global.css`. **Proibido** usar paleta literal do Tailwind (`bg-blue-500`, `text-red-700`). Variantes complexas usam `class-variance-authority` em arquivo `.variants.ts` separado. Composição de classes via `cn()`.

---

## Server vs Client Components

Server por padrão. `'use client'` apenas quando há estado, efeitos, contexto consumido ou browser API. Componentes que dependem de `window` (leaflet, gsap) ficam em arquivos `.client.tsx` carregados via `next/dynamic` com `ssr: false`.

---

## Environment

`.env.local` na raiz com as variáveis do backend (URL da API, etc.). O dev server roda com `NODE_OPTIONS=--use-system-ca` para reaproveitar certificados do sistema (necessário em ambientes Windows corporativos). Imagens externas são permitidas via `remotePatterns: [{ protocol: 'https', hostname: '**' }]` em `next.config.ts`.

---

## Lint and Convenções Forçadas

`eslint.config.mjs` impõe restrições estruturais que não devem ser contornadas:

- `src/design-system/**` não pode importar de `@/features/*` nem `@/app/*`.
- `src/design-system/primitives/**` não pode importar de `@/design-system/patterns/*`, `@/design-system/layout/*`, `@/features/*` ou `@/app/*`.
- `@next/next/no-img-element` é erro — use `next/image`.

Se você precisa quebrar uma dessas regras, a abstração está errada — inverta a dependência ou mova o código de camada.

---

## Workflow

Antes de abrir PR: `npm run lint` e `npx tsc --noEmit` passando. Mudanças visuais validadas no `npm run ladle` (componentes do Design System) ou `npm run dev` (fluxos completos). Commits seguem Conventional Commits em português, no imperativo.
