import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import { Badge, type BadgeVariant } from "../ui/Badge";
import { fadeUp } from "../../lib/variants";

/* ── Styled components ──────────────────────────────── */

const CardRoot = styled(motion.div)<{ $dangerHover?: boolean }>`
  background: ${(p) => p.theme.colors.surface};
  padding: 2.4rem;
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: ${(p) => (p.$dangerHover ? p.theme.colors.danger : "rgba(0,108,117,0.4)")};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.6rem;
`;

const IconWrapper = styled.div<{ $variant: "primary" | "success" | "danger" }>`
  padding: 0.8rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;

  ${(p) =>
    p.$variant === "primary" &&
    css`
      background: ${p.theme.colors.primaryBg};
      color: ${p.theme.colors.primary};
    `}
  ${(p) =>
    p.$variant === "success" &&
    css`
      background: ${p.theme.colors.successBg};
      color: ${p.theme.colors.success};
    `}
  ${(p) =>
    p.$variant === "danger" &&
    css`
      background: ${p.theme.colors.dangerBg};
      color: ${p.theme.colors.danger};
    `}
`;

const MetricLabel = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MetricValue = styled.p`
  margin: 0.4rem 0 0;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const ExtraSlot = styled.div`
  margin-top: 1.6rem;
`;

/* ── Component ──────────────────────────────────────── */

export interface KpiCardProps {
  icon: string;
  iconVariant?: "primary" | "success" | "danger";
  badge: { label: string; variant: BadgeVariant };
  label: string;
  value: string | number;
  dangerHover?: boolean;
  extra?: React.ReactNode;
}

export function KpiCard({
  icon,
  iconVariant = "primary",
  badge,
  label,
  value,
  dangerHover,
  extra,
}: KpiCardProps) {
  return (
    <CardRoot $dangerHover={dangerHover} variants={fadeUp}>
      <CardHeader>
        <IconWrapper $variant={iconVariant}>
          <Icon name={icon} size={22} />
        </IconWrapper>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </CardHeader>

      <MetricLabel>{label}</MetricLabel>
      <MetricValue>{value}</MetricValue>

      {extra && <ExtraSlot>{extra}</ExtraSlot>}
    </CardRoot>
  );
}
