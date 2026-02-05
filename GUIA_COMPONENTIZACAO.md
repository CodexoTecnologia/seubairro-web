# 📖 Guia de Componentização - SeuBairro

## 🎯 Estrutura do Projeto

### **Landing Page Componentizada:**

```
src/app/pages/(landingpage)/lp/
├── page.tsx                    ← Orquestrador principal
├── components/
│   ├── header.tsx             ← Navbar com menu mobile
│   ├── hero.tsx               ← Hero section com radar 3D
│   ├── info-bar.tsx           ← Barra de benefícios
│   ├── purpose.tsx            ← Seção de propósito
│   ├── for-who.tsx            ← Ecossistema (moradores/negócios)
│   ├── roadmap.tsx            ← Timeline do projeto
│   └── footer.tsx             ← Footer completo
```

### **Estilos:**
```
src/styles/landingpage/
└── landing.css                 ← Todos os estilos da LP
```

### **Assets:**
```
public/assets/
├── logo-seubairro.svg
└── logo_codexo_nome_branco.svg
```

---

## 🧩 Padrão de Componentização

### **page.tsx - Orquestrador**
```tsx
'use client'
import Header from './components/header'
import Hero from './components/hero'
// ... outros imports

export default function LandingPage() {
    return (
        <>
            <div className="map-grid-bg"></div>
            <Header />
            <main>
                <Hero />
                <InfoBar />
                {/* Outros componentes */}
            </main>
            <Footer />
        </>
    )
}
```

**Responsabilidade:**
- ✅ Importar e organizar componentes
- ✅ Definir estrutura da página
- ❌ NÃO ter lógica de negócio

---

### **Componentes Individuais**

Cada componente é independente:

```tsx
'use client'

export default function Hero() {
    return (
        <section className="hero">
            {/* Conteúdo */}
        </section>
    )
}
```

**Características:**
- ✅ Focado em uma seção específica
- ✅ Usa `'use client'` se tiver interatividade
- ✅ Classes CSS correspondentes em `landing.css`

---

## 🎨 Como Editar

### **Mudar texto/conteúdo:**
Edite o componente específico em `components/`

### **Mudar cores:**
Edite variáveis CSS em `landing.css` (linha 6-18)

### **Adicionar nova seção:**
1. Crie arquivo em `components/new-section.tsx`
2. Importe em `page.tsx`
3. Adicione estilos em `landing.css`

---

## 🚀 Acessar

```
http://localhost:3000/pages/lp
```

**Rodar servidor:**
```bash
cd c:\Codexo\SeuBairro-Web\seubairro
npm run dev
```

---

## 💡 Stack

- **Framework:** Next.js 16 + React 19
- **Linguagem:** TypeScript
- **Estilos:** CSS Modules
- **Fonte:** Inter (Google Fonts)
- **Ícones:** Remix Icon
- **Animações:** CSS puro
