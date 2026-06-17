import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../ui/Icon";

/* ── Types ───────────────────────────────────────────── */

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Use 0 to disable auto-dismiss. */
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastOptions, "description">> {
  id: number;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => number;
  dismiss: (id: number) => void;
}

/* ── Variant → icon / color ──────────────────────────── */

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

const accent = (v: ToastVariant) => {
  switch (v) {
    case "success":
      return { color: "success", bg: "successBg" } as const;
    case "error":
      return { color: "danger", bg: "dangerBg" } as const;
    case "warning":
      return { color: "warning", bg: "warningBg" } as const;
    case "info":
      return { color: "primary", bg: "primaryBg" } as const;
  }
};

/* ── Styled ──────────────────────────────────────────── */

const Viewport = styled.div`
  position: fixed;
  top: 1.6rem;
  right: 1.6rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 36rem;
  max-width: calc(100vw - 3.2rem);
  pointer-events: none;
`;

const ToastCard = styled(motion.div)<{ $variant: ToastVariant }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.4rem 1.6rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-left: 0.4rem solid ${(p) => p.theme.colors[accent(p.$variant).color]};
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
`;

const IconWrap = styled.span<{ $variant: ToastVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.8rem;
  color: ${(p) => p.theme.colors[accent(p.$variant).color]};
  background: ${(p) => p.theme.colors[accent(p.$variant).bg]};
`;

const TextWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ToastDesc = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.2rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.textSubtle};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  border-radius: 0.6rem;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.border};
  }
`;

/* ── Context ─────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 4000 }: ToastOptions) => {
      const id = ++idRef.current;
      setItems((list) => [...list, { id, title, description, variant, duration }]);
      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <Viewport>
          <AnimatePresence initial={false}>
            {items.map((t) => (
              <ToastCard
                key={t.id}
                $variant={t.variant}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.18 } }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <IconWrap $variant={t.variant}>
                  <Icon name={VARIANT_ICON[t.variant]} filled size={18} />
                </IconWrap>
                <TextWrap>
                  <ToastTitle>{t.title}</ToastTitle>
                  {t.description && <ToastDesc>{t.description}</ToastDesc>}
                </TextWrap>
                <CloseButton onClick={() => dismiss(t.id)} aria-label="Cerrar">
                  <Icon name="close" size={16} />
                </CloseButton>
              </ToastCard>
            ))}
          </AnimatePresence>
        </Viewport>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────── */

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
