import type { Story } from '@ladle/react'
import { useState } from 'react'
import { Slider } from './Slider'

const meta = { title: 'Design System / Primitives / Slider' }
export default meta

export const Basico: Story = () => {
  const [value, setValue] = useState(5)
  return <div className="w-72"><Slider label="Volume" min={0} max={10} value={value} onChange={setValue} /></div>
}

export const RaioDistancia: Story = () => {
  const OPTIONS = [1, 2, 5, 10, 20]
  const [index, setIndex] = useState(2)
  return (
    <div className="w-72">
      <Slider
        label="Raio de Distância"
        min={0}
        max={OPTIONS.length - 1}
        value={index}
        onChange={setIndex}
        valueFormatter={(i) => `${OPTIONS[i]} km`}
      />
    </div>
  )
}

export const Desabilitado: Story = () => (
  <div className="w-72"><Slider label="Indisponível" min={0} max={10} value={3} onChange={() => {}} disabled /></div>
)
