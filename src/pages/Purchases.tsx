import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";

import { Table } from "../components/ui/Table";
import type { ColumnDef } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import type { BadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

/* ── Layout ──────────────────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  flex: 1;
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

/* ── KPI grid ────────────────────────────────────────── */

const KpiGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* Glass card base */
const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 18rem;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primaryBgStrong};
    box-shadow: 0 4px 20px -4px rgba(113, 42, 226, 0.08);
  }
`;

/* — Card 1: Monthly expenses — */

const BgIcon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.6rem;
  opacity: 0.06;
  color: ${(p) => p.theme.colors.text};
  pointer-events: none;
`;

const KpiLabel = styled.p`
  margin: 0 0 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const BigValue = styled.h3`
  margin: 0;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -0.15rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1;
`;

const TrendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${(p) => p.theme.colors.danger};
  font-size: 1.3rem;
  font-weight: 600;
  margin-top: 1.2rem;
`;

/* — Card 2: Pending orders — */

const OrderCount = styled.h3`
  margin: 0.4rem 0 0.4rem;
  font-size: 3rem;
  font-weight: 900;
  color: ${(p) => p.theme.colors.text};
`;

const OrderSub = styled.p`
  margin: 0;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 0.6rem;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.chipBg};
  margin-top: 1.6rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.primary};
  box-shadow: 0 0 8px ${(p) => p.theme.colors.primaryBgStrong};
`;

/* — Card 3: Vendors — */

const AvatarStack = styled.div`
  display: flex;
  margin-bottom: 1.6rem;
`;

const AvatarCircle = styled.div<{ $bg: string; $offset: number }>`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 2.5px solid ${(p) => p.theme.colors.surface};
  background: ${(p) => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-left: ${(p) => (p.$offset > 0 ? "-1.2rem" : "0")};
  flex-shrink: 0;
`;

const OverflowBadgeCircle = styled(AvatarCircle)`
  background: ${(p) => p.theme.colors.chipBg};
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 1.1rem;
`;

const VendorLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  font-family: inherit;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.75;
    text-decoration: underline;
  }
`;

/* ── Lower grid ──────────────────────────────────────── */

const LowerGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.4rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

/* — Invoice table panel — */

const TablePanel = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  padding: 2rem 2.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(p) => p.theme.colors.surface};
`;

const TableTitle = styled.h4`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const TableActions = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const IconActionBtn = styled.button`
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

const TableFooter = styled.div`
  padding: 1.2rem 2.4rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.chipBg};
  display: flex;
  justify-content: center;
`;

const LoadMoreBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  cursor: pointer;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const DocCode = styled.p`
  margin: 0;
  font-family: monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const DocType = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const AmountCell = styled.span`
  font-family: monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

/* — Right sidebar — */

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const SidePanel = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
`;

const SidePanelTitle = styled.h4`
  margin: 0 0 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const OrderCard = styled.div<{ $accent: string }>`
  position: relative;
  padding: 1.4rem 1.4rem 1.4rem 2rem;
  border-radius: 1rem;
  background: ${(p) => p.theme.colors.chipBg};
  border: 1px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0.4rem;
    height: 100%;
    background: ${(p) => p.$accent};
    border-radius: 0.4rem 0 0 0.4rem;
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.primaryBgStrong};
  }
`;

const OrderMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.6rem;
`;

const OrderId = styled.span`
  font-family: monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const OrderAge = styled.span<{ $color: string }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.$color};
  letter-spacing: 0.03em;
`;

const OrderTitle = styled.p`
  margin: 0 0 0.3rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const OrderVendor = styled.p`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const OrderBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OrderAmount = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ReviewBtn = styled.button`
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary};
  background: transparent;
  padding: 0.4rem 1rem;
  border-radius: 0.6rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.white};
  }
`;

/* — Analytics card — */

const AnalyticsCard = styled.div`
  border-radius: 1.6rem;
  overflow: hidden;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.text} 0%, #2a1060 100%);
  padding: 2.4rem;
  position: relative;
  min-height: 16rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const AnalyticsGlow = styled.div`
  position: absolute;
  top: -3rem;
  right: -3rem;
  width: 14rem;
  height: 14rem;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  opacity: 0.25;
  filter: blur(40px);
  pointer-events: none;
`;

const AnalyticsBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  height: 5.6rem;
  margin-bottom: 1.6rem;
`;

const ABar = styled.div<{ $h: number; $bright?: boolean }>`
  flex: 1;
  height: ${(p) => p.$h}%;
  border-radius: 0.4rem 0.4rem 0 0;
  background: ${(p) => (p.$bright ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)")};
`;

const AnalyticsTitle = styled.h5`
  margin: 0 0 0.4rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
`;

const AnalyticsSub = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.65);
`;

/* ── Data ────────────────────────────────────────────── */

type InvoiceStatus = "approved" | "pending" | "rejected";

interface Invoice {
  id: string;
  type: string;
  vendor: string;
  date: string;
  status: InvoiceStatus;
  total: string;
}

const STATUS_CONFIG: Record<InvoiceStatus, { variant: BadgeVariant; label: string }> = {
  approved: { variant: "success", label: "APROBADO" },
  pending:  { variant: "warning", label: "PENDIENTE" },
  rejected: { variant: "danger",  label: "RECHAZADO" },
};

const INVOICES: Invoice[] = [
  { id: "F001-0004523", type: "Factura Electrónica",   vendor: "Logística Global S.A.C.",     date: "12 Oct 2023", status: "approved", total: "S/ 4,200.00" },
  { id: "E001-001290",  type: "Recibo por Honorarios", vendor: "Carlos Ruiz Mendez",           date: "10 Oct 2023", status: "pending",  total: "S/ 850.00"   },
  { id: "F005-0023412", type: "Factura Electrónica",   vendor: "Amazon Web Services Peru",     date: "08 Oct 2023", status: "approved", total: "S/ 2,410.50" },
  { id: "F001-0004524", type: "Factura Electrónica",   vendor: "Telecomunicaciones del Sur",   date: "05 Oct 2023", status: "rejected", total: "S/ 1,200.00" },
];

const VENDORS = [
  { initials: "LG", bg: "rgba(113,42,226,0.12)" },
  { initials: "CR", bg: "rgba(22,163,74,0.12)" },
  { initials: "AW", bg: "rgba(180,83,9,0.12)" },
];

const CRITICAL_ORDERS = [
  { id: "OC-23-0092", title: "Insumos de Oficina Trimestrales", vendor: "Tailor & Supply Co.", amount: "S/ 2,450.00", age: "HACE 2 DÍAS", accentVar: "danger" as const },
  { id: "OC-23-0088", title: "Mantenimiento de Servidores",     vendor: "Tech Support Ltd.",   amount: "S/ 5,800.00", age: "HOY",        accentVar: "success" as const },
];

const CHART_BARS = [40, 60, 30, 90, 50, 70, 40];

/* ── Column definitions ──────────────────────────────── */

const columns: ColumnDef<Invoice>[] = [
  {
    key: "id",
    header: "Documento",
    minWidth: "16rem",
    render: (r) => (
      <>
        <DocCode>{r.id}</DocCode>
        <DocType>{r.type}</DocType>
      </>
    ),
  },
  { key: "vendor", header: "Proveedor",  minWidth: "18rem" },
  { key: "date",   header: "Fecha",      width: "12rem" },
  {
    key: "status",
    header: "Estado",
    width: "12rem",
    render: (r) => {
      const cfg = STATUS_CONFIG[r.status];
      return <Badge variant={cfg.variant} dot pill>{cfg.label}</Badge>;
    },
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    width: "11rem",
    render: (r) => <AmountCell>{r.total}</AmountCell>,
  },
];

/* ── Page ────────────────────────────────────────────── */

export default function Purchases() {
  return (
    <>
      <ContentArea>
        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <PageHeading>
            <HeadingText>
              <PageTitle>Compras y Gastos</PageTitle>
              <PageSubtitle>Gestión centralizada de egresos y abastecimiento.</PageSubtitle>
            </HeadingText>
            <HeadingActions>
              <Button variant="outline">
                <Icon name="add_shopping_cart" size={18} />
                Nueva Orden de Compra
              </Button>
              <Button variant="primary">
                <Icon name="receipt_long" size={18} />
                Registrar Gasto
              </Button>
            </HeadingActions>
          </PageHeading>
        </motion.div>

        {/* KPI grid */}
        <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
          {/* Card 1 — Monthly expenses */}
          <GlassCard variants={fadeUp}>
            <BgIcon><Icon name="payments" size={80} /></BgIcon>
            <div>
              <KpiLabel>Gastos del Mes (PEN)</KpiLabel>
              <BigValue>S/ 42,850.20</BigValue>
            </div>
            <TrendRow>
              <Icon name="trending_up" size={18} />
              <span>+12.4% vs mes anterior</span>
            </TrendRow>
          </GlassCard>

          {/* Card 2 — Pending orders */}
          <GlassCard variants={fadeUp}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <KpiLabel style={{ marginBottom: 0 }}>Órdenes Pendientes</KpiLabel>
                <Badge variant="primary" appearance="solid" size="sm">ACTIVO</Badge>
              </div>
              <OrderCount>18 Órdenes</OrderCount>
              <OrderSub>S/ 12,400.00 por liquidar</OrderSub>
            </div>
            <ProgressTrack>
              <ProgressFill $pct={65} />
            </ProgressTrack>
          </GlassCard>

          {/* Card 3 — Active vendors */}
          <GlassCard variants={fadeUp}>
            <div>
              <KpiLabel>Proveedores Activos</KpiLabel>
              <AvatarStack>
                {VENDORS.map((v, i) => (
                  <AvatarCircle key={v.initials} $bg={v.bg} $offset={i}>
                    {v.initials}
                  </AvatarCircle>
                ))}
                <OverflowBadgeCircle $bg="" $offset={VENDORS.length}>+42</OverflowBadgeCircle>
              </AvatarStack>
            </div>
            <VendorLink>
              Ver directorio completo
              <Icon name="arrow_forward" size={16} />
            </VendorLink>
          </GlassCard>
        </KpiGrid>

        {/* Lower section */}
        <LowerGrid variants={staggerContainer} initial="hidden" animate="visible">
          {/* Invoice table */}
          <motion.div variants={fadeUp}>
            <TablePanel>
              <TableHeader>
                <TableTitle>Facturas de Proveedores</TableTitle>
                <TableActions>
                  <IconActionBtn title="Filtrar">
                    <Icon name="filter_list" size={20} />
                  </IconActionBtn>
                  <IconActionBtn title="Exportar">
                    <Icon name="download" size={20} />
                  </IconActionBtn>
                </TableActions>
              </TableHeader>
              <Table
                data={INVOICES}
                columns={columns}
                keyField="id"
                variant="default"
                density="default"
              />
              <TableFooter>
                <LoadMoreBtn>Cargar más facturas</LoadMoreBtn>
              </TableFooter>
            </TablePanel>
          </motion.div>

          {/* Right column */}
          <motion.div variants={fadeUp}>
            <RightCol>
              {/* Critical orders */}
              <SidePanel>
                <SidePanelTitle>Órdenes Críticas</SidePanelTitle>
                <OrdersList>
                  {CRITICAL_ORDERS.map((o) => {
                    const accentColor = o.accentVar === "danger"
                      ? "var(--color-danger)"
                      : "var(--color-success)";
                    const ageColor = o.accentVar === "danger"
                      ? "var(--color-danger)"
                      : "var(--color-success)";
                    return (
                      <OrderCard key={o.id} $accent={accentColor}>
                        <OrderMeta>
                          <OrderId>{o.id}</OrderId>
                          <OrderAge $color={ageColor}>{o.age}</OrderAge>
                        </OrderMeta>
                        <OrderTitle>{o.title}</OrderTitle>
                        <OrderVendor>Proveedor: {o.vendor}</OrderVendor>
                        <OrderBottom>
                          <OrderAmount>{o.amount}</OrderAmount>
                          <ReviewBtn>REVISAR</ReviewBtn>
                        </OrderBottom>
                      </OrderCard>
                    );
                  })}
                </OrdersList>
              </SidePanel>

              {/* Analytics visual */}
              <AnalyticsCard>
                <AnalyticsGlow />
                <AnalyticsBars>
                  {CHART_BARS.map((h, i) => (
                    <ABar key={i} $h={h} $bright={h === 90} />
                  ))}
                </AnalyticsBars>
                <AnalyticsTitle>Analítica de Categorías</AnalyticsTitle>
                <AnalyticsSub>Visualiza dónde se concentra tu gasto este trimestre.</AnalyticsSub>
              </AnalyticsCard>
            </RightCol>
          </motion.div>
        </LowerGrid>
      </ContentArea>
    </>
  );
}
