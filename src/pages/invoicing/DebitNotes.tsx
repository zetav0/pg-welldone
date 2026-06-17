import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { of } from "rxjs";
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
import { LineItemsEditor } from "../../components/invoicing/LineItemsEditor";
import type { LineItem } from "../../components/invoicing/LineItemsEditor";

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

const MonoCell = styled.span`
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
  &:hover { background: ${(p) => p.theme.colors.primaryBg}; color: ${(p) => p.theme.colors.primary}; }
`;

/* ── Drawer form ─────────────────────────────────────── */

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

const RefBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.4rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
`;

const RefMono = styled.span`
  font-family: "Courier New", monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  flex: 1;
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

const ReasonPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 10rem;
  background: rgba(220, 150, 38, 0.1);
  color: ${(p) => p.theme.colors.warning};
  font-size: 1.2rem;
  font-weight: 700;
`;

/* ── Form schema ─────────────────────────────────────── */

const debitNoteSchema = z.object({
  motivo: z.string().min(1, "Selecciona un motivo"),
});
type DebitNoteFields = z.infer<typeof debitNoteSchema>;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

/* ── Data ────────────────────────────────────────────── */

type NoteStatus = "accepted" | "pending";
type DebitReason = "intereses" | "cargo_adicional" | "diferencia_precio" | "otros";

interface DebitNote {
  id: string;
  serie: string;
  refVoucher: string;
  clientName: string;
  clientDoc: string;
  date: string;
  amount: string;
  reason: DebitReason;
  status: NoteStatus;
}

const STATUS_CFG: Record<NoteStatus, { variant: BadgeVariant; label: string }> = {
  accepted: { variant: "success", label: "ACEPTADO" },
  pending:  { variant: "warning", label: "PENDIENTE" },
};

const REASON_LABEL: Record<DebitReason, string> = {
  intereses:        "Intereses por mora",
  cargo_adicional:  "Cargo adicional",
  diferencia_precio:"Diferencia de precio",
  otros:            "Otros cargos",
};

const STATUS_CHIPS: { value: NoteStatus | "all"; label: string }[] = [
  { value: "all",      label: "Todos"     },
  { value: "accepted", label: "Aceptados" },
  { value: "pending",  label: "Pendientes"},
];

const DEBIT_NOTES: DebitNote[] = [
  { id: "1", serie: "FD01-00000009", refVoucher: "F001-00000882", clientName: "Tech Solutions Peru S.A.C.",      clientDoc: "RUC 20512345678", date: "16 Oct, 2024", amount: "S/ 1,180.00", reason: "intereses",        status: "accepted" },
  { id: "2", serie: "FD01-00000008", refVoucher: "F001-00000879", clientName: "Farmacia San Martín E.I.R.L.",    clientDoc: "RUC 20388812401", date: "12 Oct, 2024", amount: "S/   350.00", reason: "cargo_adicional",  status: "accepted" },
  { id: "3", serie: "FD01-00000007", refVoucher: "F001-00000876", clientName: "Clínica San Lucas S.A.",          clientDoc: "RUC 20456789012", date: "08 Oct, 2024", amount: "S/   820.00", reason: "diferencia_precio",status: "pending"  },
  { id: "4", serie: "BD01-00000002", refVoucher: "B001-00001228", clientName: "José Rodríguez Pinto",            clientDoc: "DNI 30456123",    date: "03 Oct, 2024", amount: "S/    25.00", reason: "otros",            status: "accepted" },
];

const PAGE_SIZE = 8;

/* ── Columns ─────────────────────────────────────────── */

function buildColumns(): ColumnDef<DebitNote>[] {
  return [
    {
      key: "serie",
      header: "Serie / Número",
      minWidth: "15rem",
      render: (r) => (
        <>
          <SerieNum>{r.serie}</SerieNum>
          <CellSub>Nota de Débito Electrónica</CellSub>
        </>
      ),
    },
    {
      key: "refVoucher",
      header: "Comp. Referencia",
      minWidth: "15rem",
      render: (r) => (
        <>
          <MonoCell>{r.refVoucher}</MonoCell>
          <CellSub>Referencia</CellSub>
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
    { key: "date", header: "Fecha", width: "12rem" },
    {
      key: "amount",
      header: "Monto Debitado",
      width: "13rem",
      align: "right",
      render: (r) => <MonoCell style={{ color: "var(--color-warning)", fontWeight: 700 }}>+{r.amount}</MonoCell>,
    },
    {
      key: "reason",
      header: "Motivo",
      width: "16rem",
      render: (r) => <span style={{ fontSize: "1.3rem" }}>{REASON_LABEL[r.reason]}</span>,
    },
    {
      key: "status",
      header: "SUNAT",
      width: "11rem",
      align: "center",
      render: (r) => {
        const cfg = STATUS_CFG[r.status];
        return <Badge variant={cfg.variant} dot pill size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      width: "8rem",
      align: "right",
      render: () => (
        <ActionRow>
          <Tooltip content="Ver PDF" side="top">
            <RowBtn onClick={(e) => e.stopPropagation()}>
              <Icon name="picture_as_pdf" size={18} />
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

export default function DebitNotes() {
  const [page, setPage]                   = useState(1);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<NoteStatus | "all">("all");
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [detailNote, setDetailNote]       = useState<DebitNote | null>(null);
  const [noteItems, setNoteItems]         = useState<LineItem[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetNote,
  } = useForm<DebitNoteFields>({
    resolver: zodResolver(debitNoteSchema),
    defaultValues: { motivo: "intereses" },
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return DEBIT_NOTES.filter((r) => {
      const matchText   = !q || r.clientName.toLowerCase().includes(q) || r.serie.toLowerCase().includes(q) || r.refVoucher.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = buildColumns();

  const onEmit = handleSubmit(() => {
    if (noteItems.length === 0) {
      toast({ variant: "error", title: "Sin ítems", description: "Agrega al menos un cargo o ítem afectado." });
      return;
    }
    of(null).subscribe({
      next: () => {
        setDrawerOpen(false);
        setNoteItems([]);
        resetNote({ motivo: "intereses" });
        toast({ variant: "success", title: "Nota de débito emitida", description: "Enviada a SUNAT exitosamente." });
      },
    });
  });

  return (
    <ContentArea>
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Breadcrumb>
          <span>Facturación</span><span>›</span>
          <BreadcrumbActive>Notas de Débito</BreadcrumbActive>
        </Breadcrumb>
        <PageHeading>
          <div>
            <PageTitle>Notas de Débito</PageTitle>
            <PageSubtitle>Correcciones que aumentan el monto de un comprobante ya emitido (intereses, cargos adicionales, diferencias de precio).</PageSubtitle>
          </div>
          <Button variant="primary" onClick={() => setDrawerOpen(true)}>
            <Icon name="add" size={18} />Nueva Nota de Débito
          </Button>
        </PageHeading>
      </motion.div>

      <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
        <KpiCard variants={fadeUp}>
          <KpiLabel>Emitidas Este Mes</KpiLabel>
          <KpiValue>09</KpiValue>
          <KpiSub>+2 vs mes anterior</KpiSub>
          <KpiBgIcon><Icon name="add_circle" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Monto Cargado</KpiLabel>
          <KpiValue $color="var(--color-warning)">S/ 2,375</KpiValue>
          <KpiSub>Cargos adicionales</KpiSub>
          <KpiBgIcon><Icon name="payments" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Pendientes SUNAT</KpiLabel>
          <KpiValue $color="var(--color-warning)">01</KpiValue>
          <KpiSub>En cola de envío</KpiSub>
          <KpiBgIcon><Icon name="cloud_upload" size={80} /></KpiBgIcon>
        </KpiCard>
        <KpiCard variants={fadeUp}>
          <KpiLabel>Por Intereses</KpiLabel>
          <KpiValue>04</KpiValue>
          <KpiSub>Motivo más frecuente</KpiSub>
          <KpiBgIcon><Icon name="percent" size={80} /></KpiBgIcon>
        </KpiCard>
      </KpiGrid>

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <TablePanel>
          <TableHeader>
            <TableTitle>Registro de Notas de Débito</TableTitle>
            <div style={{ display: "flex", gap: "0.8rem" }}>
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
                placeholder="Buscar por cliente, serie o referencia..."
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
            onRowClick={(r) => setDetailNote(r)}
          />

          <PaginationBar>
            <Pagination.Info page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} size="sm" />
            <Pagination.Pages page={page} totalPages={Math.max(1, totalPages)} onPageChange={setPage} size="sm" />
          </PaginationBar>
        </TablePanel>
      </motion.div>

      {/* Nueva Nota de Débito drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Nueva Nota de Débito"
        description="Agrega cargos adicionales a un comprobante ya emitido"
        size="lg"
        side="right"
      >
        <DrawerBody>
          <FormSection>
            <SectionTitle>Comprobante de Referencia</SectionTitle>
            <FieldGroup>
              <FieldLabel>Número de Comprobante</FieldLabel>
              <RefBox>
                <Icon name="receipt_long" size={18} />
                <RefMono>F001-00000882</RefMono>
                <span style={{ fontSize: "1.2rem", color: "var(--color-text-muted)" }}>Tech Solutions Peru S.A.C.</span>
              </RefBox>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Motivo de la Nota de Débito</FieldLabel>
              <FieldSelect {...register("motivo")}>
                <option value="intereses">01 — Intereses por mora</option>
                <option value="cargo_adicional">02 — Aumento en el valor</option>
                <option value="diferencia_precio">03 — Penalidades / otras penalidades</option>
                <option value="otros">11 — Ajustes de operaciones de exportación</option>
              </FieldSelect>
              {errors.motivo && <ErrorMsg><Icon name="error" size={14} />{errors.motivo.message}</ErrorMsg>}
            </FieldGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Ítems / Cargos Adicionales</SectionTitle>
            <LineItemsEditor items={noteItems} onChange={setNoteItems} />
          </FormSection>

          <FormSection>
            <SectionTitle>Datos del Receptor</SectionTitle>
            <FieldGroup>
              <FieldLabel>RUC / DNI</FieldLabel>
              <FieldInput type="text" defaultValue="20512345678" readOnly />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Razón Social</FieldLabel>
              <FieldInput type="text" defaultValue="Tech Solutions Peru S.A.C." readOnly />
            </FieldGroup>
          </FormSection>
        </DrawerBody>

        <Drawer.Footer>
          <DrawerFooterRow>
            <OutlineBtn type="button" onClick={() => setDrawerOpen(false)}>Cancelar</OutlineBtn>
            <PrimaryBtn type="button" onClick={onEmit}>
              <Icon name="add_circle" size={18} />
              Emitir Nota de Débito
            </PrimaryBtn>
          </DrawerFooterRow>
        </Drawer.Footer>
      </Drawer>

      {/* Detail drawer */}
      <Drawer
        open={!!detailNote}
        onClose={() => setDetailNote(null)}
        title={detailNote?.serie ?? ""}
        description="Nota de Débito Electrónica"
        size="md"
        side="right"
      >
        {detailNote && (
          <>
            <DetailBody>
              <DetailSection>
                <SectionTitle>Información General</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Número</ItemLabel>
                    <MonoValue>{detailNote.serie}</MonoValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Estado SUNAT</ItemLabel>
                    <Badge variant={STATUS_CFG[detailNote.status].variant} dot pill size="sm">
                      {STATUS_CFG[detailNote.status].label}
                    </Badge>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Fecha</ItemLabel>
                    <ItemValue>{detailNote.date}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Monto Cargado</ItemLabel>
                    <MonoValue style={{ color: "var(--color-warning)" }}>+{detailNote.amount}</MonoValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Comprobante de Referencia</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <ItemLabel>Número Referencia</ItemLabel>
                    <MonoValue>{detailNote.refVoucher}</MonoValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Motivo</ItemLabel>
                    <ReasonPill>
                      <Icon name="info" size={13} />
                      {REASON_LABEL[detailNote.reason]}
                    </ReasonPill>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Cliente</SectionTitle>
                <DetailGrid>
                  <DetailItem style={{ gridColumn: "span 2" }}>
                    <ItemLabel>Razón Social</ItemLabel>
                    <ItemValue>{detailNote.clientName}</ItemValue>
                  </DetailItem>
                  <DetailItem>
                    <ItemLabel>Documento</ItemLabel>
                    <MonoValue>{detailNote.clientDoc}</MonoValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>
            </DetailBody>

            <Drawer.Footer>
              <DrawerFooterRow>
                <OutlineBtn type="button" onClick={() => setDetailNote(null)}>Cerrar</OutlineBtn>
                <PrimaryBtn
                  type="button"
                  style={{ flex: "unset", paddingLeft: "2rem", paddingRight: "2rem" }}
                  onClick={() => toast({ variant: "info", title: "Descargando PDF…", description: detailNote.serie })}
                >
                  <Icon name="picture_as_pdf" size={18} />
                  PDF
                </PrimaryBtn>
              </DrawerFooterRow>
            </Drawer.Footer>
          </>
        )}
      </Drawer>
    </ContentArea>
  );
}
