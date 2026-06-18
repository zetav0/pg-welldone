import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { Table } from "../components/ui/Table";
import type { ColumnDef } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { Drawer } from "../components/common/Drawer";
import { useToast } from "../components/common/Toast";
import { SearchSelectCustom } from "../components/common/SearchSelect";
import type { SearchSelectOption } from "../components/common/SearchSelect";
import { ubigeoService } from "@/services/ubigeoService";
import type { UbigeoItem } from "@/services/ubigeoService";
import { useApp } from "@/context/AppContext";
import { useCompany } from "@/context/CompanyContext";
import { RestApi } from "@/services/restApi";
/* ── API types ───────────────────────────────────────── */

interface ApiClient {
  id: number;
  tipo_documento: "1" | "6";
  numero_documento: string;
  razon_social: string;
  nombre_comercial: string | null;
  direccion: string;
  ubigeo: string;
  distrito: string;
  provincia: string;
  departamento: string;
  telefono: string | null;
  email: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  company_id: number;
  company: { id: number; ruc: string; razon_social: string };
}

interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

/* ── Helpers ─────────────────────────────────────────── */

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}


/* ── Styled components ───────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1.6rem;
    gap: 2.4rem;
  }
`;

const PageHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const HeadingText = styled.div``;

const PageTitle = styled.h2`
  margin: 0;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const PageSubtitle = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const HeadingActions = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

/* ── KPI cards ───────────────────────────────────────── */

const KpiGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 2rem;
`;

const KpiCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;
`;

const KpiIcon = styled.div`
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
  opacity: 0.08;
  color: ${(p) => p.theme.colors.text};
`;

const KpiLabel = styled.p`
  margin: 0;
  font-size: 1.0rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const KpiValue = styled.p<{ $color?: string }>`
  margin: 0;
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  line-height: 1;
  color: ${(p) => p.$color ?? p.theme.colors.text};
`;

const KpiSub = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const KpiProgress = styled.div`
  width: 100%;
  height: 0.4rem;
  background: ${(p) => p.theme.colors.chipBg};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.4rem;
`;

const KpiProgressBar = styled.div<{ $pct: number; $color?: string }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: ${(p) => p.$color ?? p.theme.colors.primary};
  border-radius: 9999px;
`;

/* ── Filter bar ──────────────────────────────────────── */

const FilterBar = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 1.6rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
  flex: 1;
  min-width: 22rem;
  max-width: 40rem;

  &:focus-within {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg};
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  width: 100%;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;


const FilterActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-left: auto;
`;

const IconBtn = styled.button`
  width: 3.8rem;
  height: 3.8rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
    color: ${(p) => p.theme.colors.text};
  }
`;

/* ── Table card ──────────────────────────────────────── */

const TableCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  overflow: hidden;
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 2.4rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  flex-wrap: wrap;
  gap: 1.2rem;
`;

/* ── Client cell ─────────────────────────────────────── */

const ClientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ClientAvatar = styled.div<{ $color: string }>`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 1rem;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
`;

const ClientInfo = styled.div``;
const ClientName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;
const ClientEmail = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const RucText = styled.span`
  font-size: 1.3rem;
  font-family: monospace;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: 0.04em;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
`;

const ActionBtn = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 0.6rem;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primaryBg};
    color: ${(p) => p.theme.colors.primary};
  }
`;

/* ── Drawer form ─────────────────────────────────────── */

const DrawerForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2.4rem;
  flex: 1;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const FormLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textSubtle};
`;

const FormInput = styled.input`
  padding: 1rem 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.8rem;
  background: ${(p) => p.theme.colors.inputBg};
  font-size: 1.4rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;


const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const TypeToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.6rem;
  border-radius: 1rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

const FormSectionTitle = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const TypeOption = styled.label<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.4rem;
  border-radius: 0.8rem;
  border: 1.5px solid ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${(p) => (p.$active ? p.theme.colors.primaryBg : "transparent")};
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  transition: all 0.15s;

  input { display: none; }
`;

/* ── Detail panel ────────────────────────────────────── */

const DetailBody = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  overflow-y: auto;
  flex: 1;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const DetailAvatar = styled.div<{ $color: string }>`
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 1.4rem;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
`;

const DetailMeta = styled.div``;
const DetailName = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.text};
`;
const DetailSub = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const DetailBadges = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const InfoItemLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const InfoItemValue = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const SectionTitle = styled.h4`
  margin: 0 0 1.2rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;


const ErrorMsg = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;


/* ── Avatar color pool ───────────────────────────────── */

const AVATAR_COLORS = [
  "rgba(113,42,226,0.1)",
  "rgba(22,163,74,0.1)",
  "rgba(234,179,8,0.1)",
  "rgba(59,130,246,0.1)",
  "rgba(239,68,68,0.1)",
  "rgba(20,184,166,0.1)",
];

function avatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(
  onView: (c: ApiClient) => void,
  onEdit: (c: ApiClient) => void,
): ColumnDef<ApiClient>[] {
  return [
    {
      key: "razon_social",
      header: "Cliente / Razón Social",
      sortable: true,
      render: (row) => (
        <ClientCell>
          <ClientAvatar $color={avatarColor(row.id)}>
            {getInitials(row.razon_social)}
          </ClientAvatar>
          <ClientInfo>
            <ClientName>{row.razon_social}</ClientName>
            <ClientEmail>{row.email}</ClientEmail>
          </ClientInfo>
        </ClientCell>
      ),
    },
    {
      key: "numero_documento",
      header: "RUC / DNI",
      sortable: true,
      render: (row) => <RucText>{row.numero_documento}</RucText>,
    },
    {
      key: "tipo_documento",
      header: "Tipo",
      render: (row) => (
        <Badge variant={row.tipo_documento === "6" ? "primary" : "neutral"} size="sm">
          {row.tipo_documento === "6" ? "Empresa" : "Persona"}
        </Badge>
      ),
    },
    {
      key: "telefono",
      header: "Teléfono",
      render: (row) => row.telefono ?? "—",
    },
    {
      key: "activo",
      header: "Estado",
      render: (row) => (
        <Badge variant={row.activo ? "success" : "neutral"} size="sm" pill>
          {row.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "",
      render: (row) => (
        <ActionRow>
          <ActionBtn title="Ver detalle" onClick={(e) => { e.stopPropagation(); onView(row); }}>
            <Icon name="visibility" size={16} />
          </ActionBtn>
          <ActionBtn title="Editar" onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
            <Icon name="edit" size={16} />
          </ActionBtn>
        </ActionRow>
      ),
    },
  ];
}

/* ── Form schema ─────────────────────────────────────── */

const customerSchema = z.object({
  tipo_documento: z.enum(["1", "6"]),
  numero_documento: z.string(),
  razon_social: z.string().min(3, "Mínimo 3 caracteres"),
  nombre_comercial: z.string().optional().or(z.literal("")),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional().or(z.literal("")),
  direccion: z.string().min(5, "Dirección requerida"),
  ubigeo: z.string().regex(/^\d{6}$/, "Código ubigeo de 6 dígitos (ej. 150101)"),
  departamento: z.string().min(2, "Selecciona un departamento"),
  provincia: z.string().min(2, "Selecciona una provincia"),
  distrito: z.string().min(2, "Selecciona un distrito"),
}).superRefine((d, ctx) => {
  if (d.tipo_documento === "6") {
    if (!/^\d{11}$/.test(d.numero_documento))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numero_documento"], message: "RUC debe tener exactamente 11 dígitos" });
  } else {
    if (!/^\d{8}$/.test(d.numero_documento))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numero_documento"], message: "DNI debe tener exactamente 8 dígitos" });
  }
});

type CustomerFields = z.infer<typeof customerSchema>;

const BLANK_CUSTOMER: CustomerFields = {
  tipo_documento: "6", numero_documento: "", razon_social: "", nombre_comercial: "",
  email: "", telefono: "", direccion: "", ubigeo: "", departamento: "", provincia: "", distrito: "",
};

/* ── Component ───────────────────────────────────────── */

type DrawerMode = "none" | "new" | "detail" | "edit";

export default function Customers() {
  const { toast } = useToast();
  const { token } = useApp();
  const { companies, activeCompanyId, setActiveCompanyId } = useCompany();

  /* ── API state ── */
  const [apiClients, setApiClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<ApiMeta | null>(null);

  /* ── Filter / pagination state ── */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  /* ── GET /v1/clients ── */
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const baseUrl = import.meta.env.VITE_BACKOFFICE_BASE_URL as string;
    const url = `${baseUrl}/api/v1/clients?per_page=${pageSize}&page=${page}&search=${encodeURIComponent(search)}`;
    const sub = ajax
      .getJSON<{ success: boolean; data: ApiClient[]; meta: ApiMeta }>(url, {
        Authorization: `Bearer ${token}`,
      })
      .subscribe({
        next: (res) => {
          setApiClients(res.data ?? []);
          setMeta(res.meta ?? null);
          setLoading(false);
        },
        error: () => setLoading(false),
      });
    return () => sub.unsubscribe();
  }, [token, search, page, pageSize]);

  const totalPages = meta?.last_page ?? 1;
  const safePage = Math.min(page, totalPages);

  /* ── Search by document (onBlur del input) ── */
  const searchByDocument = (docNumber: string, tipoDoc: string) => {
    const requiredLen = tipoDoc === "6" ? 11 : 8;
    if (!token || docNumber.length !== requiredLen) return;
    clearErrors("numero_documento");
    const base = (import.meta.env.VITE_BACKOFFICE_BASE_URL as string).replace(/\/api$/, "");
    ajax<{ success: boolean; data: ApiClient }>({
      url: `${base}/api/v1/clients/search-by-document`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: { company_id: activeCompanyId, tipo_documento: tipoDoc, numero_documento: docNumber },
    }).subscribe({
      next: ({ response: res }) => {
        if (!res.success || !res.data) {
          setError("numero_documento", {
            type: "manual",
            message: tipoDoc === "6" ? "RUC no encontrado para esta empresa" : "DNI no encontrado para esta empresa",
          });
          return;
        }
        const d = res.data;
        setValue("razon_social", d.razon_social, { shouldValidate: true });
        setValue("nombre_comercial", d.nombre_comercial ?? "", { shouldValidate: true });
        setValue("email", d.email, { shouldValidate: true });
        setValue("telefono", d.telefono ?? "", { shouldValidate: true });
        setValue("direccion", d.direccion, { shouldValidate: true });
        setValue("ubigeo", d.ubigeo, { shouldValidate: true });
        setValue("departamento", d.departamento, { shouldValidate: true });
        setValue("provincia", d.provincia, { shouldValidate: true });
        setValue("distrito", d.distrito, { shouldValidate: true });
      },
      error: () => {
        setError("numero_documento", {
          type: "manual",
          message: tipoDoc === "6" ? "RUC no encontrado para esta empresa" : "DNI no encontrado para esta empresa",
        });
      },
    });
  };

  /* ── Drawer ── */
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("none");
  const [activeClient, setActiveClient] = useState<ApiClient | null>(null);

  /* ── Form (New / Edit) ── */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
  } = useForm<CustomerFields>({ resolver: zodResolver(customerSchema), defaultValues: { ...BLANK_CUSTOMER } });

  const currentTipoDoc = watch("tipo_documento");
  const watchedDep = watch("departamento");
  const watchedProv = watch("provincia");

  /* ── Reset form when active company changes ── */
  useEffect(() => {
    reset({ ...BLANK_CUSTOMER });
  }, [activeCompanyId, reset]);

  /* ── Ubigeo API state ── */
  const [regiones, setRegiones] = useState<UbigeoItem[]>([]);
  const [provincias, setProvincias] = useState<UbigeoItem[]>([]);
  const [distritos, setDistritos] = useState<UbigeoItem[]>([]);

  useEffect(() => {
    if (!token) return;
    const sub = ubigeoService.getRegiones(token).subscribe({
      next: (res) => setRegiones(res.data ?? []),
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, [token]);

  useEffect(() => {
    setProvincias([]);
    setDistritos([]);
    if (!token || !watchedDep) return;
    const regionId = regiones.find((r) => r.nombre === watchedDep)?.id;
    if (!regionId) return;
    const sub = ubigeoService.getProvincias(token, regionId).subscribe({
      next: (res) => setProvincias(res.data ?? []),
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, [token, watchedDep, regiones]);

  useEffect(() => {
    setDistritos([]);
    if (!token || !watchedProv) return;
    const provinciaId = provincias.find((p) => p.nombre === watchedProv)?.id;
    if (!provinciaId) return;
    const sub = ubigeoService.getDistritos(token, provinciaId).subscribe({
      next: (res) => setDistritos(res.data ?? []),
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, [token, watchedProv, provincias]);

  const depOptions = useMemo<SearchSelectOption[]>(
    () => regiones.map((r) => ({ id: r.nombre, title: r.nombre })),
    [regiones]
  );
  const provOptions = useMemo<SearchSelectOption[]>(
    () => provincias.map((p) => ({ id: p.nombre, title: p.nombre })),
    [provincias]
  );
  const distOptions = useMemo<SearchSelectOption[]>(
    () => distritos.map((d) => ({ id: d.nombre, title: d.nombre })),
    [distritos]
  );

  /* ── Company options ── */
  const companyOptions = useMemo<SearchSelectOption[]>(
    () => companies.map((c) => ({ id: String(c.id), title: `${c.razon_social}  ·  ${c.ruc}` })),
    [companies]
  );

  /* ── Handlers ── */
  function openNew() {
    reset({ ...BLANK_CUSTOMER });
    setDrawerMode("new");
  }

  function openDetail(c: ApiClient) {
    setActiveClient(c);
    setDrawerMode("detail");
  }

  function openEdit(c: ApiClient) {
    setActiveClient(c);
    reset({
      tipo_documento: c.tipo_documento,
      numero_documento: c.numero_documento,
      razon_social: c.razon_social,
      nombre_comercial: c.nombre_comercial ?? "",
      email: c.email,
      telefono: c.telefono ?? "",
      direccion: c.direccion,
      ubigeo: c.ubigeo,
      departamento: c.departamento,
      provincia: c.provincia,
      distrito: c.distrito,
    });
    setDrawerMode("edit");
  }

  function closeDrawer() {
    setDrawerMode("none");
    setActiveClient(null);
    reset({ ...BLANK_CUSTOMER });
  }

  const onSave = handleSubmit((data) => {
    if (drawerMode === "new") {
      const { nombre_comercial, ...rest } = data;
      const payload = {
        company_id: activeCompanyId,
        ...rest,
        ...(data.tipo_documento === "6" && nombre_comercial ? { nombre_comercial } : {}),
      };
      RestApi.securePost(token ?? "", "/api/v1/clients", payload).subscribe({
        next: () => {
          toast({ variant: "success", title: "Cliente registrado", description: data.razon_social });
          closeDrawer();
        },
        error: () => {
          toast({ variant: "error", title: "Error al registrar", description: "No se pudo crear el cliente." });
        },
      });
    } else {
      of(null).subscribe({
        next: () => {
          toast({ variant: "success", title: "Cliente actualizado", description: data.razon_social });
          closeDrawer();
        },
      });
    }
  });

  function handleExport() {
    toast({ variant: "info", title: "Exportando…", description: "El archivo Excel estará listo en unos segundos." });
  }

  const columns = useMemo(() => buildColumns(openDetail, openEdit), []);

  /* ── Render ── */
  return (
    <>
      <ContentArea>
        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <PageHeading>
            <HeadingText>
              <PageTitle>Gestión de Clientes</PageTitle>
              <PageSubtitle>Centraliza y optimiza la relación con tus clientes SUNAT.</PageSubtitle>
            </HeadingText>
            <HeadingActions>
              <Button variant="ghost" onClick={handleExport}>
                <Icon name="download" size={16} />
                Exportar Excel
              </Button>
              <Button variant="primary" onClick={openNew}>
                <Icon name="person_add" size={16} />
                Agregar Cliente
              </Button>
            </HeadingActions>
          </PageHeading>
        </motion.div>

        {/* KPIs */}
        <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="groups" size={56} /></KpiIcon>
            <KpiLabel>Total Clientes</KpiLabel>
            <KpiValue>{(meta?.total ?? 0).toLocaleString()}</KpiValue>
            <KpiSub>Registrados en el sistema</KpiSub>
            <KpiProgress>
              <KpiProgressBar $pct={100} />
            </KpiProgress>
          </KpiCard>

          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="corporate_fare" size={56} /></KpiIcon>
            <KpiLabel>Empresas (RUC)</KpiLabel>
            <KpiValue>{apiClients.filter((c) => c.tipo_documento === "6").length}</KpiValue>
            <KpiSub>En la página actual</KpiSub>
          </KpiCard>

          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="person" size={56} /></KpiIcon>
            <KpiLabel>Personas Naturales</KpiLabel>
            <KpiValue>{apiClients.filter((c) => c.tipo_documento === "1").length}</KpiValue>
            <KpiSub>En la página actual</KpiSub>
          </KpiCard>

          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="verified" size={56} /></KpiIcon>
            <KpiLabel>Activos</KpiLabel>
            <KpiValue>{apiClients.filter((c) => c.activo).length}</KpiValue>
            <KpiSub>En la página actual</KpiSub>
          </KpiCard>
        </KpiGrid>

        {/* Filters */}
        <FilterBar>
          <SearchBox>
            <Icon name="search" size={18} />
            <SearchInput
              placeholder="Buscar por razón social, RUC o correo…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </SearchBox>

          <FilterActions>
            <IconBtn title="Limpiar búsqueda" onClick={() => { setSearch(""); setPage(1); }}>
              <Icon name="filter_alt_off" size={18} />
            </IconBtn>
          </FilterActions>
        </FilterBar>

        {/* Table */}
        <TableCard>
          <Table<ApiClient>
            data={apiClients}
            keyField="id"
            columns={columns}
            onRowClick={openDetail}
            density="default"
            loading={loading}
            emptyMessage="No se encontraron clientes."
          />

          <PaginationRow>
            <Pagination.Info
              page={safePage}
              pageSize={pageSize}
              totalItems={meta?.total ?? 0}
            />
            <Pagination.Pages
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </PaginationRow>
        </TableCard>
      </ContentArea>

      {/* ── Drawer: Nuevo / Editar Cliente ── */}
      <Drawer
        open={drawerMode === "new" || drawerMode === "edit"}
        onClose={closeDrawer}
        title={drawerMode === "new" ? "Nuevo Cliente" : "Editar Cliente"}
        description={drawerMode === "new" ? "Completa los datos para registrar un nuevo cliente." : `Actualizando datos de ${activeClient?.razon_social ?? ""}`}
        size="md"
      >
        <DrawerForm>
          {/* ── Sección 1: Empresa y tipo ── */}
          <FormSection>
            <FormSectionTitle>
              <Icon name="domain" size={14} />
              Identificación
            </FormSectionTitle>

            <FormGroup>
              <FormLabel>Empresa emisora</FormLabel>
              <SearchSelectCustom
                options={companyOptions}
                value={activeCompanyId ? String(activeCompanyId) : null}
                onChange={(val) => setActiveCompanyId(Number(val))}
                placeholder="Selecciona empresa…"
                searchPlaceholder="Buscar por nombre o RUC…"
                dataCy="cy-company-select"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Tipo de cliente</FormLabel>
              <TypeToggle>
                {([["6", "corporate_fare", "Empresa (RUC)"], ["1", "person", "Persona Natural (DNI)"]] as [string, string, string][]).map(([val, icon, label]) => (
                  <TypeOption key={val} $active={currentTipoDoc === val}>
                    <input
                      type="radio"
                      name="tipo_documento"
                      value={val}
                      checked={currentTipoDoc === val}
                      onChange={() => {
                        setValue("tipo_documento", val as "1" | "6", { shouldValidate: true });
                        setValue("numero_documento", "");
                        setValue("nombre_comercial", "");
                      }}
                    />
                    <Icon name={icon} size={16} />
                    {label}
                  </TypeOption>
                ))}
              </TypeToggle>
            </FormGroup>

            <FormGroup>
              <FormLabel>{currentTipoDoc === "6" ? "RUC (11 dígitos)" : "DNI (8 dígitos)"}</FormLabel>
              <FormInput
                type="text"
                maxLength={currentTipoDoc === "6" ? 11 : 8}
                placeholder={currentTipoDoc === "6" ? "20XXXXXXXXX" : "XXXXXXXX"}
                {...register("numero_documento")}
                onChange={(e) => setValue("numero_documento", e.target.value.replace(/\D/g, ""), { shouldValidate: true })}
                onBlur={(e) => searchByDocument(e.target.value.trim(), currentTipoDoc)}
              />
              {errors.numero_documento && <ErrorMsg><Icon name="error" size={14} />{errors.numero_documento.message}</ErrorMsg>}
            </FormGroup>
          </FormSection>

          {/* ── Sección 2: Datos del cliente (según tipo) ── */}
          <FormSection>
            <FormSectionTitle>
              <Icon name={currentTipoDoc === "6" ? "corporate_fare" : "person"} size={14} />
              {currentTipoDoc === "6" ? "Datos de la Empresa" : "Datos Personales"}
            </FormSectionTitle>

            <FormGroup>
              <FormLabel>{currentTipoDoc === "6" ? "Razón Social" : "Nombre Completo"}</FormLabel>
              <FormInput
                type="text"
                placeholder={currentTipoDoc === "6" ? "Ej. CLIENTE CORPORATIVO SAC" : "Ej. Juan Carlos Pérez López"}
                {...register("razon_social")}
              />
              {errors.razon_social && <ErrorMsg><Icon name="error" size={14} />{errors.razon_social.message}</ErrorMsg>}
            </FormGroup>

            {currentTipoDoc === "6" && (
              <FormGroup>
                <FormLabel>Nombre Comercial <span style={{ fontWeight: 400, opacity: 0.6 }}>(opcional)</span></FormLabel>
                <FormInput
                  type="text"
                  placeholder="Ej. Cliente Corp"
                  {...register("nombre_comercial")}
                />
              </FormGroup>
            )}

            <FormRow>
              <FormGroup>
                <FormLabel>Correo electrónico</FormLabel>
                <FormInput
                  type="email"
                  placeholder={currentTipoDoc === "6" ? "contacto@empresa.com" : "juan.perez@email.com"}
                  {...register("email")}
                />
                {errors.email && <ErrorMsg><Icon name="error" size={14} />{errors.email.message}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <FormLabel>Teléfono</FormLabel>
                <FormInput
                  type="tel"
                  placeholder={currentTipoDoc === "6" ? "01-2345678" : "987654321"}
                  {...register("telefono")}
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* ── Sección 3: Dirección y ubicación ── */}
          <FormSection>
            <FormSectionTitle>
              <Icon name="location_on" size={14} />
              Dirección Fiscal
            </FormSectionTitle>

            <FormRow>
              <FormGroup style={{ flex: 2 }}>
                <FormLabel>Dirección</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Av. Javier Prado 1234"
                  {...register("direccion")}
                />
                {errors.direccion && <ErrorMsg><Icon name="error" size={14} />{errors.direccion.message}</ErrorMsg>}
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <FormLabel>Ubigeo</FormLabel>
                <FormInput
                  type="text"
                  maxLength={6}
                  placeholder="150101"
                  {...register("ubigeo")}
                  onChange={(e) => setValue("ubigeo", e.target.value.replace(/\D/g, ""), { shouldValidate: true })}
                />
                {errors.ubigeo && <ErrorMsg><Icon name="error" size={14} />{errors.ubigeo.message}</ErrorMsg>}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <FormLabel>Departamento</FormLabel>
              <Controller
                name="departamento"
                control={control}
                render={({ field }) => (
                  <SearchSelectCustom
                    options={depOptions}
                    value={field.value || null}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("provincia", "", { shouldValidate: false });
                      setValue("distrito", "", { shouldValidate: false });
                    }}
                    placeholder="Selecciona departamento…"
                    searchPlaceholder="Buscar departamento…"
                    error={errors.departamento?.message}
                    dataCy="cy-departamento"
                  />
                )}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <FormLabel>Provincia</FormLabel>
                <Controller
                  name="provincia"
                  control={control}
                  render={({ field }) => (
                    <SearchSelectCustom
                      options={provOptions}
                      value={field.value || null}
                      onChange={(val) => {
                        field.onChange(val);
                        setValue("distrito", "", { shouldValidate: false });
                      }}
                      placeholder="Selecciona…"
                      searchPlaceholder="Buscar provincia…"
                      disabled={!watchedDep}
                      error={errors.provincia?.message}
                      dataCy="cy-provincia"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Distrito</FormLabel>
                <Controller
                  name="distrito"
                  control={control}
                  render={({ field }) => (
                    <SearchSelectCustom
                      options={distOptions}
                      value={field.value || null}
                      onChange={field.onChange}
                      placeholder="Selecciona distrito…"
                      searchPlaceholder="Buscar distrito…"
                      disabled={!watchedProv}
                      error={errors.distrito?.message}
                      dataCy="cy-distrito"
                    />
                  )}
                />
              </FormGroup>
            </FormRow>
          </FormSection>
        </DrawerForm>

        <Drawer.Footer>
          <Button variant="ghost" onClick={closeDrawer}>Cancelar</Button>
          <Button variant="primary" onClick={onSave}>
            <Icon name={drawerMode === "new" ? "person_add" : "save"} size={16} />
            {drawerMode === "new" ? "Registrar Cliente" : "Guardar Cambios"}
          </Button>
        </Drawer.Footer>
      </Drawer>

      {/* ── Drawer: Detalle del Cliente ── */}
      {activeClient && (
        <Drawer
          open={drawerMode === "detail"}
          onClose={closeDrawer}
          title="Detalle del Cliente"
          size="md"
        >
          <DetailBody>
            <DetailHeader>
              <DetailAvatar $color={avatarColor(activeClient.id)}>
                {getInitials(activeClient.razon_social)}
              </DetailAvatar>
              <DetailMeta>
                <DetailName>{activeClient.razon_social}</DetailName>
                <DetailSub>{activeClient.email}</DetailSub>
              </DetailMeta>
            </DetailHeader>

            <DetailBadges>
              <Badge variant={activeClient.tipo_documento === "6" ? "primary" : "neutral"}>
                {activeClient.tipo_documento === "6" ? "Empresa (RUC)" : "Persona Natural (DNI)"}
              </Badge>
              <Badge variant={activeClient.activo ? "success" : "neutral"} pill>
                {activeClient.activo ? "Activo" : "Inactivo"}
              </Badge>
            </DetailBadges>

            <div>
              <SectionTitle>Información General</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoItemLabel>{activeClient.tipo_documento === "6" ? "RUC" : "DNI"}</InfoItemLabel>
                  <InfoItemValue>{activeClient.numero_documento}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>Teléfono</InfoItemLabel>
                  <InfoItemValue>{activeClient.telefono ?? "—"}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>Empresa</InfoItemLabel>
                  <InfoItemValue>{activeClient.company.razon_social}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>Ubigeo</InfoItemLabel>
                  <InfoItemValue>{activeClient.ubigeo}</InfoItemValue>
                </InfoItem>
                <InfoItem style={{ gridColumn: "1 / -1" }}>
                  <InfoItemLabel>Dirección Fiscal</InfoItemLabel>
                  <InfoItemValue>{activeClient.direccion}</InfoItemValue>
                </InfoItem>
                <InfoItem style={{ gridColumn: "1 / -1" }}>
                  <InfoItemLabel>Ubicación</InfoItemLabel>
                  <InfoItemValue>{activeClient.distrito}, {activeClient.provincia}, {activeClient.departamento}</InfoItemValue>
                </InfoItem>
              </InfoGrid>
            </div>
          </DetailBody>

          <Drawer.Footer>
            <Button variant="ghost" onClick={closeDrawer}>Cerrar</Button>
            <Button variant="primary" onClick={() => openEdit(activeClient)}>
              <Icon name="edit" size={16} />
              Editar Cliente
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}
    </>
  );
}
