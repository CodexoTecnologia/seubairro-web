import type { Story } from '@ladle/react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './Card'
import { Button } from '../Button'

const meta = { title: 'Design System / Primitives / Card' }
export default meta

export const Default: Story = () => (
  <Card>
    <p>Card simples com padding padrão.</p>
  </Card>
)

export const WithHeaderAndFooter: Story = () => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>Plano Premium</CardTitle>
      <CardDescription>Recursos extras para o seu negócio.</CardDescription>
    </CardHeader>
    <p className="text-sm">
      Suporte prioritário, destaque nos resultados e relatórios avançados.
    </p>
    <CardFooter>
      <Button variant="outline" size="sm">Saber mais</Button>
      <Button size="sm">Assinar</Button>
    </CardFooter>
  </Card>
)

export const Variants: Story = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card variant="default">
      <strong>default</strong>
      <p className="text-sm">Borda + superfície neutra.</p>
    </Card>
    <Card variant="elevated">
      <strong>elevated</strong>
      <p className="text-sm">Sombra suave, sem borda.</p>
    </Card>
    <Card variant="outlined">
      <strong>outlined</strong>
      <p className="text-sm">Apenas borda, fundo transparente.</p>
    </Card>
  </div>
)

export const Paddings: Story = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
    <Card padding="none">none</Card>
    <Card padding="sm">sm</Card>
    <Card padding="md">md</Card>
    <Card padding="lg">lg</Card>
  </div>
)
