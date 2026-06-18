import { ajax } from "rxjs/ajax";

export interface UbigeoItem {
  id: string;
  nombre: string;
}

const base = () =>
  (import.meta.env.VITE_BACKOFFICE_BASE_URL as string);

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
};
