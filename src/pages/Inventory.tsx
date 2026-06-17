import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { PageShell } from "../components/layout/PageShell";
import { Icon } from "../components/ui/Icon";
import {
  products,
  inventoryStats,
  filterCategories,
  adjustmentReasons,
  type Product,
  type StockStatus,
} from "../data/inventory";
import type { TrendType } from "../data/dashboard";

/* ════════════════════════════════════════════════════
   PAGE CONTENT AREA
════════════════════════════════════════════════════ */

const ContentArea = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1.6rem;
    gap: 1.6rem;
  }
`;

/* ── Stats ──────────────────────────────────────────── */

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.6rem;
`;

const StatCard = styled(motion.div)<{ $alert?: "danger" | "warning" }>`
  background: ${(p) => p.theme.colors.surface};
  padding: 2rem;
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: ${(p) =>
    p.$alert === "danger"
      ? "0 0 0 1px rgba(239,68,68,0.25)"
      : p.$alert === "warning"
        ? "0 0 0 1px rgba(234,179,8,0.25)"
        : "0 1px 2px rgba(0,0,0,0.05)"};
`;

const StatCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
`;

const StatLabel = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const StatIconWrapper = styled.span<{ $color?: string }>`
  color: ${(p) => p.$color ?? p.theme.colors.textMuted};
  display: flex;
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
`;

const StatValue = styled.p`
  margin: 0;
  font-size: 2.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

const StatTrend = styled.p<{ $type: TrendType }>`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) =>
    p.$type === "success"
      ? p.theme.colors.success
      : p.$type === "danger"
        ? p.theme.colors.danger
        : p.theme.colors.textMuted};
`;

/* ── Filter bar ─────────────────────────────────────── */

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
`;

const PillsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;
`;

const FilterPill = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1.6rem;
  border-radius: 9999px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: all 0.15s;

  background: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.surface)};
  color: ${(p) => (p.$active ? p.theme.colors.white : p.theme.colors.textMuted)};
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};

  &:hover {
    border-color: ${(p) => !p.$active && p.theme.colors.primaryBgStrong};
  }
`;

const AdvancedFiltersBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

/* ── Table + Side panel row ─────────────────────────── */

const ContentRow = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

/* Horizontal scroll wrapper so the wide table never overflows the viewport. */
const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

/* ── Product table ──────────────────────────────────── */

const TableCard = styled.div`
  flex: 1;
  min-width: 0;
  background: ${(p) => p.theme.colors.surface};
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  min-width: 56rem;
  text-align: left;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const Th = styled.th`
  padding: 1.6rem 2.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
`;

const Tbody = styled.tbody`
  tr + tr {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }
`;

const TableRow = styled.tr<{ $status: StockStatus; $selected: boolean }>`
  transition: background 0.15s;
  border-left: ${(p) =>
    p.$status === "warning"
      ? `2px solid ${p.theme.colors.warning}`
      : p.$status === "critical"
        ? `2px solid ${p.theme.colors.danger}`
        : "none"};
  background: ${(p) =>
    p.$selected
      ? p.theme.colors.primaryBg
      : p.$status === "warning"
        ? "rgba(234,179,8,0.03)"
        : p.$status === "critical"
          ? "rgba(239,68,68,0.03)"
          : "transparent"};
  cursor: pointer;

  &:hover {
    background: ${(p) =>
      p.$selected
        ? p.theme.colors.primaryBg
        : p.$status === "warning"
          ? "rgba(234,179,8,0.06)"
          : p.$status === "critical"
            ? "rgba(239,68,68,0.06)"
            : "rgba(255,255,255,0.02)"};
  }
`;

const Td = styled.td`
  padding: 1.6rem 2.4rem;
`;

const ProductName = styled.span`
  display: block;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const ProductCategory = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  margin-top: 0.2rem;
`;

const SkuCode = styled.code`
  font-size: 1.2rem;
  font-family: ui-monospace, monospace;
  padding: 0.2rem 0.8rem;
  border-radius: 0.4rem;
  background: ${(p) => p.theme.colors.chipBg};
  color: ${(p) => p.theme.colors.textMuted};
`;

const StockCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const StockTrack = styled.div`
  width: 9.6rem;
  height: 0.6rem;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
  flex-shrink: 0;
`;

const StockFill = styled(motion.div)<{ $pct: number; $status: StockStatus }>`
  height: 100%;
  border-radius: 9999px;
  background: ${(p) =>
    p.$status === "healthy"
      ? p.theme.colors.success
      : p.$status === "warning"
        ? p.theme.colors.warning
        : p.theme.colors.danger};
`;

const StockNum = styled.span<{ $status: StockStatus }>`
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${(p) =>
    p.$status === "healthy"
      ? p.theme.colors.text
      : p.$status === "warning"
        ? p.theme.colors.warning
        : p.theme.colors.danger};
`;

const ExpiryText = styled.span<{ $status: StockStatus }>`
  font-size: 1.2rem;
  font-weight: ${(p) => (p.$status !== "healthy" ? 700 : 400)};
  color: ${(p) =>
    p.$status === "healthy"
      ? p.theme.colors.textMuted
      : p.$status === "warning"
        ? p.theme.colors.warning
        : p.theme.colors.danger};
`;

const EditBtn = styled.button`
  padding: 0.4rem;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const TableFooter = styled.div`
  padding: 1.6rem 2.4rem;
  background: rgba(15, 23, 42, 0.3);
  border-top: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterInfo = styled.span`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const PageBtns = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const PageBtn = styled.button`
  padding: 0.4rem 0.6rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.6rem;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

/* ── Quick Edit panel ───────────────────────────────── */

const EditPanel = styled(motion.aside)`
  width: 30rem;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: sticky;
  top: 1.6rem;

  @media (max-width: 1024px) {
    width: 100%;
    position: static;
  }
`;

const EditPanelHeader = styled.div`
  padding: 1.6rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.primaryBg};
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${(p) => p.theme.colors.primary};
`;

const EditPanelTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const EditBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SelectionBox = styled.div`
  padding: 1.2rem;
  background: ${(p) => p.theme.colors.inputBg};
  border-radius: 0.8rem;
`;

const SelectionMeta = styled.p`
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SelectionName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const SelectionSku = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  font-family: ui-monospace, monospace;
  color: ${(p) => p.theme.colors.primary};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.6rem;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const QtyBtn = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.6rem;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.15s,
    background 0.15s;
  flex-shrink: 0;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primaryBg};
  }
`;

const QtyInput = styled.input`
  flex: 1;
  min-width: 0;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.6rem;
  padding: 0.6rem 0.8rem;
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.6rem;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.6rem;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  font-family: ui-monospace, monospace;
  color: ${(p) => p.theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: background 0.15s;
  box-shadow: 0 4px 6px -1px rgba(113, 42, 226, 0.25);

  &:hover {
    background: rgba(113, 42, 226, 0.9);
  }
`;

const CancelBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
  }
`;

const AuditNote = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
  font-style: italic;
  line-height: 1.5;
  padding: 1.6rem 2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: rgba(15, 23, 42, 0.3);
`;

/* ════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════ */

export default function Inventory() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[1]);
  const [quantity, setQuantity] = useState(products[1].stock);
  const [reason, setReason] = useState(adjustmentReasons[0]);
  const [batch, setBatch] = useState(products[1].batch);
  const [activeFilter, setActiveFilter] = useState("All Products");

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setQuantity(product.stock);
    setBatch(product.batch);
  }

  const visibleProducts =
    activeFilter === "All Products"
      ? products
      : products.filter((p) => p.category.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <PageShell>
      <ContentArea>
        {/* Stats */}
        <StatsGrid variants={staggerContainer} initial="hidden" animate="visible">
          {inventoryStats.map((stat) => (
            <StatCard key={stat.label} $alert={stat.alert} variants={fadeUp}>
              <StatCardTop>
                <StatLabel>{stat.label}</StatLabel>
                <StatIconWrapper $color={stat.iconColor}>
                  <Icon name={stat.icon} size={22} />
                </StatIconWrapper>
              </StatCardTop>
              <StatValueRow>
                <StatValue>{stat.value}</StatValue>
                <StatTrend $type={stat.trendType}>{stat.trend}</StatTrend>
              </StatValueRow>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Filter bar */}
        <FilterSection>
          <PillsContainer>
            {filterCategories.map((cat) => (
              <FilterPill
                key={cat}
                $active={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </FilterPill>
            ))}
          </PillsContainer>
          <AdvancedFiltersBtn>
            <Icon name="filter_list" size={16} />
            Advanced Filters
          </AdvancedFiltersBtn>
        </FilterSection>

        {/* Table + Quick Edit */}
        <ContentRow>
          {/* Product table */}
          <TableCard>
            <TableScroll>
              <Table>
                <Thead>
                <tr>
                  <Th>Product Name</Th>
                  <Th>SKU / ID</Th>
                  <Th>Stock Level</Th>
                  <Th>Expiry</Th>
                  <Th style={{ textAlign: "right" }}>Action</Th>
                </tr>
              </Thead>
              <Tbody>
                {visibleProducts.map((product, index) => (
                  <TableRow
                    key={product.id}
                    $status={product.status}
                    $selected={selectedProduct.id === product.id}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <Td>
                      <ProductName>{product.name}</ProductName>
                      <ProductCategory>{product.category}</ProductCategory>
                    </Td>
                    <Td>
                      <SkuCode>{product.sku}</SkuCode>
                    </Td>
                    <Td>
                      <StockCell>
                        <StockTrack>
                          <StockFill
                            $pct={product.stockPct}
                            $status={product.status}
                            initial={{ width: 0 }}
                            animate={{ width: `${product.stockPct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                          />
                        </StockTrack>
                        <StockNum $status={product.status}>{product.stock}</StockNum>
                      </StockCell>
                    </Td>
                    <Td>
                      <ExpiryText $status={product.status}>{product.expiry}</ExpiryText>
                    </Td>
                    <Td style={{ textAlign: "right" }}>
                      <EditBtn
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(product);
                        }}
                        title="Quick edit"
                      >
                        <Icon name="edit_note" size={22} />
                      </EditBtn>
                    </Td>
                  </TableRow>
                ))}
              </Tbody>
              </Table>
            </TableScroll>
            <TableFooter>
              <FooterInfo>Showing {visibleProducts.length} of 1,248 products</FooterInfo>
              <PageBtns>
                <PageBtn>
                  <Icon name="chevron_left" size={16} />
                </PageBtn>
                <PageBtn>
                  <Icon name="chevron_right" size={16} />
                </PageBtn>
              </PageBtns>
            </TableFooter>
          </TableCard>

          {/* Quick Edit panel */}
          <AnimatePresence>
            <EditPanel
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25 }}
            >
              <EditPanelHeader>
                <Icon name="edit" size={18} />
                <EditPanelTitle>Quick Stock Edit</EditPanelTitle>
              </EditPanelHeader>

              <EditBody>
                <SelectionBox>
                  <SelectionMeta>Active Selection</SelectionMeta>
                  <SelectionName>{selectedProduct.name}</SelectionName>
                  <SelectionSku>{selectedProduct.sku}</SelectionSku>
                </SelectionBox>

                <FieldGroup>
                  <div>
                    <FieldLabel>Adjust Quantity</FieldLabel>
                    <QtyRow>
                      <QtyBtn onClick={() => setQuantity((q) => Math.max(0, q - 1))}>−</QtyBtn>
                      <QtyInput
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min={0}
                      />
                      <QtyBtn onClick={() => setQuantity((q) => q + 1)}>+</QtyBtn>
                    </QtyRow>
                  </div>

                  <div>
                    <FieldLabel>Adjustment Reason</FieldLabel>
                    <StyledSelect value={reason} onChange={(e) => setReason(e.target.value)}>
                      {adjustmentReasons.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </StyledSelect>
                  </div>

                  <div>
                    <FieldLabel>Batch Number</FieldLabel>
                    <StyledInput
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                    />
                  </div>
                </FieldGroup>

                <ButtonGroup>
                  <SaveBtn>
                    <Icon name="check_circle" size={16} />
                    Save Changes
                  </SaveBtn>
                  <CancelBtn onClick={() => handleSelectProduct(products[1])}>Cancel</CancelBtn>
                </ButtonGroup>
              </EditBody>

              <AuditNote>* Last edited by Dr. Connor at 09:45 AM</AuditNote>
            </EditPanel>
          </AnimatePresence>
        </ContentRow>
      </ContentArea>
    </PageShell>
  );
}
