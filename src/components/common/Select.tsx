import React, { forwardRef } from "react";
import { Icon } from "../ui/Icon";

export interface OpcionDesplegable {
  id: string;
  title: string;
}

interface SelectCustomProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "onBlur"> {
  /** Label rendered above the field. */
  title?: string;
  options?: OpcionDesplegable[];
  selectedOption?: string | null;
  placeholder?: string;
  required?: boolean;
  /** Validation message; when present the field turns red. */
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  /** Shows a clear button next to the label when a value is selected. */
  onClear?: () => void;
  dataCy?: string;
}

/* ── Styles (Tailwind) ──────────────────────────────── */

const labelClasses = "text-[1rem] font-bold uppercase tracking-[0.1em] text-text-muted";

const selectBase =
  "w-full box-border appearance-none rounded-[0.8rem] bg-background text-[1.4rem] font-medium " +
  "leading-[2rem] py-[1.4rem] pl-[1.4rem] pr-[4rem] outline-none cursor-pointer " +
  "transition-[border-color,box-shadow] duration-150 " +
  "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70";

/* ── Component ──────────────────────────────────────── */

export const SelectCustom = forwardRef<HTMLSelectElement, SelectCustomProps>(function SelectCustom(
  {
    title = "",
    options = [],
    selectedOption,
    onChange,
    onBlur,
    placeholder = "Seleccione una opción",
    name,
    disabled = false,
    required = false,
    error,
    onClear,
    dataCy = "cy-select",
    className,
    id,
    value,
    ...rest
  },
  ref
) {
  // Support both controlled `selectedOption` (like the original) and `value`.
  const currentValue = (selectedOption ?? value ?? "") as string;

  const borderClass = error
    ? "border border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
    : "border border-border-strong focus:border-primary focus:shadow-[0_0_0_3px_rgba(113, 42, 226, 0.10)]";

  const textClass = currentValue ? "text-text" : "text-text-muted";

  return (
    <div className="flex flex-col gap-[0.8rem]">
      {(title || (onClear && currentValue)) && (
        <div className="flex items-center justify-between gap-[0.8rem]">
          <label htmlFor={id} className={labelClasses}>
            {title}
            {required && <span className="text-danger"> *</span>}
          </label>
          {onClear && currentValue && (
            <button
              type="button"
              onClick={onClear}
              aria-label="clear"
              className="flex items-center gap-[0.2rem] text-[1rem] font-bold uppercase tracking-[0.1em] text-text-muted transition-colors hover:text-primary"
            >
              <Icon name="close" size={14} />
              Limpiar
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={id}
          data-cy={dataCy}
          name={name}
          value={currentValue}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={[selectBase, borderClass, textClass, className].filter(Boolean).join(" ")}
          onChange={(e) => onChange?.(e)}
          onBlur={(e) => onBlur?.(e)}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-[1.2rem] top-1/2 -translate-y-1/2 flex items-center text-text-muted">
          <Icon name="expand_more" size={20} />
        </span>
      </div>

      {error && (
        <p className="m-0 flex items-center gap-[0.4rem] text-[1.2rem] text-danger">
          <Icon name="error" size={14} />
          {error}
        </p>
      )}
    </div>
  );
});
