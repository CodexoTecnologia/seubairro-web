/**
 * Monta um link wa.me a partir de telefone em dígitos puros (sem `+`, sem máscara).
 *
 * Obs.: para o botão de contato do anúncio, o backend já entrega `whatsappLink`
 * pronto e localizado — use-o diretamente. Este helper é para outros contextos
 * onde o FE precise montar o link client-side.
 */
export function whatsappLink(
  phoneCountryCode: string,
  phoneNumber: string,
  message: string,
): string {
  if (!/^\d{1,3}$/.test(phoneCountryCode)) {
    throw new Error(`Código do país inválido: "${phoneCountryCode}". Use apenas dígitos (ex.: 55).`)
  }
  if (!/^\d{8,15}$/.test(phoneNumber)) {
    throw new Error(`Número de telefone inválido: "${phoneNumber}". Use 8 a 15 dígitos, sem máscara.`)
  }
  return `https://wa.me/${phoneCountryCode}${phoneNumber}?text=${encodeURIComponent(message)}`
}
