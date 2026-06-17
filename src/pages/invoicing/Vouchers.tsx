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
  max-width: 30rem;
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

const FilterGroups = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
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

const CellSub = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const CellBold = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
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

const DangerRowBtn = styled(RowBtn)`
  &:hover {
    background: rgba(220, 38, 38, 0.08);
    color: ${(p) => p.theme.colors.danger};
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
  &:read-only { background: ${(p) => p.theme.colors.chipBg}; cursor: not-allowed; color: ${(p) => p.theme.colors.textMuted}; }
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

const RucRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const SearchDocBtn = styled.button`
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
  flex-shrink: 0;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`;

const TypeToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  overflow: hidden;
`;

const TypeBtn = styled.button<{ $active?: boolean }>`
  padding: 0.9rem 1.4rem;
  background: ${(p) => p.$active ? p.theme.colors.primary : "transparent"};
  color: ${(p) => p.$active ? p.theme.colors.white : p.theme.colors.textMuted};
  border: none;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover:not([data-active="true"]) {
    background: ${(p) => p.theme.colors.chipBg};
    color: ${(p) => p.theme.colors.text};
  }
`;

const EmptyItems = styled.div`
  border: 1.5px dashed ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  padding: 2.4rem 2rem;
  text-align: center;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 1.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`;

const AddItemBtn = styled.button`
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
  align-self: flex-start;

  &:hover { text-decoration: underline; }
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

const TotalCard = styled.div`
  background: ${(p) => p.theme.colors.primaryBg};
  border: 1px solid ${(p) => p.theme.colors.primaryBgStrong};
  border-radius: 1rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const TotalFinal = styled(TotalRow)`
  font-size: 1.6rem;
  font-weight: 900;
  color: ${(p) => p.theme.colors.primary};
  margin-top: 0.4rem;
  padding-top: 0.8rem;
  border-top: 1px solid ${(p) => p.theme.colors.primaryBgStrong};
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

const ReasonLabel = styled.label`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
  display: block;
  margin-bottom: 0.6rem;
`;

const ReasonInput = styled.textarea`
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

  &:focus { border-color: ${(p) => p.theme.colors.danger}; }
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

const TYPE_CHIPS: { value: VoucherType | "all"; label: string }[] = [
  { value: "all",     label: "Todos"    },
  { value: "factura", label: "Facturas" },
  { value: "boleta",  label: "Boletas"  },
];

const STATUS_CHIPS: { value: VoucherStatus | "all"; label: string }[] = [
  { value: "all",      label: "Todos"     },
  { value: "accepted", label: "Aceptados" },
  { value: "pending",  label: "Pendientes"},
  { value: "voided",   label: "Anulados"  },
];

const VOUCHERS: Voucher[] = [
  { id: "1", serie: "F001-00000892", type: "factura", clientName: "Constructora Alianza S.A.C.", clientDoc: "RUC 20556784912", issueDate: "14 Oct, 2024", amount: "S/ 10,550.85", igv: "S/ 1,899.15", total: "S/ 12,450.00", status: "accepted" },
  { id: "2", serie: "B001-00001230", type: "boleta",  clientName: "María García López",           clientDoc: "DNI 45123789",    issueDate: "13 Oct, 2024", amount: "S/   271.19", igv: "S/    48.81", total: "S/    320.00", status: "accepted" },
  { id: "3", serie: "F001-00000891", type: "factura", clientName: "Tech Solutions Peru S.A.C.",   clientDoc: "RUC 20512345678", issueDate: "12 Oct, 2024", amount: "S/ 20,338.98", igv: "S/ 3,661.02", total: "S/ 24,000.00", status: "pending"  },
  { id: "4", serie: "F001-00000889", type: "factura", clientName: "Distribuidora Norte E.I.R.L.", clientDoc: "RUC 20448123992", issueDate: "08 Oct, 2024", amount: "S/  2,711.86", igv: "S/   488.14", total: "S/  3,200.00", status: "voided"   },
  { id: "5", serie: "B001-00001228", type: "boleta",  clientName: "José Rodríguez Pinto",         clientDoc: "DNI 30456123",    issueDate: "05 Oct, 2024", amount: "S/    84.75", igv: "S/    15.25", total: "S/    100.00", status: "accepted" },
];

const PAGE_SIZE = 8;

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(onAnular: (v: Voucher) => void): ColumnDef<Voucher>[] {
  return [
    {
      key: "serie",
      header: "Serie / Número",
      minWidth: "16rem",
      render: (r) => (
        <>
          <SerieNum>{r.serie}</SerieNum>
          <CellSub style={{ marginTop: "0.2rem" }}>{TYPE_LABEL[r.type]}</CellSub>
        </>
      ),
    },
    {
      key: "clientName",
      header: "Cliente",
      minWidth: "18rem",
      render: (r) => (
        <>
          <CellBold>{r.clientName}</CellBold>
          <CellSub>{r.clientDoc}</CellSub>
        </>
      ),
    },
    { key: "issueDate", header: "Emisión", width: "12rem" },
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
      width: "12rem",
      align: "right",
      render: (r) => (
        <ActionRow>
          <Tooltip content="Ver PDF" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="picture_as_pdf" size={18} />
            </RowBtn>
          </Tooltip>
          <Tooltip content="Enviar por correo" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="send" size={18} />
            </RowBtn>
          </Tooltip>
          {r.status !== "voided" && (
            <Tooltip content="Anular comprobante" side="top">
              <DangerRowBtn onClick={(e) => { e.stopPropagation(); onAnular(r); }}>
                <Icon name="cancel" size={18} />
              </DangerRowBtn>
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

export default function Vouchers() {
  const [page, setPage]                   = useState(1);
  const [search, setSearch]               = useState("");
  const [typeFilter, setTypeFilter]       = useState<VoucherType | "all">("all");
  const [statusFilter, setStatusFilter]   = useState<VoucherStatus | "all">("all");
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [detailVoucher, setDetailVoucher] = useState<Voucher | null>(null);
  const [anularTarget, setAnularTarget]   = useState<Voucher | null>(null);
  const [voucherType, setVoucherType]     = useState<VoucherType>("factura");
  const [anularReason, setAnularReason]   = useState("");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return VOUCHERS.filter((r) => {
      const matchText   = !q || r.clientName.toLowerCase().includes(q) || r.serie.toLowerCase().includes(q) || r.clientDoc.toLowerCase().includes(q);
      const matchType   = typeFilter === "all"   || r.type   === typeFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchText && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applySearch(v: string) { setSearch(v); setPage(1); }
  function applyType(v: VoucherType | "all") { setTypeFilter(v); setPage(1); }
  function applyStatus(v: VoucherStatus | "all") { setStatusFilter(v); setPage(1); }

  function handleAnular(v: Voucher) {
    setAnularTarget(v);
    setAnularReason("");
  }

  function confirmAnular() {
    if (!anularTarget) return;
    setAnularTarget(null);
    toast({
      variant: "warning",
      title: "Comprobante anulado",
      description: `${anularTarget.serie} — la baja ha sido comunicada a SUNAT.`,
    });
  }

  function handleEmit() {
    setDrawerOpen(false);
    toast({ variant: "success", title: "Comprobante emitido", description: "Enviado a SUNAT exitosamente." });
  }

  const columns = buildColumns(handleAnular);

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
            <Button variant="primary" onClick={() => setDrawerOpen(true)}>
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
                placeholder="Buscar por cliente, serie..."
                value={search}
                onChange={(e) => applySearch(e.target.value)}
              />
            </SearchWrap>
            <FilterGroups>
              <ChipGroup>
                {TYPE_CHIPS.map((c) => (
                  <Chip key={c.value} $active={typeFilter === c.value} onClick={() => applyType(c.value)}>
                    {c.label}
                  </Chip>
                ))}
              </ChipGroup>
              <ChipGroup>
                {STATUS_CHIPS.map((c) => (
                  <Chip key={c.value} $active={statusFilter === c.value} onClick={() => applyStatus(c.value)}>
                    {c.label}
                  </Chip>
                ))}
              </ChipGroup>
            </FilterGroups>
          </FilterBar>

          <Table
            data={pageData}
            columns={columns}
            keyField="id"
            density="default"
            onRowClick={(r) => setDetailVoucher(r)}
          />

          <PaginationBar>
            <Pagination.Info page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} size="sm" />
            <Pagination.Pages page={page} totalPages={Math.max(1, totalPages)} onPageChange={setPage} size="sm" />
          </PaginationBar>
        </TablePanel>
      </motion.div>

      {/* Nuevo Comprobante drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Nuevo Comprobante"
        description="Emite una factura o boleta electrónica"
        size="lg"
        side="right"
      >
        <DrawerBody>
          <FormSection>
            <SectionTitle>Tipo de Comprobante</SectionTitle>
            <TypeToggle>
              <TypeBtn $active={voucherType === "factura"} onClick={() => setVoucherType("factura")}>
                Factura Electrónica
              </TypeBtn>
              <TypeBtn $active={voucherType === "boleta"} onClick={() => setVoucherType("boleta")}>
                Boleta de Venta
              </TypeBtn>
            </TypeToggle>
          </FormSection>

          <FormSection>
            <SectionTitle>Datos del {voucherType === "factura" ? "Cliente (RUC)" : "Comprador"}</SectionTitle>
            <FieldGroup>
              <FieldLabel>{voucherType === "factura" ? "RUC" : "DNI (opcional)"}</FieldLabel>
              <RucRow>
                <FieldInput type="text" placeholder={voucherType === "factura" ? "20xxxxxxxxx" : "DNI o dejar vacío"} style={{ flex: 1 }} />
                <SearchDocBtn type="button">Buscar</SearchDocBtn>
              </RucRow>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Razón Social / Nombre</FieldLabel>
              <FieldInput type="text" placeholder="Se autocompletará" readOnly />
            </FieldGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Productos / Servicios</SectionTitle>
            <EmptyItems>
              <Icon name="add_shopping_cart" size={36} />
              <span>No hay ítems agregados</span>
            </EmptyItems>
            <AddItemBtn type="button">
              <Icon name="add" size={16} />
              Agregar Ítem
            </AddItemBtn>
          </FormSection>

          <FormSection>
            <SectionTitle>Condiciones</SectionTitle>
            <FieldGrid2>
              <FieldGroup>
                <FieldLabel>Moneda</FieldLabel>
                <FieldSelect defaultValue="PEN">
                  <option value="PEN">Soles (PEN)</option>
                  <option value="USD">Dólares (USD)</option>
                </FieldSelect>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Condición de Pago</FieldLabel>
                <FieldSelect defaultValue="contado">
                  <option value="contado">Al contado</option>
                  <option value="credito15">Crédito 15 días</option>
                  <option value="credito30">Crédito 30 días</option>
                </FieldSelect>
              </FieldGroup>
            </FieldGrid2>
          </FormSection>
        </DrawerBody>

        <Drawer.Footer>
          <DrawerFooterRow>
            <OutlineBtn type="button" onClick={() => setDrawerOpen(false)}>Cancelar</OutlineBtn>
            <PrimaryBtn type="button" onClick={handleEmit}>
              <Icon name="receipt_long" size={18} />
              Emitir Comprobante
            </PrimaryBtn>
          </DrawerFooterRow>
        </Drawer.Footer>
      </Drawer>

      {/* Detail drawer */}
      <Drawer
        open={!!detailVoucher}
        onClose={() => setDetailVoucher(null)}
        title={detailVoucher?.serie ?? ""}
        description={detailVoucher ? TYPE_LABEL[detailVoucher.type] : ""}
        size="md"
        side="right"
      >
        {detailVoucher && (
          <>
            <DetailBody>
              <DetailSection>
                <SectionTitle>Información del Comprobante</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Serie / Número</ItemLabel>
                    <MonoValue>{detailVoucher.serie}</MonoValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Estado SUNAT</ItemLabel>
                    <Badge variant={STATUS_CFG[detailVoucher.status].variant} dot pill size="sm">
                      {STATUS_CFG[detailVoucher.status].label}
                    </Badge>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Tipo</ItemLabel>
                    <ItemValue>{TYPE_LABEL[detailVoucher.type]}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Fecha de Emisión</ItemLabel>
                    <ItemValue>{detailVoucher.issueDate}</ItemValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Cliente</SectionTitle>
                <DetailGrid>
                  <DetailItem style={{ gridColumn: "span 2" }}>
                    <ItemLabel>Razón Social</ItemLabel>
                    <ItemValue>{detailVoucher.clientName}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Documento</ItemLabel>
                    <MonoValue>{detailVoucher.clientDoc}</MonoValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Montos</SectionTitle>
                <TotalCard>
                  <TotalRow>
                    <span>Subtotal (sin IGV)</span>
                    <MonoValue style={{ fontSize: "1.3rem" }}>{detailVoucher.amount}</MonoValue>
                  </TotalRow>
                  <TotalRow>
                    <span>IGV (18%)</span>
                    <MonoValue style={{ fontSize: "1.3rem" }}>{detailVoucher.igv}</MonoValue>
                  </TotalRow>
                  <TotalFinal>
                    <span>Total</span>
                    <MonoValue style={{ fontSize: "1.6rem", color: "inherit" }}>{detailVoucher.total}</MonoValue>
                  </TotalFinal>
                </TotalCard>
              </DetailSection>
            </DetailBody>

            <Drawer.Footer>
              <DrawerFooterRow>
                <OutlineBtn type="button" onClick={() => setDetailVoucher(null)}>Cerrar</OutlineBtn>
                <PrimaryBtn
                  type="button"
                  style={{ flex: "unset", paddingLeft: "2rem", paddingRight: "2rem" }}
                  onClick={() => {
                    setDetailVoucher(null);
                    toast({ variant: "info", title: "Descargando PDF…", description: detailVoucher.serie });
                  }}
                >
                  <Icon name="picture_as_pdf" size={18} />
                  Ver PDF
                </PrimaryBtn>
              </DrawerFooterRow>
            </Drawer.Footer>
          </>
        )}
      </Drawer>

      {/* Anular confirmation modal */}
      <Modal
        open={!!anularTarget}
        onClose={() => setAnularTarget(null)}
        title="Anular Comprobante"
        description="Esta acción comunicará la baja a SUNAT y no se puede revertir"
        size="sm"
      >
        <ConfirmBody>
          <ConfirmDesc>
            El comprobante quedará con estado <strong>ANULADO</strong> y se enviará la comunicación
            de baja a SUNAT. Ingresa el motivo de anulación requerido por el SRI.
          </ConfirmDesc>
          {anularTarget && (
            <ConfirmRecord>
              <RecordId>{anularTarget.serie}</RecordId>
              <RecordSub>{anularTarget.clientName}</RecordSub>
              <RecordSub style={{ fontWeight: 700 }}>{anularTarget.total}</RecordSub>
            </ConfirmRecord>
          )}
          <div>
            <ReasonLabel htmlFor="anular-reason">Motivo de Anulación *</ReasonLabel>
            <ReasonInput
              id="anular-reason"
              placeholder="Ej. Error en datos del cliente, duplicado, etc."
              value={anularReason}
              onChange={(e) => setAnularReason(e.target.value)}
            />
          </div>
        </ConfirmBody>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setAnularTarget(null)}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={confirmAnular}
            style={{ background: "var(--color-danger)", borderColor: "var(--color-danger)" }}
          >
            <Icon name="cancel" size={16} />
            Confirmar Anulación
          </Button>
        </Modal.Footer>
      </Modal>
    </ContentArea>
  );
}
