/**
 * Geocodificação de endereço → coordenadas via Nominatim (OpenStreetMap) — o
 * mesmo ecossistema já usado nos mapas (leaflet). É uma API pública de terceiros,
 * então NÃO passa pelo `apiClient` (ligado ao backend do SeuBairro).
 *
 * Motivação: o backend aceita/retorna `latitude/longitude` como `null` no endereço
 * do usuário (`UpdateAddressRequest` nem tem esses campos). Sem coordenadas o feed
 * por proximidade não roda, então derivamos as coords no cliente.
 *
 * Estratégia de consulta: busca livre (`q`) com "rua, bairro, cidade, UF, Brasil".
 * O `postalcode` estruturado tem cobertura ruim para CEPs brasileiros no OSM (costuma
 * cair no centroide da cidade), enquanto a busca livre resolve em nível de rua e
 * degrada para bairro/cidade quando a rua não existe no mapa.
 *
 * Política de uso do Nominatim: máx. ~1 req/s e identificação via Referer (enviado
 * automaticamente pelo navegador). Adequado para o volume de uma tela de perfil.
 */

import { config } from '@/lib/config';

const NOMINATIM_URL = config.externalApis.nominatim.searchUrl;
const REQUEST_TIMEOUT_MS = config.externalApis.timeoutMs;

/** Ponto geográfico simples (mesmo formato de `Coords` do LocationContext). */
export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface GeocodeAddressInput {
    street?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    stateProvince?: string | null;
}

interface NominatimResult {
    lat: string;
    lon: string;
}

/** Monta "Rua X, 123, Bairro, Cidade, UF, Brasil" a partir das partes disponíveis. */
function buildQuery(input: GeocodeAddressInput): string {
    const streetLine = [input.street, input.number]
        .map((s) => (s ?? '').trim())
        .filter(Boolean)
        .join(', ');
    return [streetLine, input.neighborhood, input.city, input.stateProvince, 'Brasil']
        .map((s) => (s ?? '').trim())
        .filter(Boolean)
        .join(', ');
}

function hasEnoughToGeocode(input: GeocodeAddressInput): boolean {
    return Boolean(input.city?.trim() && input.stateProvince?.trim());
}

class GeocodingServiceImpl {
    /** Retorna as coordenadas do endereço, ou `null` se não encontrar. */
    async geocodeAddress(input: GeocodeAddressInput): Promise<GeoPoint | null> {
        if (!hasEnoughToGeocode(input)) return null;

        const params = new URLSearchParams({
            format: 'jsonv2',
            limit: '1',
            countrycodes: 'br',
            'accept-language': 'pt-BR',
            q: buildQuery(input),
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        let response: Response;
        try {
            response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
                signal: controller.signal,
                headers: { Accept: 'application/json' },
            });
        } catch {
            return null;
        } finally {
            clearTimeout(timeoutId);
        }

        if (!response.ok) return null;

        const data = (await response.json()) as NominatimResult[];
        const first = data[0];
        if (!first) return null;

        const lat = Number(first.lat);
        const lng = Number(first.lon);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        return { lat, lng };
    }

    /** Se há dados mínimos (cidade + UF) para tentar geocodificar. */
    canGeocode(input: GeocodeAddressInput): boolean {
        return hasEnoughToGeocode(input);
    }
}

export const GeocodingService = new GeocodingServiceImpl();
