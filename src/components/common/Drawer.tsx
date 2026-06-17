import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import styled from "styled-components";
import { cn } from "@/lib/utils";

/* ── Size map (panel width) ──────────────────────────── */

const SIZE = {
  sm: "32rem",
  md: "42rem",
  lg: "56rem",
  xl: "72rem",
} as const;

type DrawerSize = keyof typeof SIZE;
type DrawerSide = "right" | "left";

/* ── Styled primitives ───────────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
`;

const Content = styled(motion.div)<{ $size: DrawerSize; $side: DrawerSide }>`
  position: fixed;
  top: 0;
  bottom: 0;
  ${(p) => (p.$side === "right" ? "right: 0;" : "left: 0;")}
  z-index: 51;
  width: calc(100% - 3.2rem);
  max-width: ${(p) => SIZE[p.$size]};
  background: ${(p) => p.theme.colors.surface};
  border-${(p) => (p.$side === "right" ? "left" : "right")}: 1px solid ${(p) =>
    p.theme.colors.borderStrong};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  height: 100svh;
  overflow: hidden;
  outline: none;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 2.4rem 2.4rem 0;
  flex-shrink: 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.8rem;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.border};
    color: ${(p) => p.theme.colors.text};
  }
`;

const Body = styled.div`
  padding: 2.4rem;
  overflow-y: auto;
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2rem;
  padding: 1.6rem 2.4rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

/* ── Animation variants ──────────────────────────────── */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const buildContentVariants = (side: DrawerSide): Variants => {
  const offset = side === "right" ? "100%" : "-100%";
  return {
    hidden: { x: offset },
    visible: { x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: offset, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  };
};

/* ── Types ───────────────────────────────────────────── */

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Panel width preset. */
  size?: DrawerSize;
  /** Side the panel slides in from. */
  side?: DrawerSide;
  /** Hides the X button. */
  hideClose?: boolean;
  /** Prevent closing on overlay click / Escape. */
  preventClose?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/* ── Root component ──────────────────────────────────── */

function Drawer({
  open,
  onClose,
  title,
  description,
  size = "md",
  side = "right",
  hideClose = false,
  preventClose = false,
  children,
  className,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <Overlay
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={preventClose ? undefined : onClose}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              onPointerDownOutside={(e) => {
                if ((e.target as HTMLElement).closest("[data-combobox-portal]")) {
                  e.preventDefault();
                  return;
                }
                if (preventClose) e.preventDefault();
              }}
              onEscapeKeyDown={preventClose ? (e) => e.preventDefault() : undefined}
            >
              <Content
                $size={size}
                $side={side}
                variants={buildContentVariants(side)}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(className)}
              >
                {(title ?? !hideClose) && (
                  <Header>
                    <TitleWrapper>
                      {title && (
                        <DialogPrimitive.Title asChild>
                          <span
                            style={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                              color: "var(--color-text, #191c1e)",
                              lineHeight: 1.2,
                            }}
                          >
                            {title}
                          </span>
                        </DialogPrimitive.Title>
                      )}
                      {description && (
                        <DialogPrimitive.Description asChild>
                          <span
                            style={{
                              fontSize: "1.3rem",
                              color: "var(--color-text-muted, #45464d)",
                            }}
                          >
                            {description}
                          </span>
                        </DialogPrimitive.Description>
                      )}
                    </TitleWrapper>

                    {!hideClose && (
                      <CloseButton onClick={onClose} aria-label="Cerrar">
                        <X size={16} />
                      </CloseButton>
                    )}
                  </Header>
                )}

                <Body>{children}</Body>
              </Content>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/* ── Sub-component ───────────────────────────────────── */

Drawer.Footer = Footer;

export { Drawer };
export type { DrawerSize, DrawerSide };
