import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../ui/Icon";

const DEFAULT_REGEX = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]+$/;

/* ── Key / paste helpers (exported, like the original) ─ */

/** Block a keystroke whose character does not match the regex. Use on `onKeyDown`. */
export const handleKeyPress = (event: React.KeyboardEvent, typeRegex: RegExp = DEFAULT_REGEX) => {
  if (event.key === "Enter") return;
  // Ignore control keys (Backspace, Arrow…) and OS shortcuts.
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
  if (!typeRegex.test(event.key)) event.preventDefault();
};

const normalize = (s: unknown) =>
  String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();

const cleanPasted = (text: string) =>
  text.replace(/^['\s]+|['\s]+$/g, "").replace(/[\r\n\t]/g, "");

/* ── Props ──────────────────────────────────────────── */

interface InputCustomProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur"> {
  /** Label rendered above the field. */
  label?: string;
  required?: boolean;
  /** Validation message; when present the field turns red. */
  error?: string;
  /** Material Symbols icon shown inside the field (leading). */
  icon?: string;
  /** Restrict typed/pasted characters to this pattern. */
  regex?: RegExp;

  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  /* Search-action behaviour (optional) */
  onActionClick?: (term: string) => void;
  actionPosition?: "start" | "end";
  /** Fire the action automatically this many ms after typing stops. */
  debounceMs?: number;
  /** Minimum characters before the debounced action fires. */
  minChars?: number;
  onClear?: () => void;

  /* Paste handling */
  needCleanedText?: boolean;
  onPasteSuccess?: (cleanedText: string) => void;
  onPasteInvalid?: (originalText: string, cleanedText: string) => void;

  dataCy?: string;
}

/* ── Styles (Tailwind) ──────────────────────────────── */

const labelClasses = "text-[1rem] font-bold uppercase tracking-[0.1em]";

const inputBase =
  "w-full box-border rounded-[0.8rem] bg-background text-[1.4rem] text-text font-medium " +
  "leading-[2rem] outline-none transition-[border-color,box-shadow] duration-150 " +
  "placeholder:text-text-muted disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70";

/* ── Component ──────────────────────────────────────── */

export const InputCustom = forwardRef<HTMLInputElement, InputCustomProps>(function InputCustom(
  {
    label,
    required = false,
    error,
    icon,
    regex = DEFAULT_REGEX,
    value,
    name,
    disabled = false,
    maxLength = 100,
    placeholder = "Ingrese datos",
    onChange,
    onBlur,
    onActionClick,
    actionPosition = "end",
    debounceMs,
    minChars = 2,
    onClear,
    needCleanedText = false,
    onPasteSuccess,
    onPasteInvalid,
    dataCy = "cy-input-text-field",
    className,
    id,
    ...rest
  },
  ref
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const [typedValue, setTypedValue] = useState<string>(String(value ?? ""));
  const debounceTimer = useRef<number | null>(null);
  const lastFiredRef = useRef<string>("");

  // Keep internal mirror in sync with a controlled `value`.
  useEffect(() => {
    if (value !== undefined) setTypedValue(String(value ?? ""));
  }, [value]);

  const termNorm = useMemo(() => normalize(typedValue), [typedValue]);

  const cancelTimer = () => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  };

  const runAction = () => {
    if (!onActionClick) return;
    cancelTimer();
    const term = normalize(innerRef.current?.value ?? typedValue);
    if (term.length === 0) {
      lastFiredRef.current = "";
      onClear?.();
      return;
    }
    if (term === lastFiredRef.current) return;
    lastFiredRef.current = term;
    onActionClick(term);
  };

  // Debounced auto-search.
  useEffect(() => {
    if (!onActionClick || !debounceMs) return;

    if (termNorm.length === 0) {
      cancelTimer();
      lastFiredRef.current = "";
      onClear?.();
      return;
    }
    if (termNorm.length < minChars || termNorm === lastFiredRef.current) {
      cancelTimer();
      return;
    }

    debounceTimer.current = window.setTimeout(() => {
      lastFiredRef.current = termNorm;
      onActionClick(termNorm);
      debounceTimer.current = null;
    }, debounceMs);

    return cancelTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termNorm, debounceMs, minChars]);

  const hasAction = Boolean(onActionClick);
  const padX = "1.4rem";
  const actionPad = "4rem";
  const inputStyle: React.CSSProperties = {
    paddingTop: "1.4rem",
    paddingBottom: "1.4rem",
    paddingLeft: icon || (hasAction && actionPosition === "start") ? actionPad : padX,
    paddingRight: hasAction && actionPosition === "end" ? actionPad : padX,
  };

  const borderClass = error
    ? "border border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
    : "border border-border-strong focus:border-primary focus:shadow-[0_0_0_3px_rgba(113, 42, 226, 0.10)]";

  const ActionButton = hasAction ? (
    <button
      type="button"
      aria-label="action"
      onClick={runAction}
      tabIndex={0}
      className={[
        "absolute top-1/2 -translate-y-1/2 flex items-center text-text-muted",
        "transition-colors hover:text-primary",
        actionPosition === "end" ? "right-[1.2rem]" : "left-[1.2rem]",
      ].join(" ")}
    >
      <Icon name="search" size={18} />
    </button>
  ) : null;

  return (
    <div className="flex flex-col gap-[0.8rem]">
      {label && (
        <label
          htmlFor={id}
          className={[labelClasses, error ? "text-danger" : "text-text-muted"]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span
            className={[
              "pointer-events-none absolute left-[1.2rem] top-1/2 -translate-y-1/2 flex items-center",
              error ? "text-danger" : "text-text-muted",
            ].join(" ")}
          >
            <Icon name={icon} size={18} />
          </span>
        )}

        {actionPosition === "start" && ActionButton}

        <input
          ref={setRefs}
          id={id}
          name={name}
          data-cy={dataCy}
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          className={[inputBase, borderClass, className].filter(Boolean).join(" ")}
          style={inputStyle}
          onChange={(e) => {
            onChange?.(e);
            setTypedValue(e.target.value);
            if (normalize(e.target.value).length === 0) {
              cancelTimer();
              lastFiredRef.current = "";
              onClear?.();
            }
          }}
          onBlur={(e) => onBlur?.(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onActionClick) {
              e.preventDefault();
              runAction();
              return;
            }
            handleKeyPress(e, regex);
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("text");
            const cleanedText = needCleanedText ? cleanPasted(pastedText) : pastedText;

            if (!regex.test(cleanedText)) {
              e.preventDefault();
              onPasteInvalid?.(pastedText, cleanedText);
              return;
            }

            onPasteSuccess?.(cleanedText);

            if (needCleanedText) {
              e.preventDefault();
              setTypedValue(cleanedText);
              onChange?.({
                ...e,
                target: { ...(e.target as HTMLInputElement), value: cleanedText },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          {...rest}
        />

        {actionPosition === "end" && ActionButton}
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
