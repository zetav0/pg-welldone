import { useMemo, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../lib/variants";
import { Table } from "../../components/ui/Table";
import type { ColumnDef } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import type { BadgeVariant } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Drawer } from "../../components/common/Drawer";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/common/Toast";
import { Tooltip } from "../../components/ui/Tooltip";
import { Modal } from "../../components/ui/Modal";

/* ── Layout ──────────────────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
`;

const PageHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const Breadcrumb = styled.nav`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0.6rem;
  display: flex;
  gap: 0.6rem;
`;

const BreadcrumbActive = styled.span`
  color: ${(p) => p.theme.colors.primary};
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 3.6rem;
  font-weight: 900;
  letter-spacing: -0.15rem;
  color: ${(p) => p.theme.colors.text};
`;

const PageSubtitle = styled.p`
  margin: 0.6rem 0 0;
  font-size: 1.5rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── KPI ─────────────────────────────────────────────── */

const KpiGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  @media (max-width: 1100px) { grid-template-columns: repeat(2,1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const KpiCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const KpiLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const KpiValue = styled.h3<{ $color?: string }>`
  margin: 0;
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.$color ?? p.theme.colors.text};
`;

const KpiSub = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const KpiBgIcon = styled.div`
  position: absolute;
  right: -1rem;
  bottom: -1rem;
  opacity: 0.05;
  pointer-events: none;
`;

/* ── Table panel ─────────────────────────────────────── */

const TablePanel = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const TableIconBtn = styled.button`
  padding: 0.8rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.15s;
  &:hover { background: ${(p) => p.theme.colors.chipBg}; }
`;

/* ── Filter bar ──────────────────────────────────────── */

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 2.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-wrap: wrap;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 18rem;
  max-width: 32rem;
`;

const SearchIconEl = styled.span`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.85rem 1.4rem 0.85rem 3.6rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${(p) => p.theme.colors.primary}; }
  &::placeholder { color: ${(p) => p.theme.colors.textMuted}; }
`;

const ChipGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1.2rem;
  border-radius: 10rem;
  border: 1.5px solid ${(p) => p.$active ? p.theme.colors.primary : p.theme.colors.border};
  background: ${(p) => p.$active ? p.theme.colors.primaryBg : "transparent"};
  color: ${(p) => p.$active ? p.theme.colors.primary : p.theme.colors.textMuted};
  font-size: 1.2rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 2.4rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.chipBg};
  flex-wrap: wrap;
  gap: 1.2rem;
`;

/* ── Table cell helpers ──────────────────────────────── */

const SerieNum = styled.span`
  font-family: "Courier New", monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const TextMuted = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Bold = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
`;

const RowBtn = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.6rem;
  cursor: pointer;
  display: flex;
  color: ${(p) => p.theme.colors.textMuted};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.primaryBg};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const WarnRowBtn = styled(RowBtn)`
  &:hover {
    background: rgba(234, 88, 12, 0.08);
    color: ${(p) => p.theme.colors.warning};
  }
`;

/* ── Drawer form helpers ─────────────────────────────── */

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
  padding-bottom: 0.8rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const FieldLabel = styled.label`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 1rem 1.4rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${(p) => p.theme.colors.primary}; box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg}; }
`;

const FieldSelect = styled.select`
  width: 100%;
  padding: 1rem 1.4rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus { border-color: ${(p) => p.theme.colors.primary}; }
`;

const FieldGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
`;

const RouteArrow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 1.3rem;
`;

const RoutePoint = styled.span`
  flex: 1;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  font-size: 1.3rem;
`;

const DrawerFooterRow = styled.div`
  display: flex;
  gap: 1.2rem;
  width: 100%;
`;

const OutlineBtn = styled.button`
  flex: 1;
  padding: 1.2rem;
  background: transparent;
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover { background: ${(p) => p.theme.colors.chipBg}; }
`;

const PrimaryBtn = styled.button`
  flex: 1;
  padding: 1.2rem;
  background: ${(p) => p.theme.colors.primary};
  border: none;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.white};
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`;

/* ── Detail drawer ───────────────────────────────────── */

const DetailBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const DetailSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ItemLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ItemValue = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const MonoValue = styled(ItemValue)`
  font-family: "Courier New", Courier, monospace;
`;

const TrackingTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TrackingStep = styled.div<{ $done?: boolean; $last?: boolean }>`
  display: flex;
  gap: 1.2rem;
  padding-bottom: ${(p) => p.$last ? "0" : "1.6rem"};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0.75rem;
    top: 2rem;
    bottom: 0;
    width: 2px;
    background: ${(p) => p.$last ? "transparent" : p.$done ? p.theme.colors.success : p.theme.colors.border};
  }
`;

const TrackingDot = styled.div<{ $done?: boolean; $warn?: boolean }>`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.2rem;
  background: ${(p) =>
    p.$warn ? p.theme.colors.warning :
    p.$done ? p.theme.colors.success :
    p.theme.colors.border};
`;

const TrackingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const TrackingLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const TrackingDate = styled.span`
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Confirm modal ───────────────────────────────────── */

const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const ConfirmDesc = styled.p`
  margin: 0;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.textMuted};
  line-height: 1.6;
`;

const ConfirmRecord = styled.div`
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RecordId = styled.span`
  font-family: "Courier New", Courier, monospace;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const RecordSub = styled.span`
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const IncidentLabel = styled.label`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
  display: block;
  margin-bottom: 0.6rem;
`;

const IncidentInput = styled.textarea`
  width: 100%;
  padding: 1rem 1.4rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  resize: vertical;
  min-height: 6rem;
  transition: border-color 0.15s;

  &:focus { border-color: ${(p) => p.theme.colors.warning}; }
`;

/* ── Data ────────────────────────────────────────────── */

type GuideStatus = "transit" | "delivered" | "issue";

interface Guide {
  id: string;
  serie: string;
  origin: string;
  destination: string;
  carrier: string;
  date: string;
  status: GuideStatus;
}

const STATUS_CFG: Record<GuideStatus, { variant: BadgeVariant; label: string }> = {
  transit:   { variant: "warning", label: "EN TRÁNSITO"  },
  delivered: { variant: "success", label: "ENTREGADO"    },
  issue:     { variant: "danger",  label: "INCIDENCIA"   },
};

const STATUS_CHIPS: { value: GuideStatus | "all"; label: string }[] = [
  { value: "all",       label: "Todos"        },
  { value: "transit",   label: "En Tránsito"  },
  { value: "delivered", label: "Entregadas"   },
  { value: "issue",     label: "Incidencias"  },
];

const GUIDES: Guide[] = [
  { id: "1", serie: "T001-00000045", origin: "Lima — Almacén Central",  destination: "Arequipa — Sucursal",    carrier: "DHL Express Perú",     date: "14 Oct, 2024", status: "transit"   },
  { id: "2", serie: "T001-00000044", origin: "Lima — Almacén Central",  destination: "Trujillo — Cliente",     carrier: "Olva Courier",         date: "12 Oct, 2024", status: "delivered" },
  { id: "3", serie: "T001-00000043", origin: "Arequipa — Sucursal",     destination: "Cusco — Distribuidor",   carrier: "Marvisur Cargo",       date: "09 Oct, 2024", status: "issue"     },
  { id: "4", serie: "T001-00000042", origin: "Lima — Almacén Central",  destination: "Piura — Mayorista",      carrier: "Cargotrans Norte",     date: "05 Oct, 2024", status: "delivered" },
  { id: "5", serie: "T001-00000041", origin: "Lima — Almacén Central",  destination: "Iquitos — Cliente",      carrier: "Aerolíneas Peruanas",  date: "01 Oct, 2024", status: "delivered" },
];

const PAGE_SIZE = 8;

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(onIncident: (g: Guide) => void): ColumnDef<Guide>[] {
  return [
    {
      key: "serie",
      header: "Serie / Número",
      minWidth: "15rem",
      render: (r) => (
        <>
          <SerieNum>{r.serie}</SerieNum>
          <TextMuted>Guía de Remisión Electrónica</TextMuted>
        </>
      ),
    },
    {
      key: "origin",
      header: "Origen",
      minWidth: "16rem",
      render: (r) => <Bold>{r.origin}</Bold>,
    },
    {
      key: "destination",
      header: "Destino",
      minWidth: "16rem",
      render: (r) => <Bold>{r.destination}</Bold>,
    },
    {
      key: "carrier",
      header: "Transportista",
      minWidth: "15rem",
      render: (r) => <TextMuted style={{ color: "inherit", marginTop: 0 }}>{r.carrier}</TextMuted>,
    },
    { key: "date", header: "Fecha", width: "12rem" },
    {
      key: "status",
      header: "Estado",
      width: "13rem",
      align: "center",
      render: (r) => {
        const cfg = STATUS_CFG[r.status];
        return <Badge variant={cfg.variant} dot pill size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Acciones",
      width: "12rem",
      align: "right",
      render: (r) => (
        <ActionRow>
          <Tooltip content="Ver guía" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="visibility" size={18} />
            </RowBtn>
          </Tooltip>
          <Tooltip content="Descargar PDF" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="picture_as_pdf" size={18} />
            </RowBtn>
          </Tooltip>
          {r.status === "transit" && (
            <Tooltip content="Reportar incidencia" side="top">
              <WarnRowBtn onClick={(e) => { e.stopPropagation(); onIncident(r); }}>
                <Icon name="warning" size={18} />
              </WarnRowBtn>
            </Tooltip>
          )}
          <Tooltip content="Más opciones" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="more_vert" size={18} />
            </RowBtn>
          </Tooltip>
        </ActionRow>
      ),
    },
  ];
}

/* ── Page ────────────────────────────────────────────── */

export default function Guides() {
  const [page, setPage]                   = useState(1);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<GuideStatus | "all">("all");
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [detailGuide, setDetailGuide]     = useState<Guide | null>(null);
  const [incidentTarget, setIncidentTarget] = useState<Guide | null>(null);
  const [incidentDesc, setIncidentDesc]   = useState("");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GUIDES.filter((r) => {
      const matchText   = !q || r.origin.toLowerCase().includes(q) || r.destination.toLowerCase().includes(q) || r.carrier.toLowerCase().includes(q) || r.serie.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applySearch(v: string) { setSearch(v); setPage(1); }
  function applyStatus(v: GuideStatus | "all") { setStatusFilter(v); setPage(1); }

  function handleIncident(g: Guide) {
    setIncidentTarget(g);
    setIncidentDesc("");
  }

  function confirmIncident() {
    if (!incidentTarget) return;
    setIncidentTarget(null);
    toast({
      variant: "warning",
      title: "Incidencia registrada",
      description: `${incidentTarget.serie} — el equipo de logística ha sido notificado.`,
    });
  }

  function handleCreate() {
    setDrawerOpen(false);
    toast({ variant: "success", title: "Guía creada", description: "Guía de remisión electrónica generada y enviada a SUNAT." });
  }

  const columns = buildColumns(handleIncident);

  return (
    <ContentArea>
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Breadcrumb>
          <span>Ventas</span><span>›</span>
          <BreadcrumbActive>Guías</BreadcrumbActive>
        </Breadcrumb>
        <PageHeading>
          <div>
            <PageTitle>Guías de Remisión</PageTitle>
            <PageSubtitle>Control de traslado de mercancías con trazabilidad en tiempo real.</PageSubtitle>
          </div>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button variant="outline"><Icon name="map" size={18} />Ver Mapa</Button>
            <Button variant="primary" onClick={() => setDrawerOpen(true)}>
              <Icon name="add" size={18} />Nueva Guía
            </Button>
          </div>
        </PageHeading>
      </motion.div>

      <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
        <KpiCard variants={fadeUp}>
          <KpiLabel>En Tránsito</KpiLabel>
          <KpiValue $color="var(--color-warning)">12</KpiValue>
          <KpiSub>Envíos activos</KpiSub>
          <KpiBgIcon><Icon name="local_shipping" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Entregadas Mes</KpiLabel>
          <KpiValue $color="var(--color-success)">74</KpiValue>
          <KpiSub>97% a tiempo</KpiSub>
          <KpiBgIcon><Icon name="check_circle" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Incidencias</KpiLabel>
          <KpiValue $color="var(--color-danger)">03</KpiValue>
          <KpiSub>Requieren atención</KpiSub>
          <KpiBgIcon><Icon name="warning" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Total Este Mes</KpiLabel>
          <KpiValue>89</KpiValue>
          <KpiSub>+6 vs mes anterior</KpiSub>
          <KpiBgIcon><Icon name="analytics" size={80} /></KpiBgIcon>
        </KpiCard>
      </KpiGrid>

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <TablePanel>
          <TableHeader>
            <TableTitle>Registro de Guías de Remisión</TableTitle>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <Tooltip content="Filtrar tabla" side="top">
                <TableIconBtn><Icon name="filter_list" size={20} /></TableIconBtn>
              </Tooltip>
              <Tooltip content="Descargar Excel" side="top">
                <TableIconBtn><Icon name="download" size={20} /></TableIconBtn>
              </Tooltip>
            </div>
          </TableHeader>

          <FilterBar>
            <SearchWrap>
              <SearchIconEl><Icon name="search" size={16} /></SearchIconEl>
              <SearchInput
                type="text"
                placeholder="Buscar por origen, destino, transportista..."
                value={search}
                onChange={(e) => applySearch(e.target.value)}
              />
            </SearchWrap>
            <ChipGroup>
              {STATUS_CHIPS.map((c) => (
                <Chip key={c.value} $active={statusFilter === c.value} onClick={() => applyStatus(c.value)}>
                  {c.label}
                </Chip>
              ))}
            </ChipGroup>
          </FilterBar>

          <Table
            data={pageData}
            columns={columns}
            keyField="id"
            density="default"
            onRowClick={(r) => setDetailGuide(r)}
          />

          <PaginationBar>
            <Pagination.Info page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} size="sm" />
            <Pagination.Pages page={page} totalPages={Math.max(1, totalPages)} onPageChange={setPage} size="sm" />
          </PaginationBar>
        </TablePanel>
      </motion.div>

      {/* Nueva Guía drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Nueva Guía de Remisión"
        description="Genera una guía de remisión electrónica"
        size="lg"
        side="right"
      >
        <DrawerBody>
          <FormSection>
            <SectionTitle>Remitente</SectionTitle>
            <FieldGroup>
              <FieldLabel>RUC / Razón Social</FieldLabel>
              <FieldInput type="text" defaultValue="20601234567 — Mi Empresa S.A.C." readOnly style={{ background: "inherit" }} />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Dirección de Partida</FieldLabel>
              <FieldInput type="text" placeholder="Ej. Av. Industrial 123, Lima" />
            </FieldGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Destinatario</SectionTitle>
            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>RUC / DNI</FieldLabel>
                <FieldInput type="text" placeholder="20xxxxxxxxx" />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Razón Social</FieldLabel>
                <FieldInput type="text" placeholder="Nombre o empresa" />
              </FieldGroup>
            </FieldGrid2>
            <FieldGroup>
              <FieldLabel>Dirección de Llegada</FieldLabel>
              <FieldInput type="text" placeholder="Ej. Av. España 456, Trujillo" />
            </FieldGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Ruta</SectionTitle>
            <RouteArrow>
              <RoutePoint>Lima — Almacén Central</RoutePoint>
              <Icon name="arrow_forward" size={18} />
              <RoutePoint>—</RoutePoint>
            </RouteArrow>
          </FormSection>

          <FormSection>
            <SectionTitle>Transportista</SectionTitle>
            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>Empresa</FieldLabel>
                <FieldInput type="text" placeholder="Nombre de la empresa" />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>RUC Transportista</FieldLabel>
                <FieldInput type="text" placeholder="20xxxxxxxxx" />
              </FieldGroup>
            </FieldGrid2>
            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>Placa del Vehículo</FieldLabel>
                <FieldInput type="text" placeholder="ABC-123" />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Chofer (DNI)</FieldLabel>
                <FieldInput type="text" placeholder="DNI del conductor" />
              </FieldGroup>
            </FieldGrid2>
          </FormSection>

          <FormSection>
            <SectionTitle>Traslado</SectionTitle>
            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>Motivo</FieldLabel>
                <FieldSelect defaultValue="venta">
                  <option value="venta">Venta</option>
                  <option value="traslado">Traslado entre establecimientos</option>
                  <option value="devolucion">Devolución</option>
                  <option value="consignacion">Consignación</option>
                  <option value="otros">Otros</option>
                </FieldSelect>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Fecha de Traslado</FieldLabel>
                <FieldInput type="date" />
              </FieldGroup>
            </FieldGrid2>
            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>Peso Bruto Total (kg)</FieldLabel>
                <FieldInput type="number" placeholder="0.00" min="0" step="0.01" />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>N° Bultos / Unidades</FieldLabel>
                <FieldInput type="number" placeholder="0" min="0" />
              </FieldGroup>
            </FieldGrid2>
          </FormSection>
        </DrawerBody>

        <Drawer.Footer>
          <DrawerFooterRow>
            <OutlineBtn type="button" onClick={() => setDrawerOpen(false)}>Cancelar</OutlineBtn>
            <PrimaryBtn type="button" onClick={handleCreate}>
              <Icon name="local_shipping" size={18} />
              Generar Guía
            </PrimaryBtn>
          </DrawerFooterRow>
        </Drawer.Footer>
      </Drawer>

      {/* Detail drawer */}
      <Drawer
        open={!!detailGuide}
        onClose={() => setDetailGuide(null)}
        title={detailGuide?.serie ?? ""}
        description="Detalle de guía de remisión"
        size="md"
        side="right"
      >
        {detailGuide && (
          <>
            <DetailBody>
              <DetailSection>
                <SectionTitle>Información General</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Número</ItemLabel>
                    <MonoValue>{detailGuide.serie}</MonoValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Estado</ItemLabel>
                    <Badge variant={STATUS_CFG[detailGuide.status].variant} dot pill size="sm">
                      {STATUS_CFG[detailGuide.status].label}
                    </Badge>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Fecha</ItemLabel>
                    <ItemValue>{detailGuide.date}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Transportista</ItemLabel>
                    <ItemValue>{detailGuide.carrier}</ItemValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Ruta de Envío</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Origen</ItemLabel>
                    <ItemValue>{detailGuide.origin}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Destino</ItemLabel>
                    <ItemValue>{detailGuide.destination}</ItemValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Seguimiento</SectionTitle>
                <TrackingTimeline>
                  <TrackingStep $done>
                    <TrackingDot $done />
                    <TrackingInfo>
                      <TrackingLabel>Guía generada y enviada a SUNAT</TrackingLabel>
                      <TrackingDate>{detailGuide.date} — 08:00 AM</TrackingDate>
                    </TrackingInfo>
                  </TrackingStep>
                  <TrackingStep $done>
                    <TrackingDot $done />
                    <TrackingInfo>
                      <TrackingLabel>Mercancía recogida por transportista</TrackingLabel>
                      <TrackingDate>{detailGuide.date} — 10:30 AM</TrackingDate>
                    </TrackingInfo>
                  </TrackingStep>
                  {detailGuide.status === "issue" ? (
                    <TrackingStep $last>
                      <TrackingDot $warn />
                      <TrackingInfo>
                        <TrackingLabel>Incidencia registrada en ruta</TrackingLabel>
                        <TrackingDate>Pendiente de resolución</TrackingDate>
                      </TrackingInfo>
                    </TrackingStep>
                  ) : detailGuide.status === "delivered" ? (
                    <TrackingStep $done $last>
                      <TrackingDot $done />
                      <TrackingInfo>
                        <TrackingLabel>Entregado al destinatario</TrackingLabel>
                        <TrackingDate>Firma de conformidad recibida</TrackingDate>
                      </TrackingInfo>
                    </TrackingStep>
                  ) : (
                    <TrackingStep $last>
                      <TrackingDot />
                      <TrackingInfo>
                        <TrackingLabel>En camino al destino</TrackingLabel>
                        <TrackingDate>Estimado de llegada: 2-3 días</TrackingDate>
                      </TrackingInfo>
                    </TrackingStep>
                  )}
                </TrackingTimeline>
              </DetailSection>
            </DetailBody>

            <Drawer.Footer>
              <DrawerFooterRow>
                <OutlineBtn type="button" onClick={() => setDetailGuide(null)}>Cerrar</OutlineBtn>
                {detailGuide.status === "transit" && (
                  <PrimaryBtn
                    type="button"
                    style={{ background: "var(--color-warning)", flex: "unset", paddingLeft: "2rem", paddingRight: "2rem" }}
                    onClick={() => {
                      setDetailGuide(null);
                      handleIncident(detailGuide);
                    }}
                  >
                    <Icon name="warning" size={18} />
                    Incidencia
                  </PrimaryBtn>
                )}
                <PrimaryBtn
                  type="button"
                  style={{ flex: "unset", paddingLeft: "2rem", paddingRight: "2rem" }}
                  onClick={() => {
                    toast({ variant: "info", title: "Descargando PDF…", description: detailGuide.serie });
                  }}
                >
                  <Icon name="picture_as_pdf" size={18} />
                  PDF
                </PrimaryBtn>
              </DrawerFooterRow>
            </Drawer.Footer>
          </>
        )}
      </Drawer>

      {/* Incident report modal */}
      <Modal
        open={!!incidentTarget}
        onClose={() => setIncidentTarget(null)}
        title="Reportar Incidencia"
        description="El equipo de logística será notificado inmediatamente"
        size="sm"
      >
        <ConfirmBody>
          <ConfirmDesc>
            Describe la incidencia ocurrida durante el traslado. Se generará una alerta
            para el equipo de operaciones y se registrará en el historial de la guía.
          </ConfirmDesc>
          {incidentTarget && (
            <ConfirmRecord>
              <RecordId>{incidentTarget.serie}</RecordId>
              <RecordSub>{incidentTarget.origin} → {incidentTarget.destination}</RecordSub>
              <RecordSub>{incidentTarget.carrier}</RecordSub>
            </ConfirmRecord>
          )}
          <div>
            <IncidentLabel htmlFor="incident-desc">Descripción de la Incidencia *</IncidentLabel>
            <IncidentInput
              id="incident-desc"
              placeholder="Ej. Accidente vial, mercancía dañada, retraso significativo..."
              value={incidentDesc}
              onChange={(e) => setIncidentDesc(e.target.value)}
            />
          </div>
        </ConfirmBody>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIncidentTarget(null)}>Cancelar</Button>
          <Button variant="primary" onClick={confirmIncident}>
            <Icon name="warning" size={16} />
            Reportar
          </Button>
        </Modal.Footer>
      </Modal>
    </ContentArea>
  );
}
