/**
 * Formata distância em pt-BR para exibição no feed/cards.
 * < 1000 m: arredonda à centena → "a 800 m de você".
 * >= 1000 m: km com 1 casa decimal e vírgula → "a 1,2 km de você".
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    const rounded = Math.round(meters / 100) * 100
    return `a ${rounded} m de você`
  }
  const km = meters / 1000
  const formatted = km.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return `a ${formatted} km de você`
}
