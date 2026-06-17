import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../lib/variants";
import { Table } from "../../components/ui/Table";
import type { ColumnDef } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import type { BadgeVariant } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/common/Toast";

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

const GUIDES: Guide[] = [
  { id: "1", serie: "T001-00000045", origin: "Lima — Almacén Central",  destination: "Arequipa — Sucursal",    carrier: "DHL Express Perú",     date: "14 Oct, 2024", status: "transit"   },
  { id: "2", serie: "T001-00000044", origin: "Lima — Almacén Central",  destination: "Trujillo — Cliente",     carrier: "Olva Courier",         date: "12 Oct, 2024", status: "delivered" },
  { id: "3", serie: "T001-00000043", origin: "Arequipa — Sucursal",     destination: "Cusco — Distribuidor",   carrier: "Marvisur Cargo",       date: "09 Oct, 2024", status: "issue"     },
  { id: "4", serie: "T001-00000042", origin: "Lima — Almacén Central",  destination: "Piura — Mayorista",      carrier: "Cargotrans Norte",     date: "05 Oct, 2024", status: "delivered" },
  { id: "5", serie: "T001-00000041", origin: "Lima — Almacén Central",  destination: "Iquitos — Cliente",      carrier: "Aerolíneas Peruanas",  date: "01 Oct, 2024", status: "delivered" },
];

const PAGE_SIZE = 8;
const TOTAL = 89;

const columns: ColumnDef<Guide>[] = [
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
    render: (r) => (
      <>
        <Bold>{r.origin}</Bold>
      </>
    ),
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
    width: "10rem",
    align: "right",
    render: () => (
      <ActionRow>
        <RowBtn title="Ver guía"><Icon name="visibility" size={18} /></RowBtn>
        <RowBtn title="Descargar PDF"><Icon name="picture_as_pdf" size={18} /></RowBtn>
        <RowBtn title="Más"><Icon name="more_vert" size={18} /></RowBtn>
      </ActionRow>
    ),
  },
];

/* ── Page ────────────────────────────────────────────── */

export default function Guides() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const totalPages = Math.ceil(TOTAL / PAGE_SIZE);

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
            <Button variant="primary" onClick={() => toast({ variant: "info", title: "Nueva guía de remisión" })}>
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
              <TableIconBtn><Icon name="filter_list" size={20} /></TableIconBtn>
              <TableIconBtn><Icon name="download" size={20} /></TableIconBtn>
            </div>
          </TableHeader>
          <Table data={GUIDES} columns={columns} keyField="id" density="default" />
          <PaginationBar>
            <Pagination.Info page={page} pageSize={PAGE_SIZE} totalItems={TOTAL} size="sm" />
            <Pagination.Pages page={page} totalPages={totalPages} onPageChange={setPage} size="sm" />
          </PaginationBar>
        </TablePanel>
      </motion.div>
    </ContentArea>
  );
}
