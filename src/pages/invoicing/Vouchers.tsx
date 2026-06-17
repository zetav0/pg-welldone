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
import { useState } from "react";
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

/* ── KPI grid ────────────────────────────────────────── */

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

const ClientName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ClientRuc = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const AmountCell = styled.span`
  font-family: "Courier New", monospace;
  font-size: 1.3rem;
  font-weight: 700;
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

type VoucherType   = "factura" | "boleta";
type VoucherStatus = "accepted" | "pending" | "voided";

interface Voucher {
  id: string;
  serie: string;
  type: VoucherType;
  clientName: string;
  clientDoc: string;
  issueDate: string;
  amount: string;
  igv: string;
  total: string;
  status: VoucherStatus;
}

const TYPE_LABEL: Record<VoucherType, string> = {
  factura: "Factura Electrónica",
  boleta:  "Boleta de Venta",
};

const STATUS_CFG: Record<VoucherStatus, { variant: BadgeVariant; label: string }> = {
  accepted: { variant: "success", label: "ACEPTADO" },
  pending:  { variant: "warning", label: "PENDIENTE" },
  voided:   { variant: "danger",  label: "ANULADO"   },
};

const VOUCHERS: Voucher[] = [
  { id: "1", serie: "F001-00000892", type: "factura", clientName: "Constructora Alianza S.A.C.", clientDoc: "RUC 20556784912", issueDate: "14 Oct, 2024", amount: "S/ 10,550.85", igv: "S/ 1,899.15", total: "S/ 12,450.00", status: "accepted" },
  { id: "2", serie: "B001-00001230", type: "boleta",  clientName: "María García López",           clientDoc: "DNI 45123789",    issueDate: "13 Oct, 2024", amount: "S/   271.19", igv: "S/    48.81", total: "S/    320.00", status: "accepted" },
  { id: "3", serie: "F001-00000891", type: "factura", clientName: "Tech Solutions Peru S.A.C.",   clientDoc: "RUC 20512345678", issueDate: "12 Oct, 2024", amount: "S/ 20,338.98", igv: "S/ 3,661.02", total: "S/ 24,000.00", status: "pending"  },
  { id: "4", serie: "F001-00000889", type: "factura", clientName: "Distribuidora Norte E.I.R.L.", clientDoc: "RUC 20448123992", issueDate: "08 Oct, 2024", amount: "S/  2,711.86", igv: "S/   488.14", total: "S/  3,200.00", status: "voided"   },
  { id: "5", serie: "B001-00001228", type: "boleta",  clientName: "José Rodríguez Pinto",         clientDoc: "DNI 30456123",    issueDate: "05 Oct, 2024", amount: "S/    84.75", igv: "S/    15.25", total: "S/    100.00", status: "accepted" },
];

const PAGE_SIZE = 8;
const TOTAL = 432;

const columns: ColumnDef<Voucher>[] = [
  {
    key: "serie",
    header: "Serie / Número",
    minWidth: "16rem",
    render: (r) => (
      <>
        <SerieNum>{r.serie}</SerieNum>
        <ClientRuc style={{ marginTop: "0.2rem" }}>{TYPE_LABEL[r.type]}</ClientRuc>
      </>
    ),
  },
  {
    key: "clientName",
    header: "Cliente",
    minWidth: "18rem",
    render: (r) => (
      <>
        <ClientName>{r.clientName}</ClientName>
        <ClientRuc>{r.clientDoc}</ClientRuc>
      </>
    ),
  },
  { key: "issueDate", header: "Emisión",  width: "12rem" },
  {
    key: "total",
    header: "Total",
    width: "12rem",
    align: "right",
    render: (r) => <AmountCell>{r.total}</AmountCell>,
  },
  {
    key: "status",
    header: "Estado SUNAT",
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
        <RowBtn title="Ver PDF"><Icon name="picture_as_pdf" size={18} /></RowBtn>
        <RowBtn title="Enviar"><Icon name="send" size={18} /></RowBtn>
        <RowBtn title="Más"><Icon name="more_vert" size={18} /></RowBtn>
      </ActionRow>
    ),
  },
];

/* ── Page ────────────────────────────────────────────── */

export default function Vouchers() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const totalPages = Math.ceil(TOTAL / PAGE_SIZE);

  return (
    <ContentArea>
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Breadcrumb>
          <span>Ventas</span><span>›</span>
          <BreadcrumbActive>Comprobantes</BreadcrumbActive>
        </Breadcrumb>
        <PageHeading>
          <div>
            <PageTitle>Comprobantes Emitidos</PageTitle>
            <PageSubtitle>Facturas y boletas electrónicas registradas y enviadas a SUNAT.</PageSubtitle>
          </div>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button variant="outline"><Icon name="download" size={18} />Exportar</Button>
            <Button variant="primary" onClick={() => toast({ variant: "info", title: "Nuevo comprobante" })}>
              <Icon name="add" size={18} />Nuevo Comprobante
            </Button>
          </div>
        </PageHeading>
      </motion.div>

      <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
        <KpiCard variants={fadeUp}>
          <KpiLabel>Emitidas Hoy</KpiLabel>
          <KpiValue>47</KpiValue>
          <KpiSub>+8 vs ayer</KpiSub>
          <KpiBgIcon><Icon name="receipt_long" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Monto Total Mes</KpiLabel>
          <KpiValue>S/ 138,420</KpiValue>
          <KpiSub>432 comprobantes</KpiSub>
          <KpiBgIcon><Icon name="payments" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Pendiente SUNAT</KpiLabel>
          <KpiValue $color="var(--color-warning)">03</KpiValue>
          <KpiSub>En cola de envío</KpiSub>
          <KpiBgIcon><Icon name="cloud_upload" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Anuladas</KpiLabel>
          <KpiValue $color="var(--color-danger)">02</KpiValue>
          <KpiSub>Este mes</KpiSub>
          <KpiBgIcon><Icon name="cancel" size={80} /></KpiBgIcon>
        </KpiCard>
      </KpiGrid>

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <TablePanel>
          <TableHeader>
            <TableTitle>Registro de Comprobantes</TableTitle>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <TableIconBtn><Icon name="filter_list" size={20} /></TableIconBtn>
              <TableIconBtn><Icon name="download" size={20} /></TableIconBtn>
            </div>
          </TableHeader>
          <Table data={VOUCHERS} columns={columns} keyField="id" density="default" />
          <PaginationBar>
            <Pagination.Info page={page} pageSize={PAGE_SIZE} totalItems={TOTAL} size="sm" />
            <Pagination.Pages page={page} totalPages={totalPages} onPageChange={setPage} size="sm" />
          </PaginationBar>
        </TablePanel>
      </motion.div>
    </ContentArea>
  );
}
