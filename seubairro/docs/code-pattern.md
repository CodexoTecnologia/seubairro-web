# Code Patterns — SeuBairro Web

Como cada camada e padrão deve ser implementado no frontend. Sem exemplos de código — foco na descrição do comportamento esperado.

---

## Fluxo da Arquitetura

A informação percorre um ciclo unidirecional. A página da rota (App Router) renderiza um componente de feature, que pode ser server-side por padrão ou cliente quando marcado. A interação do usuário aciona um hook da feature, que valida a entrada com Zod, chama um Service da camada `lib/api`, que delega ao `ApiClient`. O `ApiClient` faz a requisição HTTP, anexa autenticação, trata erros e retorna o DTO tipado. O hook atualiza o estado local ou de contexto, e a UI re-renderiza. Páginas nunca chamam o `ApiClient` diretamente — sempre através de um Service.

---

## Página (App Router)

A página em `src/app/<grupo>/<rota>/page.tsx` é responsável apenas pela composição. Ela define metadados, monta o layout e delega o comportamento a componentes de feature. Não contém lógica de negócio, chamadas HTTP ou validação. Páginas dentro de grupos de rota como `(auth)`, `(business)`, `(client)` e `(public)` herdam o layout do grupo, incluindo guards e shells visuais. Quando precisa de interatividade, importa um componente `client` específico em vez de marcar a página inteira como cliente.

---

## Layout

Cada grupo de rota possui um `layout.tsx` que envolve as páginas filhas com o shell visual correspondente (DashboardShell para áreas autenticadas, PageShell para públicas), provê contextos necessários (AuthProvider) e aplica o AuthGuard quando a rota exige autenticação ou role específica. Layouts não acessam dados da requisição diretamente — apenas orquestram providers e estrutura.

---

## Componente de Feature

Componentes vivem em `src/features/<domínio>/components/`. Recebem dados via props e disparam ações via callbacks ou hooks da própria feature. Não conhecem rotas específicas, não fazem chamadas HTTP diretas e não acessam `localStorage`. Quando precisam de estado assíncrono, consomem um hook da feature. Componentes que dependem de APIs do browser (window, document, leaflet) são divididos em um wrapper server e um arquivo `.client.tsx` carregado via `dynamic` com `ssr: false`.

---

## Form

Forms usam React Hook Form com `zodResolver` apontando para um schema em `features/<domínio>/schemas/`. O componente extrai `register`, `handleSubmit`, `formState` e renderiza Inputs do Design System que recebem `error` diretamente do `formState.errors`. O submit chama o hook da feature (ex.: `useAuthContext().login`) que retorna um resultado tipado, e o componente trata sucesso (redirect via `useRouter`) ou erro (estado local de `serverError`). Forms não chamam Services diretamente — sempre através do hook.

---

## Hook

Hooks ficam em `features/<domínio>/hooks/` e encapsulam toda a lógica assíncrona e de estado da feature. Consomem Services da camada `lib/api`, gerenciam `loading`, `error` e dados via `useState`, e expõem uma API estável em forma de objeto. O hook é o único ponto que conhece o Service da feature — componentes nunca importam Services diretamente. Hooks de autenticação têm o `useAuth` como única fonte de verdade, exposto à árvore via `AuthContext`.

---

## Context

Contexts existem apenas para estado verdadeiramente global (autenticação, tema, sessão). Ficam em `features/<domínio>/context/`. O provider é criado com `createContext` e exposto via hook consumidor que lança erro se usado fora do provider. Contexts não substituem prop drilling em escopos pequenos — usá-los indevidamente acopla componentes a um provider que poderia ser local.

---

## Schema

Toda entrada do usuário passa por um schema Zod em `features/<domínio>/schemas/`. O schema define o formato, mensagens de erro em português e produz o tipo TypeScript via `z.infer`. Schemas são a única fonte de verdade da forma de um formulário — o tipo derivado é usado pelo React Hook Form, pelo componente e pelo mapeamento para DTO antes de enviar à API. Schemas nunca contêm lógica assíncrona; apenas validações estruturais e regras estáticas.

---

## Design System — Primitives

`design-system/primitives/` contém os blocos visuais mais baixos: Button, Input, Card, Skeleton. Cada primitive usa `class-variance-authority` em um arquivo `.variants.ts` separado para definir variantes, tamanhos e estados, e expõe o tipo `VariantProps`. O componente em si é fino: usa `forwardRef`, compõe classes via `cn()` e aplica `aria-*` quando relevante. Primitives nunca importam de `patterns/`, `layout/`, `features/` ou `app/` — a regra é garantida por ESLint.

---

## Design System — Patterns

`design-system/patterns/` agrupa composições reutilizáveis e agnósticas de domínio (EmptyState, ErrorState, ContactAction). Patterns podem consumir primitives, mas não podem importar de `features/` ou `app/`. São pensados para qualquer feature poder reaproveitar — se um pattern precisa de dado específico de domínio, ele recebe via prop, nunca via fetch interno.

---

## Design System — Layout

`design-system/layout/` contém shells de página (DashboardShell, PageShell) que organizam header, sidebar, footer e área de conteúdo. Layouts do Design System são puramente estruturais e estilísticos — não conhecem rotas específicas nem lógica de autenticação. Navegação concreta vive em `features/shared/components/layout/`, que recebe os itens de menu como prop ou consome o `AuthContext`.

---

## Estilização

Toda cor, espaçamento e tipografia usa tokens CSS em `var(--color-*)` definidos em `app/global.css`. Classes utilitárias do Tailwind são aplicadas inline e combinadas via `cn()` (clsx + tailwind-merge). Não existem cores hardcoded (`bg-blue-500`) — sempre o token semântico (`bg-[var(--color-primary)]`). Variantes complexas usam CVA em arquivo separado, nunca strings condicionais inline.

---

## Service

Cada Service em `lib/api/services/` estende `BaseService` quando segue o CRUD padrão (`getById`, `getAll`, `create`, `update`, `delete`), recebendo o `basePath`, se requer autenticação e como o ID é passado (query ou path). Quando a operação foge do CRUD, o método é adicionado diretamente na classe e chama `apiClient` com o verbo HTTP apropriado. Services são exportados como classe e como instância singleton, e expõem tipos de Request/Response correspondentes. Nenhuma lógica de UI, redirect ou armazenamento local pertence ao Service.

---

## DTO

DTOs são tipos puros em `lib/api/dtos/Request/` e `lib/api/dtos/Response/`, agrupados por domínio (`business`, `client`). Request DTOs descrevem o payload enviado ao backend; Response DTOs descrevem a resposta. Nenhum DTO contém lógica — apenas o formato dos dados. O hook ou o componente que prepara o envio é responsável por mapear o tipo do formulário (inferido do schema Zod) para o Request DTO antes de chamar o Service.

---

## ApiClient

O `ApiClient` em `lib/api/Client/ApiClient.ts` centraliza a comunicação HTTP. Mantém o Bearer token em memória, monta a URL com `baseUrl` e query params, anexa cabeçalhos padrões (Content-Type, Accept-Language), aplica timeout, tenta parsear a resposta como JSON e converte qualquer erro em `ApiClientError`, `NetworkError` ou `TimeoutError`. Quando recebe 401, dispara o callback `onUnauthorized` configurado, que tipicamente limpa o token e redireciona ao login. A instância única é exportada via `apiClientInstance.ts` e nunca é instanciada em outro lugar.

---

## Tratamento de Erros

Erros são propagados como exceptions tipadas. `ApiClientError` carrega `status`, `code` e detalhes vindos do backend; `NetworkError` indica falha de rede; `TimeoutError` indica estouro do timeout. Hooks e Services nunca engolem erros silenciosamente — propagam para quem chamou, e o componente decide entre exibir uma mensagem inline (`role="alert"`), navegar a uma página de erro ou usar o `error.tsx` do segmento de rota. A UI nunca exibe stacktrace nem mensagens cruas do backend sem tradução.

---

## Autenticação

O fluxo de autenticação é coordenado por três peças: `authService` em `lib/api/services/(Auth)/` faz login/logout e persiste o token via `LocalStorageService`; `useAuth` em `features/auth/hooks/` mantém o estado reativo do usuário; `AuthProvider` em `features/auth/context/` expõe esse estado à árvore. Rotas protegidas são envolvidas por `AuthGuard`, que lê o contexto e redireciona ao login (preservando `redirect=`) se não autenticado, ou à rota apropriada da role se autenticado mas sem permissão. Roles são lidas via `RoleHelper`, que decodifica o JWT.

---

## Server vs Client Components

Componentes são server por padrão. A diretiva `'use client'` é aplicada apenas quando o componente usa estado, efeitos, browser APIs ou contextos. Páginas que poderiam ser server permanecem server e delegam interatividade a um filho `client`. Bibliotecas que tocam `window` (leaflet, gsap) são importadas dinamicamente com `next/dynamic` e `ssr: false` em um arquivo `.client.tsx` separado.

---

## Performance

Estados de carregamento usam `loading.tsx` por segmento de rota e Skeletons do Design System em componentes específicos. Listas e dados grandes são paginados pelo backend e renderizados sob demanda. Imagens usam sempre `next/image` (regra ESLint `@next/next/no-img-element`). Componentes que dependem de bibliotecas pesadas client-only são lazy-loaded. Hooks evitam re-renders desnecessários encapsulando callbacks em `useCallback` quando entram em árvores de efeito ou contexto.

---

## Acessibilidade

Inputs sempre têm `label` associado e exibem mensagens de erro com `role="alert"`. Botões de ícone têm `aria-label`. Estados de carregamento usam `aria-busy`. Elementos decorativos recebem `aria-hidden`. O foco é visível via `focus-visible:ring-*` aplicado nas variantes do Design System. Cores nunca são o único veículo de informação — sempre acompanhadas de texto, ícone ou posição.
