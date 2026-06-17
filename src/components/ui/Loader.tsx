import styled, { css, keyframes } from "styled-components";
import type { AppTheme } from "@/theme";

/* ── Types ──────────────────────────────────────────── */

export type LoaderVariant = "spinner" | "dots" | "pulse";
export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoaderColor = "primary" | "white" | "muted" | "success" | "danger" | "warning";

/* ── Size maps ───────────────────────────────────────── */

const INDICATOR_SIZE: Record<LoaderSize, string> = {
  xs: "1.6rem",
  sm: "2.2rem",
  md: "3.2rem",
  lg: "4.8rem",
  xl: "6.4rem",
};

const DOT_SIZE: Record<LoaderSize, string> = {
  xs: "0.5rem",
  sm: "0.6rem",
  md: "0.9rem",
  lg: "1.2rem",
  xl: "1.6rem",
};

const DOT_GAP: Record<LoaderSize, string> = {
  xs: "0.4rem",
  sm: "0.5rem",
  md: "0.7rem",
  lg: "1.0rem",
  xl: "1.4rem",
};

const LABEL_SIZE: Record<LoaderSize, string> = {
  xs: "1.1rem",
  sm: "1.2rem",
  md: "1.3rem",
  lg: "1.5rem",
  xl: "1.7rem",
};

/* ── Color helper ────────────────────────────────────── */

function getColor(color: LoaderColor, colors: AppTheme["colors"]): string {
  return {
    primary: colors.primary,
    white:   colors.white,
    muted:   colors.textMuted,
    success: colors.success,
    danger:  colors.danger,
    warning: colors.warning,
  }[color];
}

/* ── Keyframes ───────────────────────────────────────── */

// Outer SVG rotation — constant angular velocity.
const spinRotate = keyframes`
  100% { transform: rotate(360deg); }
`;

// Arc length pulse — gives the Chrome-style "chasing tail" effect.
// Uses stroke-dasharray / stroke-dashoffset on a circle with circumference ≈ 57 (r=9).
const spinDash = keyframes`
  0%   { stroke-dasharray: 1,   150; stroke-dashoffset: 0;    }
  50%  { stroke-dasharray: 90,  150; stroke-dashoffset: -35;  }
  100% { stroke-dasharray: 90,  150; stroke-dashoffset: -124; }
`;

const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.55); opacity: 0.35; }
  40%            { transform: scale(1);    opacity: 1;    }
`;

const pulsate = keyframes`
  0%, 100% { transform: scale(0.82); opacity: 0.5; }
  50%       { transform: scale(1.18); opacity: 1;   }
`;

/* ── Spinner ─────────────────────────────────────────── */

const SpinnerSvg = styled.svg<{ $size: LoaderSize; $color: LoaderColor }>`
  width: ${(p) => INDICATOR_SIZE[p.$size]};
  height: ${(p) => INDICATOR_SIZE[p.$size]};
  flex-shrink: 0;
  animation: ${spinRotate} 1.4s linear infinite;
  will-change: transform;

  .loader-track {
    fill: none;
    stroke: ${(p) => getColor(p.$color, p.theme.colors)};
    stroke-width: 2.5;
    opacity: 0.12;
  }

  .loader-arc {
    fill: none;
    stroke: ${(p) => getColor(p.$color, p.theme.colors)};
    stroke-width: 2.5;
    stroke-linecap: round;
    animation: ${spinDash} 1.4s ease-in-out infinite;
  }
`;

/* ── Dots ────────────────────────────────────────────── */

const DotsWrapper = styled.div<{ $size: LoaderSize }>`
  display: flex;
  align-items: center;
  gap: ${(p) => DOT_GAP[p.$size]};
  flex-shrink: 0;
`;

const Dot = styled.span<{ $size: LoaderSize; $color: LoaderColor; $i: 0 | 1 | 2 }>`
  display: block;
  width: ${(p) => DOT_SIZE[p.$size]};
  height: ${(p) => DOT_SIZE[p.$size]};
  border-radius: 50%;
  background: ${(p) => getColor(p.$color, p.theme.colors)};
  animation: ${dotBounce} 1.2s ease-in-out infinite;
  animation-delay: ${(p) => ["0ms", "160ms", "320ms"][p.$i]};
  will-change: transform, opacity;
`;

/* ── Pulse ───────────────────────────────────────────── */

const PulseCircle = styled.span<{ $size: LoaderSize; $color: LoaderColor }>`
  display: block;
  width: ${(p) => INDICATOR_SIZE[p.$size]};
  height: ${(p) => INDICATOR_SIZE[p.$size]};
  border-radius: 50%;
  background: ${(p) => getColor(p.$color, p.theme.colors)};
  flex-shrink: 0;
  animation: ${pulsate} 1.2s ease-in-out infinite;
  will-change: transform, opacity;
`;

/* ── Label ───────────────────────────────────────────── */

const LabelText = styled.span<{ $size: LoaderSize; $color: LoaderColor }>`
  font-size: ${(p) => LABEL_SIZE[p.$size]};
  font-weight: 500;
  color: ${(p) => getColor(p.$color, p.theme.colors)};
  white-space: nowrap;
`;

/* ── Root ────────────────────────────────────────────── */

const Root = styled.div<{ $overlay: boolean; $fullscreen: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;

  ${(p) =>
    (p.$overlay || p.$fullscreen) &&
    css`
      display: flex;
      position: ${p.$fullscreen ? "fixed" : "absolute"};
      inset: 0;
      z-index: ${p.$fullscreen ? 9999 : 10};
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    `}
`;

/* ── Props ───────────────────────────────────────────── */

interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
  /** Accessible label announced by screen readers. */
  label?: string;
  /** Visible text rendered below the indicator. */
  text?: string;
  /** Fills the nearest `position: relative` ancestor. */
  overlay?: boolean;
  /** Covers the entire viewport. */
  fullscreen?: boolean;
  className?: string;
}

/* ── Component ───────────────────────────────────────── */

export function Loader({
  variant = "spinner",
  size = "md",
  color = "primary",
  label = "Cargando",
  text,
  overlay = false,
  fullscreen = false,
  className,
}: LoaderProps) {
  return (
    <Root
      $overlay={overlay}
      $fullscreen={fullscreen}
      className={className}
      role="status"
      aria-label={label}
    >
      {variant === "spinner" && (
        <SpinnerSvg
          $size={size}
          $color={color}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="loader-track" cx="12" cy="12" r="9" />
          <circle className="loader-arc" cx="12" cy="12" r="9" />
        </SpinnerSvg>
      )}

      {variant === "dots" && (
        <DotsWrapper $size={size} aria-hidden="true">
          <Dot $size={size} $color={color} $i={0} />
          <Dot $size={size} $color={color} $i={1} />
          <Dot $size={size} $color={color} $i={2} />
        </DotsWrapper>
      )}

      {variant === "pulse" && (
        <PulseCircle $size={size} $color={color} aria-hidden="true" />
      )}

      {text && (
        <LabelText $size={size} $color={color}>
          {text}
        </LabelText>
      )}
    </Root>
  );
}
