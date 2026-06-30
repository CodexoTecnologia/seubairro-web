import type { Story } from '@ladle/react'
import { useState } from 'react'
import { Switch } from './Switch'

const meta = { title: 'Design System / Primitives / Switch' }
export default meta

export const Interativo: Story = () => {
  const [on, setOn] = useState(false)
  return <Switch label="Aberto Agora" checked={on} onChange={setOn} />
}

export const Ligado: Story = () => <Switch label="Ativo" checked onChange={() => {}} />
export const Desabilitado: Story = () => <Switch label="Indisponível" checked={false} onChange={() => {}} disabled />
