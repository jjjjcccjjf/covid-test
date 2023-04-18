export type CountryData = {
    country: string;
    confirmed: number;
    deaths: number;
    recovered: number;
}

export type ObservationData = {
    observation_date: string;
    countries: CountryData[];
}

export type ResponseError = {
    errors: string | object
}