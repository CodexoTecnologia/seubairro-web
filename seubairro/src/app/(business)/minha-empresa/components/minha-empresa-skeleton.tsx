'use client'

import { Card } from '@/design-system/primitives/Card'
import { Skeleton } from '@/design-system/primitives/Skeleton'

/**
 * Esqueleto exato da página /minha-empresa para carregamento de alta performance
 * (elimina layout shift / CLS replicando a estrutura visual 1:1).
 */
export default function MinhaEmpresaSkeleton() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full animate-fade-in">
      {/* 1. PageHeader Esqueleto */}
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width={100} className="h-3.5" />
        <Skeleton variant="text" width={220} className="h-8 rounded-md" />
        <Skeleton variant="text" width="65%" className="h-4" />
      </div>

      {/* 2. Stepper / Barra de Progresso Esqueleto */}
      <Card padding="lg" className="flex flex-col gap-6 border-[var(--color-border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={260} className="h-5" />
            <Skeleton variant="text" width={340} className="h-3" />
          </div>
          <Skeleton variant="rect" width={140} height={24} className="rounded-md" />
        </div>

        {/* Trilha da Barra de Progresso */}
        <Skeleton variant="rect" width="100%" height={8} className="rounded-full" />

        {/* 5 Cards de Etapas (Stepper) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)]"
            >
              <Skeleton variant="circle" width={28} height={28} className="shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton variant="text" width="80%" className="h-3.5" />
                <Skeleton variant="text" width="60%" className="h-3" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Card Principal de Conteúdo (Simula a 1ª etapa: Dados & Identidade) */}
      <Card padding="lg" className="flex flex-col gap-6 border-[var(--color-border-default)]">
        {/* Cabeçalho do Card */}
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" width={20} height={20} />
          <Skeleton variant="text" width={160} className="h-4" />
        </div>

        {/* Capa / Banner (3:1 aspect ratio) */}
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" width={110} className="h-4" />
          <Skeleton variant="rect" width="100%" className="aspect-[3/1] rounded-[var(--radius-card)]" />
          <div className="flex items-center gap-3 mt-1">
            <Skeleton variant="rect" width={100} height={32} className="rounded-md" />
            <Skeleton variant="text" width={200} className="h-3" />
          </div>
        </div>

        {/* Logo + Formulário */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo */}
          <div className="flex flex-col gap-2 md:w-44 shrink-0">
            <Skeleton variant="text" width={40} className="h-4" />
            <Skeleton variant="rect" width="100%" className="aspect-square rounded-[var(--radius-card)]" />
            <Skeleton variant="rect" width="100%" height={32} className="rounded-md" />
          </div>

          {/* Campos do formulário */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-1.5">
              <Skeleton variant="text" width={120} className="h-4" />
              <Skeleton variant="rect" width="100%" height={40} className="rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton variant="text" width={90} className="h-4" />
                <Skeleton variant="rect" width="100%" height={40} className="rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton variant="text" width={80} className="h-4" />
                <Skeleton variant="rect" width="100%" height={40} className="rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton variant="text" width={160} className="h-4" />
                <Skeleton variant="rect" width="100%" height={40} className="rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton variant="text" width={110} className="h-4" />
                <Skeleton variant="rect" width="100%" height={40} className="rounded-lg" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton variant="text" width={120} className="h-4" />
              <Skeleton variant="rect" width="100%" height={96} className="rounded-lg" />
            </div>

            <Skeleton variant="rect" width={140} height={40} className="rounded-md self-end" />
          </div>
        </div>
      </Card>

      {/* 4. Rodapé de Navegação Esqueleto */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-default)]">
        <Skeleton variant="rect" width={90} height={36} className="rounded-md" />
        <Skeleton variant="text" width={100} className="h-4 hidden sm:block" />
        <Skeleton variant="rect" width={130} height={36} className="rounded-md" />
      </div>
    </div>
  )
}
