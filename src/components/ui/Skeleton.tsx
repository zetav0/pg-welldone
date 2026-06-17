import styled, { css, keyframes } from "styled-components";

/* ── Shimmer keyframe ────────────────────────────────── */
// Moves only background-position — no layout, no paint, compositor-only.

const shimmer = keyframes`
  0%   { background-position: 200% 50%; }
  100% { background-position: -200% 50%; }
`;

const animateCss = css`
  animation: ${shimmer} 1.8s ease-in-out infinite;
`;

/* ── Base atom ───────────────────────────────────────── */

const Atom = styled.div<{
  $w: string;
  $h: string;
  $r: string;
  $animate: boolean;
}>`
  display: block;
  width: ${(p) => p.$w};
  height: ${(p) => p.$h};
  border-radius: ${(p) => p.$r};
  flex-shrink: 0;
  background-color: ${(p) => p.theme.colors.surface};
  background-image: linear-gradient(
    90deg,
    transparent            0%,
    rgba(255, 255, 255, 0.07) 50%,
    transparent            100%
  );
  background-size: 400% 100%;
  ${(p) => p.$animate && animateCss}
`;

/* ── Base props & component ──────────────────────────── */

interface SkeletonProps {
  width?: string;
  height?: string;
  /** Border-radius override. Ignored when `circle` is true. */
  radius?: string;
  /** Forces border-radius 50% and uses width as height when height is omitted. */
  circle?: boolean;
  animate?: boolean;
  className?: string;
}

function SkeletonBase({
  width = "100%",
  height,
  radius,
  circle = false,
  animate = true,
  className,
}: SkeletonProps) {
  const h = height ?? (circle ? width : "1.4rem");
  const r = circle ? "50%" : (radius ?? "0.4rem");
  return (
    <Atom
      $w={width}
      $h={h}
      $r={r}
      $animate={animate}
      className={className}
      aria-hidden="true"
    />
  );
}

/* ── Skeleton.Text ───────────────────────────────────── */

const TextStack = styled.div<{ $gap: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap};
  width: 100%;
`;

interface SkeletonTextProps {
  lines?: number;
  /** Width of the last line to simulate natural text endings. */
  lastLineWidth?: string;
  lineHeight?: string;
  gap?: string;
  animate?: boolean;
  className?: string;
}

function SkeletonText({
  lines = 3,
  lastLineWidth = "60%",
  lineHeight = "1.4rem",
  gap = "0.8rem",
  animate = true,
  className,
}: SkeletonTextProps) {
  return (
    <TextStack $gap={gap} className={className} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBase
          key={i}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : "100%"}
          height={lineHeight}
          animate={animate}
        />
      ))}
    </TextStack>
  );
}

/* ── Skeleton.Avatar ─────────────────────────────────── */

const AVATAR_SIZE = {
  xs: "2.4rem",
  sm: "3.2rem",
  md: "4.0rem",
  lg: "5.6rem",
  xl: "7.2rem",
} as const;

interface SkeletonAvatarProps {
  size?: keyof typeof AVATAR_SIZE;
  animate?: boolean;
  className?: string;
}

function SkeletonAvatar({ size = "md", animate = true, className }: SkeletonAvatarProps) {
  const s = AVATAR_SIZE[size];
  return <SkeletonBase width={s} circle animate={animate} className={className} />;
}

/* ── Skeleton.Card ───────────────────────────────────── */

const CardShell = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const CardTopMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

interface SkeletonCardProps {
  showAvatar?: boolean;
  lines?: number;
  animate?: boolean;
  className?: string;
}

function SkeletonCard({
  showAvatar = true,
  lines = 3,
  animate = true,
  className,
}: SkeletonCardProps) {
  return (
    <CardShell className={className} aria-hidden="true">
      {showAvatar && (
        <CardTop>
          <SkeletonBase width="3.6rem" circle animate={animate} />
          <CardTopMeta>
            <SkeletonBase height="1.4rem" width="55%" animate={animate} />
            <SkeletonBase height="1.2rem" width="38%" animate={animate} />
          </CardTopMeta>
        </CardTop>
      )}
      <SkeletonText lines={lines} animate={animate} />
    </CardShell>
  );
}

/* ── Skeleton.KpiCard ────────────────────────────────── */
// Mirrors the layout of KpiCard (src/components/dashboard/KpiCard.tsx).

const KpiShell = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const KpiTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const KpiBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

interface SkeletonKpiCardProps {
  animate?: boolean;
  className?: string;
}

function SkeletonKpiCard({ animate = true, className }: SkeletonKpiCardProps) {
  return (
    <KpiShell className={className} aria-hidden="true">
      <KpiTop>
        {/* icon box */}
        <SkeletonBase width="3.8rem" height="3.8rem" radius="0.8rem" animate={animate} />
        {/* badge chip */}
        <SkeletonBase width="6rem" height="2.2rem" radius="0.4rem" animate={animate} />
      </KpiTop>
      <KpiBody>
        {/* label */}
        <SkeletonBase height="1.4rem" width="60%" animate={animate} />
        {/* big value */}
        <SkeletonBase height="3.2rem" width="42%" animate={animate} />
      </KpiBody>
    </KpiShell>
  );
}

/* ── Skeleton.Table ──────────────────────────────────── */

const TableShell = styled.div`
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 1.2rem;
`;

const TRow = styled.div<{ $header?: boolean }>`
  display: flex;
  gap: 1.6rem;
  padding: 1.2rem 2rem;
  background: ${(p) => (p.$header ? p.theme.colors.background : "transparent")};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TCell = styled.div`
  flex: 1;
  min-width: 0;
`;

// Deterministic pseudo-varying widths — avoids Math.random() SSR mismatches.
const cellW = (row: number, col: number) => `${70 + ((row * 7 + col * 13) % 25)}%`;

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
  animate?: boolean;
  className?: string;
}

function SkeletonTable({
  rows = 5,
  cols = 4,
  showHeader = true,
  animate = true,
  className,
}: SkeletonTableProps) {
  return (
    <TableShell className={className} aria-hidden="true">
      {showHeader && (
        <TRow $header>
          {Array.from({ length: cols }, (_, c) => (
            <TCell key={c}>
              <SkeletonBase height="1.4rem" width="58%" animate={animate} />
            </TCell>
          ))}
        </TRow>
      )}
      {Array.from({ length: rows }, (_, r) => (
        <TRow key={r}>
          {Array.from({ length: cols }, (_, c) => (
            <TCell key={c}>
              <SkeletonBase height="1.3rem" width={cellW(r, c)} animate={animate} />
            </TCell>
          ))}
        </TRow>
      ))}
    </TableShell>
  );
}

/* ── Compound export ─────────────────────────────────── */

export const Skeleton = Object.assign(SkeletonBase, {
  Text:    SkeletonText,
  Avatar:  SkeletonAvatar,
  Card:    SkeletonCard,
  KpiCard: SkeletonKpiCard,
  Table:   SkeletonTable,
});

export type { SkeletonProps, SkeletonTextProps, SkeletonAvatarProps, SkeletonCardProps, SkeletonKpiCardProps, SkeletonTableProps };
