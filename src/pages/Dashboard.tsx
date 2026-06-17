import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { PageShell } from "../components/layout/PageShell";
import { KpiCard } from "../components/dashboard/KpiCard";
import { CounterCard } from "../components/dashboard/CounterCard";
import { ExpirationsTable } from "../components/dashboard/ExpirationsTable";
import { QuickActionsPanel } from "../components/dashboard/QuickActionsPanel";
import { InventoryOverview } from "../components/dashboard/InventoryOverview";

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1.6rem;
    gap: 2.4rem;
  }
`;

/* ── Page heading ───────────────────────────────────── */

const PageHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.6rem;
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
  gap: 0.8rem;
`;

const ExportButton = styled.button`
  padding: 0.8rem 1.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
  }
`;

const HealthButton = styled.button`
  padding: 0.8rem 1.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover {
    background: rgba(113, 42, 226, 0.9);
  }
`;

/* ── Grids ──────────────────────────────────────────── */

const KpiGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 2.4rem;
`;

const MiddleGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.4rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

/* ── Mini bar chart (Sales KPI extra slot) ──────────── */

const MiniChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
  height: 3.2rem;
  margin-top: 0.8rem;
`;

const MiniBar = styled.div<{ $h: number; $active?: boolean }>`
  flex: 1;
  height: ${(p) => p.$h}%;
  border-radius: 0.2rem 0.2rem 0 0;
  background: ${(p) => (p.$active ? "rgba(113, 42, 226, 0.5)" : p.theme.colors.chipBg)};
`;

/* ── Footer ─────────────────────────────────────────── */

const PageFooter = styled.footer`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 1.6rem 3.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.2rem;

  @media (max-width: 640px) {
    padding: 1.6rem;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
`;

const PulsingDot = styled.span`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.success};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;

const FooterVersion = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Data for KPI cards ─────────────────────────────── */

const salesChart = (
  <MiniChart>
    {[50, 66, 33, 100, 75].map((h, i) => (
      <MiniBar key={i} $h={h} $active={i === 3} />
    ))}
  </MiniChart>
);

const pendingNote = (
  <p
    style={{
      margin: 0,
      fontSize: "1.2rem",
      color: "#45464d",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    }}
  >
    <span className="material-symbols-outlined" style={{ fontSize: "1.4rem" }}>
      schedule
    </span>
    Avg processing time: 12 min
  </p>
);

const stockAlert = (
  <p
    style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#ba1a1a", cursor: "pointer" }}
  >
    Review Critical Items →
  </p>
);

/* ── Page component ─────────────────────────────────── */

export default function Dashboard() {
  return (
    <PageShell>
      <ContentArea>
        <PageHeading>
          <HeadingText>
            <PageTitle>Dashboard Overview</PageTitle>
            <PageSubtitle>Operational performance — Monday, Oct 23rd</PageSubtitle>
          </HeadingText>
          <HeadingActions>
            <ExportButton>EXPORT DATA</ExportButton>
            <HealthButton>SYSTEM HEALTH: 100%</HealthButton>
          </HeadingActions>
        </PageHeading>

        <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
          <KpiCard
            icon="payments"
            iconVariant="success"
            badge={{ label: "+12.4%", variant: "success" }}
            label="Daily Sales"
            value="$4,250.80"
            extra={salesChart}
          />
          <KpiCard
            icon="pending_actions"
            badge={{ label: "Normal", variant: "neutral" }}
            label="Pending Orders"
            value="14"
            extra={pendingNote}
          />
          <KpiCard
            icon="warning"
            iconVariant="danger"
            badge={{ label: "-5%", variant: "danger" }}
            label="Low Stock Alerts"
            value="08"
            dangerHover
            extra={stockAlert}
          />
          <CounterCard />
        </KpiGrid>

        <MiddleGrid variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <ExpirationsTable />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <QuickActionsPanel />
          </motion.div>
        </MiddleGrid>

        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <InventoryOverview />
        </motion.div>
      </ContentArea>

      <PageFooter>
        <FooterLeft>
          <FooterItem>
            <PulsingDot />
            Inventory Sync Active
          </FooterItem>
          <FooterItem>
            <span className="material-symbols-outlined" style={{ fontSize: "1.4rem" }}>
              database
            </span>
            Backup: 5 mins ago
          </FooterItem>
        </FooterLeft>
        <FooterVersion>PharmaCore v2.4.0-Stable • Client ID: DWTN-882</FooterVersion>
      </PageFooter>
    </PageShell>
  );
}
