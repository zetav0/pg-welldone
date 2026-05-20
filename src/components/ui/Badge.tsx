import styled, { css } from "styled-components";

export type BadgeVariant = "primary" | "success" | "danger" | "warning" | "neutral";

const BadgeRoot = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  font-weight: 700;

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

  ${(p) =>
    p.$variant === "warning" &&
    css`
      background: ${p.theme.colors.warningBg};
      color: ${p.theme.colors.warning};
    `}

  ${(p) =>
    p.$variant === "primary" &&
    css`
      background: ${p.theme.colors.primaryBg};
      color: ${p.theme.colors.primary};
    `}

  ${(p) =>
    p.$variant === "neutral" &&
    css`
      background: ${p.theme.colors.chipBg};
      color: ${p.theme.colors.textMuted};
    `}
`;

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return <BadgeRoot $variant={variant}>{children}</BadgeRoot>;
}
