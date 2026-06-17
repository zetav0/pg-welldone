import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "../ui/Icon";

export interface SearchSelectOption {
  id: string;
  title: string;
}

interface SearchSelectCustomProps {
  label?: string;
  required?: boolean;
  error?: string;
  value?: string | null;
  options?: SearchSelectOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  dataCy?: string;
  className?: string;
}

const triggerBase = [
  "w-full box-border flex items-center justify-between gap-[0.8rem]",
  "rounded-[0.8rem] bg-background",
  "text-[1.4rem] font-medium leading-[2rem]",
  "py-[1.4rem] pl-[1.4rem] pr-[1.2rem]",
  "outline-none cursor-pointer text-left",
  "transition-[border-color,box-shadow] duration-150",
  "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70",
].join(" ");

export const SearchSelectCustom = forwardRef<HTMLButtonElement, SearchSelectCustomProps>(
  function SearchSelectCustom(
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
      dataCy = "cy-search-select",
      className,
    },
    ref
  ) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const searchRef = useRef<HTMLInputElement | null>(null);

    const selected = useMemo(
      () => options.find((o) => o.id === value) ?? null,
      [options, value]
    );

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options.filter((o) => o.title.toLowerCase().includes(q));
    }, [options, query]);

    useEffect(() => {
      if (open) {
        setQuery("");
        setActiveIndex(0);
        const t = setTimeout(() => searchRef.current?.focus(), 30);
        return () => clearTimeout(t);
      }
    }, [open]);

    const handleClose = () => {
      setOpen(false);
      onBlur?.();
    };

    const handleSelect = (option: SearchSelectOption) => {
      onChange?.(option.id);
      handleClose();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[activeIndex]) handleSelect(filtered[activeIndex]);
          break;
        case "Escape":
          e.preventDefault();
          handleClose();
          break;
      }
    };

    const borderClass = error
      ? "border border-danger shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
      : open
        ? "border border-primary shadow-[0_0_0_3px_rgba(113,42,226,0.10)]"
        : "border border-border-strong hover:border-primary/60";

    return (
      <div className="flex flex-col gap-[0.8rem]">
        {label && (
          <label
            htmlFor={id}
            className={[
              "text-[1rem] font-bold uppercase tracking-[0.1em]",
              error ? "text-danger" : "text-text-muted",
            ].join(" ")}
          >
            {label}
            {required && <span className="text-danger"> *</span>}
          </label>
        )}

        <Popover.Root
          open={open}
          onOpenChange={(v) => {
            if (!v) handleClose();
            else setOpen(true);
          }}
        >
          <Popover.Trigger asChild>
            <button
              ref={ref}
              type="button"
              id={id}
              name={name}
              data-cy={dataCy}
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-invalid={Boolean(error)}
              className={[triggerBase, borderClass, className].filter(Boolean).join(" ")}
            >
              <span className={selected ? "text-text truncate" : "text-text-muted"}>
                {selected ? selected.title : placeholder}
              </span>
              <span className="flex items-center shrink-0 text-text-muted">
                <Icon name={open ? "expand_less" : "expand_more"} size={20} />
              </span>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              sideOffset={4}
              align="start"
              avoidCollisions
              collisionPadding={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
              style={{
                width: "var(--radix-popover-trigger-width)",
                zIndex: 9999,
              }}
              className={[
                "overflow-hidden rounded-[0.8rem]",
                "border border-border-strong bg-surface",
                "shadow-[0_12px_32px_-8px_rgba(0,0,0,0.22),0_2px_8px_-2px_rgba(0,0,0,0.08)]",
              ].join(" ")}
            >
              {/* Search */}
              <div className="border-b border-border p-[0.8rem]">
                <div className="flex items-center gap-[0.6rem] rounded-[0.6rem] bg-background px-[1rem]">
                  <span className="shrink-0 text-text-muted">
                    <Icon name="search" size={16} />
                  </span>
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
                    onKeyDown={onKeyDown}
                  />
                  {query && (
                    <button
                      type="button"
                      className="shrink-0 flex items-center text-text-muted hover:text-text transition-colors"
                      tabIndex={-1}
                      onClick={() => {
                        setQuery("");
                        setActiveIndex(0);
                        searchRef.current?.focus();
                      }}
                    >
                      <Icon name="close" size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Options */}
              <ul
                role="listbox"
                className="max-h-[22rem] overflow-y-auto py-[0.4rem]"
              >
                {filtered.length === 0 ? (
                  <li className="px-[1.6rem] py-[1.4rem] text-[1.3rem] text-text-muted">
                    {emptyMessage}
                  </li>
                ) : (
                  filtered.map((option, i) => {
                    const isSelected = option.id === value;
                    const isActive   = i === activeIndex;
                    return (
                      <li key={option.id} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          data-cy={`${dataCy}-option`}
                          className={[
                            "flex w-full items-center justify-between gap-[0.8rem]",
                            "px-[1.4rem] py-[1rem] text-left text-[1.4rem]",
                            "transition-colors duration-100",
                            isActive   ? "bg-primary/[0.07]"     : "bg-transparent",
                            isSelected ? "font-semibold text-primary" : "text-text",
                          ].join(" ")}
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => handleSelect(option)}
                        >
                          <span className="truncate">{option.title}</span>
                          {isSelected && (
                            <span className="shrink-0 text-primary">
                              <Icon name="check" size={18} />
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

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
