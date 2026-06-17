import { useMemo, useState } from "react";
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
import type { BadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Drawer } from "../components/common/Drawer";
import { Pagination } from "../components/ui/Pagination";
import { useToast } from "../components/common/Toast";
import { Tooltip } from "../components/ui/Tooltip";
import { Modal } from "../components/ui/Modal";

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

/* ── Aging summary ───────────────────────────────────── */

const AgingCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const AgingTitle = styled.h3`
  margin: 0 0 2rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const AgingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.6rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2,1fr); }
`;

const AgingBucket = styled.div<{ $color: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const AgingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const AgingRange = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const AgingAmount = styled.span<{ $color: string }>`
  font-family: "Courier New", monospace;
  font-size: 1.5rem;
  font-weight: 900;
  color: ${(p) => p.$color};
`;

const AgingBar = styled.div`
  height: 0.8rem;
  border-radius: 10rem;
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

const AgingFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  border-radius: 10rem;
  background: ${(p) => p.$color};
  transition: width 0.6s ease;
`;

const AgingCount = styled.span`
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
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

  &:hover { border-color: ${(p) => p.theme.colors.primary}; color: ${(p) => p.theme.colors.primary}; }
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

/* ── Cell helpers ────────────────────────────────────── */

const CellBold = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const CellSub = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MonoCell = styled.span`
  font-family: "Courier New", monospace;
  font-size: 1.3rem;
  font-weight: 700;
`;

const OverdueTag = styled.span<{ $days: number }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) =>
    p.$days > 60 ? p.theme.colors.danger :
    p.$days > 30 ? p.theme.colors.warning :
    p.theme.colors.textMuted};
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
  &:hover { background: ${(p) => p.theme.colors.primaryBg}; color: ${(p) => p.theme.colors.primary}; }
`;

/* ── Detail / Payment modal helpers ─────────────────── */

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

const PaymentHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaymentEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.4rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
`;

const PaymentDate = styled.span`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const PaymentMethod = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const PaymentAmount = styled.span`
  font-family: "Courier New", monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.success};
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

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
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

  &:focus { border-color: ${(p) => p.theme.colors.primary}; }
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

const InvoiceBox = styled.div`
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  padding: 1.2rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
`;

/* ── Data ────────────────────────────────────────────── */

type ReceivableStatus = "pending" | "overdue" | "paid";

interface Receivable {
  id: string;
  clientName: string;
  clientDoc: string;
  invoiceSerie: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
  status: ReceivableStatus;
}

const STATUS_CFG: Record<ReceivableStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: "warning", label: "PENDIENTE" },
  overdue: { variant: "danger",  label: "VENCIDO"   },
  paid:    { variant: "success", label: "COBRADO"   },
};

const STATUS_CHIPS: { value: ReceivableStatus | "all"; label: string }[] = [
  { value: "all",     label: "Todos"     },
  { value: "pending", label: "Pendientes"},
  { value: "overdue", label: "Vencidos"  },
  { value: "paid",    label: "Cobrados"  },
];

const RECEIVABLES: Receivable[] = [
  { id: "1",  clientName: "Constructora Alianza S.A.C.",      clientDoc: "RUC 20556784912", invoiceSerie: "F001-00000892", issueDate: "14 Oct, 2024", dueDate: "13 Nov, 2024", amount: 12450.00, daysOverdue:  0, status: "pending" },
  { id: "2",  clientName: "Tech Solutions Peru S.A.C.",        clientDoc: "RUC 20512345678", invoiceSerie: "F001-00000882", issueDate: "02 Oct, 2024", dueDate: "01 Nov, 2024", amount: 24000.00, daysOverdue:  0, status: "pending" },
  { id: "3",  clientName: "Clínica San Lucas S.A.",            clientDoc: "RUC 20456789012", invoiceSerie: "F001-00000876", issueDate: "25 Sep, 2024", dueDate: "25 Oct, 2024", amount: 15300.00, daysOverdue: 19, status: "overdue" },
  { id: "4",  clientName: "Laboratorio Andino S.A.C.",         clientDoc: "RUC 20567890123", invoiceSerie: "F001-00000874", issueDate: "22 Sep, 2024", dueDate: "22 Oct, 2024", amount:  9750.00, daysOverdue: 22, status: "overdue" },
  { id: "5",  clientName: "Farmacia San Martín E.I.R.L.",      clientDoc: "RUC 20388812401", invoiceSerie: "F001-00000879", issueDate: "28 Sep, 2024", dueDate: "28 Oct, 2024", amount:  5600.00, daysOverdue: 16, status: "overdue" },
  { id: "6",  clientName: "Importaciones Cóndor S.R.L.",       clientDoc: "RUC 20678901234", invoiceSerie: "F001-00000871", issueDate: "18 Sep, 2024", dueDate: "18 Oct, 2024", amount:  2800.00, daysOverdue:  0, status: "paid"    },
  { id: "7",  clientName: "Distribuidora Norte E.I.R.L.",      clientDoc: "RUC 20448123992", invoiceSerie: "F001-00000890", issueDate: "12 Oct, 2024", dueDate: "11 Nov, 2024", amount:  3200.00, daysOverdue:  0, status: "pending" },
  { id: "8",  clientName: "Corporación Buen Vivir S.A.",       clientDoc: "RUC 20601029384", invoiceSerie: "F001-00000860", issueDate: "10 Sep, 2024", dueDate: "10 Oct, 2024", amount: 18750.00, daysOverdue: 34, status: "overdue" },
  { id: "9",  clientName: "Inversiones Pizarro",               clientDoc: "RUC 10456677881", invoiceSerie: "F001-00000855", issueDate: "05 Sep, 2024", dueDate: "05 Oct, 2024", amount:  8900.00, daysOverdue:  0, status: "paid"    },
  { id: "10", clientName: "Agro Exportaciones Lima S.R.L.",    clientDoc: "RUC 20391028475", invoiceSerie: "F001-00000868", issueDate: "20 Sep, 2024", dueDate: "20 Oct, 2024", amount:  6400.00, daysOverdue: 24, status: "overdue" },
];

const PAGE_SIZE = 8;

/* ── Payment form schema ─────────────────────────────── */

const paymentSchema = z.object({
  monto:      z.string().refine((v) => parseFloat(v) > 0, "El monto debe ser mayor a 0"),
  fecha:      z.string().min(1, "La fecha es requerida"),
  metodo:     z.enum(["efectivo", "transferencia", "cheque", "deposito", "yape"]),
  referencia: z.string().optional(),
});
type PaymentFields = z.infer<typeof paymentSchema>;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

function fmtSol(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ── Aging buckets ───────────────────────────────────── */

const AGING = [
  { label: "Corriente",  range: "0 – 30 días",  color: "var(--color-success)", filter: (r: Receivable) => r.daysOverdue === 0 && r.status !== "paid" },
  { label: "Por Vencer", range: "31 – 60 días",  color: "var(--color-warning)", filter: (r: Receivable) => r.daysOverdue > 0  && r.daysOverdue <= 30  },
  { label: "Vencido",    range: "61 – 90 días",  color: "#f97316",              filter: (r: Receivable) => r.daysOverdue > 30 && r.daysOverdue <= 60  },
  { label: "Crítico",    range: "+90 días",       color: "var(--color-danger)",  filter: (r: Receivable) => r.daysOverdue > 60 },
] as const;

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(onRegisterPayment: (r: Receivable) => void): ColumnDef<Receivable>[] {
  return [
    {
      key: "clientName",
      header: "Cliente",
      minWidth: "20rem",
      render: (r) => (
        <>
          <CellBold>{r.clientName}</CellBold>
          <CellSub>{r.clientDoc}</CellSub>
        </>
      ),
    },
    {
      key: "invoiceSerie",
      header: "Factura",
      minWidth: "15rem",
      render: (r) => (
        <>
          <MonoCell>{r.invoiceSerie}</MonoCell>
          <CellSub>Emitida: {r.issueDate}</CellSub>
        </>
      ),
    },
    { key: "dueDate", header: "Vencimiento", width: "13rem" },
    {
      key: "amount",
      header: "Monto",
      width: "13rem",
      align: "right",
      render: (r) => <MonoCell>{fmtSol(r.amount)}</MonoCell>,
    },
    {
      key: "daysOverdue",
      header: "Días Mora",
      width: "10rem",
      align: "center",
      render: (r) =>
        r.status === "paid" ? (
          <span style={{ fontSize: "1.2rem", color: "var(--color-text-muted)" }}>—</span>
        ) : r.daysOverdue === 0 ? (
          <span style={{ fontSize: "1.2rem", color: "var(--color-text-muted)" }}>Al día</span>
        ) : (
          <OverdueTag $days={r.daysOverdue}>{r.daysOverdue}d mora</OverdueTag>
        ),
    },
    {
      key: "status",
      header: "Estado",
      width: "12rem",
      align: "center",
      render: (r) => {
        const cfg = STATUS_CFG[r.status];
        return <Badge variant={cfg.variant} dot pill size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      width: "10rem",
      align: "right",
      render: (r) => (
        <ActionRow>
          {r.status !== "paid" && (
            <Tooltip content="Registrar pago" side="top">
              <RowBtn onClick={(e) => { e.stopPropagation(); onRegisterPayment(r); }}>
                <Icon name="payments" size={18} />
              </RowBtn>
            </Tooltip>
          )}
          <Tooltip content="Enviar recordatorio" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="mail" size={18} />
            </RowBtn>
          </Tooltip>
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

export default function Collections() {
  const [page, setPage]                     = useState(1);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState<ReceivableStatus | "all">("all");
  const [detailReceivable, setDetailReceivable] = useState<Receivable | null>(null);
  const [paymentTarget, setPaymentTarget]   = useState<Receivable | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetPayment,
  } = useForm<PaymentFields>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { monto: "", fecha: new Date().toISOString().slice(0, 10), metodo: "transferencia", referencia: "" },
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return RECEIVABLES.filter((r) => {
      const matchText   = !q || r.clientName.toLowerCase().includes(q) || r.invoiceSerie.toLowerCase().includes(q) || r.clientDoc.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPending  = RECEIVABLES.filter((r) => r.status !== "paid").reduce((s, r) => s + r.amount, 0);
  const totalOverdue  = RECEIVABLES.filter((r) => r.status === "overdue").reduce((s, r) => s + r.amount, 0);
  const totalPaid     = RECEIVABLES.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const pendingCount  = RECEIVABLES.filter((r) => r.status !== "paid").length;

  const agingData = AGING.map((bucket) => {
    const items  = RECEIVABLES.filter(bucket.filter);
    const amount = items.reduce((s, r) => s + r.amount, 0);
    return { ...bucket, amount, count: items.length };
  });
  const maxAmount = Math.max(...agingData.map((b) => b.amount), 1);

  function handleRegisterPayment(r: Receivable) {
    setPaymentTarget(r);
    resetPayment({ monto: r.amount.toFixed(2), fecha: new Date().toISOString().slice(0, 10), metodo: "transferencia", referencia: "" });
  }

  const onPayment = handleSubmit((data) => {
    if (!paymentTarget) return;
    const target = paymentTarget;
    setPaymentTarget(null);
    of(null).subscribe({
      next: () => toast({
        variant: "success",
        title: "Pago registrado",
        description: `${target.invoiceSerie} — ${fmtSol(parseFloat(data.monto))} vía ${data.metodo}.`,
      }),
    });
  });

  const columns = buildColumns(handleRegisterPayment);

  return (
    <ContentArea>
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Breadcrumb>
          <span>Finanzas</span><span>›</span>
          <BreadcrumbActive>Cobranzas</BreadcrumbActive>
        </Breadcrumb>
        <PageHeading>
          <div>
            <PageTitle>Cobranzas y Recaudo</PageTitle>
            <PageSubtitle>Seguimiento de cuentas por cobrar, aging de cartera y registro de pagos al contado o crédito.</PageSubtitle>
          </div>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button variant="outline"><Icon name="mail" size={18} />Enviar Recordatorios</Button>
            <Button variant="primary"><Icon name="download" size={18} />Exportar</Button>
          </div>
        </PageHeading>
      </motion.div>

      {/* KPIs */}
      <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
        <KpiCard variants={fadeUp}>
          <KpiLabel>Total por Cobrar</KpiLabel>
          <KpiValue>{fmtSol(totalPending)}</KpiValue>
          <KpiSub>{pendingCount} facturas pendientes</KpiSub>
          <KpiBgIcon><Icon name="account_balance_wallet" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Cartera Vencida</KpiLabel>
          <KpiValue $color="var(--color-danger)">{fmtSol(totalOverdue)}</KpiValue>
          <KpiSub>Requiere gestión inmediata</KpiSub>
          <KpiBgIcon><Icon name="warning" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Cobrado Este Mes</KpiLabel>
          <KpiValue $color="var(--color-success)">{fmtSol(totalPaid)}</KpiValue>
          <KpiSub>Pagos recibidos</KpiSub>
          <KpiBgIcon><Icon name="task_alt" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Clientes Morosos</KpiLabel>
          <KpiValue $color="var(--color-warning)">{RECEIVABLES.filter((r) => r.status === "overdue").length}</KpiValue>
          <KpiSub>Con deuda vencida</KpiSub>
          <KpiBgIcon><Icon name="person_off" size={80} /></KpiBgIcon>
        </KpiCard>
      </KpiGrid>

      {/* Aging chart */}
      <AgingCard variants={fadeUp} initial="hidden" animate="visible">
        <AgingTitle>Análisis de Antigüedad de Cartera</AgingTitle>
        <AgingGrid>
          {agingData.map((bucket) => (
            <AgingBucket key={bucket.label} $color={bucket.color}>
              <AgingHeader>
                <AgingRange>{bucket.range}</AgingRange>
                <AgingAmount $color={bucket.color}>{fmtSol(bucket.amount)}</AgingAmount>
              </AgingHeader>
              <AgingBar>
                <AgingFill $pct={Math.round((bucket.amount / maxAmount) * 100)} $color={bucket.color} />
              </AgingBar>
              <AgingCount>{bucket.count} factura{bucket.count !== 1 ? "s" : ""} — {bucket.label}</AgingCount>
            </AgingBucket>
          ))}
        </AgingGrid>
      </AgingCard>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <TablePanel>
          <TableHeader>
            <TableTitle>Cuentas por Cobrar</TableTitle>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <Tooltip content="Descargar Excel" side="top">
                <TableIconBtn><Icon name="download" size={20} /></TableIconBtn>
              </Tooltip>
              <Tooltip content="Imprimir reporte" side="top">
                <TableIconBtn><Icon name="print" size={20} /></TableIconBtn>
              </Tooltip>
            </div>
          </TableHeader>

          <FilterBar>
            <SearchWrap>
              <SearchIconEl><Icon name="search" size={16} /></SearchIconEl>
              <SearchInput
                type="text"
                placeholder="Buscar por cliente o factura..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </SearchWrap>
            <ChipGroup>
              {STATUS_CHIPS.map((c) => (
                <Chip key={c.value} $active={statusFilter === c.value} onClick={() => { setStatusFilter(c.value); setPage(1); }}>
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
            onRowClick={(r) => setDetailReceivable(r)}
          />

          <PaginationBar>
            <Pagination.Info page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} size="sm" />
            <Pagination.Pages page={page} totalPages={Math.max(1, totalPages)} onPageChange={setPage} size="sm" />
          </PaginationBar>
        </TablePanel>
      </motion.div>

      {/* Detail drawer */}
      <Drawer
        open={!!detailReceivable}
        onClose={() => setDetailReceivable(null)}
        title={detailReceivable?.invoiceSerie ?? ""}
        description="Detalle de cuenta por cobrar"
        size="md"
        side="right"
      >
        {detailReceivable && (
          <>
            <DetailBody>
              <DetailSection>
                <SectionTitle>Información de la Deuda</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Factura</ItemLabel>
                    <MonoValue>{detailReceivable.invoiceSerie}</MonoValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Estado</ItemLabel>
                    <Badge variant={STATUS_CFG[detailReceivable.status].variant} dot pill size="sm">
                      {STATUS_CFG[detailReceivable.status].label}
                    </Badge>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Emisión</ItemLabel>
                    <ItemValue>{detailReceivable.issueDate}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Vencimiento</ItemLabel>
                    <ItemValue>{detailReceivable.dueDate}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Monto Total</ItemLabel>
                    <MonoValue>{fmtSol(detailReceivable.amount)}</MonoValue>
                  </DetailItem>
                  {detailReceivable.daysOverdue > 0 && (
                    <DetailItem>
                      <ItemLabel>Días en Mora</ItemLabel>
                      <ItemValue style={{ color: "var(--color-danger)" }}>{detailReceivable.daysOverdue} días</ItemValue>
                    </DetailItem>
                  )}
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Cliente</SectionTitle>
                <DetailGrid>
                  <DetailItem style={{ gridColumn: "span 2" }}>
                    <ItemLabel>Razón Social</ItemLabel>
                    <ItemValue>{detailReceivable.clientName}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Documento</ItemLabel>
                    <MonoValue>{detailReceivable.clientDoc}</MonoValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Historial de Pagos</SectionTitle>
                {detailReceivable.status === "paid" ? (
                  <PaymentHistory>
                    <PaymentEntry>
                      <div>
                        <PaymentDate>13 Oct, 2024</PaymentDate>
                        <PaymentMethod style={{ display: "block" }}>Transferencia bancaria</PaymentMethod>
                      </div>
                      <PaymentAmount>{fmtSol(detailReceivable.amount)}</PaymentAmount>
                    </PaymentEntry>
                  </PaymentHistory>
                ) : (
                  <span style={{ fontSize: "1.3rem", color: "var(--color-text-muted)" }}>
                    Sin pagos registrados aún.
                  </span>
                )}
              </DetailSection>
            </DetailBody>

            <Drawer.Footer>
              <DrawerFooterRow>
                <OutlineBtn type="button" onClick={() => setDetailReceivable(null)}>Cerrar</OutlineBtn>
                {detailReceivable.status !== "paid" && (
                  <PrimaryBtn
                    type="button"
                    onClick={() => {
                      setDetailReceivable(null);
                      handleRegisterPayment(detailReceivable);
                    }}
                  >
                    <Icon name="payments" size={18} />
                    Registrar Pago
                  </PrimaryBtn>
                )}
              </DrawerFooterRow>
            </Drawer.Footer>
          </>
        )}
      </Drawer>

      {/* Register payment modal */}
      <Modal
        open={!!paymentTarget}
        onClose={() => setPaymentTarget(null)}
        title="Registrar Pago"
        description="Ingresa los datos del pago recibido"
        size="sm"
      >
        <ModalBody>
          {paymentTarget && (
            <InvoiceBox>
              <div>
                <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: "1.3rem" }}>
                  {paymentTarget.invoiceSerie}
                </div>
                <div style={{ fontSize: "1.2rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                  {paymentTarget.clientName}
                </div>
              </div>
              <span style={{ fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: "1.5rem" }}>
                {fmtSol(paymentTarget.amount)}
              </span>
            </InvoiceBox>
          )}

          <Grid2>
            <FieldGroup>
              <FieldLabel htmlFor="pay-amount">Monto Recibido (S/)</FieldLabel>
              <FieldInput
                id="pay-amount"
                type="number"
                min={0}
                step={0.01}
                {...register("monto")}
              />
              {errors.monto && <ErrorMsg><Icon name="error" size={14} />{errors.monto.message}</ErrorMsg>}
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor="pay-date">Fecha de Pago</FieldLabel>
              <FieldInput id="pay-date" type="date" {...register("fecha")} />
              {errors.fecha && <ErrorMsg><Icon name="error" size={14} />{errors.fecha.message}</ErrorMsg>}
            </FieldGroup>
          </Grid2>

          <FieldGroup>
            <FieldLabel htmlFor="pay-method">Método de Pago</FieldLabel>
            <FieldSelect id="pay-method" {...register("metodo")}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="cheque">Cheque</option>
              <option value="deposito">Depósito en cuenta</option>
              <option value="yape">Yape / Plin</option>
            </FieldSelect>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="pay-ref">Referencia / Nº Operación (opcional)</FieldLabel>
            <FieldInput id="pay-ref" type="text" placeholder="Ej. Nº de transferencia, nº cheque..." {...register("referencia")} />
          </FieldGroup>
        </ModalBody>

        <Modal.Footer>
          <Button variant="outline" onClick={() => setPaymentTarget(null)}>Cancelar</Button>
          <Button variant="primary" onClick={onPayment}>
            <Icon name="check_circle" size={16} />
            Confirmar Pago
          </Button>
        </Modal.Footer>
      </Modal>
    </ContentArea>
  );
}
