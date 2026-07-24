# Refinamento Técnico — Planos e Monetização (Business e Client) com Gating de Recursos por Workspace

Status: planejado (engatilhado — aguardando decisões de produto e contrato de backend para execução)
Branch de referência: feature/finalizadno-client
Data: 2026-07-12

---

## 1. Análise da Demanda

### 1.1 Objetivo

Introduzir planos pagos nos dois workspaces (cliente e business) em quatro níveis — Gratuito, Básico, Intermediário e Avançado — travando recursos por plano, com uma escada de valor desenhada para que o upgrade seja a decisão natural quando o usuário cresce dentro da plataforma. Este documento planeja tudo (estratégia de tiers, arquitetura de gating, contratos com o backend, fases de execução) para permitir escolher a melhor opção antes de codar.

### 1.2 Estado atual do código

- A BusinessSidebar (`src/features/business/components/BusinessSidebar/BusinessSidebar.tsx`) já exibe um card "Plano Premium / Gerenciar Plano" — é um placeholder com botão morto. É o ponto de ancoragem natural do plano do business.
- Não existe nenhum conceito de assinatura, plano ou entitlement em `src/lib/api` (nenhum service, DTO ou enum). Zero billing.
- Os workspaces são independentes por role com troca livre para multi-role (ver docs/refinement-workspaces.md) — o modelo de planos precisa respeitar essa independência: o plano é do perfil (workspace), não da conta.
- Recursos hoje existentes que são candidatos a alavanca de valor: anúncios (criar/listar), pedidos, chat, perfil público com slug, horários/aberto-agora, nichos, busca por proximidade com filtros (raio, aberto agora, nichos), avaliações (ListingReviewService), perguntas (ListingQuestionService), mapa de anúncios.

### 1.3 Princípios de produto (fundamentam a matriz)

1. Nunca travar a liquidez do marketplace. Recursos que fazem o marketplace funcionar para os dois lados ficam gratuitos para sempre: aparecer na busca, receber/fazer pedidos, chat, receber e responder avaliações, horários/aberto-agora. Travar isso derrubaria a experiência do cliente e o valor de todos os planos.
2. As alavancas pagas do business são três eixos: inventário (quantos anúncios/fotos), visibilidade (destaque, ranking, vitrine) e inteligência (analytics, termos de busca, exportação). Cada tier sobe um degrau em cada eixo.
3. O lado cliente monetiza por conveniência e benefícios (clube), nunca por acesso — cliente pagando para poder buscar mata a aquisição. Recomendação estratégica: lançar planos business primeiro; clube do cliente em fase posterior.
4. Paywall contextual: a oferta de upgrade aparece no momento da dor (atingiu o limite de anúncios, clicou em analytics bloqueado), não em tela genérica.
5. O front trava por UX; o backend é a autoridade. Toda trava do front tem enforcement correspondente na API (403/402 com código de erro de plano).

### 1.4 Perfis, domínios e workspaces

- Assinatura por workspace: um usuário multi-role pode ter Business Intermediário e Cliente Gratuito ao mesmo tempo. O workspace ativo (route group) define qual assinatura e quais entitlements se aplicam.
- Domínios impactados: business, client, shared (gating), marketing (página pública de preços), lib/api (nova área de billing).
- Perfis: público (vê /planos), cliente autenticado, negócio autenticado.

### 1.5 Riscos

- Estratégico: travar recurso errado no Gratuito mata a rede (ver princípio 1). A matriz abaixo já protege isso.
- Contratual: billing exige backend novo (catálogo, assinatura, checkout, webhooks de pagamento). O front pode ser todo construído antes, atrás de flag, com fonte de entitlements mockada — é isso que deixa o projeto "engatilhado".
- Técnico: gating espalhado vira dívida; a arquitetura centraliza tudo num mapa único de features + um hook + um componente de gate.
- UX: usuário rebaixado de plano (downgrade/cancelamento) com uso acima do novo limite (ex.: 30 anúncios ativos no plano de 10) — política necessária: anúncios excedentes ficam pausados, nunca deletados.

---

## 2. Estratégia de Planos

### 2.1 Nomenclatura

Canônica no código: enum `PlanTier` = `Free | Basic | Intermediate | Advanced`. Sugestão de nomes de marketing (decisão de produto em aberto):

- Business: Presença (Gratuito), Vitrine (Básico), Crescimento (Intermediário), Domínio (Avançado).
- Cliente: Vizinho (Gratuito), Vizinho+ (Básico), Clube (Intermediário), Clube Total (Avançado).

### 2.2 Matriz Business (eixos: inventário, visibilidade, inteligência)

Preços sugeridos como âncora inicial (hipótese a validar): R$ 0 / R$ 19,90 / R$ 49,90 / R$ 99,90 por mês.

| Recurso | Gratuito | Básico | Intermediário | Avançado |
|---|---|---|---|---|
| Perfil público (slug, mapa, horários, aberto-agora) | Sim | Sim | Sim | Sim |
| Pedidos + chat com clientes | Sim | Sim | Sim | Sim |
| Receber e responder avaliações | Sim | Sim | Sim | Sim |
| Aparecer na busca por proximidade | Sim | Sim | Sim | Sim |
| Anúncios ativos | 3 | 10 | 30 | Ilimitado |
| Fotos por anúncio | 1 | 4 | 8 | 12 |
| Analytics (visitas ao perfil, cliques em anúncios) | — | Essencial (30 dias) | Completo (90 dias + termos de busca) | Completo + exportação CSV |
| Promoções/cupons ativos | — | 1 | 5 | Ilimitado |
| Selo "Destaque" + prioridade no ranking da busca | — | — | Sim | Sim |
| Topo da categoria (rotativo entre Avançados do raio) | — | — | — | Sim |
| Vitrine na home do bairro | — | — | — | Sim |
| Unidades (endereços) por negócio | 1 | 1 | 2 | 5 |
| Suporte | Comunidade | E-mail | Prioritário | Prioritário |

Lógica da escada (por que o upgrade faz sentido):

- Gratuito → Básico: o negócio provou valor (recebeu pedidos) e esbarrou no teto de 3 anúncios ou na foto única. O Básico remove o atrito de inventário e dá o primeiro analytics ("quantas pessoas me viram?") — a pergunta que todo lojista faz no primeiro mês.
- Básico → Intermediário: o negócio quer crescer, não só existir. Compra visibilidade (selo Destaque + boost de ranking = mais olhos) e inteligência (o que buscaram para me achar) + 5 promoções para converter. É o tier de quem trata o SeuBairro como canal de vendas.
- Intermediário → Avançado: o negócio quer dominar a região ou tem mais de uma unidade. Topo da categoria, vitrine na home e multi-unidades são recursos de escala — só fazem sentido (e só custam caro) para quem já validou o retorno nos tiers anteriores.
- Gatilhos contextuais de upgrade: (a) tentar criar o 4º/11º/31º anúncio; (b) clicar no card de analytics bloqueado no dashboard; (c) tentar criar cupom além do limite; (d) banner de uso "X de Y anúncios" no listar-anuncio a partir de 80% do limite.

### 2.3 Matriz Cliente (eixo: conveniência e benefícios — nunca acesso)

Preços sugeridos: R$ 0 / R$ 4,90 / R$ 9,90 / R$ 14,90 por mês. Recomendação estratégica: lançar somente na Fase 3, depois do business provar receita; a descoberta permanece 100% gratuita em todos os cenários.

| Recurso | Gratuito | Básico | Intermediário | Avançado |
|---|---|---|---|---|
| Busca, filtros (raio, aberto agora, nichos), mapa | Sim | Sim | Sim | Sim |
| Pedidos, chat, avaliações, perguntas | Sim | Sim | Sim | Sim |
| Favoritos | 20 | Ilimitado | Ilimitado | Ilimitado |
| Alertas (novo anúncio de favorito, promoção no raio) | — | Sim | Sim | Sim |
| Cupons exclusivos do clube | — | — | Sim | Sim |
| Acesso antecipado a promoções | — | — | Sim | Sim |
| Sorteios e eventos do bairro | — | — | — | Sim |
| Selo "Apoiador do bairro" no perfil | — | — | — | Sim |

Lógica: Básico compra conveniência (não perder oportunidade — alertas), Intermediário compra vantagem econômica (cupons pagam a mensalidade), Avançado compra pertencimento (clube completo + selo). Nota: favoritos e alertas ainda não existem no produto — o plano do cliente depende desses recursos serem construídos; mais um motivo para faseá-lo depois.

### 2.4 Relação com os workspaces

- A assinatura pertence ao perfil: `Subscription { workspace: 'client' | 'business', tier, status }`. Duas assinaturas independentes para multi-role.
- O workspace ativo (route group) define qual assinatura o front resolve — mesmo mecanismo já usado para tema e navegação (data-context/route group).
- Superfícies por workspace: PlanBadge no rodapé da sidebar de cada workspace (substituindo o placeholder "Plano Premium" do business e o bloco de localização ganha um irmão no client); item "Meu plano" no menu do usuário do navbar; gestão em /plano (business) e aba "Meu Plano" no /perfil (client).
- A troca de workspace nunca é travada por plano — plano trava recursos dentro do workspace, jamais o acesso ao workspace em si (a independência definida no refinamento de workspaces permanece intocada).

---

## 3. Arquitetura de Gating (frontend)

### 3.1 lib/api (contratos)

- `enums/PlanTierEnum.ts`: `Free | Basic | Intermediate | Advanced` (+ ordem numérica para comparação de tier).
- `dtos/Response/plans/PlanResponse.ts`: catálogo — id, tier, audience ('client' | 'business'), nome, preço, lista de features/limites.
- `dtos/Response/plans/SubscriptionResponse.ts`: assinatura corrente — planId, tier, workspace, status ('active' | 'past_due' | 'canceled'), renewsAt, usage (ex.: activeListings), limits (ex.: maxListings, maxPhotos, maxCoupons).
- `dtos/Request/plans/CheckoutRequest.ts`: planId + workspace → retorna URL de checkout do gateway.
- `services/PlanService.ts` e `services/SubscriptionService.ts` estendendo BaseService (singleton por módulo): GET /api/plans, GET /api/subscriptions/me?workspace=, POST /api/subscriptions/checkout, POST /api/subscriptions/cancel.
- ApiClient: tratar códigos de erro de plano vindos do backend — `PLAN_LIMIT_REACHED` e `PLAN_FEATURE_REQUIRED` (HTTP 403/402) — expostos via ApiClientError.code para a UI disparar o UpgradeModal contextual em vez de erro genérico.

### 3.2 Nova feature `plans` (src/features/plans)

- `config/features.ts` — o coração do gating, mapa único e tipado:
  `FEATURES: Record<FeatureKey, { workspace: Workspace; minTier: PlanTier; limitByTier?: Record<PlanTier, number> }>`
  FeatureKeys business: `listings.active`, `listings.photos`, `analytics.essential`, `analytics.full`, `analytics.export`, `coupons.active`, `search.boost`, `search.top`, `home.showcase`, `business.units`. FeatureKeys client: `favorites.max`, `alerts`, `club.coupons`, `club.early-access`.
- `hooks/useSubscription.ts` — assinatura do workspace ativo (fonte: SubscriptionService; fallback: tier Free). Cache em contexto (`context/SubscriptionContext.tsx`) montado nos dois layouts autenticados.
- `hooks/useEntitlement.ts` — `useEntitlement(key)` → `{ allowed, limit, usage, requiredTier }` comparando tier da assinatura com o mapa FEATURES.
- `components/PlanGate` — wrapper declarativo: `<PlanGate feature="analytics.full" fallback={<UpgradeCard/>}>{children}</PlanGate>`.
- `components/UpgradePrompt` — card/modal contextual (usa Modal do DS) com o benefício específico + CTA para /plano; variante inline (banner de uso "8 de 10 anúncios").
- `components/PlanBadge` — chip do tier atual (sidebar/menu).
- `components/PricingTable` — tabela comparativa para /planos e /plano, com toggle Vizinho/Empreendedor.

Modo engatilhado (Fase 0): `useSubscription` lê a fonte por flag — `NEXT_PUBLIC_PLANS_ENABLED=false` faz o hook devolver tier máximo (nada travado, comportamento atual intacto) e os PlanGates viram no-ops. Ligar o gating = trocar a flag + backend responder /subscriptions/me. Isso permite mergear as travas progressivamente sem efeito visível.

### 3.3 Pontos de trava no código atual (onde o PlanGate entra)

- `src/app/(business)/criar-anuncio/page.tsx`: cap de anúncios ativos (`listings.active`) — atingiu o limite, formulário dá lugar ao UpgradePrompt; upload de fotos respeita `listings.photos`.
- `src/app/(business)/listar-anuncio/page.tsx`: banner de uso (X de Y anúncios) a partir de 80% do limite.
- `src/app/(business)/dashboard-business/page.tsx`: card de analytics — Gratuito vê o card bloqueado com blur + UpgradePrompt (o recurso fantasma é o melhor vendedor).
- `src/features/business/components/BusinessSidebar/BusinessSidebar.tsx`: o card placeholder "Plano Premium" vira PlanBadge real + link para /plano.
- Cliente (Fase 3): favoritos/alertas nos componentes de feed e detalhes quando existirem.
- Navbar (menu do usuário): item "Meu plano" com PlanBadge do workspace ativo.

### 3.4 Rotas (src/app)

- `(public)/planos/page.tsx` — pricing público, Server Component, SEO (metadata + entrada no sitemap), toggle Vizinho/Empreendedor, CTA → cadastro com perfil pré-selecionado (deep-link já existente `?perfil=`).
- `(business)/plano/page.tsx` — gestão da assinatura business: plano atual, uso vs limites, comparativo, upgrade (checkout), cancelamento. AuthGuard já herdado do layout.
- `(client)/perfil` — nova aba "Meu Plano" na página existente (padrão de tabs já presente).
- `plano/retorno` — rota de retorno do checkout (sucesso/pendência/falha) com estados acessíveis (role=status/alert).

### 3.5 Design System

- Pattern `PricingCard` (novo): card de plano com variantes CVA em `.variants.ts` (tier, recommended com destaque visual), lista de features com check, preço, CTA. História Ladle com os quatro tiers.
- Primitive `Badge` (novo, pequeno): chip de status reutilizável (hoje há chips inline repetidos em sidebar/roadmap/cards — o PlanBadge o consome). História Ladle.
- Tokens: nenhum novo obrigatório; destaque do plano recomendado usa --color-primary + shadow-primary existentes.

### 3.6 Estados, acessibilidade e UX

- Sem assinatura/erro ao carregar: front assume Free (fail-open na UI; o backend nega de fato — fail-closed no servidor).
- Downgrade com uso excedente: excedentes pausados, nunca deletados; banner explicativo no listar-anuncio.
- UpgradePrompt com role="dialog" via Modal do DS; banners com aria-live="polite"; blur de analytics acompanhado de texto real (não só visual).
- Loading: skeletons já padronizados (ShellSkeleton/ListingCardSkeleton) cobrem as novas telas.

---

## 4. Dependências com o Backend (contrato esperado)

| Endpoint | Método | Auth | Uso |
|---|---|---|---|
| /api/plans?audience= | GET | Não | Catálogo para /planos e comparativos |
| /api/subscriptions/me?workspace= | GET | Sim | Assinatura + usage/limits do workspace |
| /api/subscriptions/checkout | POST | Sim | Cria sessão no gateway, retorna URL |
| /api/subscriptions/cancel | POST | Sim | Cancelamento (fim do ciclo) |

- Enforcement server-side obrigatório: criação de anúncio/cupom acima do limite responde 403/402 com `code: PLAN_LIMIT_REACHED`; recursos de tier superior respondem `PLAN_FEATURE_REQUIRED`. O front só embeleza.
- Gateway de pagamento (Stripe/Mercado Pago/etc.), webhooks e ciclo de cobrança são inteiramente backend — o front consome a URL de checkout e a rota de retorno.
- Ranking/boost de busca (Intermediário+) é regra do backend/busca; o front exibe o selo.
- Analytics exige eventos e agregação no backend; o front consome DTOs prontos.

---

## 5. Fases de Execução (o gatilho)

- Fase 0 — Engatilhar (sem backend, sem cobrança, zero risco): enums + config FEATURES + useSubscription/useEntitlement com flag desligada + PlanGate/PlanBadge/UpgradePrompt + Badge/PricingCard no DS + página /planos pública (catálogo estático) + travas plugadas nos pontos 3.3 como no-ops. Mergeável a qualquer momento.
- Fase 1 — Business pago: backend de catálogo/assinatura/checkout pronto → ligar flag, /plano business, tratamento PLAN_* no ApiClient, banners de uso. Primeira receita.
- Fase 2 — Recursos premium de fato: analytics, cupons, destaque/topo, vitrine, multi-unidades (cada um é um épico próprio, front+back).
- Fase 3 — Clube do cliente: favoritos ilimitados, alertas, cupons do clube (depende de favoritos/notificações existirem).

## 6. Estimativa de Esforço (dev Pleno, horas)

| Fase | Task | Horas |
|---|---|---|
| 0 | Enums + config FEATURES + tipos | 2,0 |
| 0 | useSubscription + SubscriptionContext + useEntitlement (flag) | 6,0 |
| 0 | PlanGate + UpgradePrompt + PlanBadge | 6,0 |
| 0 | DS: Badge primitive + PricingCard pattern + Ladle | 6,0 |
| 0 | Página pública /planos (+ sitemap/metadata) | 4,0 |
| 0 | Travas nos pontos 3.3 (no-op atrás da flag) | 5,0 |
| 0 | QA fase 0 | 3,0 |
| | Subtotal Fase 0 | 32,0 |
| 1 | Services + DTOs + erros PLAN_* no ApiClient | 6,0 |
| 1 | /plano business (gestão, uso, upgrade) | 8,0 |
| 1 | Aba "Meu Plano" no perfil do cliente | 4,0 |
| 1 | Checkout (redirect + rota de retorno) | 4,0 |
| 1 | QA fase 1 (3 perfis × tiers) | 4,0 |
| | Subtotal Fase 1 | 26,0 |
| | Total F0+F1 base | 58,0 |
| | Margem 20% | 11,6 |
| | Total F0+F1 | 69,6 |

Fase 2 e 3 estimadas por épico quando priorizadas (ordem de grandeza: analytics 16h, cupons 16h, selo/destaque 6h front, alertas cliente 12h, favoritos 10h — todos + backend).

## 7. Definição de Pronto (por fase)

Fase 0: lint/tsc/build passando; flag desligada = produto idêntico ao atual (zero regressão); Ladle com Badge, PricingCard e PlanGate; /planos pública no ar com a matriz; travas revisadas em code review como no-ops.
Fase 1: fluxo completo upgrade/downgrade/cancelamento validado com backend de teste; erros PLAN_* disparando UpgradePrompt contextual; usuário Free atinge cap e consegue fazer upgrade sem sair do fluxo; multi-role vê planos independentes por workspace; sem fetch direto em componente; DTOs tipados.

## 8. Decisões em aberto (bloqueiam o gatilho, não o scaffold)

1. Preços finais e nomes de marketing dos tiers (âncoras sugeridas em 2.2/2.3).
2. Estratégia do lado cliente: lançar clube na Fase 3 (recomendado) ou junto com o business.
3. Gateway de pagamento (define a UX do checkout: redirect vs embedded).
4. Política de downgrade (recomendada: excedentes pausados).
5. Valores exatos dos limites por tier (3/10/30/∞ anúncios é hipótese inicial — validar com os comércios do piloto de Colombo).
6. Confirmar com o backend a viabilidade do ranking/boost e dos contadores de uso no MVP.
