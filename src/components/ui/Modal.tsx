import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import styled from "styled-components";
import { cn } from "@/lib/utils";

/* ── Size map ────────────────────────────────────────── */

const SIZE = {
  sm: "36rem",
  md: "52rem",
  lg: "72rem",
  xl: "96rem",
} as const;

type ModalSize = keyof typeof SIZE;

/* ── Styled primitives ───────────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
`;

const Content = styled(motion.div)<{ $size: ModalSize }>`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 51;
  width: calc(100% - 3.2rem);
  max-width: ${(p) => SIZE[p.$size]};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 1.6rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  max-height: calc(100svh - 6.4rem);
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

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15 },
  },
};

/* ── Types ───────────────────────────────────────────── */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: ModalSize;
  /** Hides the X button */
  hideClose?: boolean;
  /** Prevent closing on overlay click */
  preventClose?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/* ── Root component ──────────────────────────────────── */

function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  hideClose = false,
  preventClose = false,
  children,
  className,
}: ModalProps) {
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
              onPointerDownOutside={preventClose ? (e) => e.preventDefault() : undefined}
              onEscapeKeyDown={preventClose ? (e) => e.preventDefault() : undefined}
            >
              <Content
                $size={size}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ x: "-50%", y: "-50%" }}
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
                              color: "var(--color-text, #f1f5f9)",
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
                              color: "var(--color-text-muted, #64748b)",
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

Modal.Footer = Footer;

export { Modal };
export type { ModalSize };
