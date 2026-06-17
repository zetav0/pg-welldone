import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../ui/Icon";

export interface ComboboxOption {
  id: string;
  title: string;
}

interface ComboboxCustomProps {
  /** Label rendered above the field. */
  label?: string;
  required?: boolean;
  /** Validation message; when present the field (and its label) turns red. */
  error?: string;
  /** Selected option id. */
  value?: string | null;
  options?: ComboboxOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  /** Text shown on the trigger when nothing is selected. */
  placeholder?: string;
  /** Placeholder for the search box inside the dropdown. */
  searchPlaceholder?: string;
  /** Shown when the search yields no matches. */
  emptyMessage?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  dataCy?: string;
  className?: string;
}

/* ── Styles (Tailwind) ──────────────────────────────── */

const labelClasses = "text-[1rem] font-bold uppercase tracking-[0.1em]";

const triggerBase =
  "w-full box-border flex items-center justify-between gap-[0.8rem] rounded-[0.8rem] bg-background " +
  "text-[1.4rem] font-medium leading-[2rem] py-[1.4rem] pl-[1.4rem] pr-[1.2rem] outline-none cursor-pointer " +
  "text-left transition-[border-color,box-shadow] duration-150 " +
  "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70";

/* ── Component ──────────────────────────────────────── */

export const ComboboxCustom = forwardRef<HTMLButtonElement, ComboboxCustomProps>(
  function ComboboxCustom(
    {
      label,
      required = false,
      error,
      value,
      options = [],
      onChange,
      onBlur,
      placeholder = "Seleccione una opción",
      searchPlaceholder = "Buscar…",
      emptyMessage = "Sin resultados",
      disabled = false,
      id,
      name,
      dataCy = "cy-combobox",
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const selected = useMemo(
      () => options.find((o) => o.id === value) ?? null,
      [options, value]
    );

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options.filter((o) => o.title.toLowerCase().includes(q));
    }, [options, query]);

    const close = () => {
      setOpen(false);
      setQuery("");
      onBlur?.();
    };

    // Close on outside click.
    useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) close();
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Focus the search box when opening.
    useEffect(() => {
      if (open) {
        setActiveIndex(0);
        searchRef.current?.focus();
      }
    }, [open]);

    const select = (option: ComboboxOption) => {
      onChange?.(option.id);
      setOpen(false);
      setQuery("");
      onBlur?.();
    };

    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const option = filtered[activeIndex];
        if (option) select(option);
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    const borderClass = error
      ? "border border-danger focus:border-danger shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
      : open
        ? "border border-primary shadow-[0_0_0_3px_rgba(113,42,226,0.10)]"
        : "border border-border-strong";

    return (
      <div className="flex flex-col gap-[0.8rem]" ref={containerRef}>
        {label && (
          <label
            htmlFor={id}
            className={[labelClasses, error ? "text-danger" : "text-text-muted"].join(" ")}
          >
            {label}
            {required && <span className="text-danger"> *</span>}
          </label>
        )}

        <div className="relative">
          <button
            ref={ref}
            type="button"
            id={id}
            name={name}
            data-cy={dataCy}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={[triggerBase, borderClass, className].filter(Boolean).join(" ")}
            onClick={() => !disabled && setOpen((v) => !v)}
            onBlur={() => {
              // Let clicks inside the panel land before firing blur.
              if (!open) onBlur?.();
            }}
          >
            <span className={selected ? "text-text" : "text-text-muted"}>
              {selected ? selected.title : placeholder}
            </span>
            <span className="flex items-center text-text-muted">
              <Icon name={open ? "expand_less" : "expand_more"} size={20} />
            </span>
          </button>

          {open && (
            <div className="absolute z-20 mt-[0.4rem] w-full overflow-hidden rounded-[0.8rem] border border-border-strong bg-surface shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)]">
              <div className="border-b border-border p-[0.8rem]">
                <div className="flex items-center gap-[0.6rem] rounded-[0.6rem] bg-background px-[1rem]">
                  <Icon name="search" size={16} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    placeholder={searchPlaceholder}
                    data-cy={`${dataCy}-search`}
                    autoComplete="off"
                    className="w-full bg-transparent py-[1rem] text-[1.3rem] text-text outline-none placeholder:text-text-muted"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={onSearchKeyDown}
                  />
                </div>
              </div>

              <ul role="listbox" className="max-h-[24rem] overflow-y-auto py-[0.4rem]">
                {filtered.length === 0 && (
                  <li className="px-[1.4rem] py-[1.2rem] text-[1.3rem] text-text-muted">
                    {emptyMessage}
                  </li>
                )}
                {filtered.map((option, i) => {
                  const isSelected = option.id === value;
                  const isActive = i === activeIndex;
                  return (
                    <li key={option.id} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        data-cy={`${dataCy}-option`}
                        className={[
                          "flex w-full items-center justify-between gap-[0.8rem] px-[1.4rem] py-[1rem] text-left text-[1.4rem] transition-colors",
                          isActive ? "bg-[rgba(113,42,226,0.08)]" : "bg-transparent",
                          isSelected ? "font-bold text-primary" : "text-text",
                        ].join(" ")}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => select(option)}
                      >
                        {option.title}
                        {isSelected && <Icon name="check" size={18} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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
);
