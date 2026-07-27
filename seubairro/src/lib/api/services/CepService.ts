import { config } from '@/lib/config';
import type { CepAddress } from '../dtos/Response/index';

/**
 * Consulta de CEP via ViaCEP (https://viacep.com.br). É uma API pública de
 * terceiros, portanto NÃO passa pelo `apiClient` (que é ligado ao backend do
 * SeuBairro, anexa token e trata 401). Mantemos o `fetch` isolado aqui para que
 * nenhum componente/hook fale HTTP diretamente.
 */

const VIACEP_BASE_URL = config.externalApis.viaCep.baseUrl;
const REQUEST_TIMEOUT_MS = config.externalApis.timeoutMs;

/** Resposta crua do ViaCEP (apenas os campos que consumimos). */
interface ViaCepResponse {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: boolean | string;
}

/** Remove máscara e mantém somente os 8 dígitos do CEP. */
export function sanitizeCep(value: string): string {
    return value.replace(/\D/g, '').slice(0, 8);
}

class CepServiceImpl {
    async lookup(postalCode: string): Promise<CepAddress> {
        const cep = sanitizeCep(postalCode);
        if (cep.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos.');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        let response: Response;
        try {
            response = await fetch(`${VIACEP_BASE_URL}/${cep}/json/`, {
                signal: controller.signal,
                headers: { Accept: 'application/json' },
            });
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                throw new Error('A consulta do CEP demorou demais. Tente novamente.');
            }
            throw new Error('Falha de conexão ao consultar o CEP.');
        } finally {
            clearTimeout(timeoutId);
        }

        if (!response.ok) {
            throw new Error('Não foi possível consultar o CEP agora.');
        }

        const data = (await response.json()) as ViaCepResponse;
        if (data.erro || !data.uf || !data.localidade) {
            throw new Error('CEP não encontrado.');
        }

        return {
            postalCode: cep,
            street: data.logradouro ?? '',
            neighborhood: data.bairro ?? '',
            city: data.localidade,
            stateProvince: data.uf,
        };
    }
}

export const CepService = new CepServiceImpl();
