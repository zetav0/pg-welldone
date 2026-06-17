import React from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { Badge, type BadgeVariant } from "./Badge";
import type { AppTheme } from "@/theme";

// Framer Motion redefines these HTML event signatures — omit to avoid conflicts.
type ConflictingEvents =
  | "onDrag" | "onDragEnd" | "onDragStart" | "onDragEnter" | "onDragExit"
  | "onDragLeave" | "onDragOver" | "onAnimationStart" | "onAnimationEnd"
  | "onAnimationIteration";

/* ── Shared helpers ──────────────────────────────────── */

type AccentVariant = "primary" | "success" | "danger" | "warning";

function accentColor(v: AccentVariant, c: AppTheme["colors"]): string {
  return { primary: c.primary, success: c.success, danger: c.danger, warning: c.warning }[v];
}

function accentBg(v: AccentVariant, c: AppTheme["colors"]): string {
  return { primary: c.primaryBg, success: c.successBg, danger: c.dangerBg, warning: c.warningBg }[v];
}

/* ═══════════════════════════════════════════════════════
   1. Card — compound base
═══════════════════════════════════════════════════════ */

export type CardVariant = "default" | "flat" | "bordered";

const CardRoot = styled(motion.div)<{ $variant: CardVariant; $hover: boolean }>`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 1.6rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);

  ${(p) =>
    p.$variant === "default" &&
    css`border: 1px solid ${p.theme.colors.border};`}

  ${(p) =>
    p.$variant === "bordered" &&
    css`border: 1px solid ${p.theme.colors.borderStrong};`}

  ${(p) =>
    p.$hover &&
    css`
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;
      &:hover {
        border-color: rgba(0, 108, 117, 0.35);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }
    `}
`;

/* Card.Header */
const CardHeaderRoot = styled.div<{ $divider: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 2rem 2.4rem;
  flex-shrink: 0;
  ${(p) => p.$divider && css`border-bottom: 1px solid ${p.theme.colors.border};`}
`;

const CardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
`;

const CardTitleEl = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardSubtitleEl = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  divider?: boolean;
}

function CardHeader({ title, subtitle, action, divider = true }: CardHeaderProps) {
  return (
    <CardHeaderRoot $divider={divider}>
      <CardTitleGroup>
        <CardTitleEl>{title}</CardTitleEl>
        {subtitle && <CardSubtitleEl>{subtitle}</CardSubtitleEl>}
      </CardTitleGroup>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </CardHeaderRoot>
  );
}

/* Card.Body */
const CardBodyRoot = styled.div<{ $padding: string }>`
  padding: ${(p) => p.$padding};
  flex: 1;
`;

interface CardBodyProps {
  padding?: string;
  children?: React.ReactNode;
  className?: string;
}

function CardBody({ padding = "2.4rem", children, className }: CardBodyProps) {
  return <CardBodyRoot $padding={padding} className={className}>{children}</CardBodyRoot>;
}

/* Card.Footer */
const CardFooterRoot = styled.div<{ $justify: string; $divider: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => p.$justify};
  gap: 1.2rem;
  padding: 1.6rem 2.4rem;
  flex-shrink: 0;
  ${(p) => p.$divider && css`border-top: 1px solid ${p.theme.colors.border};`}
`;

interface CardFooterProps {
  children?: React.ReactNode;
  justify?: "flex-start" | "flex-end" | "space-between" | "center";
  divider?: boolean;
  className?: string;
}

function CardFooter({ children, justify = "flex-end", divider = true, className }: CardFooterProps) {
  return (
    <CardFooterRoot $justify={justify} $divider={divider} className={className}>
      {children}
    </CardFooterRoot>
  );
}

/* Card.Divider */
const CardDividerRoot = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

function CardDivider() {
  return <CardDividerRoot />;
}

/* Card root */
interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, ConflictingEvents> {
  variant?: CardVariant;
  hover?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function CardBase({ variant = "default", hover = false, children, className, ...rest }: CardProps) {
  return (
    <CardRoot
      $variant={variant}
      $hover={hover}
      className={className}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={hover ? { y: 0 } : undefined}
      transition={{ duration: 0.15 }}
      {...(rest as object)}
    >
      {children}
    </CardRoot>
  );
}

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Divider: CardDivider,
});

/* ═══════════════════════════════════════════════════════
   2. StatCard — metric card with accent + trend delta
═══════════════════════════════════════════════════════ */

export type StatCardVariant = AccentVariant;

export interface StatCardDelta {
  value: string;
  direction: "up" | "down" | "flat";
}

const DELTA_ICON = { up: "trending_up", down: "trending_down", flat: "trending_flat" } as const;

const StatRoot = styled(motion.div)<{ $variant: StatCardVariant }>`
  position: relative;
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: border-color 0.2s, box-shadow 0.2s;

  /* Colored top accent — clipped cleanly by overflow:hidden + border-radius */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(p) => accentColor(p.$variant, p.theme.colors)};
  }

  &:hover {
    border-color: ${(p) => accentColor(p.$variant, p.theme.colors)}66;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const StatIconBox = styled.div<{ $variant: StatCardVariant }>`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) => accentBg(p.$variant, p.theme.colors)};
  color: ${(p) => accentColor(p.$variant, p.theme.colors)};
`;

const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const StatLabel = styled.p`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
`;

const StatValue = styled.p`
  margin: 0;
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: -0.15rem;
  line-height: 1;
  color: ${(p) => p.theme.colors.text};
`;

const StatDeltaChip = styled.span<{ $dir: StatCardDelta["direction"] }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: ${(p) =>
    p.$dir === "up" ? p.theme.colors.successBg :
    p.$dir === "down" ? p.theme.colors.dangerBg :
    p.theme.colors.chipBg};
  color: ${(p) =>
    p.$dir === "up" ? p.theme.colors.success :
    p.$dir === "down" ? p.theme.colors.danger :
    p.theme.colors.textMuted};
`;

export interface StatCardProps {
  icon: string;
  iconVariant?: StatCardVariant;
  label: string;
  value: string | number;
  delta?: StatCardDelta;
  badge?: { label: string; variant: BadgeVariant };
  className?: string;
}

export function StatCard({
  icon,
  iconVariant = "primary",
  label,
  value,
  delta,
  badge,
  className,
}: StatCardProps) {
  return (
    <StatRoot
      $variant={iconVariant}
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <StatTop>
        <StatIconBox $variant={iconVariant}>
          <Icon name={icon} size={20} />
        </StatIconBox>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </StatTop>

      <StatBody>
        <StatLabel>{label}</StatLabel>
        <StatValue>{value}</StatValue>
        {delta && (
          <StatDeltaChip $dir={delta.direction}>
            <Icon name={DELTA_ICON[delta.direction]} size={13} />
            {delta.value}
          </StatDeltaChip>
        )}
      </StatBody>
    </StatRoot>
  );
}

/* ═══════════════════════════════════════════════════════
   3. ProfileCard — person card with avatar + stats
═══════════════════════════════════════════════════════ */

const AVATAR_PALETTES = [
  { bg: "rgba(0,108,117,0.18)",   fg: "#006c75" },
  { bg: "rgba(34,197,94,0.18)",   fg: "#22c55e" },
  { bg: "rgba(234,179,8,0.18)",   fg: "#eab308" },
  { bg: "rgba(99,102,241,0.18)",  fg: "#818cf8" },
  { bg: "rgba(236,72,153,0.18)",  fg: "#f472b6" },
] as const;

function avatarPalette(name: string) {
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

const ProfileRoot = styled(motion.div)`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
`;

const ProfileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 2.4rem 2.4rem 2rem;
`;

const AvatarCircle = styled.div<{ $bg: string; $fg: string }>`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$fg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: 0.04em;
`;

const AvatarImg = styled.img`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ProfileName = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileRole = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
`;

const ProfileInfo = styled.p`
  margin: 0;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ProfileStatsRow = styled.div`
  display: flex;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const ProfileStat = styled.div`
  flex: 1;
  padding: 1.4rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & + & {
    border-left: 1px solid ${(p) => p.theme.colors.border};
  }
`;

const ProfileStatValue = styled.span`
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.05rem;
  color: ${(p) => p.theme.colors.text};
`;

const ProfileStatLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ProfileActionRow = styled.div`
  padding: 1.2rem 2.4rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const ProfileActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.75;
  }
`;

export interface ProfileCardProps {
  name: string;
  role: string;
  meta?: string;
  initials?: string;
  avatarSrc?: string;
  stats?: Array<{ label: string; value: string | number }>;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function ProfileCard({
  name,
  role,
  meta,
  initials: initialsOverride,
  avatarSrc,
  stats,
  action,
  className,
}: ProfileCardProps) {
  const palette = avatarPalette(name);
  const abbrev = initialsOverride ?? initials(name);

  return (
    <ProfileRoot
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <ProfileTop>
        {avatarSrc ? (
          <AvatarImg src={avatarSrc} alt={name} />
        ) : (
          <AvatarCircle $bg={palette.bg} $fg={palette.fg}>{abbrev}</AvatarCircle>
        )}
        <ProfileMeta>
          <ProfileName>{name}</ProfileName>
          <ProfileRole>{role}</ProfileRole>
          {meta && <ProfileInfo>{meta}</ProfileInfo>}
        </ProfileMeta>
      </ProfileTop>

      {stats && stats.length > 0 && (
        <ProfileStatsRow>
          {stats.map((s) => (
            <ProfileStat key={s.label}>
              <ProfileStatValue>{s.value}</ProfileStatValue>
              <ProfileStatLabel>{s.label}</ProfileStatLabel>
            </ProfileStat>
          ))}
        </ProfileStatsRow>
      )}

      {action && (
        <ProfileActionRow>
          <ProfileActionBtn onClick={action.onClick}>
            {action.label}
            <Icon name="arrow_forward" size={14} />
          </ProfileActionBtn>
        </ProfileActionRow>
      )}
    </ProfileRoot>
  );
}

/* ═══════════════════════════════════════════════════════
   4. ActionCard — clickable tile
═══════════════════════════════════════════════════════ */

export type ActionCardVariant = "default" | "primary";

const ActionRoot = styled(motion.button)<{ $variant: ActionCardVariant }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 2.8rem 2rem;
  border-radius: 1.6rem;
  cursor: pointer;
  font-family: inherit;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;

  ${(p) =>
    p.$variant === "default" &&
    css`
      background: ${p.theme.colors.surface};
      border: 1px solid ${p.theme.colors.border};
      color: ${p.theme.colors.textMuted};

      &:hover {
        border-color: rgba(0, 108, 117, 0.4);
        color: ${p.theme.colors.primary};
        background: ${p.theme.colors.primaryBg};
      }
    `}

  ${(p) =>
    p.$variant === "primary" &&
    css`
      background: ${p.theme.colors.primaryBg};
      border: 1px solid rgba(0, 108, 117, 0.25);
      color: ${p.theme.colors.primary};

      &:hover {
        background: ${p.theme.colors.primaryBgStrong};
        border-color: rgba(0, 108, 117, 0.5);
      }
    `}
`;

const ActionIconStack = styled.div`
  position: relative;
  width: 5.6rem;
  height: 5.6rem;
`;

const ActionIconBg = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1.4rem;
  background: currentColor;
  opacity: 0.12;
`;

const ActionIconFg = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionLabel = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: inherit;
`;

const ActionDescription = styled.span`
  font-size: 1.2rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
  line-height: 1.4;
`;

const ActionBadge = styled.span`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 1rem;
  font-weight: 700;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
`;

export interface ActionCardProps {
  icon: string;
  label: string;
  description?: string;
  onClick?: () => void;
  badge?: string;
  variant?: ActionCardVariant;
  className?: string;
}

export function ActionCard({
  icon,
  label,
  description,
  onClick,
  badge,
  variant = "default",
  className,
}: ActionCardProps) {
  return (
    <ActionRoot
      $variant={variant}
      className={className}
      onClick={onClick}
      style={{ position: "relative" }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
      whileTap={{ y: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {badge && <ActionBadge>{badge}</ActionBadge>}
      <ActionIconStack>
        <ActionIconBg />
        <ActionIconFg>
          <Icon name={icon} size={26} />
        </ActionIconFg>
      </ActionIconStack>
      <ActionLabel>{label}</ActionLabel>
      {description && <ActionDescription>{description}</ActionDescription>}
    </ActionRoot>
  );
}

/* ═══════════════════════════════════════════════════════
   5. AlertCard — status/informational banner
═══════════════════════════════════════════════════════ */

export type AlertCardVariant = "success" | "warning" | "danger" | "info";

const ALERT_ICON: Record<AlertCardVariant, string> = {
  success: "check_circle",
  warning: "warning",
  danger: "error",
  info: "info",
};

function alertColor(v: AlertCardVariant, c: AppTheme["colors"]): string {
  return { success: c.success, warning: c.warning, danger: c.danger, info: c.primary }[v];
}

function alertBg(v: AlertCardVariant, c: AppTheme["colors"]): string {
  return { success: c.successBg, warning: c.warningBg, danger: c.dangerBg, info: c.primaryBg }[v];
}

function alertBorder(v: AlertCardVariant): string {
  return {
    success: "rgba(34,197,94,0.2)",
    warning: "rgba(234,179,8,0.2)",
    danger: "rgba(239,68,68,0.2)",
    info: "rgba(0,108,117,0.2)",
  }[v];
}

const AlertRoot = styled.div<{ $variant: AlertCardVariant }>`
  position: relative;
  overflow: hidden;
  border-radius: 1.2rem;
  border: 1px solid ${(p) => alertBorder(p.$variant)};
  background: ${(p) => alertBg(p.$variant, p.theme.colors)};
  padding: 1.6rem 1.6rem 1.6rem calc(1.6rem + 4px);

  /* Left accent strip */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background: ${(p) => alertColor(p.$variant, p.theme.colors)};
  }
`;

const AlertInner = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
`;

const AlertIconWrap = styled.div<{ $variant: AlertCardVariant }>`
  flex-shrink: 0;
  color: ${(p) => alertColor(p.$variant, p.theme.colors)};
  margin-top: 0.1rem;
`;

const AlertContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const AlertTitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const AlertDescription = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textSubtle};
  line-height: 1.5;
`;

const AlertActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s;
  color: ${(p) => p.theme.colors.text};

  &:hover { opacity: 0.65; }
`;

const AlertDismissBtn = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  padding: 0.2rem;
  border-radius: 0.4rem;
  transition: color 0.15s;

  &:hover { color: ${(p) => p.theme.colors.text}; }
`;

export interface AlertCardProps {
  variant?: AlertCardVariant;
  title: string;
  description?: string;
  icon?: string;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  className?: string;
}

export function AlertCard({
  variant = "info",
  title,
  description,
  icon,
  action,
  onDismiss,
  className,
}: AlertCardProps) {
  return (
    <AlertRoot $variant={variant} className={className}>
      <AlertInner>
        <AlertIconWrap $variant={variant}>
          <Icon name={icon ?? ALERT_ICON[variant]} size={18} filled />
        </AlertIconWrap>

        <AlertContent>
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
          {action && (
            <AlertActionBtn onClick={action.onClick}>
              {action.label}
              <Icon name="arrow_forward" size={13} />
            </AlertActionBtn>
          )}
        </AlertContent>

        {onDismiss && (
          <AlertDismissBtn onClick={onDismiss} aria-label="Cerrar">
            <Icon name="close" size={16} />
          </AlertDismissBtn>
        )}
      </AlertInner>
    </AlertRoot>
  );
}
