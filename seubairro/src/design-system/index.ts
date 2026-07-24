/**
 * Design System — entrypoints por camada.
 *
 * Prefira importar do subpath específico (tree-shaking + clareza):
 *   import { Button } from '@/design-system/primitives'
 *   import { EmptyState } from '@/design-system/patterns'
 *   import { DashboardShell } from '@/design-system/layout'
 *
 * Este barrel raiz existe só para conveniência em scripts/testes.
 */
export * from './primitives'
export * from './patterns'
export * from './layout'
