import React, { forwardRef, useEffect, useRef } from "react";
import { Icon } from "../ui/Icon";

interface CheckboxCustomProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Text rendered next to the box. */
  label?: React.ReactNode;
  required?: boolean;
  /** Validation message; when present the box turns red. */
  error?: string;
  /** Visual third state (does not change `checked`). */
  indeterminate?: boolean;
  dataCy?: string;
}

/* ── Component ──────────────────────────────────────── */

export const CheckboxCustom = forwardRef<HTMLInputElement, CheckboxCustomProps>(
  function CheckboxCustom(
    { label, required = false, error, indeterminate = false, disabled, dataCy = "cy-checkbox", id, className, ...rest },
    ref
  ) {
    const innerRef = useRef<HTMLInputElement | null>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const boxBorder = error ? "border-danger" : "border-border-strong";

    return (
      <div className="flex flex-col gap-[0.4rem]">
        <label
          htmlFor={id}
          className={[
            "inline-flex items-center gap-[0.8rem] select-none",
            disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
          ].join(" ")}
        >
          <span className="relative inline-flex shrink-0">
            <input
              ref={setRefs}
              id={id}
              type="checkbox"
              data-cy={dataCy}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className={[
                "peer appearance-none w-[1.8rem] h-[1.8rem] rounded-[0.4rem] bg-background border",
                boxBorder,
                "transition-[background-color,border-color,box-shadow] duration-150",
                "checked:bg-primary checked:border-primary",
                "indeterminate:bg-primary indeterminate:border-primary",
                "focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,108,117,0.12)]",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className,
              ]
                .filter(Boolean)
                .join(" ")}
              {...rest}
            />
            {/* Check mark — visible only when checked (and not indeterminate) */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0">
              <Icon name="check" size={14} />
            </span>
            {/* Dash — visible only in the indeterminate state */}
            {indeterminate && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white">
                <Icon name="remove" size={14} />
              </span>
            )}
          </span>

          {label && (
            <span className="text-[1.4rem] text-text">
              {label}
              {required && <span className="text-danger"> *</span>}
            </span>
          )}
        </label>

        {error && (
          <p className="m-0 flex items-center gap-[0.4rem] text-[1.2rem] text-danger">
            <Icon name="error" size={14} />
            {error}
          </p>
        )}
      </div>
    );
  }
);
