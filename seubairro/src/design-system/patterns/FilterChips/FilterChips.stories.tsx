import type { Story } from '@ladle/react'
import { useState } from 'react'
import { FilterChips } from './FilterChips'

const meta = { title: 'Design System / Patterns / FilterChips' }
export default meta

const NICHES = [
  { value: 'a', label: 'Vegano' },
  { value: 'b', label: 'Sem glúten' },
  { value: 'c', label: 'Artesanal' },
  { value: 'd', label: 'Fitness' },
]

export const Multipla: Story = () => {
  const [selected, setSelected] = useState<string[]>(['a'])
  return <FilterChips ariaLabel="Nichos" multi items={NICHES} selected={selected} onChange={setSelected} />
}

export const Unica: Story = () => {
  const [selected, setSelected] = useState<string[]>([])
  return (
    <FilterChips
      ariaLabel="Tipo"
      multi={false}
      items={[
        { value: 'all', label: 'Tudo' },
        { value: 'product', label: 'Produtos' },
        { value: 'service', label: 'Serviços' },
      ]}
      selected={selected}
      onChange={setSelected}
    />
  )
}
