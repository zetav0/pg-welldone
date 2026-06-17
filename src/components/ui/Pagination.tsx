import styled, { css } from "styled-components";
import { Icon } from "./Icon";

/* ── Types ──────────────────────────────────────────────── */

export type PaginationSize = "sm" | "md" | "lg";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

/* ── Layout constants ───────────────────────────────────── */

const SIZE = {
  sm: { btn: "2.8rem", font: "1.1rem", icon: 14, infoFont: "1.1rem", gap: "0.3rem" },
  md: { btn: "3.4rem", font: "1.3rem", icon: 16, infoFont: "1.2rem", gap: "0.4rem" },
  lg: { btn: "4.0rem", font: "1.5rem", icon: 18, infoFont: "1.4rem", gap: "0.5rem" },
} as const;

/* ── Algorithm ──────────────────────────────────────────── */

function buildPageRange(
  page: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PageItem[] {
  const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
  const range = (lo: number, hi: number): number[] =>
    Array.from({ length: Math.max(hi - lo + 1, 0) }, (_, i) => lo + i);

  const start = range(1, Math.min(boundaryCount, totalPages));
  const end = range(Math.max(totalPages - boundaryCount + 1, 1), totalPages);
  const mid = range(
    clamp(page - siblingCount, 1, totalPages),
    clamp(page + siblingCount, 1, totalPages),
  );

  const nums = [...new Set([...start, ...mid, ...end])].sort((a, b) => a - b);

  const out: PageItem[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] - nums[i - 1] > 1) {
      out.push(nums[i - 1] < page ? "start-ellipsis" : "end-ellipsis");
    }
    out.push(nums[i]);
  }
  return out;
}

/* ── Shared styled primitives ───────────────────────────── */

const PageBtn = styled.button<{ $active: boolean; $size: PaginationSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${(p) => SIZE[p.$size].btn};
  height: ${(p) => SIZE[p.$size].btn};
  padding: 0 0.5rem;
  border-radius: 0.7rem;
  font-size: ${(p) => SIZE[p.$size].font};
  font-family: ${(p) => p.theme.fonts.sans};
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  border: 1px solid;
  transition: background 0.14s, color 0.14s, border-color 0.14s, transform 0.1s,
    box-shadow 0.14s;

  ${(p) =>
    p.$active
      ? css`
          background: ${p.theme.colors.primary};
          border-color: ${p.theme.colors.primary};
          color: ${p.theme.colors.white};
          box-shadow: 0 2px 8px rgba(0, 108, 117, 0.4);
        `
      : css`
          background: transparent;
          border-color: ${p.theme.colors.borderStrong};
          color: ${p.theme.colors.textSubtle};
          &:hover:not(:disabled) {
            background: ${p.theme.colors.chipBg};
            color: ${p.theme.colors.text};
            border-color: ${p.theme.colors.borderStrong};
          }
          &:active:not(:disabled) {
            transform: scale(0.93);
          }
        `}

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

const NavBtn = styled.button<{ $size: PaginationSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => SIZE[p.$size].btn};
  height: ${(p) => SIZE[p.$size].btn};
  border-radius: 0.7rem;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  transition: background 0.14s, color 0.14s, border-color 0.14s, transform 0.1s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.chipBg};
    color: ${(p) => p.theme.colors.text};
    border-color: ${(p) => p.theme.colors.primary};
  }
  &:active:not(:disabled) {
    transform: scale(0.93);
  }
  &:disabled {
    opacity: 0.28;
    cursor: not-allowed;
  }
`;

const EllipsisEl = styled.span<{ $size: PaginationSize }>`
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  min-width: ${(p) => SIZE[p.$size].btn};
  height: ${(p) => SIZE[p.$size].btn};
  font-size: ${(p) => SIZE[p.$size].font};
  color: ${(p) => p.theme.colors.textMuted};
  user-select: none;
  pointer-events: none;
  padding-bottom: 0.4rem;
  letter-spacing: 0.08em;
`;

const PagesWrap = styled.div<{ $gap: string }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.$gap};
`;

/* ── Pagination.Pages ───────────────────────────────────── */

export interface PaginationPagesProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page. Default 1. */
  siblingCount?: number;
  /** Pages always shown at each boundary (first/last). Default 1. */
  boundaryCount?: number;
  /** Show first/last jump buttons. Default true. */
  showFirstLast?: boolean;
  size?: PaginationSize;
  disabled?: boolean;
  className?: string;
}

function PaginationPages({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  size = "md",
  disabled = false,
  className,
}: PaginationPagesProps) {
  const safe = Math.max(1, totalPages);
  const cur = Math.min(Math.max(1, page), safe);
  const items = buildPageRange(cur, safe, siblingCount, boundaryCount);
  const s = SIZE[size];

  const go = (p: number) => {
    if (!disabled && p >= 1 && p <= safe && p !== cur) onPageChange(p);
  };

  return (
    <PagesWrap $gap={s.gap} role="navigation" aria-label="Paginación" className={className}>
      {showFirstLast && (
        <NavBtn
          $size={size}
          onClick={() => go(1)}
          disabled={disabled || cur === 1}
          aria-label="Primera página"
          type="button"
        >
          <Icon name="first_page" size={s.icon} />
        </NavBtn>
      )}

      <NavBtn
        $size={size}
        onClick={() => go(cur - 1)}
        disabled={disabled || cur === 1}
        aria-label="Página anterior"
        type="button"
      >
        <Icon name="chevron_left" size={s.icon} />
      </NavBtn>

      {items.map((item) => {
        if (item === "start-ellipsis" || item === "end-ellipsis") {
          return (
            <EllipsisEl key={item} $size={size} aria-hidden="true">
              •••
            </EllipsisEl>
          );
        }
        return (
          <PageBtn
            key={item}
            $size={size}
            $active={item === cur}
            onClick={() => go(item)}
            disabled={disabled}
            aria-label={`Página ${item}`}
            aria-current={item === cur ? "page" : undefined}
            type="button"
          >
            {item}
          </PageBtn>
        );
      })}

      <NavBtn
        $size={size}
        onClick={() => go(cur + 1)}
        disabled={disabled || cur === safe}
        aria-label="Página siguiente"
        type="button"
      >
        <Icon name="chevron_right" size={s.icon} />
      </NavBtn>

      {showFirstLast && (
        <NavBtn
          $size={size}
          onClick={() => go(safe)}
          disabled={disabled || cur === safe}
          aria-label="Última página"
          type="button"
        >
          <Icon name="last_page" size={s.icon} />
        </NavBtn>
      )}
    </PagesWrap>
  );
}

/* ── Pagination.Info ────────────────────────────────────── */

const InfoText = styled.p<{ $size: PaginationSize }>`
  margin: 0;
  font-size: ${(p) => SIZE[p.$size].infoFont};
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  line-height: 1;

  strong {
    color: ${(p) => p.theme.colors.textSubtle};
    font-weight: 600;
  }
`;

export interface PaginationInfoProps {
  page: number;
  pageSize: number;
  totalItems: number;
  size?: PaginationSize;
  className?: string;
}

function PaginationInfo({ page, pageSize, totalItems, size = "md", className }: PaginationInfoProps) {
  const from = Math.min((page - 1) * pageSize + 1, totalItems);
  const to = Math.min(page * pageSize, totalItems);
  return (
    <InfoText $size={size} className={className}>
      <strong>{from}–{to}</strong> de <strong>{totalItems.toLocaleString("es")}</strong> resultados
    </InfoText>
  );
}

/* ── Pagination.Sizer ───────────────────────────────────── */

const SizerRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const SizerLabel = styled.span<{ $size: PaginationSize }>`
  font-size: ${(p) => SIZE[p.$size].infoFont};
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
`;

const SelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const SizerSelect = styled.select<{ $size: PaginationSize }>`
  appearance: none;
  -webkit-appearance: none;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.6rem;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => SIZE[p.$size].infoFont};
  font-family: ${(p) => p.theme.fonts.sans};
  padding: 0.4rem 2.4rem 0.4rem 0.9rem;
  min-width: 5.5rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.14s;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

const SelectChevron = styled.span`
  position: absolute;
  right: 0.4rem;
  font-size: 1.6rem;
  color: ${(p) => p.theme.colors.textMuted};
  pointer-events: none;
  line-height: 1;
`;

export interface PaginationSizerProps {
  pageSize: number;
  options?: number[];
  onChange: (size: number) => void;
  size?: PaginationSize;
  disabled?: boolean;
  className?: string;
}

function PaginationSizer({
  pageSize,
  options = [10, 25, 50, 100],
  onChange,
  size = "md",
  disabled = false,
  className,
}: PaginationSizerProps) {
  return (
    <SizerRoot className={className}>
      <SizerLabel $size={size}>Por página</SizerLabel>
      <SelectWrap>
        <SizerSelect
          $size={size}
          value={pageSize}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </SizerSelect>
        <SelectChevron className="material-symbols-outlined">expand_more</SelectChevron>
      </SelectWrap>
    </SizerRoot>
  );
}

/* ── Main Pagination ────────────────────────────────────── */

const Root = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-left: auto;
  flex-wrap: wrap;
`;

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Total item count — enables the info text when provided. */
  totalItems?: number;
  /** Current page size — required when totalItems is set. */
  pageSize?: number;
  /** Enables the page-size selector when provided alongside pageSize. */
  onPageSizeChange?: (size: number) => void;
  /** Options for the page-size selector. Default [10, 25, 50, 100]. */
  pageSizeOptions?: number[];
  /** Pages flanking the current page. Default 1. */
  siblingCount?: number;
  /** Pages pinned at each end. Default 1. */
  boundaryCount?: number;
  showFirstLast?: boolean;
  size?: PaginationSize;
  disabled?: boolean;
  className?: string;
}

function PaginationBase({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  size = "md",
  disabled = false,
  className,
}: PaginationProps) {
  const showInfo = totalItems != null && pageSize != null;
  const showSizer = showInfo && onPageSizeChange != null;

  return (
    <Root aria-label="Paginación" className={className}>
      {showInfo && (
        <PaginationInfo
          page={page}
          pageSize={pageSize!}
          totalItems={totalItems!}
          size={size}
        />
      )}
      <RightGroup>
        {showSizer && (
          <PaginationSizer
            pageSize={pageSize!}
            options={pageSizeOptions}
            onChange={onPageSizeChange!}
            size={size}
            disabled={disabled}
          />
        )}
        <PaginationPages
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          siblingCount={siblingCount}
          boundaryCount={boundaryCount}
          showFirstLast={showFirstLast}
          size={size}
          disabled={disabled}
        />
      </RightGroup>
    </Root>
  );
}

/* ── Compound export ────────────────────────────────────── */

export const Pagination = Object.assign(PaginationBase, {
  Pages: PaginationPages,
  Info:  PaginationInfo,
  Sizer: PaginationSizer,
});
