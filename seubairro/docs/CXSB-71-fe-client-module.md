# CXSB-71 [FE] — Módulo Cliente — Tasks

Cada bloco abaixo corresponde a uma task filha de CXSB-71. O título vai no campo Title do card e o conteúdo vai no campo Description (user history). Critérios de aceitação e estimativas ficam em seus próprios campos do Jira.

> **Atenção:** este arquivo foi atualizado conforme `contract-reconciliation-customer.md`. As seções marcadas com `[AJUSTADO]` refletem decisões do contrato BE×FE.

---

## Onda A — Perfil do Cliente (RN01)

---

### [FE] Criar primitive Avatar no Design System

**1. Contexto e Objetivo**

O Módulo Cliente vai expor a foto de perfil do usuário em pontos diversos da aplicação (cabeçalho da página de perfil, futuras listagens com identidade do usuário, contextos sociais). Hoje o projeto não tem um componente de avatar padronizado — a tela de perfil em `src/app/(client)/perfil/page.tsx` renderiza uma `<div>` ad-hoc com a inicial do nome usando classes diretas. Isso impede que outras features reutilizem o componente e quebra a consistência visual quando novas telas precisarem do mesmo elemento.

Esta task entrega o primitive base do Design System que servirá tanto à edição do próprio perfil quanto a qualquer composição que precise de avatar (cards de comentário, headers personalizados, etc.).

**2. O que precisa ser feito**

Criar o primitive `Avatar` na camada mais baixa do Design System, em `src/design-system/primitives/Avatar/`, com a estrutura padrão do projeto (`Avatar.tsx`, `Avatar.variants.ts`, `Avatar.stories.tsx`, `index.ts`).

Props esperadas: `src?: string`, `alt: string` (obrigatório por acessibilidade), `fallback: string` (iniciais quando não há imagem), `size: 'sm' | 'md' | 'lg' | 'xl'`.

Quando `src` estiver presente, renderizar via `next/image` (proibido `<img>` por regra ESLint do projeto). Quando `src` ausente ou falhar, renderizar fallback em formato circular com tokens `var(--color-primary)` (fundo) e `var(--color-on-primary)` (texto), legível em todos os tamanhos.

Variantes de tamanho via `class-variance-authority` em arquivo separado, expondo `VariantProps`. O componente em si é fino: usa `forwardRef`, compõe classes via `cn()` e aplica `aria-*` quando relevante.

O primitive não pode importar de `patterns/`, `layout/`, `features/` ou `app/`. Regra garantida por ESLint — se o lint reclamar, o desenho está errado.

História Ladle cobrindo: todas as variantes de size, estado com `src` válido, estado com `src` quebrado (fallback automático), estado só com fallback.

---

### [FE] Criar DTOs de Customer (Request e Response) `[AJUSTADO]`

**1. Contexto e Objetivo**

A camada de comunicação com a API exige tipos puros para Request e Response em `src/lib/api/dtos`. Sem eles, o `CustomerProfileService` não tem como tipar suas chamadas e o hook `useCustomerProfile` não consegue inferir o formato do retorno. Esta task é pré-requisito de toda a Onda A.

**2. O que precisa ser feito**

Criar `src/lib/api/dtos/Request/client/UpdateCustomerRequest.ts` com:

```typescript
{
  firstName?: string;          // min 2, max 60
  lastName?: string;           // min 2, max 60
  birthDate?: string;          // ISO date, não futura
  taxId?: string;
  phoneCountryCode?: string;   // ^\d{1,3}$ — só dígitos, ex.: "55"
  phoneNumber?: string;        // ^\d{8,15}$ — só dígitos, sem máscara
  primaryAddressId?: string;   // Guid
}
```

Todos opcionais — o backend aceita atualização parcial (PATCH semântico). **Não usar `name` unificado nem `whatsappPhone`**: o backend mantém `FirstName`, `LastName`, `PhoneCountryCode` e `PhoneNumber` como campos separados.

Criar `src/lib/api/dtos/Response/client/CustomerProfileResponse.ts` com:

```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  taxId: string;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  profilePictureUrl: string | null;   // campo exposto pelo BE (não avatarUrl)
  primaryAddress: {
    id: string;
    city: string;
    neighborhood: string;
    latitude: number;                  // precisão real — dado privado do cliente
    longitude: number;
  } | null;
}
```

Adicionar exports em `src/lib/api/dtos/Request/index/index.ts` e `src/lib/api/dtos/Response/index/index.ts`. Tipos puros — sem lógica, sem default values, sem helpers.

---

### [FE] Criar CustomerProfileService `[AJUSTADO]`

**1. Contexto e Objetivo**

A camada `lib/api/services` é a única que pode falar com o `ApiClient`. Para que o módulo Cliente edite perfil, o frontend precisa de um Service dedicado que centralize o acesso ao perfil e ao avatar. Sem ele, hooks teriam que chamar o ApiClient diretamente — proibido pela arquitetura.

**2. O que precisa ser feito**

Criar `src/lib/api/services/CustomerProfileService.ts`, estendendo `BaseService`.

Métodos:

- `getMe(): Promise<CustomerProfileResponse>` — chama `GET /api/user/profile`, autenticado.
- `updateMe(payload: UpdateCustomerRequest): Promise<CustomerProfileResponse>` — chama `PATCH /api/user/profile`, autenticado, retornando o DTO atualizado.
- `uploadAvatar(file: File): Promise<{ profilePictureUrl: string }>` — chama `PATCH /api/user/avatar` via `multipart/form-data` com campo `image: File`, autenticado. O verbo é **PATCH** (não POST) — é substituição de recurso existente.
- `deleteAvatar(): Promise<void>` — chama `DELETE /api/user/avatar`, autenticado.

Exportar como classe e como instância singleton (padrão do projeto — ver `AuthInstance.ts` e `CategoryService.ts`). Adicionar export em `src/lib/api/services/index.ts`.

Erros são propagados como exceptions tipadas (`ApiClientError`, `NetworkError`, `TimeoutError`). O Service nunca trata redirect, UI ou storage local.

---

### [FE] Criar schemas Zod de perfil e avatar `[AJUSTADO]`

**1. Contexto e Objetivo**

Toda entrada de usuário no projeto passa por um schema Zod em `features/<domínio>/schemas/`. O telefone precisa de validação cuidadosa porque será usado para gerar o deep-link `wa.me` — telefone inválido aqui quebra a comunicação na Onda E.

**2. O que precisa ser feito**

Criar `src/features/client/schemas/customer-profile.schema.ts` validando:

- `firstName` como string com mínimo 2 e máximo 60 caracteres (mensagem: "Nome deve ter entre 2 e 60 caracteres");
- `lastName` como string com mínimo 2 e máximo 60 caracteres (mensagem: "Sobrenome deve ter entre 2 e 60 caracteres");
- `phoneCountryCode` como string opcional com regex `^\d{1,3}$` (mensagem: "Código do país inválido — use apenas dígitos, ex.: 55");
- `phoneNumber` como string opcional com regex `^\d{8,15}$` (mensagem: "Número de telefone inválido — use apenas dígitos, sem máscara").

**Não usar regex `^\+55\d{10,11}$`** — o backend armazena dígitos puros sem `+`. A máscara visual `+XX (XX) XXXXX-XXXX` existe apenas como apresentação no Input; o valor real enviado ao backend é somente dígitos. Todos os campos são opcionais no schema base (PATCH parcial); o form define `defaultValues` com os dados atuais do perfil.

Exportar tipo via `z.infer<typeof customerProfileSchema>`.

Criar `src/features/client/schemas/customer-avatar.schema.ts` validando instância de `File` com `size <= 5 * 1024 * 1024` (5 MB) e `type` ∈ `['image/jpeg', 'image/png', 'image/webp']`. Mensagens em português ("Tamanho máximo de 5 MB", "Formato não suportado — use JPG, PNG ou WebP"). Exportar tipo inferido.

Os schemas não contêm lógica assíncrona — apenas validações estruturais.

---

### [FE] Criar hook useCustomerProfile `[AJUSTADO]`

**1. Contexto e Objetivo**

Hooks de feature são o único ponto da aplicação que pode importar Services da camada `lib/api`. Componentes consomem hooks; hooks consomem Services.

A página de perfil hoje (`src/app/(client)/perfil/page.tsx`) declara estados (`useState`) e chama Services direto no componente. Isso vai ser removido — esta task entrega o substituto para a parte de perfil.

**2. O que precisa ser feito**

Criar `src/features/client/hooks/useCustomerProfile.ts`.

No mount, dispara `customerProfileService.getMe()` com `let cancelled = false` no `useEffect`. Expõe estado `{ profile: CustomerProfileResponse | null; isLoading: boolean; error: Error | null }` e ações `updateProfile(values: CustomerProfileFormValues)` e `uploadAvatar(file: File)`.

`updateProfile` mapeia `CustomerProfileFormValues` para `UpdateCustomerRequest` antes de chamar o Service. O mapping inclui: `firstName`, `lastName`, `phoneCountryCode`, `phoneNumber` — todos como strings de dígitos puros, sem `+`.

`uploadAvatar` chama `uploadAvatar` do Service e atualiza `profile.profilePictureUrl` no estado local com o valor retornado.

Erros do Service são propagados via `error` no estado e/ou `throw` controlado para que o componente decida onde exibir.

---

### [FE] Criar hook useCustomerAddress `[AJUSTADO]`

**1. Contexto e Objetivo**

O endereço padrão do cliente é um sub-domínio próprio com seu próprio Service (`AddressService`) e fluxo de criação vs atualização. Além disso, a alteração do endereço tem efeito colateral no `LocationContext` — quando o backend devolver Lat/Long geocodificados, o contexto precisa refletir o novo ponto.

**2. O que precisa ser feito**

Criar `src/features/client/hooks/useCustomerAddress.ts`.

No mount, obtém o endereço primário via `customerProfileService.getMe().primaryAddress`. Armazena como `address: PrimaryAddressResponse | null`. Expõe `{ address, isLoading, error, save(values) }`.

`save` segue o fluxo correto conforme o contrato do backend:

1. Se `address === null` (primeiro endereço): `POST /api/address` — o backend já marca como `IsPrimary=true` automaticamente no construtor.
2. Se `address !== null` e o usuário está editando dados: `PUT /api/address/{id}` — atualiza os dados; endereço permanece primário.
3. Para troca de qual endereço é o primário (futuro, múltiplos endereços): `PATCH /api/user/primary-address/{addressId}` — endpoint dedicado e separado da atualização de dados.

**Atenção:** `PATCH /api/user/primary-address/{addressId}` é exclusivo para promoção de primário — não é chamado implicitamente no `save`. O `LocationContext` não deve chamar PATCH a cada toggle de fonte de localização; em vez disso, deve usar as coords já presentes no `profile.primaryAddress` obtido via `GET /api/user/profile`.

Após `save` bem-sucedido, se o response contiver `latitude` e `longitude` não nulos, chama `useLocationContext().useProfileAddress({ lat, lng })`.

Mapeia o tipo do form para `CreateAddressRequest` / `UpdateAddressRequest`, anexando `countryCode: CountryCodeEnum.Brasil`.

---

### [FE] Criar componente CustomerProfileForm `[AJUSTADO]`

**1. Contexto e Objetivo**

A página atual de perfil tem inputs desabilitados com a observação "A edição ainda não está disponível pela API". A RN01 derruba essa limitação: o cliente deve poder editar nome, foto e telefone. Esta task entrega o formulário responsável por essas informações.

**2. O que precisa ser feito**

Criar `src/features/client/components/CustomerProfileForm/CustomerProfileForm.tsx` como Client Component (`'use client'`).

Usar `useForm` com `zodResolver(customerProfileSchema)` e `defaultValues` vindos de `useCustomerProfile().profile`.

Campos:

- **Nome** (`firstName`): Input do Design System com label "Nome".
- **Sobrenome** (`lastName`): Input do Design System com label "Sobrenome". Dois inputs separados — não unificar em um único "Nome completo" nem fazer split client-side.
- **Telefone WhatsApp**: dois inputs adjacentes — `phoneCountryCode` (label "DDI", ex.: "55") e `phoneNumber` (label "Número"). A máscara visual pode mostrar `+XX (XX) XXXXX-XXXX` para orientação, mas o valor armazenado em cada campo é somente dígitos sem `+`.
- **Avatar**: primitive `Avatar` renderizando `profile.profilePictureUrl` ou fallback com iniciais `{firstName[0]}{lastName[0]}`. Botão "Alterar foto" abre seletor de arquivo e gera preview via `URL.createObjectURL(file)`, disparando `uploadAvatar(file)` imediatamente (upload independente do submit do form).

Sidebar do perfil exibe `{profile.firstName} {profile.lastName}` como nome completo.

Erros: cada `Input` recebe `error={formState.errors.<campo>?.message}` direto. Loading inline no botão de submit. Mensagem de servidor após `updateProfile`: sucesso com `role="status"` e `aria-live="polite"`; erro com `role="alert"`. O componente não redireciona.

---

### [FE] Criar componente CustomerAddressForm `[PENDÊNCIA DE CONTRATO]`

**1. Contexto e Objetivo**

A edição de endereço hoje vive inline em `src/app/(client)/perfil/page.tsx` na sub-função `LocationTab`, com estado próprio e chamadas diretas a `AddressService`. A RN01 mantém a funcionalidade, mas exige que o endereço gere a coordenada de busca do cliente — o que torna a operação parte de um fluxo maior e justifica isolar o formulário em um componente dedicado.

Além disso, o formulário inline atual não usa Zod nem React Hook Form, divergindo do padrão obrigatório do projeto.

**2. O que precisa ser feito**

Criar `src/features/client/components/CustomerAddressForm/CustomerAddressForm.tsx` como Client Component.

Usar `useForm` com `zodResolver(customerAddressSchema)`. Campos (todos `Input` do Design System): CEP (8 dígitos com validação), Cidade, Estado/UF (2 letras maiúsculas), Rua, Número (opcional), Bairro.

Pré-popular via `useCustomerAddress().address` quando existir. Submit chama `useCustomerAddress().save(values)`. O hook decide entre create e update. Botão muda label entre "Cadastrar Endereço" e "Atualizar Endereço" conforme `address` existir ou não.

**[PENDÊNCIA DE CONTRATO]** O único shape de leitura de endereço definido no contrato é `CustomerProfileResponse.primaryAddress` = `{ id, city, neighborhood, latitude, longitude }` (item 14 da reconciliação). Ele **não** carrega `cep`, `rua`, `número` nem `uf`, então a edição não tem como pré-popular esses campos. Para o caso de **edição** do endereço existente é preciso uma decisão do BE: expor um `GET /api/address/{id}` completo ou ampliar o `primaryAddress`. Levantado como comentário FE na reconciliação (ver §17 de `contract-reconciliation-customer.md`). Enquanto não houver definição, a edição pré-popula apenas Cidade e Bairro; a criação do primeiro endereço não é afetada.

Mensagens: `role="alert"` para erro de servidor, `role="status"` para sucesso. Após salvar, exibir copy curta indicando que a localização padrão foi atualizada (apenas quando o response devolver Lat/Long).

---

### [FE] Refactor de perfil/page.tsx consumindo hooks e componentes novos

**1. Contexto e Objetivo**

Hoje `src/app/(client)/perfil/page.tsx` carrega 350+ linhas com: estado inline para 3 abas, chamadas diretas a `AddressService` e `authService`, validação de senha à mão e mensagens hardcoded. Isso quebra o padrão arquitetural (componente chama hook, não Service) e impede que outras telas reutilizem a edição de perfil/endereço.

As tasks anteriores da Onda A produziram as peças (primitives, DTOs, Service, schemas, hooks, componentes). Esta task substitui o conteúdo da página pelos novos componentes, mantendo as 3 abas (Dados Pessoais, Localização, Segurança).

**2. O que precisa ser feito**

Refatorar `src/app/(client)/perfil/page.tsx`.

Manter a estrutura de abas (`Tab = 'personal' | 'location' | 'security'`) e o sidebar com Avatar + nome + e-mail. O sidebar passa a usar o primitive `Avatar` novo e exibe `{profile.firstName} {profile.lastName}`.

Aba **Dados Pessoais**: renderiza `<CustomerProfileForm />`. Remover totalmente os Inputs `disabled` e a copy "A edição ainda não está disponível pela API".

Aba **Localização**: renderiza `<LocationSourceToggle />` no topo e `<CustomerAddressForm />` em seguida.

Aba **Segurança**: mantida como está. Continua chamando `authService.resetPassword` (o módulo de Auth não está no escopo desta sprint).

Remover toda a lógica inline de endereço e perfil que existia antes — agora vive nos hooks/componentes.

---

## Onda B — Localização Ativa

---

### [FE] Criar LocationContext

**1. Contexto e Objetivo**

A RN02 exige que o feed só seja gerado quando houver coordenada de origem (GPS em tempo real OU endereço salvo no perfil). Essa coordenada é consumida por diversas telas (dashboard, busca, filtros) e pode ser alterada de vários pontos (banner de permissão, toggle no perfil, salvamento de endereço). Manter o estado em prop drilling é inviável; manter em estado local de cada tela leva a divergências.

A solução é um `LocationContext` global ao route group `(client)`, na mesma linha do `AuthContext` já existente. Ele é a fonte única de verdade da coordenada ativa do cliente durante a sessão.

**2. O que precisa ser feito**

Criar `src/features/client/context/LocationContext.tsx` com `LocationProvider` (Client Component) que envolve `children`.

Estado interno: `{ coords: { lat: number; lng: number } | null; source: 'gps' | 'profile' | null; status: 'idle' | 'pending' | 'granted' | 'denied' | 'unavailable' }`.

Ações expostas no `value`: `requestGps()` dispara `navigator.geolocation.getCurrentPosition` com timeout de 10s e atualiza `status` para `pending`, depois `granted` (com `coords` e `source: 'gps'`) ou `denied`/`unavailable` conforme erro; `useProfileAddress(coords)` força fonte `profile` com coords passados (vem do `useCustomerAddress.save`); `clear()` reseta para `idle`.

Hook consumidor `useLocationContext()` que lança erro descritivo ("useLocationContext deve estar dentro de LocationProvider") quando usado fora do Provider.

Memoizar o `value` para evitar re-renders em cascata (deps: `coords`, `source`, `status`).

---

### [FE] Criar hook useUserLocation `[AJUSTADO]`

**1. Contexto e Objetivo**

O `LocationContext` é a fonte de verdade do estado, mas a lógica de "como descobrir a coordenada" precisa estar isolada em um hook reutilizável. A regra de negócio diz: tentar GPS primeiro; se negado ou indisponível, usar endereço salvo; se nenhum dos dois, instruir o usuário a cadastrar endereço.

Esta task encapsula essa máquina de estados em um único hook consumível por `GeolocationGate` e por `LocationSourceToggle`.

**2. O que precisa ser feito**

Criar `src/features/client/hooks/useUserLocation.ts`.

Consome `useLocationContext` para escrever no estado global. Em paralelo, consulta `customerProfileService.getMe()` no mount e lê `primaryAddress` para conhecer o endereço de fallback. **Não usar `AddressService.getMine()`**: o contrato BE não expõe um GET dedicado de endereço — as coordenadas de fallback vêm sempre do perfil (`GET /api/user/profile` → `primaryAddress.latitude/longitude`), conforme o item 13 da reconciliação.

Expõe `{ coords, source, status, requestGps(), useProfileFallback(), error }`.

`requestGps()` encapsula `navigator.geolocation.getCurrentPosition` com `{ timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }`. Sucesso: chama o método correspondente do Context. Erro: distingue entre `PERMISSION_DENIED`, `POSITION_UNAVAILABLE` e `TIMEOUT`.

`useProfileFallback()` lê `primaryAddress` do perfil e, se tiver `latitude`/`longitude` não nulos, chama `useProfileAddress` do Context. Caso o cliente não tenha endereço salvo (`primaryAddress === null`), mantém `status` indicando ausência de fallback para o `GeolocationGate` orientar o cadastro.

Trata o caso "sem GPS no device" (Geolocation API ausente) como `status: 'unavailable'`.

---

### [FE] Criar componente LocationSourceToggle `[AJUSTADO]`

**1. Contexto e Objetivo**

O cliente precisa de controle explícito sobre qual fonte de coordenada está ativa: ele pode estar em casa e querer ver o que tem perto do trabalho (endereço salvo) ou estar na rua e querer o que está em torno dele agora (GPS). A RN02 obriga a coordenada; a RN03 implicitamente exige clareza sobre qual coordenada o feed está usando.

Este toggle aparece na aba Localização do perfil e é visualmente óbvio sobre qual fonte está ativa.

**2. O que precisa ser feito**

Criar `src/features/client/components/LocationSourceToggle/LocationSourceToggle.tsx` como Client Component.

Consome `useLocationContext` e `useUserLocation`. Duas opções mutuamente exclusivas: "Usar minha localização (GPS)" e "Usar endereço cadastrado". Implementar como `role="radiogroup"` com dois `role="radio"` (ou usar o primitive `Switch` se a Onda D já estiver mergeada).

Clicar em GPS chama `requestGps()`. Clicar em endereço cadastrado chama `useProfileFallback()`.

Mostrar estado atual de forma legível: "Usando GPS atualizado em HH:mm" ou "Usando endereço: {bairro}, {cidade}". O `CustomerProfileResponse.primaryAddress` só expõe `city` e `neighborhood` (além de `latitude`/`longitude`) — não há `rua`/`número` no contrato, então a copy usa bairro e cidade, não "Rua X, 123".

Quando GPS for negado, exibir mensagem acessível (`role="alert"`) instruindo o usuário a habilitar permissão nas configurações do navegador.

---

### [FE] Criar componente GeolocationGate

**1. Contexto e Objetivo**

A RN02 é clara: sem coordenada de origem, o feed não pode ser gerado. Isso significa que dashboard, busca e qualquer tela que dependa de proximidade precisa de um "portão" que bloqueie a renderização do conteúdo até a coordenada existir, instruindo o usuário em vez de mostrar uma tela vazia.

Sem esse portão, o cliente teria uma experiência confusa (feed vazio sem explicação), ou pior, o frontend faria request com `lat/lng undefined` e quebraria.

**2. O que precisa ser feito**

Criar `src/features/client/components/GeolocationGate/GeolocationGate.tsx` como Client Component, recebendo `children: ReactNode` e consumindo `useLocationContext`.

Quando `coords !== null`: renderiza `children` normalmente.

Quando `coords === null` e `status === 'idle'` ou `'pending'`: renderiza banner de consentimento usando o pattern `Modal` do Design System (focus trap garantido). Banner contém texto explicativo curto, botão primário "Permitir localização" (dispara `requestGps()`) e botão secundário "Usar endereço cadastrado" (dispara `useProfileFallback()` — desabilitado se não houver endereço salvo).

Quando `status === 'denied'` ou `'unavailable'` e sem endereço salvo: renderiza `EmptyState` do Design System com CTA "Cadastrar endereço" linkando para `/perfil`.

Quando `status === 'denied'` mas há endereço salvo: aplicar fallback automático silencioso (sem bloqueio) e renderizar `children`.

---

### [FE] Montar LocationProvider no layout do (client)

**1. Contexto e Objetivo**

Para que o `LocationContext` esteja disponível em todas as páginas do route group `(client)`, o `LocationProvider` precisa ser montado no `layout.tsx` desse grupo, abaixo do `AuthProvider` e do `AuthGuard` (acesso à localização só faz sentido depois que o usuário está autenticado).

**2. O que precisa ser feito**

Atualizar `src/app/(client)/layout.tsx` importando `LocationProvider` de `src/features/client/context/LocationContext` e envolvendo `DashboardShell` (ou o `children` final) com `<LocationProvider>...</LocationProvider>`, dentro do `AuthGuard` e abaixo do `useAuthContext`.

---

### [FE] Integrar LocationSourceToggle na aba Localização do perfil

**1. Contexto e Objetivo**

O componente `LocationSourceToggle` precisa de um ponto de entrada visível para o cliente. A aba Localização do perfil é o lugar natural — é onde o cliente edita o endereço e onde ele entende que a escolha afeta a busca.

**2. O que precisa ser feito**

Em `src/app/(client)/perfil/page.tsx` (após o refactor que substitui a aba de localização pelo `CustomerAddressForm`), inserir `<LocationSourceToggle />` no topo da aba "Meu Endereço", acima do `CustomerAddressForm`.

Pequeno separador visual entre o toggle e o formulário (ex.: divider `h-px bg-[var(--color-border-default)]`).

---

## Onda C — Busca e Feed (RN02)

---

### [FE] Criar pattern ListingCard

**1. Contexto e Objetivo**

Hoje o dashboard do cliente renderiza cards de anúncio com classes Tailwind inline dentro da própria página. Isso impede que a página de busca (`/busca`) e qualquer futura tela reuse o mesmo visual, e mistura camada de feature com camada de apresentação.

A regra ESLint do projeto proíbe que o Design System importe de `features/`. Isso é um risco específico para `ListingCard`, porque o card deve exibir o badge "Aberto agora", cuja lógica vive em `features/business`. A solução é o pattern receber um slot (`openSlot: ReactNode`) — a injeção do `OpenNowBadge` fica a cargo do caller (em `features/client`), preservando a regra das camadas.

**2. O que precisa ser feito**

Criar `src/design-system/patterns/ListingCard/` com `ListingCard.tsx`, `ListingCard.variants.ts`, `ListingCard.stories.tsx` e `index.ts`.

Componente renderiza: thumbnail via `next/image` (obrigatório — `<img>` é erro de lint); header com categoria e o `openSlot` (ReactNode opcional); título; `DistanceBadge` com `distanceMeters`; preço formatado em BRL. Tudo dentro de um `<Link>` recebido como prop `href`.

Props: `{ title, price, categoryName, thumbnailUrl, distanceMeters, openSlot?: ReactNode, href, type: 'product' | 'service' }`.

Variantes via CVA: `layout: 'vertical' | 'horizontal'` e `emphasis: 'default' | 'featured'`.

O pattern não importa de `features/` ou `app/`. Toda informação chega por props.

História Ladle cobrindo: vertical/default, vertical/featured, horizontal/default, com e sem `openSlot`.

---

### [FE] Criar pattern SearchBar

**1. Contexto e Objetivo**

A RN02 prevê busca textual livre ("Bolo de pote"). Hoje o projeto não tem um componente de busca padronizado. A nova rota `/busca` e potencialmente o dashboard vão precisar do mesmo input.

Para evitar duplicar lógica de Enter/Esc/limpar e estilização do ícone, esta task entrega o pattern reutilizável.

**2. O que precisa ser feito**

Criar `src/design-system/patterns/SearchBar/SearchBar.tsx`.

Props: `value: string`, `onChange(value: string)`, `onSubmit?(value: string)`, `placeholder?`, `autoFocus?`.

Layout: container com ícone de busca à esquerda, input no meio, botão de limpar (`aria-label="Limpar busca"`) à direita visível só quando `value` não está vazio.

Comportamento de teclado: `Enter` dispara `onSubmit`, `Esc` chama `onChange('')`.

Debounce não é feito internamente — o caller controla via hook. Razão: a SearchBar pode ser usada para submit imediato em alguns contextos.

Tokens do Design System; sem cor literal Tailwind. História Ladle cobrindo: idle, focused, com texto, vazio com placeholder.

---

### [FE] Criar pattern DistanceBadge

**1. Contexto e Objetivo**

A RN02 manda exibir a distância calculada na interface ("a 800m de você"). Hoje não há componente para isso. Como o número aparece em vários lugares (card, detalhe, possivelmente filtros), vale isolar a formatação em um pattern dedicado para garantir consistência visual e tipográfica.

**2. O que precisa ser feito**

Criar `src/design-system/patterns/DistanceBadge/DistanceBadge.tsx` com prop `{ meters: number }`.

Usa o helper `formatDistance` para formatar: menor que 1000 m em metros ("a 800 m de você"), maior ou igual a 1000 m em km com vírgula decimal pt-BR ("a 1,2 km de você").

Visual: pequeno badge inline com ícone de pin (`ri-map-pin-line` da Remix Icon, já usada no projeto) e texto em `text-xs`. Tokens semânticos para cor.

---

### [FE] Criar helpers formatDistance e haversineKm

**1. Contexto e Objetivo**

A formatação de distância aparece em vários componentes. Centralizar no `lib/utils` evita duplicação e garante padrão pt-BR (vírgula decimal). O `haversineKm` serve como cálculo local de sanidade — mas não como fonte de ordenação, que vem sempre do backend.

**2. O que precisa ser feito**

Em `src/lib/utils/`, criar `formatDistance.ts` exportando `formatDistance(meters: number): string`. Para distâncias menores que 1000 m, arredondar para a centena mais próxima e retornar "a 800 m de você". Para 1000 m ou mais, dividir por 1000, arredondar para 1 casa decimal, formato pt-BR com vírgula, e retornar "a 1,2 km de você".

Criar `haversineKm.ts` exportando `haversineKm(a: { lat, lng }, b: { lat, lng }): number` com a fórmula haversine padrão. Comentário no topo do arquivo deixando explícito: "Uso apenas para sanidade visual ou fallback de exibição. Nunca para reordenar o feed — a ordem vem do backend."

Exportar via `index.ts` correspondente.

---

### [FE] Criar DTOs de busca de listing `[AJUSTADO]`

**1. Contexto e Objetivo**

A busca por proximidade requer um contrato bem definido entre frontend e backend. Os DTOs centralizam esse contrato em tipos puros, permitindo que o Service e o hook saibam exatamente o que enviar e receber. Pré-requisito do método `search` no `ListingService` e do hook `useListingSearch`.

**2. O que precisa ser feito**

Criar os seguintes arquivos em `src/lib/api/dtos/`.

`Request/listing/ListingSearchRequest.ts`:

```typescript
{
  latitude?: number;
  longitude?: number;
  listingCategoryId?: string;
  nicheIds?: string[];         // CSV no query: ?nicheIds=a,b,c
  query?: string;              // max 80
  maxDistanceKm?: number;      // [0.5, 50], default 10
  openNow?: boolean;
  page?: number;
  pageSize?: number;           // max 50
}
```

`Response/listing/PublicListingNearbyResponse.ts` (item do feed — substitui `ListingSearchItemResponse`):

```typescript
{
  listingId: string;
  title: string;
  slug: string;
  price: number;
  currencyCode: string;
  coverImageUrl: string | null;
  distanceInKm: number;        // 1 casa decimal
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessLogoUrl: string | null;
  businessLatitude: number;    // arredondado 3 casas — privacidade do empreendedor
  businessLongitude: number;
  city: string;
  neighborhood: string;
  isOpenNow: boolean;
  whatsappLink: string | null; // montado e localizado pelo backend — não construir no FE
}
```

`Response/listing/PublicListingDetailResponse.ts` (detalhe do anúncio — novo DTO):

```typescript
{
  id: string;
  title: string;
  description: string;
  price: number;
  currencyCode: string;
  slug: string;
  stockQuantity: number;
  images: { id: string; imageUrl: string; isCover: boolean; displayOrder: number }[];
  business: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    isOpenNow: boolean;
  };
  businessLocation: {
    city: string;
    neighborhood: string;
    latitude: number;          // arredondado 3 casas
    longitude: number;
  };
  whatsappLink: string | null; // montado e localizado pelo backend
}
```

`Response/listing/PaginatedListingResponse.ts`:

```typescript
{
  items: PublicListingNearbyResponse[];
  total: number;
  page: number;
  pageSize: number;
}
```

Adicionar exports nos `index/index.ts` correspondentes. Criar pasta `listing/` se não existir. Tipos puros.

---

### [FE] Adicionar método search ao ListingService `[AJUSTADO]`

**1. Contexto e Objetivo**

O dashboard hoje chama `ListingService.getNearby(50)` — um endpoint que não respeita `lat/lng` reais nem filtros. A RN02 exige uma busca completa com coordenada, raio, categoria, busca textual, openNow e paginação.

**2. O que precisa ser feito**

Em `src/lib/api/services/ListingService.ts`, adicionar:

`search(filters: ListingSearchRequest): Promise<PaginatedListingResponse>` — chama `GET /api/discovery/listings`.

Montar a query string com `URLSearchParams`: omitir campos `undefined`; `nicheIds` (array) vira CSV `?nicheIds=a,b,c`; booleans viram `"true"`/`"false"`; numbers convertidos via `String(...)`. Endpoint autenticado.

`getPublicDetail(id: string): Promise<PublicListingDetailResponse>` — chama `GET /api/discovery/listings/{id}`. Endpoint `[AllowAnonymous]` — não requer auth, mas envia token se disponível no header.

Marcar `getNearby(radius)` como `@deprecated` no JSDoc apontando para `search`. Não remover ainda — remoção fica para o refactor do dashboard.

---

### [FE] Criar listing-search.schema.ts com parse e serialização `[AJUSTADO]`

**1. Contexto e Objetivo**

Os filtros da busca precisam ser persistidos na URL para que o usuário possa compartilhar links e o reload preserve estado. Esta task centraliza a serialização e desserialização em um único módulo Zod.

**2. O que precisa ser feito**

Criar `src/features/client/schemas/listing-search.schema.ts`.

Schema Zod com defaults: `type: 'all' | 'product' | 'service'` (default `'all'`); `listingCategoryId?: string`; `nicheIds: string[]` (default `[]`); `query?: string` (max 80); `maxDistanceKm: 1 | 2 | 5 | 10 | 20` (default `5`); `openNow: boolean` (default `false`); `view: 'list' | 'grid'` (default `'list'`).

Exportar tipo via `z.infer` como `ListingSearchFilters`.

Exportar `parseSearchParams(params: URLSearchParams): ListingSearchFilters` que converte URL em objeto tipado, aplicando defaults. `nicheIds` lê CSV (`?nicheIds=a,b,c` → `['a', 'b', 'c']`).

Exportar `serializeFilters(filters: ListingSearchFilters): URLSearchParams` que omite defaults para manter a URL limpa (`maxDistanceKm=5`, `openNow=false` e `nicheIds=[]` não aparecem). Idempotência: `parse(serialize(x)) === x` para qualquer `x` válido.

---

### [FE] Criar hook useListingSearch `[AJUSTADO]`

**1. Contexto e Objetivo**

A busca é o coração da RN02. O hook `useListingSearch` é o ponto de orquestração entre filtros, coordenada e o Service.

**2. O que precisa ser feito**

Criar `src/features/client/hooks/useListingSearch.ts`.

Recebe `filters: ListingSearchFilters` e `coords: { lat: number; lng: number } | null`. Retorna `{ listings: PublicListingNearbyResponse[]; total; page; isLoading; error; loadMore() }`.

Quando `coords === null`: não dispara request, retorna `listings: []` e `isLoading: false`.

Quando filtros mudam (deep compare): reseta página para 1, limpa lista, refaz request.

`loadMore`: incrementa página e concatena os novos `items` ao final.

Mapeia `filters + coords` para `ListingSearchRequest`:

- `latitude: coords.lat`, `longitude: coords.lng`
- `maxDistanceKm: filters.maxDistanceKm`
- `nicheIds: filters.nicheIds`
- `query: filters.query`
- `listingCategoryId: filters.listingCategoryId`
- `openNow: filters.openNow`

Cancellation via `AbortController` ou flag `cancelled` no `useEffect`.

---

### [FE] Criar componente ListingFeed `[AJUSTADO]`

**1. Contexto e Objetivo**

O grid de cards do feed é o conteúdo principal do dashboard e da página de busca. Para evitar duplicação entre as duas rotas e para isolar a lógica de infinite scroll, o feed vira um componente único parametrizado.

**2. O que precisa ser feito**

Criar `src/features/client/components/ListingFeed/ListingFeed.tsx` como Client Component.

Recebe `filters: ListingSearchFilters`. Consome `useLocationContext` para coords e `useListingSearch` para listings.

Renderiza grid responsivo `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`. Para cada `PublicListingNearbyResponse`, renderiza `<ListingCard ... openSlot={<OpenNowBadge slug={item.businessSlug} />} />`.

Atenção: o DTO retorna `distanceInKm` (número com 1 decimal); o `ListingCard`/`DistanceBadge` espera `distanceMeters`. Converter via `item.distanceInKm * 1000` antes de passar como prop.

**[PENDÊNCIA DE CONTRATO]** O `PublicListingNearbyResponse` (item 14 da reconciliação) **não** inclui `categoryName`/`listingCategoryId` nem `type` (`'product' | 'service'`), mas o `ListingCard` os recebe como props. Sem esses campos no item do feed, o caller não tem como preencher categoria nem tipo por anúncio. Decisão pendente do BE: incluir `categoryName` (ou `listingCategoryId`, resolvido via `useCategoryTree`) e `type` no item do feed, ou confirmar que ficam opcionais/ocultos no card. Levantado como comentário FE na reconciliação (ver §17 de `contract-reconciliation-customer.md`). Enquanto isso, tratar `categoryName`/`type` como opcionais no `ListingCard` e ocultar o header de categoria quando ausentes.

Implementa infinite scroll com Intersection Observer no último item visível, disparando `loadMore`.

Estados: loading inicial com 6-8 `Skeleton` no grid; erro com `ErrorState` do Design System e retry; vazio com `EmptyState` ("Nenhum resultado encontrado") e CTA "Limpar filtros"; loading de páginas adicionais com linha de spinners no final do grid.

---

### [FE] Refactor de dashboard-client/page.tsx para feed e localização `[AJUSTADO]`

**1. Contexto e Objetivo**

O dashboard atual tem estado inline, chama `ListingService.getNearby(50)` direto e não respeita a RN02 (sem coords não pode haver feed). Esta task substitui o conteúdo da página pela composição dos componentes novos.

**2. O que precisa ser feito**

Refatorar `src/app/(client)/dashboard-client/page.tsx`. Manter `'use client'` (depende de `useSearchParams`).

Parsear filtros da URL via `parseSearchParams`. Sincronizar mudanças nos tabs de categoria e tipo com a URL via `router.replace`. Usar `listingCategoryId` (não `categoryId`) e `nicheIds` (não `subcategoryIds`) ao serializar.

Renderizar `<GeolocationGate>` envolvendo o sticky header de tabs (tipo + categoria) e `<ListingFeed filters={filters} />`.

Remover toda a lógica inline (`useState` de `ads`, `useEffect` chamando Services, `normalize`, etc.). A lista de categorias pode vir de `useCategoryTree` (Onda D) — enquanto essa task não estiver mergeada, manter o array hardcoded existente temporariamente.

Remover o método `ListingService.getNearby` do arquivo do Service após confirmar que não tem outros consumidores via grep no projeto.

---

### [FE] Criar rota busca/page.tsx

**1. Contexto e Objetivo**

A RN02 prevê busca livre por texto ("Bolo de pote"). A rota dedicada `/busca` oferece foco total no input e mostra resultados conforme o usuário digita.

**2. O que precisa ser feito**

Criar `src/app/(client)/busca/page.tsx` como Client Component.

Parsear filtros da URL via `parseSearchParams`. O foco aqui é `query` (busca textual).

Renderizar `<SearchBar autoFocus value={query} onChange={...} />` no topo (sticky), e `<GeolocationGate><ListingFeed filters={filters} /></GeolocationGate>` abaixo.

Debounce do `query` controlado pela própria página (300 ms) antes de atualizar a URL via `router.replace`. Submit explícito da SearchBar (Enter) força atualização imediata da URL.

---

### [FE] Atualizar BOTTOM_NAV do layout do (client)

**1. Contexto e Objetivo**

O bottom nav atual tem `Favoritos` apontando para uma rota inexistente e `Buscar` ainda não plugado. Esta task corrige os dois.

**2. O que precisa ser feito**

Em `src/app/(client)/layout.tsx`, atualizar o array `BOTTOM_NAV`: manter `Início` → `/dashboard-client`; manter `Buscar` → `/busca`; remover `Favoritos`; manter `Perfil` → `/perfil`.

Bottom nav passa a ter 3 itens; ajustar `grid-cols-4` para `grid-cols-3`.

Considerar mover `ClientBottomNav` para `src/features/client/components/ClientBottomNav/` para manter o layout fino. Opcional dentro desta task; recomendado.

---

## Onda D — Filtros Avançados (RN03)

---

### [FE] Criar primitive Slider

**1. Contexto e Objetivo**

A RN03 exige um filtro de raio de distância (1, 2, 5, 10, 20 km). Inputs numéricos puros são ruins para escolha discreta de valor; um slider permite feedback contínuo. O projeto não tem esse componente.

**2. O que precisa ser feito**

Criar `src/design-system/primitives/Slider/` com `Slider.tsx`, `Slider.variants.ts`, `Slider.stories.tsx` e `index.ts`.

`Slider.tsx`: wrapper acessível sobre `<input type="range">` com `forwardRef`. Props: `min`, `max`, `step`, `value`, `onChange(value: number)`, `label: string`, `valueFormatter?: (v) => string`, `disabled?`.

Renderiza track + thumb estilizados com tokens (`var(--color-primary)` para preenchimento, `var(--color-border-default)` para track). `focus-visible:ring-2` no thumb. Label visível por padrão; valor formatado ao lado do label via `valueFormatter`.

Variantes via CVA: `color: 'primary' | 'neutral'`, `size: 'sm' | 'md'`. Acessibilidade por teclado: setas movem; Home/End para min/max. História Ladle cobrindo idle, focused, disabled, com `valueFormatter` (ex.: "5 km"), com ranges diferentes.

---

### [FE] Criar primitive Switch

**1. Contexto e Objetivo**

A RN03 prevê o filtro "Aberto Agora" — um toggle on/off. A RN01 vai usar um toggle para "Usar GPS vs endereço cadastrado" no perfil. O projeto não tem esse componente.

**2. O que precisa ser feito**

Criar `src/design-system/primitives/Switch/` com `Switch.tsx`, `Switch.variants.ts`, `Switch.stories.tsx` e `index.ts`.

Componente acessível com `role="switch"` e `aria-checked`. Props: `checked: boolean`, `onChange(checked: boolean)`, `label: string`, `disabled?`.

Visual: track + thumb com `transition-colors` suave entre estados; track usa `var(--color-primary)` quando on, `var(--color-border-default)` quando off. `focus-visible:ring-2` no track. Variantes via CVA com `size: 'sm' | 'md'`.

Acessibilidade por teclado: Space e Enter alternam. História Ladle cobrindo: on, off, disabled, focused.

---

### [FE] Criar pattern FilterChips

**1. Contexto e Objetivo**

A RN03 menciona filtros por nicho. Tags/chips são o padrão de marketplace para seleção múltipla. O projeto não tem esse pattern.

**2. O que precisa ser feito**

Criar `src/design-system/patterns/FilterChips/FilterChips.tsx`.

Props: `items: { value: string; label: string; icon?: string }[]`, `selected: string[]`, `onChange(selected: string[])`, `multi: boolean`, `ariaLabel: string`.

Container `<div role="group" aria-label={ariaLabel}>`. Cada chip é `<button type="button" aria-pressed={isSelected}>` com label, ícone opcional, e visual diferente para selecionado vs não.

`multi: true`: clicar adiciona/remove do array. `multi: false`: clicar substitui (lista de 1 elemento).

Tokens: selecionado usa `var(--color-primary)` no fundo e `var(--color-on-primary)` no texto; não selecionado usa `var(--color-surface)` e `var(--color-body)`. `focus-visible:ring-2`.

História Ladle: multi com 6 items, single com 3 items, com ícones, sem ícones, com seleção inicial.

---

### [FE] Criar NicheResponse DTO `[AJUSTADO — substitui SubcategoryResponse]`

**1. Contexto e Objetivo**

O domínio do projeto não tem "subcategoria" como filha de `ListingCategory`. O conceito equivalente é `Niches` — entidade independente vinculada ao Business. Esta task cria o tipo puro para tipar as respostas do `NicheService`.

A task "Criar `SubcategoryResponse` DTO" foi **removida** do backlog — o endpoint `GET /categories/{id}/subcategories` não existe e não será criado.

**2. O que precisa ser feito**

Criar `src/lib/api/dtos/Response/business/NicheResponse.ts` com:

```typescript
{
  id: string;
  name: string;
}
```

Adicionar export em `src/lib/api/dtos/Response/index/index.ts`.

---

### [FE] Criar NicheService `[AJUSTADO — substitui getSubcategories no CategoryService]`

**1. Contexto e Objetivo**

Nichos não fazem parte do domínio de categorias — são uma entidade independente. Por isso, entram em um Service dedicado em vez de serem adicionados ao `CategoryService`.

A task "Adicionar `getSubcategories` ao `CategoryService`" foi **removida** do backlog.

**2. O que precisa ser feito**

Criar `src/lib/api/services/NicheService.ts`, estendendo `BaseService`.

Método: `getAll(): Promise<NicheResponse[]>` — chama `GET /api/niches`. Endpoint público (`[AllowAnonymous]`), mas envia token se disponível.

Exportar como classe e como instância singleton. Adicionar export em `src/lib/api/services/index.ts`.

---

### [FE] Criar hook useCategoryTree com cache `[AJUSTADO]`

**1. Contexto e Objetivo**

Categorias são consumidas em múltiplos lugares: chips no dashboard, filtros, mapeamento de `categoryId → categoryName` no `ListingCard`. Sem cache, cada montagem de componente refaz o request. Como categorias mudam pouco, cache de sessão (`useRef<Map>`) é suficiente.

**2. O que precisa ser feito**

Criar `src/features/client/hooks/useCategoryTree.ts`.

No mount, chama `CategoryService.getAll()` e armazena em `categories: CategoryResponse[]`.

Expõe `{ categories, isLoading, error }`.

**Não incluir** lógica de subcategorias (`getSubcategories`, cache de subcategorias). Essa responsabilidade pertence ao `useNiches` — hook separado descrito na próxima task.

---

### [FE] Criar hook useNiches com cache `[NOVA TASK]`

**1. Contexto e Objetivo**

Nichos são consumidos em `ListingFilters` e possivelmente em outros contextos. Como são dados globais que raramente mudam, cache de sessão via `useRef` é suficiente.

**2. O que precisa ser feito**

Criar `src/features/client/hooks/useNiches.ts`.

No mount, chama `NicheService.getAll()` e armazena em `useRef<NicheResponse[] | null>` como cache de sessão. Se já há cache, não refaz o request.

Expõe `{ niches: NicheResponse[]; isLoading: boolean; error: Error | null }`.

Os nichos são uma lista plana global — não são organizados por categoria e não têm hierarquia. O componente `ListingFilters` exibe todos os nichos disponíveis sempre, sem depender de categoria selecionada.

---

### [FE] Estender listing-search.schema.ts com novos filtros `[AJUSTADO]`

**1. Contexto e Objetivo**

A task que criou o schema base já entregou os defaults principais. Esta task confirma e ajusta o suporte completo a `maxDistanceKm`, `openNow` e `nicheIds` no parse e na serialização.

**2. O que precisa ser feito**

Em `src/features/client/schemas/listing-search.schema.ts`, garantir que:

- `maxDistanceKm` aceita `1 | 2 | 5 | 10 | 20` com default `5`;
- `openNow: boolean` tem default `false`;
- `nicheIds: string[]` tem default `[]`.

`parseSearchParams`: `nicheIds` lê CSV (`?nicheIds=a,b,c` → `['a', 'b', 'c']`).

`serializeFilters`: omite `maxDistanceKm=5`, `openNow=false`, `nicheIds=[]` (defaults) da URL final.

Parse e serialização idempotentes (`parse(serialize(x)) === x`).

---

### [FE] Criar componente ListingFilters `[AJUSTADO]`

**1. Contexto e Objetivo**

A página `filtros` precisa de uma composição visual dos filtros (raio, Aberto Agora, nichos, tipo, categoria). Isolar em um componente permite reuso em modais futuros e separa orquestração de UI.

**2. O que precisa ser feito**

Criar `src/features/client/components/ListingFilters/ListingFilters.tsx` como Client Component.

Props: `filters: ListingSearchFilters`, `onChange(filters: ListingSearchFilters)`.

Renderiza, em sections:

- "Tipo de Anúncio" com `FilterChips` single (`all/product/service`);
- "Categoria" com `FilterChips` single alimentado por `useCategoryTree().categories`;
- **"Nichos"** com `FilterChips` multi alimentado por `useNiches().niches` — **exibe sempre a lista global de nichos, independente da categoria selecionada**. Não condicionar por `listingCategoryId`. Esta section substitui a antiga "Subcategorias";
- "Raio de Distância" com `Slider` mapeando 1/2/5/10/20 e `valueFormatter` mostrando "X km" (prop `maxDistanceKm`);
- "Aberto Agora" com `Switch` com label.

Cada mudança chama `onChange` com o filters atualizado.

---

### [FE] Refactor de filtros/page.tsx `[AJUSTADO]`

**1. Contexto e Objetivo**

A página `src/app/(client)/filtros/page.tsx` hoje tem lógica de filtros inline (estado local + arrays hardcoded de categorias). Falta o raio, falta o Aberto Agora, faltam nichos. Tem um seletor de "Visualização" (list/grid/map) que vai sair — Mapa não está no MVP.

**2. O que precisa ser feito**

Refatorar `src/app/(client)/filtros/page.tsx`. Manter `'use client'`.

Parsear filtros iniciais da URL via `parseSearchParams`. Renderizar `<ListingFilters filters={filters} onChange={setFilters} />`.

Manter os botões "Limpar" e "Aplicar" fixos no rodapé: "Limpar" reseta para defaults do schema; "Aplicar" chama `router.push('/dashboard-client?' + serializeFilters(filters))`.

Remover a section "Visualização" (list/grid/map) — Mapa fora do MVP.

---

## Onda E — WhatsApp e Mapa no Detalhe (RN04)

---

### [FE] Criar helper whatsappLink `[AJUSTADO]`

**1. Contexto e Objetivo**

A URL do WhatsApp é `https://wa.me/<telefoneSemMais>?text=<mensagemUrlEncoded>`. Para evitar montagem de string espalhada em componentes, centralizar em um helper.

**Nota importante:** para o botão de contato do anúncio (listing), o backend já entrega `whatsappLink` pronto e localizado no `PublicListingNearbyResponse` e `PublicListingDetailResponse`. Este helper é mantido para outros contextos onde o FE precise construir um link WhatsApp client-side (ex.: exibir o telefone do próprio cliente em outro ponto da UI).

**2. O que precisa ser feito**

Em `src/lib/utils/`, criar `whatsappLink.ts` exportando `whatsappLink(phoneCountryCode: string, phoneNumber: string, message: string): string`.

Ambos os parâmetros de telefone são strings de dígitos puros (sem `+`, sem espaços). Validar: `phoneCountryCode` com regex `^\d{1,3}$` e `phoneNumber` com `^\d{8,15}$`. Se inválido, lançar `Error` descritivo.

Concatenar internamente e montar URL: `https://wa.me/${phoneCountryCode}${phoneNumber}?text=${encodeURIComponent(message)}`.

Exportar via `index.ts` correspondente.

---

### [FE] Estender pattern ContactAction com variant whatsapp

**1. Contexto e Objetivo**

O Design System já tem o pattern `ContactAction` em `src/design-system/patterns/ContactAction/`. Esta task adiciona a variant `whatsapp` para padronizar o botão verde do WhatsApp e seu comportamento de abrir em nova aba.

**2. O que precisa ser feito**

Em `src/design-system/patterns/ContactAction/`, adicionar variant `whatsapp` ao componente.

Visual: cor verde (token `var(--color-success)` ou novo token específico se design pedir), ícone do WhatsApp (`ri-whatsapp-line` da Remix Icon).

Label padrão "Chamar no WhatsApp" (pode ser sobrescrito por prop).

Sempre `target="_blank"` + `rel="noopener noreferrer"`.

Atualizar `ContactAction.variants.ts` para incluir a variant. Atualizar `ContactAction.stories.tsx` cobrindo a nova variant.

---

### [FE] Integrar botão WhatsApp em detalhes-anuncio `[AJUSTADO]`

**1. Contexto e Objetivo**

A página de detalhe do anúncio é onde a ação de conversão acontece (RN04). O backend já entrega `whatsappLink: string | null` pronto no `PublicListingDetailResponse` — montado e localizado conforme a cultura do request.

**2. O que precisa ser feito**

Em `src/app/(client)/detalhes-anuncio/page.tsx`, consumir `GET /api/discovery/listings/{id}` via `ListingService.getPublicDetail(id)` para obter o `PublicListingDetailResponse`.

Renderizar `<ContactAction variant="whatsapp" href={listing.whatsappLink} />` passando o link **diretamente do backend** — não construir o link no FE via helper `whatsappLink` para este caso.

Tratar `listing.whatsappLink === null`: ocultar o botão e exibir aviso discreto "Este anúncio não tem WhatsApp cadastrado" — sem layout shift. Não tentar reconstruir o link a partir de outros campos.

---

### [FE] Integrar BusinessMapPreview em detalhes-anuncio `[AJUSTADO]`

**1. Contexto e Objetivo**

A demanda inclui "Visualizar a localização" como funcionalidade do cliente. O componente `BusinessMapPreview.client.tsx` já existe em `src/features/business/components/BusinessMapPreview/`. Esta task pluga ele na página de detalhe do anúncio, garantindo que o mapa é carregado client-side via `next/dynamic`.

**2. O que precisa ser feito**

Em `src/app/(client)/detalhes-anuncio/page.tsx`, importar `BusinessMapPreview` via `next/dynamic` com `{ ssr: false }`.

A página consome `GET /api/discovery/listings/{id}` via `ListingService.getPublicDetail(id)`, retornando `PublicListingDetailResponse` com o campo `businessLocation: { city, neighborhood, latitude, longitude }`.

Renderizar section "Localização" com props `{ latitude: listing.businessLocation.latitude, longitude: listing.businessLocation.longitude, name: listing.business.name }`.

**Atenção:** as coordenadas são arredondadas a 3 casas decimais (≈ 110m de precisão) — isso é intencional, protege o endereço real do empreendedor em endpoint público. Não solicitar coordenadas mais precisas ao backend para este endpoint.

Quando `businessLocation` ausente: renderizar fallback textual com `city` e `neighborhood`.

Container do mapa com `aria-label="Mapa mostrando a localização de [nome do estabelecimento]"`. Exibir endereço por extenso abaixo do mapa como alternativa textual.

---

## Tasks Transversais

---

### [FE] Revisar boundaries do route group (client)

**1. Contexto e Objetivo**

Cada route group em Next.js App Router pode ter `loading.tsx`, `error.tsx` e `not-found.tsx` próprios. O route group `(client)` já tem `loading` e `error`, mas eles podem estar desatualizados em relação aos novos tokens/padrões, e `not-found` pode estar ausente. Sem isso, navegação a rota inexistente cai em fallback genérico do Next, fora do shell.

**2. O que precisa ser feito**

Atualizar `src/app/(client)/loading.tsx` alinhando com `Skeleton` do Design System, mantendo a forma do `DashboardShell`.

Atualizar `src/app/(client)/error.tsx` usando `ErrorState` pattern do Design System com mensagem em português e botão "Tentar novamente" que chama `reset()`.

Criar `src/app/(client)/not-found.tsx` usando `EmptyState` pattern com mensagem "Página não encontrada" e CTA "Voltar para o início" linkando para `/dashboard-client`.

---

### [FE] Validação manual completa em npm run dev `[AJUSTADO]`

**1. Contexto e Objetivo**

Type checking e lint validam corretude de código, não de feature. As regras RN01–RN04 só são validadas com o app rodando e exercitando o fluxo completo como cliente autenticado, com vários cenários de coordenada (permitir GPS, negar, sem endereço).

**2. O que precisa ser feito**

Rodar `npm run dev` e validar como cliente autenticado: editar perfil (`firstName` + `lastName` separados, `phoneCountryCode` e `phoneNumber` em dígitos puros sem `+`, upload de avatar com preview e persistência via `profilePictureUrl`); salvar endereço (criar e atualizar; `LocationContext` atualiza quando o response tem Lat/Long); GPS (aceitar permissão → feed por proximidade; negar com endereço salvo → fallback; negar sem endereço → `EmptyState` com CTA); categorias (chips atualizam query e feed via `listingCategoryId`); busca textual (`query`, debounce 300 ms, Enter força busca imediata); filtros (`maxDistanceKm` reduz resultados, Aberto Agora reduz, nichos via `nicheIds` reduzem — nichos **independem de categoria selecionada**); WhatsApp (clique abre `listing.whatsappLink` pronto do backend, sem construção no FE); mapa no detalhe (renderiza client-side com coords arredondadas a 3 casas; sem coordenadas, fallback textual com city e neighborhood).

Documentar resultado em planilha ou comentário no card (passa/falha por cenário). Bugs encontrados viram cards de correção.

---

### [FE] Ajustes finos de acessibilidade

**1. Contexto e Objetivo**

A11y não vem grátis. Embora cada task individual exija `aria-*` e foco visível, é comum que detalhes escapem em revisão. Esta task reserva tempo dedicado para audit e ajuste final, antes do PR.

**2. O que precisa ser feito**

Auditar: `h1` único por página com hierarquia `h2` > `h3` correta dentro de sections; `role="alert"` em todas as mensagens de erro inline; `role="status"` + `aria-live="polite"` em mensagens de sucesso; `focus-visible:ring-2` em todos os botões, chips, switches, sliders, inputs novos; navegação por teclado completa em bottom nav, formulários, filtros, modais; Modal de GPS com focus trap funcionando e Esc fecha; contraste mínimo AA (4.5:1) em todos os textos contra o fundo (usar DevTools ou axe).

Amostragem com leitor de tela (NVDA no Windows ou VoiceOver no Mac) em pelo menos: formulário de perfil, feed com cards, modal de permissão de GPS.

---

### [FE] Ajustes responsivos

**1. Contexto e Objetivo**

A maioria dos clientes acessa marketplaces locais via celular. O projeto é mobile-first, mas o desktop também precisa funcionar bem. Esta task valida e ajusta em três tamanhos representativos.

**2. O que precisa ser feito**

Validar nos viewports 375px (mobile), 768px (tablet), 1280px+ (desktop): grid do feed muda de 1 → 2 → 3 → 4 colunas conforme breakpoint; sticky header do dashboard não corta scroll horizontal; bottom nav não sobrepõe conteúdo (padding bottom no `DashboardShell`); filtros (slider e chips utilizáveis em mobile, sem overflow horizontal); formulários de perfil (`firstName` + `lastName` em colunas separadas no desktop, empilhados no mobile; campos DDI + número em linha); modal de banner de GPS (ocupa tela razoavelmente em mobile, não tela inteira mas não minúsculo).

Sem scroll horizontal indevido. Tudo legível e tocável (alvos mínimos 44x44 px em mobile).

---

### [FE] Code review e iteração

**1. Contexto e Objetivo**

Toda PR séria passa por revisão. Esta task reserva capacity para iterar sobre comentários do time, executar lint e tsc finais, e ajustar antes do merge.

**2. O que precisa ser feito**

Rodar `npm run lint` (zero warnings), `npx tsc --noEmit` (zero erros) e `npm run ladle:build` (Design System builda sem erro).

Endereçar comentários da revisão do time.

Garantir commits seguindo Conventional Commits em português (`feat(client): ...`, `feat(design-system): ...`, `refactor(client): ...`).

Descrição do PR aponta impacto por camada, contratos backend dependentes (CXSB-72), screenshots de antes/depois quando visual.
