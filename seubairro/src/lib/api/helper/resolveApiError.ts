import { ApiClientError } from '../Client/ApiClientError';

/**
 * Resolve uma mensagem amigável a partir de um erro de API.
 *
 * - Se o `error.code` estiver no mapa fornecido pelo chamador, usa essa mensagem.
 * - Se for `ValidationFailed`, concatena os itens de `error.details` (validações
 *   estruturais vindas do backend).
 * - Caso contrário, devolve o `fallback`.
 *
 * As strings de mensagem ficam no chamador (camada de UI); este helper só decide
 * qual usar a partir do contrato de erro.
 */
export function resolveApiErrorMessage(
    err: unknown,
    messages: Record<string, string>,
    fallback: string
): string {
    if (err instanceof ApiClientError) {
        if (messages[err.code]) return messages[err.code];
        if (err.code === 'OrderOutOfStock') {
            const item = err.details?.[0];
            return item
                ? `O item "${item}" está sem estoque suficiente no momento.`
                : 'Este anúncio está sem estoque disponível no momento.';
        }
        if (err.code === 'ValidationFailed' && err.details && err.details.length > 0) {
            return err.details.join(' ');
        }
        if (err.message && err.message !== 'Erro na requisição da API' && err.message !== err.code) {
            return err.message;
        }
    }
    return fallback;
}
