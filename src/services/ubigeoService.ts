import { ajax } from "rxjs/ajax";

export interface UbigeoItem {
  id: string;
  nombre: string;
}

export interface UbigeoSearchItem {
  id: string;
  nombre: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

const base = () => (import.meta.env.VITE_BACKOFFICE_BASE_URL as string);

const headers = (token: string) => ({ Authorization: `Bearer ${token}` });

export const ubigeoService = {
  getRegiones: (token: string) =>
    ajax.getJSON<{ success: boolean; data: UbigeoItem[] }>(
      `${base()}/api/v1/ubigeos/regiones`,
      headers(token)
    ),

  getProvincias: (token: string, regionId: string) =>
    ajax.getJSON<{ success: boolean; data: UbigeoItem[] }>(
      `${base()}/api/v1/ubigeos/provincias?region_id=${regionId}`,
      headers(token)
    ),

  getDistritos: (token: string, provinciaId: string) =>
    ajax.getJSON<{ success: boolean; data: UbigeoItem[] }>(
      `${base()}/api/v1/ubigeos/distritos?provincia_id=${provinciaId}`,
      headers(token)
    ),

  search: (token: string, q: string) =>
    ajax.getJSON<{ success: boolean; data: UbigeoSearchItem[] }>(
      `${base()}/v1/ubigeos/search?q=${encodeURIComponent(q)}`,
      headers(token)
    ),
};
