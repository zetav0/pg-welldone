import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { of } from "rxjs";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { Table } from "../components/ui/Table";
import type { ColumnDef } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import type { BadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { Drawer } from "../components/common/Drawer";
import { useToast } from "../components/common/Toast";
import { ComboboxCustom } from "../components/common/Combobox";
import type { ComboboxOption } from "../components/common/Combobox";
import { getDepartamentos, getProvincias, getDistritos } from "../data/ubigeo";
import { useApp } from "@/context/AppContext";
import { useCompany } from "@/context/CompanyContext";
import { RestApi } from "@/services/restApi";
import { clients, customerKpis } from "../data/customers";
import type { Client, ClientSegment, ClientStatus, ClientType } from "../data/customers";

/* ── Helpers ─────────────────────────────────────────── */

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const SEGMENT_LABEL: Record<ClientSegment, string> = {
  vip:        "VIP",
  recurrente: "Recurrente",
  nuevo:      "Nuevo",
};
const SEGMENT_VARIANT: Record<ClientSegment, BadgeVariant> = {
  vip:        "warning",
  recurrente: "primary",
  nuevo:      "neutral",
};
const STATUS_LABEL: Record<ClientStatus, string> = {
  al_dia:    "Al día",
  con_deuda: "Con Deuda",
};
const STATUS_VARIANT: Record<ClientStatus, BadgeVariant> = {
  al_dia:    "success",
  con_deuda: "danger",
};
const TYPE_LABEL: Record<ClientType, string> = {
  empresa: "Empresa",
  persona: "Persona",
};

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

const FilterDivider = styled.div`
  width: 1px;
  height: 2.4rem;
  background: ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

const FilterChips = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.4rem;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  border: 1px solid ${(p) => (p.$active ? "transparent" : p.theme.colors.border)};
  background: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.surface)};
  color: ${(p) => (p.$active ? p.theme.colors.white : p.theme.colors.textMuted)};

  &:not([disabled]):hover {
    background: ${(p) => p.$active ? p.theme.colors.primary : p.theme.colors.chipBg};
    color: ${(p) => p.$active ? p.theme.colors.white : p.theme.colors.text};
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

const DebtCard = styled.div<{ $hasDebt: boolean }>`
  padding: 1.6rem 2rem;
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.$hasDebt ? p.theme.colors.dangerBg : p.theme.colors.successBg};
  background: ${(p) => p.$hasDebt ? p.theme.colors.dangerBg : p.theme.colors.successBg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const DebtAmount = styled.span<{ $hasDebt: boolean }>`
  font-size: 2rem;
  font-weight: 900;
  color: ${(p) => p.$hasDebt ? p.theme.colors.danger : p.theme.colors.success};
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

function avatarColor(id: string): string {
  const idx = parseInt(id, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(
  onView: (c: Client) => void,
  onEdit: (c: Client) => void,
): ColumnDef<Client>[] {
  return [
    {
      key: "name",
      header: "Cliente / Razón Social",
      sortable: true,
      render: (row) => (
        <ClientCell>
          <ClientAvatar $color={avatarColor(row.id)}>
            {getInitials(row.name)}
          </ClientAvatar>
          <ClientInfo>
            <ClientName>{row.name}</ClientName>
            <ClientEmail>{row.email}</ClientEmail>
          </ClientInfo>
        </ClientCell>
      ),
    },
    {
      key: "rucDni",
      header: "RUC / DNI",
      sortable: true,
      render: (row) => <RucText>{row.rucDni}</RucText>,
    },
    {
      key: "type",
      header: "Tipo",
      render: (row) => (
        <Badge variant={row.type === "empresa" ? "primary" : "neutral"} size="sm">
          {TYPE_LABEL[row.type]}
        </Badge>
      ),
    },
    {
      key: "segment",
      header: "Segmento",
      render: (row) => (
        <Badge variant={SEGMENT_VARIANT[row.segment]} size="sm" dot>
          {SEGMENT_LABEL[row.segment]}
        </Badge>
      ),
    },
    {
      key: "lastPurchase",
      header: "Última Compra",
      sortable: true,
    },
    {
      key: "status",
      header: "Estado",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]} size="sm" pill>
          {STATUS_LABEL[row.status]}
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
  tipo_documento:   z.enum(["1", "6"]),
  numero_documento: z.string(),
  razon_social:     z.string().min(3, "Mínimo 3 caracteres"),
  email:            z.string().email("Correo electrónico inválido"),
  telefono:         z.string().optional().or(z.literal("")),
  direccion:        z.string().min(5, "Dirección requerida"),
  departamento:     z.string().min(2, "Selecciona un departamento"),
  provincia:        z.string().min(2, "Selecciona una provincia"),
  distrito:         z.string().min(2, "Selecciona un distrito"),
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
  tipo_documento: "6", numero_documento: "", razon_social: "", email: "",
  telefono: "", direccion: "", departamento: "", provincia: "", distrito: "",
};

/* ── Component ───────────────────────────────────────── */

type DrawerMode = "none" | "new" | "detail" | "edit";

export default function Customers() {
  const { toast } = useToast();
  const { token } = useApp();
  const { companies, activeCompanyId, setActiveCompanyId } = useCompany();

  /* ── Filter state ── */
  const [search,        setSearch]        = useState("");
  const [segFilter,     setSegFilter]     = useState<"all" | ClientSegment>("all");
  const [statusFilter,  setStatusFilter]  = useState<"all" | ClientStatus>("all");

  /* ── Pagination ── */
  const [page,     setPage]     = useState(1);
  const [pageSize]              = useState(10);

  /* ── Drawer ── */
  const [drawerMode,  setDrawerMode]  = useState<DrawerMode>("none");
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  /* ── Form (New / Edit) ── */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CustomerFields>({ resolver: zodResolver(customerSchema), defaultValues: { ...BLANK_CUSTOMER } });

  const currentTipoDoc = watch("tipo_documento");
  const watchedDep     = watch("departamento");
  const watchedProv    = watch("provincia");

  /* ── Ubigeo cascading options ── */
  const depOptions = useMemo<ComboboxOption[]>(
    () => getDepartamentos().map((d) => ({ id: d, title: d })),
    []
  );
  const provOptions = useMemo<ComboboxOption[]>(
    () => (watchedDep ? getProvincias(watchedDep).map((p) => ({ id: p, title: p })) : []),
    [watchedDep]
  );
  const distOptions = useMemo<ComboboxOption[]>(
    () => (watchedDep && watchedProv ? getDistritos(watchedDep, watchedProv).map((d) => ({ id: d, title: d })) : []),
    [watchedDep, watchedProv]
  );

  /* ── Company options ── */
  const companyOptions = useMemo<ComboboxOption[]>(
    () => companies.map((c) => ({ id: String(c.id), title: `${c.razon_social}  ·  ${c.ruc}` })),
    [companies]
  );

  /* ── Derived data ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.rucDni.includes(q) || c.email.toLowerCase().includes(q);
      const matchSeg    = segFilter === "all"    || c.segment === segFilter;
      const matchStatus = statusFilter === "all" || c.status  === statusFilter;
      return matchSearch && matchSeg && matchStatus;
    });
  }, [search, segFilter, statusFilter]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  /* ── Handlers ── */
  function openNew() {
    reset({ ...BLANK_CUSTOMER });
    setDrawerMode("new");
  }

  function openDetail(c: Client) {
    setActiveClient(c);
    setDrawerMode("detail");
  }

  function openEdit(c: Client) {
    setActiveClient(c);
    reset({
      tipo_documento:   c.type === "empresa" ? "6" : "1",
      numero_documento: c.rucDni,
      razon_social:     c.name,
      email:            c.email,
      telefono:         c.phone ?? "",
      direccion:        c.address,
      departamento:     "",
      provincia:        "",
      distrito:         "",
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
      RestApi.securePost(token ?? "", "/api/v1/clients", {
        company_id: activeCompanyId,
        ...data,
      }).subscribe({
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
            <KpiLabel>Total Clientes Activos</KpiLabel>
            <KpiValue>{customerKpis.totalActive.toLocaleString()}</KpiValue>
            <KpiSub style={{ color: "var(--color-success, #16a34a)", fontWeight: 700 }}>+12% este mes</KpiSub>
            <KpiProgress>
              <KpiProgressBar $pct={75} />
            </KpiProgress>
          </KpiCard>

          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="payments" size={56} /></KpiIcon>
            <KpiLabel>Deuda Total por Cobrar</KpiLabel>
            <KpiValue $color="#ba1a1a">
              S/ {(customerKpis.totalDebt / 1000).toFixed(1)}k
            </KpiValue>
            <KpiSub>{customerKpis.debtorCount} clientes con deuda pendiente</KpiSub>
          </KpiCard>

          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="workspace_premium" size={56} /></KpiIcon>
            <KpiLabel>Segmento VIP</KpiLabel>
            <KpiValue>{customerKpis.vipCount}</KpiValue>
            <KpiSub>Clientes con mayor recurrencia</KpiSub>
          </KpiCard>

          <KpiCard variants={fadeUp}>
            <KpiIcon><Icon name="verified" size={56} /></KpiIcon>
            <KpiLabel>Compliance SUNAT</KpiLabel>
            <KpiValue>{customerKpis.compliance}%</KpiValue>
            <KpiSub>Documentación al día</KpiSub>
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

          <FilterDivider />

          <FilterChips>
            {(["all", "vip", "recurrente", "nuevo"] as const).map((s) => (
              <FilterChip key={s} $active={segFilter === s} onClick={() => { setSegFilter(s); setPage(1); }}>
                {s === "all" ? "Todos" : SEGMENT_LABEL[s]}
              </FilterChip>
            ))}
          </FilterChips>

          <FilterDivider />

          <FilterChips>
            {(["all", "al_dia", "con_deuda"] as const).map((s) => (
              <FilterChip key={s} $active={statusFilter === s} onClick={() => { setStatusFilter(s); setPage(1); }}>
                {s === "all" ? "Todos" : STATUS_LABEL[s]}
              </FilterChip>
            ))}
          </FilterChips>

          <FilterActions>
            <IconBtn title="Filtros avanzados">
              <Icon name="filter_list" size={18} />
            </IconBtn>
            <IconBtn title="Ordenar" onClick={() => { setSearch(""); setSegFilter("all"); setStatusFilter("all"); setPage(1); }}>
              <Icon name="filter_alt_off" size={18} />
            </IconBtn>
          </FilterActions>
        </FilterBar>

        {/* Table */}
        <TableCard>
          <Table<Client>
            data={paginated}
            keyField="id"
            columns={columns}
            onRowClick={openDetail}
            density="default"
            emptyMessage="No se encontraron clientes con los filtros aplicados."
          />

          <PaginationRow>
            <Pagination.Info
              page={safePage}
              pageSize={pageSize}
              totalItems={filtered.length}
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
        description={drawerMode === "new" ? "Completa los datos para registrar un nuevo cliente." : `Actualizando datos de ${activeClient?.name ?? ""}`}
        size="md"
      >
        <DrawerForm>
          {/* Empresa */}
          <FormGroup>
            <FormLabel>Empresa</FormLabel>
            <ComboboxCustom
              options={companyOptions}
              value={activeCompanyId ? String(activeCompanyId) : null}
              onChange={(val) => setActiveCompanyId(Number(val))}
              placeholder="Selecciona empresa…"
              searchPlaceholder="Buscar por nombre o RUC…"
              dataCy="cy-company-select"
            />
          </FormGroup>

          {/* Tipo de cliente */}
          <FormGroup>
            <FormLabel>Tipo de cliente</FormLabel>
            <TypeToggle>
              {([["6", "corporate_fare", "Empresa"], ["1", "person", "Persona Natural"]] as [string, string, string][]).map(([val, icon, label]) => (
                <TypeOption key={val} $active={currentTipoDoc === val}>
                  <input
                    type="radio"
                    name="tipo_documento"
                    value={val}
                    checked={currentTipoDoc === val}
                    onChange={() => { setValue("tipo_documento", val as "1" | "6", { shouldValidate: true }); setValue("numero_documento", ""); }}
                  />
                  <Icon name={icon} size={16} />
                  {label}
                </TypeOption>
              ))}
            </TypeToggle>
          </FormGroup>

          {/* Número de documento */}
          <FormGroup>
            <FormLabel>{currentTipoDoc === "6" ? "RUC (11 dígitos)" : "DNI (8 dígitos)"}</FormLabel>
            <FormInput
              type="text"
              maxLength={currentTipoDoc === "6" ? 11 : 8}
              placeholder={currentTipoDoc === "6" ? "20XXXXXXXXX" : "XXXXXXXX"}
              {...register("numero_documento")}
              onChange={(e) => setValue("numero_documento", e.target.value.replace(/\D/g, ""), { shouldValidate: true })}
            />
            {errors.numero_documento && <ErrorMsg><Icon name="error" size={14} />{errors.numero_documento.message}</ErrorMsg>}
          </FormGroup>

          {/* Razón Social */}
          <FormGroup>
            <FormLabel>{currentTipoDoc === "6" ? "Razón Social" : "Nombre Completo"}</FormLabel>
            <FormInput
              type="text"
              placeholder={currentTipoDoc === "6" ? "Ej. Empresa S.A.C." : "Ej. Juan Pérez García"}
              {...register("razon_social")}
            />
            {errors.razon_social && <ErrorMsg><Icon name="error" size={14} />{errors.razon_social.message}</ErrorMsg>}
          </FormGroup>

          {/* Email + Teléfono */}
          <FormRow>
            <FormGroup>
              <FormLabel>Correo electrónico</FormLabel>
              <FormInput
                type="email"
                placeholder="correo@empresa.com"
                {...register("email")}
              />
              {errors.email && <ErrorMsg><Icon name="error" size={14} />{errors.email.message}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <FormLabel>Teléfono</FormLabel>
              <FormInput
                type="tel"
                placeholder="987654321"
                {...register("telefono")}
              />
            </FormGroup>
          </FormRow>

          {/* Dirección */}
          <FormGroup>
            <FormLabel>Dirección fiscal</FormLabel>
            <FormInput
              type="text"
              placeholder="Av. Ejemplo 123"
              {...register("direccion")}
            />
            {errors.direccion && <ErrorMsg><Icon name="error" size={14} />{errors.direccion.message}</ErrorMsg>}
          </FormGroup>

          {/* Ubicación: Departamento → Provincia → Distrito */}
          <FormGroup>
            <FormLabel>Departamento</FormLabel>
            <Controller
              name="departamento"
              control={control}
              render={({ field }) => (
                <ComboboxCustom
                  options={depOptions}
                  value={field.value || null}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("provincia", "", { shouldValidate: false });
                    setValue("distrito",  "", { shouldValidate: false });
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
                  <ComboboxCustom
                    options={provOptions}
                    value={field.value || null}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("distrito", "", { shouldValidate: false });
                    }}
                    placeholder="Selecciona provincia…"
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
                  <ComboboxCustom
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
            {/* Header */}
            <DetailHeader>
              <DetailAvatar $color={avatarColor(activeClient.id)}>
                {getInitials(activeClient.name)}
              </DetailAvatar>
              <DetailMeta>
                <DetailName>{activeClient.name}</DetailName>
                <DetailSub>{activeClient.email}</DetailSub>
              </DetailMeta>
            </DetailHeader>

            <DetailBadges>
              <Badge variant={SEGMENT_VARIANT[activeClient.segment]} dot>
                {SEGMENT_LABEL[activeClient.segment]}
              </Badge>
              <Badge variant={STATUS_VARIANT[activeClient.status]} pill>
                {STATUS_LABEL[activeClient.status]}
              </Badge>
              <Badge variant={activeClient.type === "empresa" ? "primary" : "neutral"}>
                {TYPE_LABEL[activeClient.type]}
              </Badge>
            </DetailBadges>

            {/* Info grid */}
            <div>
              <SectionTitle>Información General</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoItemLabel>{activeClient.type === "empresa" ? "RUC" : "DNI"}</InfoItemLabel>
                  <InfoItemValue>{activeClient.rucDni}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>Teléfono</InfoItemLabel>
                  <InfoItemValue>{activeClient.phone}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>Última Compra</InfoItemLabel>
                  <InfoItemValue>{activeClient.lastPurchase}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>Segmento</InfoItemLabel>
                  <InfoItemValue>{SEGMENT_LABEL[activeClient.segment]}</InfoItemValue>
                </InfoItem>
                <InfoItem style={{ gridColumn: "1 / -1" }}>
                  <InfoItemLabel>Dirección Fiscal</InfoItemLabel>
                  <InfoItemValue>{activeClient.address}</InfoItemValue>
                </InfoItem>
              </InfoGrid>
            </div>

            {/* Deuda */}
            <div>
              <SectionTitle>Estado Financiero</SectionTitle>
              <DebtCard $hasDebt={activeClient.totalDebt > 0}>
                <div>
                  <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, opacity: 0.7 }}>
                    {activeClient.totalDebt > 0 ? "Deuda pendiente" : "Sin deuda pendiente"}
                  </p>
                  <DebtAmount $hasDebt={activeClient.totalDebt > 0}>
                    S/ {activeClient.totalDebt.toLocaleString()}
                  </DebtAmount>
                </div>
                <Icon
                  name={activeClient.totalDebt > 0 ? "warning" : "check_circle"}
                  size={28}
                  filled
                />
              </DebtCard>
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
