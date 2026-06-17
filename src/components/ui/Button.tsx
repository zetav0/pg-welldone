import styled, { css } from "styled-components";
import { motion } from "framer-motion";

export type ButtonVariant = "primary" | "outline" | "ghost";

// Conflicting HTML events that Framer Motion redefines with different signatures.
type ConflictingEvents =
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

const ButtonRoot = styled(motion.button)<{ $variant: ButtonVariant; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.4rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  width: ${(p) => (p.$fullWidth ? "100%" : "auto")};

  ${(p) =>
    p.$variant === "primary" &&
    css`
      padding: 1rem 1.6rem;
      background: ${p.theme.colors.primary};
      color: ${p.theme.colors.white};
      border: none;
      box-shadow: 0 4px 6px -1px rgba(113, 42, 226, 0.2);
      &:hover {
        background: rgba(113, 42, 226, 0.9);
      }
    `}

  ${(p) =>
    p.$variant === "outline" &&
    css`
      padding: 0.8rem 1.6rem;
      background: transparent;
      color: ${p.theme.colors.textMuted};
      border: 1px solid ${p.theme.colors.border};
      &:hover {
        border-color: ${p.theme.colors.primary};
        color: ${p.theme.colors.primary};
      }
    `}

  ${(p) =>
    p.$variant === "ghost" &&
    css`
      padding: 0.8rem;
      background: transparent;
      color: ${p.theme.colors.textMuted};
      border: none;
      &:hover {
        color: ${p.theme.colors.primary};
      }
    `}
`;

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  ConflictingEvents
> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({ variant = "primary", fullWidth, children, ...rest }: ButtonProps) {
  return (
    <ButtonRoot
      $variant={variant}
      $fullWidth={fullWidth}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      {...rest}
    >
      {children}
    </ButtonRoot>
  );
}
