import { useState, useMemo, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { Icon } from "./Icon";
import { Skeleton } from "./Skeleton";

/* ── Types ──────────────────────────────────────────────── */

export type TableVariant = "default" | "striped" | "bordered";
export type TableDensity  = "compact" | "default" | "comfortable";

export interface ColumnDef<T> {
  /** Property key used for default cell rendering and client-side sorting. */
  key: string;
  header: React.ReactNode;
  /** Custom cell renderer. Falls back to `String(row[key])`. */
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  /** CSS column width (e.g. "12rem", "20%"). */
  width?: string;
  /** Minimum CSS width — useful for text-heavy columns. */
  minWidth?: string;
}

export interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  /** Row identifier key — must uniquely identify each row. */
  keyField: keyof T;

  /* ── Sorting ── */
  /** Controlled sort key. Omit for uncontrolled client-side sort. */
  sortKey?: string;
  sortDir?: "asc" | "desc";
  /** Provide to switch to controlled sort mode. */
  onSort?: (key: string, dir: "asc" | "desc") => void;

  /* ── Selection ── */
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;

  /* ── State ── */
  loading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  emptyIcon?: string;

  /* ── Appearance ── */
  variant?: TableVariant;
  density?: TableDensity;
  /** Pin the header while body scrolls. Requires maxHeight. */
  stickyHeader?: boolean;
  maxHeight?: string;

  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

/* ── Density config ─────────────────────────────────────── */

const DENSITY: Record<TableDensity, { cell: string; head: string }> = {
  compact:     { cell: "0.7rem 1.2rem", head: "0.6rem 1.2rem" },
  default:     { cell: "1.2rem 1.6rem", head: "0.9rem 1.6rem" },
  comfortable: { cell: "1.8rem 2rem",   head: "1.4rem 2rem"   },
};

/* ── Styled primitives ──────────────────────────────────── */

const Wrapper = styled.div`
  position: relative;
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
`;

const ScrollArea = styled.div<{ $maxHeight?: string }>`
  overflow-x: auto;
  overflow-y: ${(p) => (p.$maxHeight ? "auto" : "visible")};
  max-height: ${(p) => p.$maxHeight ?? "none"};

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${(p) => p.theme.colors.borderStrong} transparent;
  &::-webkit-scrollbar { height: 0.5rem; width: 0.5rem; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.borderStrong};
    border-radius: 9999px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 56rem;
  border-collapse: collapse;
  font-size: 1.3rem;
  font-family: ${(p) => p.theme.fonts.sans};
`;

const Thead = styled.thead<{ $sticky: boolean }>`
  ${(p) =>
    p.$sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 1;
    `}
  background: ${(p) => p.theme.colors.background};
`;

const Th = styled.th<{
  $align: string;
  $sortable: boolean;
  $active: boolean;
  $density: TableDensity;
  $width?: string;
  $minWidth?: string;
}>`
  padding: ${(p) => DENSITY[p.$density].head};
  text-align: ${(p) => p.$align};
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  border-bottom: 1px solid ${(p) => p.theme.colors.borderStrong};
  cursor: ${(p) => (p.$sortable ? "pointer" : "default")};
  user-select: none;
  width: ${(p) => p.$width ?? "auto"};
  min-width: ${(p) => p.$minWidth ?? "auto"};
  transition: color 0.14s;

  ${(p) =>
    p.$sortable &&
    css`
      &:hover {
        color: ${p.theme.colors.text};
      }
    `}
`;

const ThContent = styled.span<{ $align: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: ${(p) =>
    p.$align === "right" ? "flex-end" : p.$align === "center" ? "center" : "flex-start"};
  width: 100%;
`;

const SortIconWrap = styled.span<{ $active: boolean }>`
  display: inline-flex;
  opacity: ${(p) => (p.$active ? 1 : 0.35)};
  flex-shrink: 0;
  transition: opacity 0.14s;
`;

const BodyTr = styled.tr<{
  $clickable: boolean;
  $selected: boolean;
  $striped: boolean;
  $bordered: boolean;
}>`
  border-bottom: 1px solid
    ${(p) => (p.$bordered ? p.theme.colors.borderStrong : p.theme.colors.border)};
  transition: background 0.12s;

  ${(p) =>
    p.$selected &&
    css`
      background: ${p.theme.colors.primaryBg} !important;
    `}

  ${(p) =>
    p.$striped &&
    css`
      &:nth-child(odd):not(:where(&)) {
        background: rgba(255, 255, 255, 0.018);
      }
    `}

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
  }

  ${(p) => p.$clickable && css`cursor: pointer;`}

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td<{
  $align: string;
  $density: TableDensity;
  $bordered: boolean;
}>`
  padding: ${(p) => DENSITY[p.$density].cell};
  text-align: ${(p) => p.$align};
  color: ${(p) => p.theme.colors.text};
  vertical-align: middle;
  line-height: 1.4;

  ${(p) =>
    p.$bordered &&
    css`
      border-right: 1px solid ${p.theme.colors.border};
      &:last-child {
        border-right: none;
      }
    `}
`;

/* Checkbox column */
const CheckTh = styled.th<{ $density: TableDensity }>`
  padding: ${(p) => DENSITY[p.$density].head};
  width: 4.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderStrong};
`;

const CheckTd = styled.td<{ $density: TableDensity }>`
  padding: ${(p) => DENSITY[p.$density].cell};
  width: 4.4rem;
  vertical-align: middle;
`;

const CheckInput = styled.input`
  width: 1.55rem;
  height: 1.55rem;
  cursor: pointer;
  accent-color: ${(p) => p.theme.colors.primary};
  display: block;
`;

/* Empty state */
const EmptyTd = styled.td`
  padding: 4.8rem 2rem;
  text-align: center;
  color: ${(p) => p.theme.colors.textMuted};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const EmptyMsg = styled.p`
  margin: 0;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Sort helpers ───────────────────────────────────────── */

function clientSort<T extends object>(
  data: T[],
  key: string,
  dir: "asc" | "desc",
): T[] {
  return [...data].sort((a, b) => {
    const av = (a as Record<string, unknown>)[key];
    const bv = (b as Record<string, unknown>)[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv), "es", { sensitivity: "base" });
    return dir === "asc" ? cmp : -cmp;
  });
}

/* ── Component ──────────────────────────────────────────── */

export function Table<T extends object>({
  columns,
  data,
  keyField,
  sortKey: controlledSortKey,
  sortDir: controlledSortDir,
  onSort,
  selectable = false,
  selectedKeys: controlledSelected,
  onSelectionChange,
  loading = false,
  skeletonRows = 5,
  emptyMessage = "Sin datos disponibles",
  emptyIcon = "inbox",
  variant = "default",
  density = "default",
  stickyHeader = false,
  maxHeight,
  onRowClick,
  className,
}: TableProps<T>) {
  /* ── Sort state ── */
  const isControlledSort = onSort !== undefined;
  const [intSortKey, setIntSortKey] = useState<string | null>(null);
  const [intSortDir, setIntSortDir] = useState<"asc" | "desc">("asc");

  const activeSortKey = isControlledSort ? (controlledSortKey ?? null) : intSortKey;
  const activeSortDir = isControlledSort ? (controlledSortDir ?? "asc") : intSortDir;

  function handleSort(key: string) {
    const nextDir =
      activeSortKey === key && activeSortDir === "asc" ? "desc" : "asc";
    if (isControlledSort) {
      onSort!(key, nextDir);
    } else {
      setIntSortKey(key);
      setIntSortDir(nextDir);
    }
  }

  const sortedData = useMemo(
    () =>
      !isControlledSort && activeSortKey
        ? clientSort(data, activeSortKey, activeSortDir)
        : data,
    [data, isControlledSort, activeSortKey, activeSortDir],
  );

  /* ── Selection state ── */
  const isControlledSel = controlledSelected !== undefined;
  const [intSelected, setIntSelected] = useState<Set<string | number>>(new Set());

  const selected = isControlledSel ? controlledSelected! : intSelected;

  function setSelected(next: Set<string | number>) {
    if (!isControlledSel) setIntSelected(next);
    onSelectionChange?.(next);
  }

  const rowKey = (row: T) => String(row[keyField]);

  function toggleRow(key: string | number) {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    setSelected(next);
  }

  function toggleAll() {
    if (selected.size === sortedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedData.map((r) => rowKey(r))));
    }
  }

  /* ── Select-all indeterminate ref ── */
  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!selectAllRef.current) return;
    const all = sortedData.length > 0 && selected.size === sortedData.length;
    const some = selected.size > 0 && selected.size < sortedData.length;
    selectAllRef.current.checked = all;
    selectAllRef.current.indeterminate = some;
  });

  const bordered = variant === "bordered";
  const striped  = variant === "striped";

  /* ── Render ── */
  return (
    <Wrapper className={className}>
      <ScrollArea $maxHeight={maxHeight}>
        <StyledTable>
          <Thead $sticky={stickyHeader}>
            <tr>
              {selectable && (
                <CheckTh $density={density}>
                  <CheckInput
                    ref={selectAllRef}
                    type="checkbox"
                    onChange={toggleAll}
                    aria-label="Seleccionar todo"
                  />
                </CheckTh>
              )}
              {columns.map((col) => {
                const isActive = activeSortKey === col.key;
                const sortIcon = isActive
                  ? activeSortDir === "asc"
                    ? "keyboard_arrow_up"
                    : "keyboard_arrow_down"
                  : "unfold_more";

                return (
                  <Th
                    key={col.key}
                    $align={col.align ?? "left"}
                    $sortable={!!col.sortable}
                    $active={isActive}
                    $density={density}
                    $width={col.width}
                    $minWidth={col.minWidth}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    aria-sort={
                      isActive
                        ? activeSortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    <ThContent $align={col.align ?? "left"}>
                      {col.header}
                      {col.sortable && (
                        <SortIconWrap $active={isActive}>
                          <Icon name={sortIcon} size={14} />
                        </SortIconWrap>
                      )}
                    </ThContent>
                  </Th>
                );
              })}
            </tr>
          </Thead>

          <tbody>
            {/* Skeleton rows */}
            {loading &&
              Array.from({ length: skeletonRows }, (_, i) => (
                <BodyTr
                  key={`sk-${i}`}
                  $clickable={false}
                  $selected={false}
                  $striped={false}
                  $bordered={bordered}
                >
                  {selectable && <CheckTd $density={density} />}
                  {columns.map((col, ci) => (
                    <Td
                      key={col.key}
                      $align={col.align ?? "left"}
                      $density={density}
                      $bordered={bordered}
                    >
                      <Skeleton
                        width={`${65 + ((i * 7 + ci * 13) % 25)}%`}
                        height="1.4rem"
                      />
                    </Td>
                  ))}
                </BodyTr>
              ))}

            {/* Empty state */}
            {!loading && sortedData.length === 0 && (
              <tr>
                <EmptyTd colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState>
                    <Icon name={emptyIcon} size={38} />
                    <EmptyMsg>{emptyMessage}</EmptyMsg>
                  </EmptyState>
                </EmptyTd>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              sortedData.map((row, i) => {
                const key = rowKey(row);
                const isSelected = selected.has(key);

                return (
                  <BodyTr
                    key={key}
                    $clickable={!!onRowClick}
                    $selected={isSelected}
                    $striped={striped && i % 2 === 1}
                    $bordered={bordered}
                    onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                  >
                    {selectable && (
                      <CheckTd $density={density}>
                        <CheckInput
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Seleccionar fila ${i + 1}`}
                        />
                      </CheckTd>
                    )}
                    {columns.map((col) => {
                      const val = (row as Record<string, unknown>)[col.key];
                      return (
                        <Td
                          key={col.key}
                          $align={col.align ?? "left"}
                          $density={density}
                          $bordered={bordered}
                        >
                          {col.render
                            ? col.render(row, i)
                            : val != null
                              ? String(val)
                              : "—"}
                        </Td>
                      );
                    })}
                  </BodyTr>
                );
              })}
          </tbody>
        </StyledTable>
      </ScrollArea>
    </Wrapper>
  );
}
