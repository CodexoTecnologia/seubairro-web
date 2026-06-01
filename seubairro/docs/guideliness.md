# Guidelines — SeuBairro Web

Princípios e regras de desenvolvimento que regem todo o frontend.

---

## Princípios Fundamentais

O código deve ser legível, previsível e composável. Seguir o Single Responsibility Principle: cada arquivo tem um propósito claro. Evitar duplicação (DRY) sem cair em abstrações prematuras — três linhas repetidas são melhores que um helper que ninguém entende. Preferir composição de componentes pequenos ao invés de componentes massivos com muitas responsabilidades. Manter o fluxo de dados unidirecional: props descem, eventos sobem.

---

## Arquitetura em Camadas

O projeto segue uma arquitetura em quatro camadas principais. A regra central é que dependências só apontam para dentro — uma camada de fora pode importar de uma camada interna, mas nunca o contrário.

**app** é a camada de roteamento (Next.js App Router). Define rotas, layouts de grupo, `loading.tsx`, `error.tsx` e composição final das páginas. Não contém lógica de negócio nem chamadas HTTP — apenas orquestra features.

**features** contém a lógica de domínio dividida por subdomínio (`auth`, `business`, `client`, `marketing`, `shared`). Cada feature tem seus próprios `components/`, `hooks/`, `schemas/` e, quando aplicável, `context/`. Features podem consumir o Design System e `lib/`, mas nunca importam de `app/` nem de outra feature por caminho profundo — comunicação entre features acontece via barrel exports ou `features/shared/`.

**design-system** é a camada visual pura, organizada em `primitives/`, `patterns/` e `layout/`. Não depende de `features/` nem de `app/` — regra garantida por ESLint. A direção interna também é unidirecional: `primitives/` não importa de `patterns/` ou `layout/`.

**lib** contém utilidades transversais. `lib/api/` centraliza toda comunicação com o backend (ApiClient, Services, DTOs, enums); `lib/utils/` contém helpers genéricos como `cn()`. Nenhum código de UI pertence aqui.

---

## Convenções de Nomenclatura

Componentes e classes usam PascalCase (`LoginForm`, `ApiClient`). Hooks sempre começam com `use` em camelCase (`useAuth`, `useBusinessOpenStatus`). Schemas Zod seguem o padrão `NomeSchema` e o tipo inferido é `NomeInput` ou `NomeData`. Arquivos de schema usam o sufixo `.schema.ts`. Arquivos de variantes do Design System usam o sufixo `.variants.ts`. Arquivos exclusivamente client recebem o sufixo `.client.tsx`. Rotas e nomes de pasta em `app/` usam kebab-case e português quando voltadas ao usuário (`criar-anuncio`, `editar-profile`). Grupos de rota usam parênteses (`(auth)`, `(business)`). Variáveis e parâmetros usam camelCase.

---

## Estilo e Tokens

Cores, espaçamentos e tipografia vêm exclusivamente das variáveis CSS definidas em `app/global.css`. É proibido usar cores literais do Tailwind (`bg-blue-500`, `text-red-700`) — sempre tokens semânticos (`var(--color-primary)`, `var(--color-danger)`). Variantes complexas de um componente vivem em arquivo `.variants.ts` com `cva`, nunca como strings condicionais espalhadas pelo JSX. Composição de classes usa o helper `cn()` para resolver conflitos do Tailwind via `tailwind-merge`.

---

## Segurança

Nunca confiar em dados do cliente — toda entrada passa por schema Zod antes de virar payload. Token de autenticação fica em `localStorage` via `LocalStorageService` e em memória no `ApiClient`, nunca em variável global. Rotas autenticadas são envolvidas pelo `AuthGuard`, que valida sessão e role. Nunca renderizar HTML vindo do backend sem sanitização. Não logar payloads sensíveis no console em produção (`console.error` é aceito apenas para diagnóstico de erros já tratados).

---

## Padrões de API

Toda comunicação HTTP passa por um Service em `lib/api/services/`, que por sua vez chama o `apiClient` único. Componentes nunca usam `fetch` diretamente. DTOs são tipados explicitamente em `Request/` e `Response/`. Quando o backend evolui um contrato, o DTO correspondente é atualizado e os Services que dependem dele são ajustados na mesma mudança. Status HTTP do backend são respeitados: 401 dispara logout e redirect ao login; 4xx é exibido ao usuário com mensagem traduzida; 5xx leva à página de erro do segmento.

---

## Forms

Forms usam React Hook Form para gestão de estado e Zod para validação, via `zodResolver`. O schema é a fonte de verdade — o tipo do form vem de `z.infer`, nunca declarado manualmente. Mensagens de erro são em português e ficam no próprio schema. Submissão chama um hook de feature que retorna resultado tipado; o form é responsável apenas por exibir loading (`isSubmitting`), erros inline e mensagens de servidor.

---

## Server vs Client

Componentes são server por padrão. `'use client'` é uma escolha explícita, justificada por uso de estado, efeitos, contextos ou APIs do navegador. Páginas são server sempre que possível e delegam interatividade a componentes filhos client. Bibliotecas que tocam `window` ou `document` são carregadas via `next/dynamic` com `ssr: false` em arquivos `.client.tsx`.

---

## Acessibilidade

Acessibilidade não é opcional. Inputs sempre têm `label`. Botões de ícone têm `aria-label`. Estados de carregamento usam `aria-busy`. Mensagens de erro usam `role="alert"`. Elementos decorativos recebem `aria-hidden`. O foco é sempre visível via `focus-visible:ring-*`. Cores nunca são o único veículo de informação — sempre acompanhadas de ícone, texto ou posição.

---

## Imagens e Assets

Toda imagem usa `next/image` (regra ESLint ativa). Logos e ícones vetoriais ficam em `public/assets/`. Ícones de interface vêm do `remixicon` via classe (`ri-mail-line`). SVGs inline são reservados para casos onde o controle de estilo via CSS é necessário.

---

## Testes e Verificação Manual

Mudanças visuais e de interação são verificadas no `ladle serve` quando o componente tem story, e no `next dev` para fluxos completos. Type checking (`tsc --noEmit`) e lint (`eslint`) são exigidos antes de abrir PR. Testes automatizados serão introduzidos quando os fluxos críticos estabilizarem, priorizando schemas Zod e hooks de feature.

---

## Commits

Usar Conventional Commits obrigatoriamente. Os prefixos válidos são `feat` para nova funcionalidade, `fix` para correção de bug, `refactor` para melhoria de código existente, `style` para ajustes puramente visuais ou de formatação, `docs` para documentação, `chore` para ajustes menores sem impacto em regras, e `test` para adição ou correção de testes. Mensagens em português, no imperativo, descrevendo o porquê quando não for óbvio.

---

## O que NÃO fazer

Não chamar `fetch` ou `apiClient` diretamente de dentro de um componente — sempre via Service consumido por hook. Não importar Services dentro do Design System. Não usar cores literais do Tailwind. Não marcar a página inteira com `'use client'` quando só um filho precisa de interatividade. Não criar contexts para estado local que poderia ser passado por prop. Não duplicar tipos que já vêm inferidos de um schema Zod. Não silenciar erros com try/catch vazio. Não usar `<img>` — sempre `next/image`. Não importar de caminhos profundos de outra feature (`features/business/hooks/...`) — usar o barrel `features/business`.
