import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { of } from "rxjs";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";

import { Table } from "../components/ui/Table";
import type { ColumnDef } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { useToast } from "../components/common/Toast";

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

const FormLabel = styled.label`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const StyledInput = styled.input`
  width: 100%;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  padding: 1.1rem 1.4rem;
  font-size: 1.4rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg};
  }
`;

const MonoInput = styled(StyledInput)`
  font-family: "Courier New", Courier, monospace;
  font-weight: 600;
`;

const SmallInput = styled(StyledInput)`
  padding: 0.8rem 1.2rem;
  font-size: 1.3rem;
`;

const PasswordWrap = styled.div`
  position: relative;
`;

const VisibilityBtn = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

/* ── Upload zone ─────────────────────────────────────── */

const UploadZone = styled.div`
  border: 2px dashed ${(p) => p.theme.colors.borderStrong};
  border-radius: 1.2rem;
  padding: 3.2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.inputBg};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  text-align: center;
  gap: 0.6rem;

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const UploadLabel = styled.p`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const UploadSub = styled.p`
  margin: 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
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
  transition: background 0.15s, color 0.15s;

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
  transition: background 0.2s, border-color 0.2s;

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
  transition: background 0.15s, color 0.15s;

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

  &:hover { text-decoration: underline; }
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

  &:hover { border-color: ${(p) => p.theme.colors.borderStrong}; }
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
  transition: color 0.15s, background 0.15s;

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
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.12s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 4px 16px -4px ${(p) => p.theme.colors.primaryBg};
    transform: translateY(-1px);
  }

  &:active { transform: scale(0.97); }
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
  background: ${(p) => p.$strong ? p.theme.colors.primary : p.theme.colors.primaryBg};
  transition: opacity 0.15s;

  &:hover { opacity: 0.7; }
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

/* ── Form schema ─────────────────────────────────────── */

const settingsSchema = z.object({
  ruc:             z.string().regex(/^\d{11}$/, "El RUC debe tener exactamente 11 dígitos"),
  razonSocial:     z.string().min(3, "Mínimo 3 caracteres"),
  nombreComercial: z.string().optional(),
  usuarioSol:      z.string().min(3, "Mínimo 3 caracteres"),
  claveSol:        z.string().min(6, "Mínimo 6 caracteres"),
});
type SettingsFields = z.infer<typeof settingsSchema>;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const ADMIN_OPTIONS = [
  { icon: "group",           label: "Usuarios y Roles" },
  { icon: "account_balance", label: "Config. SUNAT" },
  { icon: "business",        label: "Datos Empresa" },
  { icon: "history_edu",     label: "Logs Sistema" },
] as const;

const USERS = [
  { name: "Carlos Méndez", role: "Admin",    initials: "CM", bg: "rgba(113,42,226,0.10)", dot: "#712ae2" },
  { name: "Ana Valdivia",  role: "Vendedor", initials: "AV", bg: "rgba(22,163,74,0.10)",  dot: "#16a34a" },
  { name: "Jorge Ruiz",    role: "Contador", initials: "JR", bg: "rgba(180,83,9,0.10)",   dot: "#b45309" },
];

const LOG_BARS: Array<{ h: number; strong?: boolean }> = [
  { h: 40 }, { h: 60 }, { h: 30 }, { h: 90, strong: true }, { h: 50 }, { h: 70 }, { h: 40 },
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

/* ── Page ────────────────────────────────────────────── */

export default function Settings() {
  const [autoSend,     setAutoSend]     = useState(true);
  const [thermalPrint, setThermalPrint] = useState(false);
  const [emailNotify,  setEmailNotify]  = useState(true);
  const [showPass,     setShowPass]     = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFields>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ruc:             "20601234567",
      razonSocial:     "PHARMACORE PERU S.A.C.",
      nombreComercial: "PharmaCore",
      usuarioSol:      "MODDATOS",
      claveSol:        "password123",
    },
  });

  const onSave = handleSubmit(() => {
    of(null).subscribe({
      next: () => toast({ variant: "success", title: "Configuración guardada", description: "Los cambios han sido aplicados correctamente." }),
    });
  });

  function handleDiscard() {
    reset();
    toast({ variant: "warning", title: "Cambios descartados" });
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
              <PageSubtitle>Gestiona la identidad corporativa y credenciales fiscales de tu negocio.</PageSubtitle>
            </HeadingText>
            <HeadingActions>
              <Button variant="outline" onClick={handleDiscard}>Descartar</Button>
              <Button variant="primary" onClick={onSave}>
                <Icon name="save" size={18} />
                Guardar Cambios
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
                <FormGroup>
                  <FormLabel htmlFor="ruc">RUC (Número de Identificación)</FormLabel>
                  <MonoInput id="ruc" type="text" {...register("ruc")} />
                  {errors.ruc && <ErrorMsg><Icon name="error" size={14} />{errors.ruc.message}</ErrorMsg>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="razonSocial">Razón Social</FormLabel>
                  <StyledInput id="razonSocial" type="text" {...register("razonSocial")} />
                  {errors.razonSocial && <ErrorMsg><Icon name="error" size={14} />{errors.razonSocial.message}</ErrorMsg>}
                </FormGroup>

                <FormGroupFull>
                  <FormLabel htmlFor="nombreComercial">Nombre Comercial</FormLabel>
                  <StyledInput id="nombreComercial" type="text" {...register("nombreComercial")} />
                </FormGroupFull>

                <FormGroupFull>
                  <FormLabel>Logo de la Empresa</FormLabel>
                  <UploadZone>
                    <Icon name="cloud_upload" size={36} />
                    <UploadLabel>Click para subir o arrastra un archivo</UploadLabel>
                    <UploadSub>PNG, JPG (Máx. 2MB)</UploadSub>
                  </UploadZone>
                </FormGroupFull>
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
                <FormGroup>
                  <FormLabel htmlFor="usuarioSol">Usuario SOL</FormLabel>
                  <SmallInput id="usuarioSol" type="text" {...register("usuarioSol")} />
                  {errors.usuarioSol && <ErrorMsg><Icon name="error" size={14} />{errors.usuarioSol.message}</ErrorMsg>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="claveSol">Clave SOL</FormLabel>
                  <PasswordWrap>
                    <SmallInput
                      id="claveSol"
                      type={showPass ? "text" : "password"}
                      style={{ paddingRight: "3.6rem" }}
                      {...register("claveSol")}
                    />
                    <VisibilityBtn
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      title={showPass ? "Ocultar" : "Mostrar"}
                    >
                      <Icon name={showPass ? "visibility_off" : "visibility"} size={18} />
                    </VisibilityBtn>
                  </PasswordWrap>
                  {errors.claveSol && <ErrorMsg><Icon name="error" size={14} />{errors.claveSol.message}</ErrorMsg>}
                </FormGroup>
              </SunatFieldStack>

              <OutlineFullBtn>Actualizar Certificado</OutlineFullBtn>
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
                    <SwitchInput type="checkbox" checked={autoSend} onChange={() => setAutoSend((v) => !v)} />
                    <SwitchTrack $on={autoSend} />
                  </SwitchLabel>
                </ToggleRow>

                <ToggleRow>
                  <ToggleLabel>Impresión Térmica (80mm)</ToggleLabel>
                  <SwitchLabel>
                    <SwitchInput type="checkbox" checked={thermalPrint} onChange={() => setThermalPrint((v) => !v)} />
                    <SwitchTrack $on={thermalPrint} />
                  </SwitchLabel>
                </ToggleRow>

                <ToggleRow>
                  <ToggleLabel>Notificar por Email a Cliente</ToggleLabel>
                  <SwitchLabel>
                    <SwitchInput type="checkbox" checked={emailNotify} onChange={() => setEmailNotify((v) => !v)} />
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
                    <AdminCardIcon><Icon name={opt.icon} size={26} /></AdminCardIcon>
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
