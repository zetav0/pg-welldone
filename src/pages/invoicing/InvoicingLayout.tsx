import styled from "styled-components";
import { NavLink, Outlet } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";

/* ── Sub-navigation bar ──────────────────────────────── */

const SubNavWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  padding: 0 3.2rem;
  flex-shrink: 0;
`;

const TabLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.4rem 1.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
  text-decoration: none;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }

  &.active {
    color: ${(p) => p.theme.colors.primary};
    border-bottom-color: ${(p) => p.theme.colors.primary};
    font-weight: 700;
  }
`;

const OutletWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
`;

/* ── Sub-module tabs ─────────────────────────────────── */

const TABS = [
  { to: "/invoicing/quotes",       label: "Cotizaciones",    icon: "request_quote"  },
  { to: "/invoicing/vouchers",     label: "Comprobantes",    icon: "receipt_long"   },
  { to: "/invoicing/guides",       label: "Guías",           icon: "local_shipping" },
  { to: "/invoicing/credit-notes", label: "Notas Crédito",   icon: "credit_score"   },
  { to: "/invoicing/debit-notes",  label: "Notas Débito",    icon: "request_page"   },
] as const;

/* ── Layout ──────────────────────────────────────────── */

export default function InvoicingLayout() {
  return (
    <>
      <SubNavWrap>
        {TABS.map((t) => (
          <TabLink key={t.to} to={t.to} end>
            <Icon name={t.icon} size={18} />
            {t.label}
          </TabLink>
        ))}
      </SubNavWrap>
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
}
