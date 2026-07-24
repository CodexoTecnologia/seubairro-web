import type { Story } from '@ladle/react'
import { useState } from 'react'
import { SearchBar } from './SearchBar'

const meta = { title: 'Design System / Patterns / SearchBar' }
export default meta

export const Vazio: Story = () => {
  const [value, setValue] = useState('')
  return <SearchBar value={value} onChange={setValue} placeholder="Bolo de pote" />
}

export const ComTexto: Story = () => {
  const [value, setValue] = useState('Bolo de pote')
  return <SearchBar value={value} onChange={setValue} onSubmit={(v) => alert(`Buscar: ${v}`)} />
}
