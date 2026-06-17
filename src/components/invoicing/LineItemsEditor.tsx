import styled from "styled-components";
import { Icon } from "@/components/ui/Icon";
import { catalogProducts } from "@/data/catalog";

/* ── Public types ────────────────────────────────────── */

export interface LineItem {
  lineId: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

/* ── Helpers ─────────────────────────────────────────── */

function newLineId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function fmt(n: number): string {
  return `S/ ${n.toFixed(2)}`;
}

/* ── Styled ──────────────────────────────────────────── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const EmptyState = styled.div`
  border: 1.5px dashed ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  padding: 2.8rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 1.3rem;
`;

const ItemsTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
`;

const ItemHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 7rem 9rem 8rem 3.2rem;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  background: ${(p) => p.theme.colors.chipBg};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const HeadCell = styled.span`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 7rem 9rem 8rem 3.2rem;
  gap: 0.8rem;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child { border-bottom: none; }
`;

const ProductSelect = styled.select`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.6rem;
  font-size: 1.3rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  cursor: pointer;

  &:focus { border-color: ${(p) => p.theme.colors.primary}; }
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: 0.6rem;
  font-size: 1.3rem;
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  text-align: right;

  &:focus { border-color: ${(p) => p.theme.colors.primary}; }
`;

const SubtotalCell = styled.span`
  font-family: "Courier New", monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  text-align: right;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(220, 38, 38, 0.08);
    color: ${(p) => p.theme.colors.danger};
  }
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  align-self: flex-start;

  &:hover { text-decoration: underline; }
`;

const Summary = styled.div`
  background: ${(p) => p.theme.colors.primaryBg};
  border: 1px solid ${(p) => p.theme.colors.primaryBgStrong};
  border-radius: 1rem;
  padding: 1.2rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const SummaryTotal = styled(SummaryRow)`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${(p) => p.theme.colors.primary};
  padding-top: 0.6rem;
  margin-top: 0.2rem;
  border-top: 1px solid ${(p) => p.theme.colors.primaryBgStrong};
`;

const SummaryMono = styled.span`
  font-family: "Courier New", monospace;
`;

/* ── Component ───────────────────────────────────────── */

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
  function addLine() {
    const first = catalogProducts[0];
    onChange([
      ...items,
      {
        lineId:    newLineId(),
        productId: first?.id ?? "",
        name:      first?.name ?? "",
        qty:       1,
        unitPrice: first?.unitPrice ?? 0,
      },
    ]);
  }

  function removeLine(lineId: string) {
    onChange(items.filter((i) => i.lineId !== lineId));
  }

  function updateProduct(lineId: string, productId: string) {
    const prod = catalogProducts.find((p) => p.id === productId);
    onChange(
      items.map((i) =>
        i.lineId === lineId
          ? { ...i, productId, name: prod?.name ?? "", unitPrice: prod?.unitPrice ?? 0 }
          : i,
      ),
    );
  }

  function updateQty(lineId: string, qty: number) {
    onChange(items.map((i) => (i.lineId === lineId ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function updatePrice(lineId: string, unitPrice: number) {
    onChange(items.map((i) => (i.lineId === lineId ? { ...i, unitPrice: Math.max(0, unitPrice) } : i)));
  }

  const subtotalBase = items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);
  const igv          = subtotalBase * 0.18;
  const total        = subtotalBase + igv;

  return (
    <Wrap>
      {items.length === 0 ? (
        <EmptyState>
          <Icon name="inventory" size={38} />
          <span>No hay productos agregados todavía</span>
        </EmptyState>
      ) : (
        <ItemsTable>
          <ItemHead>
            <HeadCell>Producto</HeadCell>
            <HeadCell style={{ textAlign: "right" }}>Cant.</HeadCell>
            <HeadCell style={{ textAlign: "right" }}>P. Unit.</HeadCell>
            <HeadCell style={{ textAlign: "right" }}>Subtotal</HeadCell>
            <HeadCell />
          </ItemHead>
          {items.map((item) => (
            <ItemRow key={item.lineId}>
              <ProductSelect
                value={item.productId}
                onChange={(e) => updateProduct(item.lineId, e.target.value)}
              >
                {catalogProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.sku}
                  </option>
                ))}
              </ProductSelect>
              <NumberInput
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => updateQty(item.lineId, Number(e.target.value))}
              />
              <NumberInput
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                onChange={(e) => updatePrice(item.lineId, Number(e.target.value))}
              />
              <SubtotalCell>{fmt(item.qty * item.unitPrice)}</SubtotalCell>
              <DeleteBtn type="button" onClick={() => removeLine(item.lineId)}>
                <Icon name="close" size={16} />
              </DeleteBtn>
            </ItemRow>
          ))}
        </ItemsTable>
      )}

      <AddBtn type="button" onClick={addLine}>
        <Icon name="add" size={16} />
        Agregar producto
      </AddBtn>

      {items.length > 0 && (
        <Summary>
          <SummaryRow>
            <span>Subtotal (sin IGV)</span>
            <SummaryMono>{fmt(subtotalBase)}</SummaryMono>
          </SummaryRow>
          <SummaryRow>
            <span>IGV (18%)</span>
            <SummaryMono>{fmt(igv)}</SummaryMono>
          </SummaryRow>
          <SummaryTotal>
            <span>Total</span>
            <SummaryMono>{fmt(total)}</SummaryMono>
          </SummaryTotal>
        </Summary>
      )}
    </Wrap>
  );
}
