import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled, { keyframes } from "styled-components";
import { Icon } from "./Icon";

/* ── Keyframes ──────────────────────────────────────────── */

const fadeScaleIn = keyframes`
  from { opacity: 0; transform: scale(0.91); }
  to   { opacity: 1; transform: scale(1); }
`;

/* ── Content element ────────────────────────────────────── */

const ContentEl = styled(TooltipPrimitive.Content)<{ $maxWidth: string }>`
  max-width: ${(p) => p.$maxWidth};
  padding: 0.55rem 1rem;
  border-radius: 0.7rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.4),
    0 12px 32px -4px rgba(0, 0, 0, 0.55);
  color: ${(p) => p.theme.colors.text};
  font-size: 1.2rem;
  line-height: 1.5;
  z-index: 9999;
  will-change: transform, opacity;

  /* Scale emerges from the trigger direction */
  &[data-side="top"]    { transform-origin: bottom center; }
  &[data-side="bottom"] { transform-origin: top center; }
  &[data-side="left"]   { transform-origin: right center; }
  &[data-side="right"]  { transform-origin: left center; }

  &[data-state="delayed-open"],
  &[data-state="instant-open"] {
    animation: ${fadeScaleIn} 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const ArrowEl = styled(TooltipPrimitive.Arrow)`
  fill: ${(p) => p.theme.colors.background};
`;

/* ── Tooltip.Rich ───────────────────────────────────────── */

const RichRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const RichHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const RichTitle = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.3;
`;

const RichDesc = styled.p`
  margin: 0;
  font-size: 1.15rem;
  color: ${(p) => p.theme.colors.textSubtle};
  line-height: 1.5;
`;

const RichSep = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.borderStrong};
  margin: 0.3rem 0;
`;

interface TooltipRichProps {
  title: string;
  description?: string;
  icon?: string;
  footer?: React.ReactNode;
  className?: string;
}

function TooltipRich({ title, description, icon, footer, className }: TooltipRichProps) {
  return (
    <RichRoot className={className}>
      <RichHeader>
        {icon && <Icon name={icon} size={14} />}
        <RichTitle>{title}</RichTitle>
      </RichHeader>
      {description && <RichDesc>{description}</RichDesc>}
      {footer && (
        <>
          <RichSep />
          {footer}
        </>
      )}
    </RichRoot>
  );
}

/* ── Main Tooltip ───────────────────────────────────────── */

export interface TooltipProps {
  /** Tooltip text or JSX. Use `<Tooltip.Rich>` for structured content. */
  content: React.ReactNode;
  /** Trigger element — must forward refs (native elements work out of the box). */
  children: React.ReactElement;
  /** Which side to prefer. Flips automatically on collision. Default "top". */
  side?: "top" | "right" | "bottom" | "left";
  /** Alignment relative to trigger. Default "center". */
  align?: "start" | "center" | "end";
  /** Delay before showing in ms. Default 400. */
  delayDuration?: number;
  /** Gap between trigger and tooltip in px. Default 8. */
  sideOffset?: number;
  /** Max width override. Default "22rem". */
  maxWidth?: string;
  /** Suppress the tooltip — useful for conditionally disabling. */
  disabled?: boolean;
  /** Show the directional arrow. Default true. */
  arrow?: boolean;
  className?: string;
}

function TooltipBase({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 400,
  sideOffset = 8,
  maxWidth = "22rem",
  disabled = false,
  arrow = true,
  className,
}: TooltipProps) {
  if (disabled || !content) return children;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <ContentEl
            $maxWidth={maxWidth}
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={className}
          >
            {content}
            {arrow && <ArrowEl width={10} height={5} />}
          </ContentEl>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* ── Compound export ────────────────────────────────────── */

export const Tooltip = Object.assign(TooltipBase, {
  Rich: TooltipRich,
});

export type { TooltipRichProps };
