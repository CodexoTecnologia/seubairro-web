/**
 * Endereço resolvido a partir de um CEP (ViaCEP), já normalizado para o
 * formato usado pelos formulários de endereço do app.
 */
export interface CepAddress {
    /** Somente os 8 dígitos, sem máscara. */
    postalCode: string;
    /** Logradouro. Vazio para CEPs gerais de cidade. */
    street: string;
    /** Bairro. Vazio para CEPs gerais de cidade. */
    neighborhood: string;
    city: string;
    /** UF com 2 letras (ex.: "PR"). */
    stateProvince: string;
}
