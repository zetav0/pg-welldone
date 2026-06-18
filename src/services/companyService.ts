import type { Observable } from "rxjs";
import { RestApi } from "./restApi";
import { LocalStorageKeys } from "@/utilities/local-storage-manager";

/**
 * Company (empresa) domain service.
 *
 * Thin, typed wrapper over `RestApi` for the SUNAT company endpoints. Pages call
 * these instead of building URLs/bodies inline. Exposes the full CRUD surface so
 * it already scales to a multi-tenant module (a companies list/detail screen can
 * reuse `list`/`get`/`activate` without changes); the single-company Settings
 * screen just uses `get` + `create`/`update`.
 */

/* ── API shapes ──────────────────────────────────────── */

/** Standard `{ success, message, data }` envelope returned by the API. */
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** A company as returned by the API. Extra/server-managed fields are optional. */
export interface Company {
  id: number;
  ruc: string;
  razon_social: string;
  nombre_comercial: string | null;
  direccion: string | null;
  ubigeo: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  telefono: string | null;
  email: string | null;
  usuario_sol?: string | null;
  clave_sol?: string | null;
  // The API returns a boolean here; the create/update payload sends 0 | 1.
  modo_produccion: number | boolean;
  activo?: boolean;
  logo_path?: string | null;
  branches?: unknown[];
  created_at?: string;
  updated_at?: string;
}

/** Aggregate stats returned alongside the company list. */
export interface CompanyListMeta {
  total: number;
  active_count: number;
  production_count: number;
}

/** Response shape of `GET /api/v1/companies` (`data` + `meta`). */
export interface CompanyListResponse {
  success: boolean;
  message?: string;
  data: Company[];
  meta?: CompanyListMeta;
}

/** Body for creating a company (matches `POST /api/v1/companies`). */
export interface CompanyPayload {
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
  direccion: string;
  ubigeo: string;
  distrito: string;
  provincia: string;
  departamento: string;
  telefono: string;
  email: string;
  usuario_sol: string;
  clave_sol: string;
  modo_produccion: number;
}

/** Optional file uploads accepted by the update endpoint (form-data). */
export interface CompanyFiles {
  certificado_pem?: File;
  certificado_password?: string;
  logo_path?: File;
}

/* ── Internals ───────────────────────────────────────── */

const BASE = "/api/v1/companies";

function authToken(): string {
  return localStorage.getItem(LocalStorageKeys.TOKEN) ?? "";
}

/**
 * The update endpoint expects multipart/form-data (it accepts certificate/logo
 * files) and a `_method=PUT` override for the `POST` route.
 */
function toFormData(payload: Partial<CompanyPayload>, files?: CompanyFiles): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fd.append(key, String(value));
  });
  if (files?.certificado_pem) fd.append("certificado_pem", files.certificado_pem);
  if (files?.certificado_password) fd.append("certificado_password", files.certificado_password);
  if (files?.logo_path) fd.append("logo_path", files.logo_path);
  fd.append("_method", "PUT");
  return fd;
}

/* ── Service ─────────────────────────────────────────── */

export const companyService = {
  /** List the authenticated user's companies (with aggregate `meta`). */
  list(): Observable<CompanyListResponse> {
    return RestApi.secureGet(authToken(), BASE);
  },

  /** Fetch a single company by id. */
  get(id: number | string): Observable<ApiEnvelope<Company>> {
    return RestApi.secureGet(authToken(), `${BASE}/${id}`);
  },

  /** Create a new company. */
  create(payload: CompanyPayload): Observable<ApiEnvelope<Company>> {
    return RestApi.securePost(authToken(), BASE, payload);
  },

  /** Update an existing company (multipart, supports certificate/logo files). */
  update(
    id: number | string,
    payload: Partial<CompanyPayload>,
    files?: CompanyFiles
  ): Observable<ApiEnvelope<Company>> {
    return RestApi.securePost(authToken(), `${BASE}/${id}`, toFormData(payload, files));
  },

  /**
   * Activate a company for operations.
   * Note: in the API this route is mounted without the `/api` prefix.
   */
  activate(id: number | string): Observable<ApiEnvelope<Company>> {
    return RestApi.securePost(authToken(), `/v1/companies/${id}/activate`, {});
  },
};
