export enum CountryCodeEnum {
    Brasil = 1,
    Argentina = 2,
    Uruguai = 3,
}

export const getCountryName = (code: CountryCodeEnum): string => {
    const names: Record<CountryCodeEnum, string> = {
        [CountryCodeEnum.Brasil]: 'Brasil',
        [CountryCodeEnum.Argentina]: 'Argentina',
        [CountryCodeEnum.Uruguai]: 'Uruguai',
    };
    return names[code] || 'Desconhecido';
};

