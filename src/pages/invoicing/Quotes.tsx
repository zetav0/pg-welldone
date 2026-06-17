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

/* ── Heading ─────────────────────────────────────────── */

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0.6rem;
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

const PageTitle = styled.h1`
  margin: 0;
  font-size: 3.6rem;
  font-weight: 900;
  letter-spacing: -0.15rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.1;
`;

const PageSubtitle = styled.p`
  margin: 0.6rem 0 0;
  font-size: 1.5rem;
  color: ${(p) => p.theme.colors.textMuted};
  max-width: 52rem;
`;

const HeadingActions = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-shrink: 0;
`;

/* ── KPI grid ────────────────────────────────────────── */

const KpiGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const KpiCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2rem 2rem 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primaryBgStrong};
    box-shadow: 0 4px 20px -4px rgba(113,42,226,0.08);
  }
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
  line-height: 1;
`;

const KpiSub = styled.p<{ $success?: boolean; $warning?: boolean }>`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) =>
    p.$success ? p.theme.colors.success :
    p.$warning ? p.theme.colors.warning :
    p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const KpiBgIcon = styled.div`
  position: absolute;
  right: -1.2rem;
  bottom: -1.2rem;
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
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
    color: ${(p) => p.theme.colors.text};
  }
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
  max-width: 34rem;
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

const QuoteNumber = styled.span`
  font-family: "Courier New", Courier, monospace;
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
  font-family: "Courier New", Courier, monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
`;

const RowIconBtn = styled.button`
  background: none;
  border: none;
  padding: 0.6rem;
  border-radius: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.textMuted};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primaryBg};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const FacturarBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.2rem;
  border: 1.5px solid ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.primaryBg};
  color: ${(p) => p.theme.colors.primary};
  border-radius: 0.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.white};
  }
`;

/* ── Drawer form ─────────────────────────────────────── */

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const Step = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StepBadge = styled.span`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const StepLabel = styled.h4`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
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
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg};
  }

  &:read-only {
    background: ${(p) => p.theme.colors.chipBg};
    cursor: not-allowed;
    color: ${(p) => p.theme.colors.textMuted};
  }
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
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg};
  }
`;

const RucRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const SearchBtn = styled.button`
  padding: 1rem 1.6rem;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`;

const FieldGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const EmptyProducts = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  padding: 3.2rem 2rem;
  text-align: center;
  background: ${(p) => p.theme.colors.chipBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const EmptyLabel = styled.p`
  margin: 0;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const AddLineBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;

  &:hover { text-decoration: underline; }
`;

const CatalogBtn = styled.button`
  padding: 0.8rem 1.6rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover { background: ${(p) => p.theme.colors.chipBg}; }
`;

const DrawerFooterRow = styled.div`
  display: flex;
  gap: 1.2rem;
  width: 100%;
`;

const DraftBtn = styled.button`
  flex: 1;
  padding: 1.2rem;
  background: ${(p) => p.theme.colors.surface};
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

const SendBtn = styled.button`
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

const DetailMonospace = styled(ItemValue)`
  font-family: "Courier New", Courier, monospace;
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

/* ── Data ────────────────────────────────────────────── */

type QuoteStatus = "sent" | "accepted" | "expired" | "draft";

interface Quote {
  id: string;
  clientName: string;
  clientRuc: string;
  date: string;
  amount: string;
  status: QuoteStatus;
}

const STATUS_CONFIG: Record<QuoteStatus, { variant: BadgeVariant; label: string }> = {
  sent:     { variant: "warning", label: "ENVIADO"  },
  accepted: { variant: "success", label: "ACEPTADO" },
  expired:  { variant: "danger",  label: "VENCIDO"  },
  draft:    { variant: "neutral", label: "BORRADOR" },
};

const STATUS_CHIPS: { value: QuoteStatus | "all"; label: string }[] = [
  { value: "all",      label: "Todos"     },
  { value: "sent",     label: "Enviados"  },
  { value: "accepted", label: "Aceptados" },
  { value: "expired",  label: "Vencidos"  },
  { value: "draft",    label: "Borradores"},
];

const QUOTES: Quote[] = [
  { id: "COT-2024-0891", clientName: "Constructora Alianza S.A.C.",     clientRuc: "20556784912", date: "14 Oct, 2024", amount: "S/ 12,450.00", status: "sent"     },
  { id: "COT-2024-0890", clientName: "Distribuidora Norte E.I.R.L.",    clientRuc: "20448123992", date: "12 Oct, 2024", amount: "S/  3,200.00", status: "accepted"  },
  { id: "COT-2024-0885", clientName: "Inversiones Pizarro",             clientRuc: "10456677881", date: "05 Oct, 2024", amount: "S/  8,900.00", status: "expired"   },
  { id: "COT-2024-0882", clientName: "Tech Solutions Peru S.A.C.",      clientRuc: "20512345678", date: "02 Oct, 2024", amount: "S/ 24,000.00", status: "accepted"  },
  { id: "COT-2024-0879", clientName: "Farmacia San Martín E.I.R.L.",    clientRuc: "20388812401", date: "28 Sep, 2024", amount: "S/  5,600.00", status: "sent"      },
  { id: "COT-2024-0876", clientName: "Clínica San Lucas S.A.",          clientRuc: "20456789012", date: "25 Sep, 2024", amount: "S/ 15,300.00", status: "draft"     },
  { id: "COT-2024-0874", clientName: "Laboratorio Andino S.A.C.",       clientRuc: "20567890123", date: "22 Sep, 2024", amount: "S/  9,750.00", status: "expired"   },
  { id: "COT-2024-0871", clientName: "Importaciones Cóndor S.R.L.",     clientRuc: "20678901234", date: "18 Sep, 2024", amount: "S/  2,800.00", status: "accepted"  },
];

const PAGE_SIZE = 8;

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(
  onFacturar: (q: Quote) => void,
): ColumnDef<Quote>[] {
  return [
    {
      key: "id",
      header: "Número",
      minWidth: "15rem",
      render: (r) => <QuoteNumber>{r.id}</QuoteNumber>,
    },
    {
      key: "clientName",
      header: "Cliente",
      minWidth: "20rem",
      render: (r) => (
        <>
          <ClientName>{r.clientName}</ClientName>
          <ClientRuc>RUC: {r.clientRuc}</ClientRuc>
        </>
      ),
    },
    { key: "date",   header: "Fecha",  width: "12rem" },
    {
      key: "amount",
      header: "Monto",
      width: "13rem",
      align: "right",
      render: (r) => <AmountCell>{r.amount}</AmountCell>,
    },
    {
      key: "status",
      header: "Estado",
      width: "12rem",
      align: "center",
      render: (r) => {
        const cfg = STATUS_CONFIG[r.status];
        return <Badge variant={cfg.variant} dot pill size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Acciones",
      width: "14rem",
      align: "right",
      render: (r) => (
        <ActionGroup>
          {r.status === "accepted" ? (
            <Tooltip content="Convertir a factura electrónica" side="top">
              <FacturarBtn onClick={(e) => { e.stopPropagation(); onFacturar(r); }}>
                <Icon name="point_of_sale" size={15} />
                FACTURAR
              </FacturarBtn>
            </Tooltip>
          ) : r.status === "expired" ? (
            <Tooltip content="Renovar cotización" side="top">
              <RowIconBtn onClick={(e) => e.stopPropagation()}>
                <Icon name="refresh" size={18} />
              </RowIconBtn>
            </Tooltip>
          ) : (
            <Tooltip content="Ver detalles" side="top">
              <RowIconBtn onClick={(e) => e.stopPropagation()}>
                <Icon name="receipt_long" size={18} />
              </RowIconBtn>
            </Tooltip>
          )}
          <Tooltip content="Más opciones" side="top">
            <RowIconBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="more_vert" size={18} />
            </RowIconBtn>
          </Tooltip>
        </ActionGroup>
      ),
    },
  ];
}

/* ── Page ────────────────────────────────────────────── */

export default function Quotes() {
  const [page, setPage]                     = useState(1);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState<QuoteStatus | "all">("all");
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [detailQuote, setDetailQuote]       = useState<Quote | null>(null);
  const [facturarTarget, setFacturarTarget] = useState<Quote | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return QUOTES.filter((r) => {
      const matchText   = !q || r.clientName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applySearch(v: string) { setSearch(v); setPage(1); }
  function applyStatus(v: QuoteStatus | "all") { setStatusFilter(v); setPage(1); }

  function handleFacturar(q: Quote) {
    setFacturarTarget(q);
  }

  function confirmFacturar() {
    if (!facturarTarget) return;
    setFacturarTarget(null);
    toast({
      variant: "success",
      title: "Factura generada",
      description: `${facturarTarget.id} convertida — enviando a SUNAT…`,
    });
  }

  const columns = buildColumns(handleFacturar);

  function handleSend() {
    setDrawerOpen(false);
    toast({ variant: "success", title: "Cotización enviada", description: "El cliente recibirá la proforma por correo electrónico." });
  }

  function handleDraft() {
    setDrawerOpen(false);
    toast({ variant: "info", title: "Borrador guardado" });
  }

  return (
    <ContentArea>
      {/* Heading */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Breadcrumb>
          <span>Ventas</span>
          <span>›</span>
          <BreadcrumbActive>Cotizaciones</BreadcrumbActive>
        </Breadcrumb>
        <PageHeading>
          <div>
            <PageTitle>Cotizaciones y Proformas</PageTitle>
            <PageSubtitle>
              Gestiona tus propuestas comerciales. Convierte proformas aceptadas en facturas electrónicas en un clic.
            </PageSubtitle>
          </div>
          <HeadingActions>
            <Button variant="outline">
              <Icon name="download" size={18} />
              Exportar
            </Button>
            <Button variant="primary" onClick={() => setDrawerOpen(true)}>
              <Icon name="add_circle" size={18} />
              Nueva Cotización
            </Button>
          </HeadingActions>
        </PageHeading>
      </motion.div>

      {/* KPI cards */}
      <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
        <KpiCard variants={fadeUp}>
          <KpiLabel>Valor Total Mes</KpiLabel>
          <KpiValue>S/ 42,850</KpiValue>
          <KpiSub $success>
            <Icon name="trending_up" size={15} />
            +12.5% vs mes anterior
          </KpiSub>
          <KpiBgIcon><Icon name="payments" size={80} /></KpiBgIcon>
        </KpiCard>

        <KpiCard variants={fadeUp}>
          <KpiLabel>Aceptadas</KpiLabel>
          <KpiValue $color="var(--color-success)">24</KpiValue>
          <KpiSub>82% de conversión</KpiSub>
          <KpiBgIcon><Icon name="task_alt" size={80} /></KpiBgIcon>
        </KpiCard>

        <KpiCard variants={fadeUp}>
          <KpiLabel>Por Vencer</KpiLabel>
          <KpiValue $color="var(--color-warning)">08</KpiValue>
          <KpiSub $warning>
            <Icon name="timer" size={15} />
            Próximos 7 días
          </KpiSub>
          <KpiBgIcon><Icon name="timer" size={80} /></KpiBgIcon>
        </KpiCard>

        <KpiCard variants={fadeUp}>
          <KpiLabel>SUNAT Uptime</KpiLabel>
          <KpiValue>99.9%</KpiValue>
          <KpiSub>Conexión en tiempo real</KpiSub>
          <KpiBgIcon><Icon name="cloud_done" filled size={80} /></KpiBgIcon>
        </KpiCard>
      </KpiGrid>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <TablePanel>
          <TableHeader>
            <TableTitle>Historial de Cotizaciones</TableTitle>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <Tooltip content="Descargar Excel" side="top">
                <TableIconBtn><Icon name="download" size={20} /></TableIconBtn>
              </Tooltip>
              <Tooltip content="Imprimir" side="top">
                <TableIconBtn><Icon name="print" size={20} /></TableIconBtn>
              </Tooltip>
            </div>
          </TableHeader>

          <FilterBar>
            <SearchWrap>
              <SearchIconEl><Icon name="search" size={16} /></SearchIconEl>
              <SearchInput
                type="text"
                placeholder="Buscar por cliente o número..."
                value={search}
                onChange={(e) => applySearch(e.target.value)}
              />
            </SearchWrap>
            <ChipGroup>
              {STATUS_CHIPS.map((c) => (
                <Chip
                  key={c.value}
                  $active={statusFilter === c.value}
                  onClick={() => applyStatus(c.value)}
                >
                  {c.label}
                </Chip>
              ))}
            </ChipGroup>
          </FilterBar>

          <Table
            data={pageData}
            columns={columns}
            keyField="id"
            variant="default"
            density="default"
            onRowClick={(r) => setDetailQuote(r)}
          />

          <PaginationBar>
            <Pagination.Info
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              size="sm"
            />
            <Pagination.Pages
              page={page}
              totalPages={Math.max(1, totalPages)}
              onPageChange={setPage}
              size="sm"
              siblingCount={1}
            />
          </PaginationBar>
        </TablePanel>
      </motion.div>

      {/* Nueva Cotización drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Nueva Cotización"
        description="Genera una propuesta comercial profesional"
        size="lg"
        side="right"
      >
        <DrawerBody>
          <Step>
            <StepHeader>
              <StepTitle>
                <StepBadge>1</StepBadge>
                <StepLabel>Información del Cliente</StepLabel>
              </StepTitle>
            </StepHeader>

            <FieldGroup>
              <FieldLabel>RUC o DNI</FieldLabel>
              <RucRow>
                <FieldInput type="text" placeholder="Ej. 20601234567" style={{ flex: 1 }} />
                <SearchBtn type="button">Buscar</SearchBtn>
              </RucRow>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Razón Social</FieldLabel>
              <FieldInput
                type="text"
                placeholder="Se autocompletará al buscar RUC"
                readOnly
              />
            </FieldGroup>
          </Step>

          <Step>
            <StepHeader>
              <StepTitle>
                <StepBadge>2</StepBadge>
                <StepLabel>Productos / Servicios</StepLabel>
              </StepTitle>
              <AddLineBtn type="button">
                <Icon name="add" size={16} />
                Agregar Línea
              </AddLineBtn>
            </StepHeader>

            <EmptyProducts>
              <Icon name="inventory" size={40} />
              <EmptyLabel>No hay productos agregados todavía.</EmptyLabel>
              <CatalogBtn type="button">Explorar Catálogo</CatalogBtn>
            </EmptyProducts>
          </Step>

          <Step>
            <StepTitle>
              <StepBadge>3</StepBadge>
              <StepLabel>Condiciones y Validez</StepLabel>
            </StepTitle>

            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>Validez (Días)</FieldLabel>
                <FieldSelect defaultValue="15">
                  <option value="7">7 días</option>
                  <option value="15">15 días</option>
                  <option value="30">30 días</option>
                </FieldSelect>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Moneda</FieldLabel>
                <FieldSelect defaultValue="PEN">
                  <option value="PEN">Soles (PEN)</option>
                  <option value="USD">Dólares (USD)</option>
                </FieldSelect>
              </FieldGroup>
            </FieldGrid2>

            <FieldGroup>
              <FieldLabel>Observaciones</FieldLabel>
              <FieldInput as="textarea" placeholder="Condiciones comerciales, notas..." style={{ minHeight: "7rem", resize: "vertical" }} />
            </FieldGroup>
          </Step>
        </DrawerBody>

        <Drawer.Footer>
          <DrawerFooterRow>
            <DraftBtn type="button" onClick={handleDraft}>Guardar Borrador</DraftBtn>
            <SendBtn type="button" onClick={handleSend}>
              <Icon name="send" size={18} />
              Generar y Enviar
            </SendBtn>
          </DrawerFooterRow>
        </Drawer.Footer>
      </Drawer>

      {/* Detail drawer */}
      <Drawer
        open={!!detailQuote}
        onClose={() => setDetailQuote(null)}
        title={detailQuote?.id ?? ""}
        description="Detalle de cotización"
        size="md"
        side="right"
      >
        {detailQuote && (
          <>
            <DetailBody>
              <DetailSection>
                <SectionTitle>Información General</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Número</ItemLabel>
                    <DetailMonospace>{detailQuote.id}</DetailMonospace>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Estado</ItemLabel>
                    <Badge
                      variant={STATUS_CONFIG[detailQuote.status].variant}
                      dot
                      pill
                      size="sm"
                    >
                      {STATUS_CONFIG[detailQuote.status].label}
                    </Badge>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Fecha</ItemLabel>
                    <ItemValue>{detailQuote.date}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Monto Total</ItemLabel>
                    <DetailMonospace>{detailQuote.amount}</DetailMonospace>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Cliente</SectionTitle>
                <DetailGrid>
                  <DetailItem style={{ gridColumn: "span 2" }}>
                    <ItemLabel>Razón Social</ItemLabel>
                    <ItemValue>{detailQuote.clientName}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>RUC / DNI</ItemLabel>
                    <DetailMonospace>{detailQuote.clientRuc}</DetailMonospace>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Productos / Servicios</SectionTitle>
                <EmptyProducts>
                  <Icon name="inventory" size={36} />
                  <EmptyLabel>No hay líneas de detalle disponibles en modo demo.</EmptyLabel>
                </EmptyProducts>
              </DetailSection>
            </DetailBody>

            <Drawer.Footer>
              <DrawerFooterRow>
                <DraftBtn type="button" onClick={() => setDetailQuote(null)}>Cerrar</DraftBtn>
                {detailQuote.status === "accepted" && (
                  <SendBtn
                    type="button"
                    onClick={() => {
                      setDetailQuote(null);
                      setFacturarTarget(detailQuote);
                    }}
                  >
                    <Icon name="point_of_sale" size={18} />
                    Facturar
                  </SendBtn>
                )}
              </DrawerFooterRow>
            </Drawer.Footer>
          </>
        )}
      </Drawer>

      {/* FACTURAR confirmation modal */}
      <Modal
        open={!!facturarTarget}
        onClose={() => setFacturarTarget(null)}
        title="Convertir a Factura Electrónica"
        description="Esta acción generará un comprobante electrónico y lo enviará a SUNAT"
        size="sm"
      >
        <ConfirmBody>
          <ConfirmDesc>
            Se emitirá una factura electrónica a nombre del cliente por el monto indicado.
            Una vez confirmada, la cotización pasará al estado <strong>Facturado</strong> y no podrá modificarse.
          </ConfirmDesc>
          {facturarTarget && (
            <ConfirmRecord>
              <RecordId>{facturarTarget.id}</RecordId>
              <RecordSub>{facturarTarget.clientName}</RecordSub>
              <RecordSub style={{ marginTop: "0.4rem", fontWeight: 700 }}>{facturarTarget.amount}</RecordSub>
            </ConfirmRecord>
          )}
        </ConfirmBody>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setFacturarTarget(null)}>Cancelar</Button>
          <Button variant="primary" onClick={confirmFacturar}>
            <Icon name="point_of_sale" size={16} />
            Confirmar y Emitir
          </Button>
        </Modal.Footer>
      </Modal>
    </ContentArea>
  );
}
