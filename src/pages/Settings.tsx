import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { staggerContainer, fadeUp } from "../lib/variants";

import { Table } from "../components/ui/Table";
import type { ColumnDef } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { useToast } from "../components/common/Toast";
import { InputCustom } from "../components/common/Input";
import { RestApi } from "@/services/restApi";
import { useApp } from "@/context/AppContext";

/* ── Layout ──────────────────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
  flex: 1;
`;

/* ── Page heading ────────────────────────────────────── */

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0.8rem;
`;

const BreadcrumbActive = styled.span`
  color: ${(p) => p.theme.colors.primary};
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
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: -0.12rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.1;
`;

const PageSubtitle = styled.p`
  margin: 0.6rem 0 0;
  font-size: 1.5rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const HeadingActions = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

/* ── Bento grid ──────────────────────────────────────── */

const BentoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2.4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* span helpers */
const ColSpan8 = styled(motion.div)`
  grid-column: span 8 / span 8;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
  }
`;

const ColSpan4 = styled(motion.div)`
  grid-column: span 4 / span 4;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
  }
`;

const ColSpan12 = styled(motion.div)`
  grid-column: 1 / -1;
`;

/* ── Glass card ──────────────────────────────────────── */

const Card = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
`;

const CardIconWrap = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 0.8rem;
  background: ${(p) => p.theme.colors.primaryBg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
`;

const CardIconWrapSuccess = styled(CardIconWrap)`
  background: ${(p) => p.theme.colors.successBg};
  color: ${(p) => p.theme.colors.success};
`;

const CardIconWrapNeutral = styled(CardIconWrap)`
  background: ${(p) => p.theme.colors.chipBg};
  color: ${(p) => p.theme.colors.textMuted};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.04rem;
`;

/* ── Form fields ─────────────────────────────────────── */

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FormGroupFull = styled(FormGroup)`
  grid-column: 1 / -1;
`;

/* ── SUNAT config ────────────────────────────────────── */

const CertRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.4rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  margin-bottom: 2rem;
`;

const CertLabel = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const CertSub = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const CertCheckIcon = styled.span`
  color: ${(p) => p.theme.colors.success};
  display: flex;
`;

const SunatFieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-bottom: 2rem;
`;

const OutlineFullBtn = styled.button`
  width: 100%;
  padding: 1rem 1.6rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.primary};
  border: 1.5px solid ${(p) => p.theme.colors.primary};
  border-radius: 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.white};
  }
`;

/* ── Preference toggles ──────────────────────────────── */

const PrefsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
`;

const ToggleLabel = styled.span`
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.text};
`;

/* reusable toggle switch */
const SwitchLabel = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
`;

const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchTrack = styled.div<{ $on: boolean }>`
  width: 4rem;
  height: 2.2rem;
  border-radius: 9999px;
  background: ${(p) => (p.$on ? p.theme.colors.primary : p.theme.colors.chipBg)};
  border: 1.5px solid ${(p) => (p.$on ? p.theme.colors.primary : p.theme.colors.borderStrong)};
  position: relative;
  transition:
    background 0.2s,
    border-color 0.2s;

  &::after {
    content: "";
    position: absolute;
    top: 0.2rem;
    left: ${(p) => (p.$on ? "1.8rem" : "0.2rem")};
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.white};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transition: left 0.2s;
  }
`;

/* ── Branches table panel ────────────────────────────── */

const TablePanel = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const TablePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 2rem 2.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.chipBg};
`;

const TablePanelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const BranchName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const BranchType = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MonoCode = styled.span`
  font-family: "Courier New", Courier, monospace;
  font-weight: 600;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.text};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
`;

const ActionIconBtn = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.textMuted};
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => (p.$danger ? p.theme.colors.dangerBg : p.theme.colors.primaryBg)};
    color: ${(p) => (p.$danger ? p.theme.colors.danger : p.theme.colors.primary)};
  }
`;

/* ── Users list ──────────────────────────────────────── */

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.6rem;
`;

const SectionLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const SectionLink = styled.button`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.6rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const UserAvatar = styled.div<{ $bg: string }>`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 0.8rem;
  background: ${(p) => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  flex-shrink: 0;
`;

const UserName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
`;

const RoleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
`;

const RoleDot = styled.span<{ $color: string }>`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const RoleLabel = styled.span`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  padding: 0.4rem;
  border-radius: 0.6rem;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.border};
  }
`;

/* ── Admin options grid ──────────────────────────────── */

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const AdminCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.8rem;
  padding: 1.6rem 1rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.12s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 4px 16px -4px ${(p) => p.theme.colors.primaryBg};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const AdminCardIcon = styled.span`
  color: ${(p) => p.theme.colors.primary};
  display: flex;
`;

const AdminCardLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Activity chart ──────────────────────────────────── */

const ChartGlow = styled.div`
  position: absolute;
  top: -4rem;
  right: -4rem;
  width: 12rem;
  height: 12rem;
  background: ${(p) => p.theme.colors.primaryBg};
  border-radius: 50%;
  filter: blur(32px);
  pointer-events: none;
`;

const ChartTitle = styled.p`
  margin: 0 0 1.6rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 6rem;
`;

const Bar = styled.div<{ $h: number; $strong?: boolean }>`
  flex: 1;
  height: ${(p) => p.$h}%;
  border-radius: 0.4rem 0.4rem 0 0;
  background: ${(p) => (p.$strong ? p.theme.colors.primary : p.theme.colors.primaryBg)};
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`;

const ChartSub = styled.p`
  margin: 1.2rem 0 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ChartCard = styled.div`
  position: relative;
  overflow: hidden;
`;

/* ── Data ────────────────────────────────────────────── */

interface Branch {
  id: string;
  name: string;
  type: string;
  address: string;
  sunatCode: string;
}

const ADMIN_OPTIONS = [
  { icon: "group", label: "Usuarios y Roles" },
  { icon: "account_balance", label: "Config. SUNAT" },
  { icon: "business", label: "Datos Empresa" },
  { icon: "history_edu", label: "Logs Sistema" },
] as const;

const USERS = [
  {
    name: "Carlos Méndez",
    role: "Admin",
    initials: "CM",
    bg: "rgba(113,42,226,0.10)",
    dot: "#712ae2",
  },
  {
    name: "Ana Valdivia",
    role: "Vendedor",
    initials: "AV",
    bg: "rgba(22,163,74,0.10)",
    dot: "#16a34a",
  },
  {
    name: "Jorge Ruiz",
    role: "Contador",
    initials: "JR",
    bg: "rgba(180,83,9,0.10)",
    dot: "#b45309",
  },
];

const LOG_BARS: Array<{ h: number; strong?: boolean }> = [
  { h: 40 },
  { h: 60 },
  { h: 30 },
  { h: 90, strong: true },
  { h: 50 },
  { h: 70 },
  { h: 40 },
];

const BRANCHES: Branch[] = [
  {
    id: "0000",
    name: "Sede Principal - Lima",
    type: "Almacén Central",
    address: "Av. Javier Prado Este 1234, San Isidro",
    sunatCode: "0000",
  },
  {
    id: "0001",
    name: "Sucursal Arequipa",
    type: "Ventas Retail",
    address: "Calle Mercaderes 505, Arequipa",
    sunatCode: "0001",
  },
];

const branchColumns: ColumnDef<Branch>[] = [
  {
    key: "name",
    header: "Nombre / Sede",
    minWidth: "18rem",
    render: (r) => (
      <>
        <BranchName>{r.name}</BranchName>
        <BranchType>{r.type}</BranchType>
      </>
    ),
  },
  { key: "address", header: "Dirección", minWidth: "20rem" },
  {
    key: "sunatCode",
    header: "Código SUNAT",
    width: "13rem",
    render: (r) => <MonoCode>{r.sunatCode}</MonoCode>,
  },
  {
    key: "active",
    header: "Estado",
    width: "10rem",
    render: () => (
      <Badge variant="success" dot pill>
        ACTIVO
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "Acciones",
    width: "10rem",
    align: "right",
    render: () => (
      <ActionGroup>
        <ActionIconBtn title="Editar">
          <Icon name="edit" size={18} />
        </ActionIconBtn>
        <ActionIconBtn $danger title="Eliminar">
          <Icon name="delete" size={18} />
        </ActionIconBtn>
      </ActionGroup>
    ),
  },
];

/* ── Company form schema ─────────────────────────────── */

const companySchema = z.object({
  ruc: z
    .string()
    .min(1, "El RUC es requerido")
    .regex(/^\d{11}$/, "El RUC debe tener 11 dígitos"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  nombre_comercial: z.string().min(1, "El nombre comercial es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  ubigeo: z.string().min(1, "El ubigeo es requerido"),
  distrito: z.string().min(1, "El distrito es requerido"),
  provincia: z.string().min(1, "La provincia es requerida"),
  departamento: z.string().min(1, "El departamento es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
  usuario_sol: z.string().min(1, "El usuario SOL es requerido"),
  clave_sol: z.string().min(1, "La clave SOL es requerida"),
});

type CompanyFields = z.infer<typeof companySchema>;

/* keystroke filters for the company form inputs */
const NUM_REGEX = /^[0-9]+$/;
const TEXT_REGEX = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,&#°/-]+$/;
const PHONE_REGEX = /^[0-9+\s()-]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9@._+-]+$/;
const CRED_REGEX = /^[\s\S]*$/;

/* ── Page ────────────────────────────────────────────── */

export default function Settings() {
  const [autoSend, setAutoSend] = useState(true);
  const [thermalPrint, setThermalPrint] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [productionMode, setProductionMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { token } = useApp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFields>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      ruc: "",
      razon_social: "",
      nombre_comercial: "",
      direccion: "",
      ubigeo: "",
      distrito: "",
      provincia: "",
      departamento: "",
      telefono: "",
      email: "",
      usuario_sol: "",
      clave_sol: "",
    },
  });

  function handleDiscard() {
    reset();
    setProductionMode(false);
    toast({ variant: "warning", title: "Cambios descartados" });
  }

  function onSubmit(data: CompanyFields) {
    setLoading(true);
    const tokenp = token || localStorage.getItem("token") || "";
    console.log("token para API:", tokenp);
    RestApi.securePost(tokenp, "/api/v1/companies", {
      ...data,
      modo_produccion: productionMode ? 1 : 0,
    }).subscribe({
      next: () => {
        setLoading(false);
        toast({
          variant: "success",
          title: "Configuración guardada",
          description: "Los cambios han sido aplicados correctamente.",
        });
      },
      error: (error: unknown) => {
        setLoading(false);
        const message =
          error instanceof Error ? error.message : "Error al conectar con el servidor";
        toast({ variant: "error", title: "Error al guardar", description: message });
      },
    });
  }

  return (
    <>
      <ContentArea>
        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Breadcrumb>
            <span>Panel</span>
            <span>/</span>
            <BreadcrumbActive>Configuración</BreadcrumbActive>
          </Breadcrumb>
          <PageHeading>
            <HeadingText>
              <PageTitle>Configuración de Empresa</PageTitle>
              <PageSubtitle>
                Gestiona la identidad corporativa y credenciales fiscales de tu negocio.
              </PageSubtitle>
            </HeadingText>
            <HeadingActions>
              <Button type="button" variant="outline" onClick={handleDiscard} disabled={loading}>
                Descartar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
              >
                <Icon name="save" size={18} />
                {loading ? "Guardando…" : "Guardar Cambios"}
              </Button>
            </HeadingActions>
          </PageHeading>
        </motion.div>

        {/* Bento grid */}
        <BentoGrid variants={staggerContainer} initial="hidden" animate="visible">
          {/* Información General */}
          <ColSpan8 variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardIconWrap>
                  <Icon name="business" size={20} />
                </CardIconWrap>
                <CardTitle>Información General</CardTitle>
              </CardHeader>

              <FormGrid>
                <InputCustom
                  id="ruc"
                  label="RUC (Número de Identificación)"
                  regex={NUM_REGEX}
                  maxLength={11}
                  error={errors.ruc?.message}
                  {...register("ruc")}
                />

                <InputCustom
                  id="razon_social"
                  label="Razón Social"
                  regex={TEXT_REGEX}
                  error={errors.razon_social?.message}
                  {...register("razon_social")}
                />

                <FormGroupFull>
                  <InputCustom
                    id="nombre_comercial"
                    label="Nombre Comercial"
                    regex={TEXT_REGEX}
                    error={errors.nombre_comercial?.message}
                    {...register("nombre_comercial")}
                  />
                </FormGroupFull>

                <FormGroupFull>
                  <InputCustom
                    id="direccion"
                    label="Dirección"
                    regex={TEXT_REGEX}
                    error={errors.direccion?.message}
                    {...register("direccion")}
                  />
                </FormGroupFull>

                <InputCustom
                  id="ubigeo"
                  label="Ubigeo"
                  regex={NUM_REGEX}
                  maxLength={6}
                  error={errors.ubigeo?.message}
                  {...register("ubigeo")}
                />

                <InputCustom
                  id="distrito"
                  label="Distrito"
                  regex={TEXT_REGEX}
                  error={errors.distrito?.message}
                  {...register("distrito")}
                />

                <InputCustom
                  id="provincia"
                  label="Provincia"
                  regex={TEXT_REGEX}
                  error={errors.provincia?.message}
                  {...register("provincia")}
                />

                <InputCustom
                  id="departamento"
                  label="Departamento"
                  regex={TEXT_REGEX}
                  error={errors.departamento?.message}
                  {...register("departamento")}
                />

                <InputCustom
                  id="telefono"
                  label="Teléfono"
                  regex={PHONE_REGEX}
                  error={errors.telefono?.message}
                  {...register("telefono")}
                />

                <InputCustom
                  id="email"
                  label="Email"
                  type="email"
                  regex={EMAIL_REGEX}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </FormGrid>
            </Card>
          </ColSpan8>

          {/* Right column */}
          <ColSpan4 variants={fadeUp}>
            {/* SUNAT Config */}
            <Card>
              <CardHeader>
                <CardIconWrapSuccess>
                  <Icon name="security" size={20} />
                </CardIconWrapSuccess>
                <CardTitle>Configuración SUNAT</CardTitle>
              </CardHeader>

              <CertRow>
                <div>
                  <CertLabel>Certificado Digital</CertLabel>
                  <CertSub>Vence en: 142 días</CertSub>
                </div>
                <CertCheckIcon>
                  <Icon name="check_circle" filled size={22} />
                </CertCheckIcon>
              </CertRow>

              <SunatFieldStack>
                <InputCustom
                  id="usuario_sol"
                  label="Usuario SOL"
                  regex={CRED_REGEX}
                  error={errors.usuario_sol?.message}
                  {...register("usuario_sol")}
                />

                <InputCustom
                  id="clave_sol"
                  label="Clave SOL"
                  type={showPass ? "text" : "password"}
                  regex={CRED_REGEX}
                  icon={showPass ? "visibility_off" : "visibility"}
                  error={errors.clave_sol?.message}
                  {...register("clave_sol")}
                />

                <SectionLink type="button" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? "Ocultar clave SOL" : "Mostrar clave SOL"}
                </SectionLink>

                <ToggleRow>
                  <ToggleLabel>Modo Producción</ToggleLabel>
                  <SwitchLabel>
                    <SwitchInput
                      type="checkbox"
                      checked={productionMode}
                      onChange={() => setProductionMode((v) => !v)}
                    />
                    <SwitchTrack $on={productionMode} />
                  </SwitchLabel>
                </ToggleRow>
              </SunatFieldStack>

              <OutlineFullBtn type="button">Actualizar Certificado</OutlineFullBtn>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardIconWrapNeutral>
                  <Icon name="settings_suggest" size={20} />
                </CardIconWrapNeutral>
                <CardTitle>Preferencias</CardTitle>
              </CardHeader>

              <PrefsStack>
                <ToggleRow>
                  <ToggleLabel>Envío Automático SUNAT</ToggleLabel>
                  <SwitchLabel>
                    <SwitchInput
                      type="checkbox"
                      checked={autoSend}
                      onChange={() => setAutoSend((v) => !v)}
                    />
                    <SwitchTrack $on={autoSend} />
                  </SwitchLabel>
                </ToggleRow>

                <ToggleRow>
                  <ToggleLabel>Impresión Térmica (80mm)</ToggleLabel>
                  <SwitchLabel>
                    <SwitchInput
                      type="checkbox"
                      checked={thermalPrint}
                      onChange={() => setThermalPrint((v) => !v)}
                    />
                    <SwitchTrack $on={thermalPrint} />
                  </SwitchLabel>
                </ToggleRow>

                <ToggleRow>
                  <ToggleLabel>Notificar por Email a Cliente</ToggleLabel>
                  <SwitchLabel>
                    <SwitchInput
                      type="checkbox"
                      checked={emailNotify}
                      onChange={() => setEmailNotify((v) => !v)}
                    />
                    <SwitchTrack $on={emailNotify} />
                  </SwitchLabel>
                </ToggleRow>
              </PrefsStack>
            </Card>
          </ColSpan4>

          {/* Sucursales y Almacenes */}
          <ColSpan12 variants={fadeUp}>
            <TablePanel>
              <TablePanelHeader>
                <TablePanelLeft>
                  <CardIconWrap>
                    <Icon name="storefront" size={20} />
                  </CardIconWrap>
                  <CardTitle>Sucursales y Almacenes</CardTitle>
                </TablePanelLeft>
                <Button variant="primary">
                  <Icon name="add" size={18} />
                  Añadir Sede
                </Button>
              </TablePanelHeader>
              <Table
                data={BRANCHES}
                columns={branchColumns}
                keyField="id"
                variant="default"
                density="default"
              />
            </TablePanel>
          </ColSpan12>

          {/* Usuarios del sistema */}
          <ColSpan8 variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardIconWrap>
                  <Icon name="group" size={20} />
                </CardIconWrap>
                <CardTitle>Usuarios del Sistema</CardTitle>
              </CardHeader>
              <SectionHeaderRow>
                <SectionLabel>Activos · {USERS.length} usuarios</SectionLabel>
                <SectionLink>Ver todos</SectionLink>
              </SectionHeaderRow>
              <UsersList>
                {USERS.map((u) => (
                  <UserItem key={u.name}>
                    <UserLeft>
                      <UserAvatar $bg={u.bg}>{u.initials}</UserAvatar>
                      <div>
                        <UserName>{u.name}</UserName>
                        <RoleBadge>
                          <RoleDot $color={u.dot} />
                          <RoleLabel>{u.role}</RoleLabel>
                        </RoleBadge>
                      </div>
                    </UserLeft>
                    <MoreButton title="Opciones">
                      <Icon name="more_vert" size={20} />
                    </MoreButton>
                  </UserItem>
                ))}
              </UsersList>
            </Card>
          </ColSpan8>

          {/* Right col: admin options + activity log */}
          <ColSpan4 variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardIconWrapNeutral>
                  <Icon name="admin_panel_settings" size={20} />
                </CardIconWrapNeutral>
                <CardTitle>Acceso Rápido</CardTitle>
              </CardHeader>
              <AdminGrid>
                {ADMIN_OPTIONS.map((opt) => (
                  <AdminCard key={opt.label}>
                    <AdminCardIcon>
                      <Icon name={opt.icon} size={26} />
                    </AdminCardIcon>
                    <AdminCardLabel>{opt.label}</AdminCardLabel>
                  </AdminCard>
                ))}
              </AdminGrid>
            </Card>

            <Card style={{ position: "relative", overflow: "hidden" }}>
              <ChartGlow />
              <ChartCard>
                <ChartTitle>Actividad de Logs</ChartTitle>
                <ChartBars>
                  {LOG_BARS.map((b, i) => (
                    <Bar key={i} $h={b.h} $strong={b.strong} />
                  ))}
                </ChartBars>
                <ChartSub>+12% peticiones hoy</ChartSub>
              </ChartCard>
            </Card>
          </ColSpan4>
        </BentoGrid>
      </ContentArea>
    </>
  );
}
