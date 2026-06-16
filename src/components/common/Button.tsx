import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

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

/* ── Style maps (Tailwind classes) ──────────────────── */

const base =
  "inline-flex items-center justify-center gap-[0.8rem] font-bold rounded-[0.8rem] " +
  "cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-[1.2rem] py-[0.6rem] text-[1.2rem]",
  md: "px-[1.6rem] py-[1rem] text-[1.4rem]",
  lg: "px-[2rem] py-[1.3rem] text-[1.6rem]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border border-transparent " +
    "shadow-[0_4px_6px_-1px_rgba(0,108,117,0.2)] enabled:hover:bg-primary/90",
  outline:
    "bg-transparent text-text-muted border border-border " +
    "enabled:hover:border-primary enabled:hover:text-primary",
  ghost: "bg-transparent text-text-muted border border-transparent enabled:hover:text-primary",
  danger:
    "bg-danger text-white border border-transparent " +
    "shadow-[0_4px_6px_-1px_rgba(239,68,68,0.2)] enabled:hover:bg-danger/90",
};

/* ── Props ──────────────────────────────────────────── */

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  ConflictingEvents
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Material Symbols icon name rendered before the label. */
  icon?: string;
  /** Render the icon after the label instead of before. */
  iconRight?: boolean;
}

/* ── Component ──────────────────────────────────────── */

export function ButtonCustom({
  variant = "primary",
  size = "md",
  fullWidth,
  icon,
  iconRight = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;
  const iconEl = icon ? <Icon name={icon} size={iconSize} /> : null;

  const classes = [
    base,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "w-auto",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      {...rest}
    >
      {!iconRight && iconEl}
      {children}
      {iconRight && iconEl}
    </motion.button>
  );
}
