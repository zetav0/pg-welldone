import React, { forwardRef } from "react";
import { Icon } from "../ui/Icon";

/* ── Single radio ───────────────────────────────────── */

interface RadioCustomProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Text rendered next to the dot. */
  label?: React.ReactNode;
  error?: boolean;
  dataCy?: string;
}

export const RadioCustom = forwardRef<HTMLInputElement, RadioCustomProps>(function RadioCustom(
  { label, error = false, disabled, dataCy = "cy-radio", id, className, ...rest },
  ref
) {
  const boxBorder = error ? "border-danger" : "border-border-strong";

  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex items-center gap-[0.8rem] select-none",
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      ].join(" ")}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          id={id}
          type="radio"
          data-cy={dataCy}
          disabled={disabled}
          aria-invalid={error}
          className={[
            "peer appearance-none w-[1.8rem] h-[1.8rem] rounded-full bg-background border",
            boxBorder,
            "transition-[border-color,box-shadow] duration-150",
            "checked:border-primary",
            "focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(113, 42, 226, 0.12)]",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
        {/* Inner dot — visible only when selected */}
        <span className="pointer-events-none absolute inset-0 m-auto h-[0.8rem] w-[0.8rem] rounded-full bg-primary opacity-0 peer-checked:opacity-100" />
      </span>

      {label && <span className="text-[1.4rem] text-text">{label}</span>}
    </label>
  );
});

/* ── Radio group ────────────────────────────────────── */

export interface OpcionRadio {
  id: string;
  title: string;
  disabled?: boolean;
}

interface RadioGroupCustomProps {
  /** Group label. */
  title?: string;
  name: string;
  options?: OpcionRadio[];
  selectedOption?: string | null;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  /** Validation message; when present options turn red. */
  error?: string;
  /** Stack vertically (default) or lay out in a row. */
  direction?: "column" | "row";
  dataCy?: string;
}

const labelClasses = "text-[1rem] font-bold uppercase tracking-[0.1em] text-text-muted";

export function RadioGroupCustom({
  title = "",
  name,
  options = [],
  selectedOption,
  onChange,
  required = false,
  disabled = false,
  error,
  direction = "column",
  dataCy = "cy-radio-group",
}: RadioGroupCustomProps) {
  return (
    <div className="flex flex-col gap-[0.8rem]" role="radiogroup" aria-label={title || name}>
      {title && (
        <span className={labelClasses}>
          {title}
          {required && <span className="text-danger"> *</span>}
        </span>
      )}

      <div className={["flex gap-[1.6rem]", direction === "row" ? "flex-row" : "flex-col"].join(" ")}>
        {options.map((option) => (
          <RadioCustom
            key={option.id}
            id={`${name}-${option.id}`}
            name={name}
            value={option.id}
            label={option.title}
            checked={selectedOption === option.id}
            disabled={disabled || option.disabled}
            error={Boolean(error)}
            dataCy={`${dataCy}-${option.id}`}
            onChange={() => onChange?.(option.id)}
          />
        ))}
      </div>

      {error && (
        <p className="m-0 flex items-center gap-[0.4rem] text-[1.2rem] text-danger">
          <Icon name="error" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
