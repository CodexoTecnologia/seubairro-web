import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // === Arquitetura do Design System ===
  // design-system/ NÃO pode importar de features/ nem de app/.
  // Mantém a camada de UI pura sem amarras de domínio.
  {
    files: ["src/design-system/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/app/*"],
              message:
                "design-system/ não pode depender de features/ nem de app/. Inverta a dependência ou passe via prop.",
            },
          ],
        },
      ],
    },
  },

  // primitives/ não pode importar de patterns/ nem de layout/ (sentido único da camada).
  {
    files: ["src/design-system/primitives/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/design-system/patterns/*",
                "@/design-system/layout/*",
                "@/features/*",
                "@/app/*",
              ],
              message:
                "primitives/ é a camada mais baixa do DS. Não pode importar patterns/, layout/, features/ ou app/.",
            },
          ],
        },
      ],
    },
  },

  // === Boas práticas ===
  {
    rules: {
      "@next/next/no-img-element": "error",
    },
  },
]);

export default eslintConfig;
