'use client'

import { useSyncExternalStore } from 'react'

/** Nunca notifica: a saudação só precisa ser resolvida na hidratação. */
const subscribe = () => () => {}

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const getSnapshot = () => greetingForHour(new Date().getHours())

/**
 * Saudação conforme o horário local de quem acessa.
 *
 * A página do dashboard é pré-renderizada, então o horário do build (ou do
 * servidor) não vale nada para o usuário. `useSyncExternalStore` resolve isso
 * sem risco de hidratação: o servidor rende o neutro "Olá" e o cliente troca
 * pela saudação real logo após hidratar.
 */
export function useGreeting(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'Olá')
}
