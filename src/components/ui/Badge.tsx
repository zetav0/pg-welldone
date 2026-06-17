import styled, { css } from "styled-components";
import type { AppTheme } from "../../theme";
import { Icon } from "./Icon";

/* ── Types ─────────────────────────────────────────────── */

export type BadgeVariant = "primary" | "success" | "danger" | "warning" | "neutral";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeAppearance = "subtle" | "solid" | "outline";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Visual fill style. "subtle" = tinted bg (default). "solid" = filled. "outline" = border only. */
  appearance?: BadgeAppearance;
  /** Full pill shape. Default is slightly-rounded chip. */
  pill?: boolean;
  /** Leading Material Symbol icon name. */
  icon?: string;
  /** Show a colored status dot before content. */
  dot?: boolean;
  /** Renders a × dismiss button and fires on click. */
  onRemove?: () => void;
  /** Makes the badge interactive (cursor pointer + hover opacity). */
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/* ── Color helpers ──────────────────────────────────────── */

type ColorsMap = AppTheme["colors"];

type ColorSet = { bg: string; text: string; border: string };

function getColorSet(
  variant: BadgeVariant,
  appearance: BadgeAppearance,
  c: ColorsMap,
): ColorSet {
  const base: Record<BadgeVariant, string> = {
    primary: c.primary,
    success: c.success,
    danger:  c.danger,
    warning: c.warning,
    neutral: c.textMuted,
  };
  const subtleBg: Record<BadgeVariant, string> = {
    primary: c.primaryBg,
    success: c.successBg,
    danger:  c.dangerBg,
    warning: c.warningBg,
    neutral: c.chipBg,
  };
  // warning/success are light colors — dark text reads better on solid fill
  const solidText: Record<BadgeVariant, string> = {
    primary: c.white,
    success: c.background,
    danger:  c.white,
    warning: c.background,
    neutral: c.text,
  };

  if (appearance === "solid") {
    return { bg: base[variant], text: solidText[variant], border: "transparent" };
  }
  if (appearance === "outline") {
    return { bg: "transparent", text: base[variant], border: base[variant] };
  }
  return { bg: subtleBg[variant], text: base[variant], border: "transparent" };
}

/* ── Size config ────────────────────────────────────────── */

const SIZE: Record<BadgeSize, { fontSize: string; py: string; px: string; gap: string }> = {
  sm: { fontSize: "1.0rem", py: "0.15rem", px: "0.5rem",  gap: "0.28rem" },
  md: { fontSize: "1.1rem", py: "0.25rem", px: "0.7rem",  gap: "0.35rem" },
  lg: { fontSize: "1.3rem", py: "0.35rem", px: "0.95rem", gap: "0.4rem"  },
};
const ICON_PX: Record<BadgeSize, number> = { sm: 11, md: 13, lg: 15 };
const DOT_SIZE: Record<BadgeSize, string> = { sm: "0.5rem", md: "0.55rem", lg: "0.65rem" };

/* ── Styled primitives ──────────────────────────────────── */

const BadgeRoot = styled.span<{
  $variant: BadgeVariant;
  $size: BadgeSize;
  $appearance: BadgeAppearance;
  $pill: boolean;
  $interactive: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => SIZE[p.$size].gap};
  padding: ${(p) => `${SIZE[p.$size].py} ${SIZE[p.$size].px}`};
  font-size: ${(p) => SIZE[p.$size].fontSize};
  font-family: ${(p) => p.theme.fonts.sans};
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  border-radius: ${(p) => (p.$pill ? "9999px" : "0.45rem")};
  border: 1px solid;
  vertical-align: middle;
  user-select: none;

  ${(p) => {
    const cs = getColorSet(p.$variant, p.$appearance, p.theme.colors);
    return css`
      background: ${cs.bg};
      color: ${cs.text};
      border-color: ${cs.border};
    `;
  }}

  ${(p) =>
    p.$interactive &&
    css`
      cursor: pointer;
      transition: opacity 0.15s ease;
      &:hover {
        opacity: 0.75;
      }
      &:active {
        opacity: 0.6;
      }
    `}
`;

const StatusDot = styled.span<{ $size: BadgeSize }>`
  display: block;
  width: ${(p) => DOT_SIZE[p.$size]};
  height: ${(p) => DOT_SIZE[p.$size]};
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;

const RemoveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.1rem;
  cursor: pointer;
  color: currentColor;
  opacity: 0.55;
  border-radius: 50%;
  line-height: 1;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
    opacity: 1;
  }
`;

/* ── Component ──────────────────────────────────────────── */

export function Badge({
  variant = "neutral",
  size = "md",
  appearance = "subtle",
  pill = false,
  icon,
  dot = false,
  onRemove,
  onClick,
  className,
  children,
}: BadgeProps) {
  return (
    <BadgeRoot
      $variant={variant}
      $size={size}
      $appearance={appearance}
      $pill={pill}
      $interactive={!!onClick}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={className}
    >
      {dot && <StatusDot $size={size} aria-hidden="true" />}
      {icon && <Icon name={icon} size={ICON_PX[size]} />}
      {children}
      {onRemove && (
        <RemoveBtn
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Eliminar"
        >
          <Icon name="close" size={ICON_PX[size]} />
        </RemoveBtn>
      )}
    </BadgeRoot>
  );
}
