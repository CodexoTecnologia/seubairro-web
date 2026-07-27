import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_APP_ENV: z
        .enum(['development', 'staging', 'production'], {
            message: 'Deve ser "development", "staging" ou "production".',
        })
        .default('development'),

    NEXT_PUBLIC_API_BASE_URL: z
        .url({ message: 'URL inválida — informe a base da API, ex.: https://api.seubairro.com.br' })
        .refine((url) => !url.endsWith('/'), {
            message: 'Não deve terminar com "/" — o endpoint do Service já começa com "/".',
        }),

    NEXT_PUBLIC_API_TIMEOUT_MS: z.coerce
        .number({ message: 'Deve ser um número em milissegundos.' })
        .int()
        .positive()
        .default(30_000),

    NEXT_PUBLIC_SITE_URL: z
        .url({ message: 'URL inválida — informe a origem pública, ex.: https://seubairro.com.br' })
        .refine((url) => !url.endsWith('/'), {
            message: 'Não deve terminar com "/" — as URLs são concatenadas com "/rota".',
        }),

    NEXT_PUBLIC_VIACEP_BASE_URL: z.url().default('https://viacep.com.br/ws'),

    NEXT_PUBLIC_NOMINATIM_SEARCH_URL: z.url().default('https://nominatim.openstreetmap.org/search'),

    NEXT_PUBLIC_EXTERNAL_API_TIMEOUT_MS: z.coerce.number().int().positive().default(8_000),
});

/** String vazia (comum em painel de deploy) conta como ausente e cai no default. */
const emptyAsUndefined = (value: string | undefined) => (value?.trim() ? value : undefined);

/**
 * Cada chave precisa ser lida literalmente: o bundler do Next substitui o texto
 * `process.env.NEXT_PUBLIC_X` no build, então acesso dinâmico devolve undefined.
 */
const rawEnv = {
    NEXT_PUBLIC_APP_ENV: emptyAsUndefined(process.env.NEXT_PUBLIC_APP_ENV),
    NEXT_PUBLIC_API_BASE_URL: emptyAsUndefined(process.env.NEXT_PUBLIC_API_BASE_URL),
    NEXT_PUBLIC_API_TIMEOUT_MS: emptyAsUndefined(process.env.NEXT_PUBLIC_API_TIMEOUT_MS),
    NEXT_PUBLIC_SITE_URL: emptyAsUndefined(process.env.NEXT_PUBLIC_SITE_URL),
    NEXT_PUBLIC_VIACEP_BASE_URL: emptyAsUndefined(process.env.NEXT_PUBLIC_VIACEP_BASE_URL),
    NEXT_PUBLIC_NOMINATIM_SEARCH_URL: emptyAsUndefined(process.env.NEXT_PUBLIC_NOMINATIM_SEARCH_URL),
    NEXT_PUBLIC_EXTERNAL_API_TIMEOUT_MS: emptyAsUndefined(process.env.NEXT_PUBLIC_EXTERNAL_API_TIMEOUT_MS),
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
    const details = parsed.error.issues
        .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

    throw new Error(
        `Configuração de ambiente inválida:\n${details}\n\n` +
            'Ajuste .env.development / .env.production ou defina a variável no painel de deploy.'
    );
}

const env = parsed.data;

export const config = {
    appEnv: env.NEXT_PUBLIC_APP_ENV,
    api: {
        baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
        timeoutMs: env.NEXT_PUBLIC_API_TIMEOUT_MS,
    },
    site: {
        url: env.NEXT_PUBLIC_SITE_URL,
    },
    externalApis: {
        timeoutMs: env.NEXT_PUBLIC_EXTERNAL_API_TIMEOUT_MS,
        viaCep: { baseUrl: env.NEXT_PUBLIC_VIACEP_BASE_URL },
        nominatim: { searchUrl: env.NEXT_PUBLIC_NOMINATIM_SEARCH_URL },
    },
} as const;

export type AppConfig = typeof config;
