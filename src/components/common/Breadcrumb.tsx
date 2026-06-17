import { useState } from "react";
import styled from "styled-components";
import { Icon } from "../ui/Icon";

/* ── Types ───────────────────────────────────────────── */

export interface BreadcrumbItem {
  /** Visible text. */
  label: string;
  /** Optional href — rendered as an anchor when present. */
  href?: string;
  /** Optional leading Material Symbol ligature (e.g. "home"). */
  icon?: string;
  /** Click handler — receives the item. Call e.preventDefault() to stay in-app. */
  onClick?: (e: React.MouseEvent) => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Custom separator node. Defaults to a chevron icon. */
  separator?: React.ReactNode;
  /**
   * Collapse the middle items with an expandable "…" when the list is longer
   * than this. `0` (default) disables collapsing. Keeps the first and the last
   * two items visible.
   */
  maxItems?: number;
  className?: string;
}

/* ── Styled ──────────────────────────────────────────── */

const Nav = styled.nav`
  width: 100%;
`;

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
`;

const crumbBase = `
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 24rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.6rem;
  font-size: 1.3rem;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CrumbLink = styled.a`
  ${crumbBase};
  color: ${(p) => p.theme.colors.textMuted};
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.chipBg};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 1px;
  }
`;

const CrumbCurrent = styled.span`
  ${crumbBase};
  color: ${(p) => p.theme.colors.text};
  font-weight: 700;
`;

const EllipsisButton = styled.button`
  ${crumbBase};
  color: ${(p) => p.theme.colors.textMuted};
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.chipBg};
  }
`;

const Separator = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${(p) => p.theme.colors.textMuted};
  flex-shrink: 0;
  user-select: none;
`;

/* ── Component ────────────────────────────────────────── */

export function Breadcrumb({ items, separator, maxItems = 0, className }: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);

  const sep = separator ?? (
    <Separator aria-hidden="true">
      <Icon name="chevron_right" size={16} />
    </Separator>
  );

  // Decide which items to render (with an optional collapsed middle).
  const shouldCollapse = maxItems > 0 && !expanded && items.length > maxItems;

  type Rendered = { kind: "item"; item: BreadcrumbItem; index: number } | { kind: "ellipsis" };

  const rendered: Rendered[] = shouldCollapse
    ? [
        { kind: "item", item: items[0], index: 0 },
        { kind: "ellipsis" },
        ...items.slice(-2).map((item, i) => ({
          kind: "item" as const,
          item,
          index: items.length - 2 + i,
        })),
      ]
    : items.map((item, index) => ({ kind: "item" as const, item, index }));

  return (
    <Nav aria-label="Breadcrumb" className={className}>
      <List>
        {rendered.map((entry, i) => {
          const isLastNode = i === rendered.length - 1;

          if (entry.kind === "ellipsis") {
            return (
              <Item key="ellipsis">
                <EllipsisButton
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-label="Mostrar rutas ocultas"
                  title="Mostrar todo"
                >
                  <Icon name="more_horiz" size={18} />
                </EllipsisButton>
                {!isLastNode && sep}
              </Item>
            );
          }

          const { item, index } = entry;
          const isCurrent = index === items.length - 1;

          return (
            <Item key={`${item.label}-${index}`}>
              {isCurrent ? (
                <CrumbCurrent aria-current="page">
                  {item.icon && <Icon name={item.icon} size={16} />}
                  {item.label}
                </CrumbCurrent>
              ) : (
                <CrumbLink href={item.href ?? "#"} onClick={item.onClick}>
                  {item.icon && <Icon name={item.icon} size={16} />}
                  {item.label}
                </CrumbLink>
              )}
              {!isCurrent && !isLastNode && sep}
            </Item>
          );
        })}
      </List>
    </Nav>
  );
}
