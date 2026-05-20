import styled from "styled-components";
import { Icon } from "../ui/Icon";
import { inventoryItems, type TrendType } from "../../data/dashboard";

/* ── Styled components ──────────────────────────────── */

const Root = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 2.4rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.4rem;
`;

const HeaderText = styled.div``;

const Title = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const FilterArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const FilterSelect = styled.select`
  background: ${(p) => p.theme.colors.inputBg};
  border: none;
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textSubtle};
  outline: none;
  cursor: pointer;
  font-family: inherit;
`;

const FilterButton = styled.button`
  padding: 0.8rem;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  transition: background 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.chipBg};
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.6rem;
`;

const InventoryItem = styled.div<{ $critical: boolean }>`
  padding: 1.6rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-left: ${(p) => p.$critical && `4px solid ${p.theme.colors.danger}`};
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const ItemIconWrapper = styled.div<{ $critical: boolean }>`
  height: 4.8rem;
  width: 4.8rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) => (p.$critical ? p.theme.colors.dangerBg : p.theme.colors.inputBg)};
  color: ${(p) => (p.$critical ? p.theme.colors.danger : p.theme.colors.textMuted)};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ItemMetrics = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 0.4rem;
`;

const ItemQty = styled.p<{ $critical: boolean }>`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
  color: ${(p) => (p.$critical ? p.theme.colors.danger : p.theme.colors.text)};
`;

const ItemTrend = styled.span<{ $type: TrendType }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) =>
    ({
      success: p.theme.colors.success,
      danger: p.theme.colors.danger,
      neutral: p.theme.colors.textMuted,
    })[p.$type]};
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 2.4rem auto 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

/* ── Component ──────────────────────────────────────── */

export function InventoryOverview() {
  return (
    <Root>
      <Header>
        <HeaderText>
          <Title>Inventory Movement</Title>
          <Subtitle>Live feed of recent stock fluctuations</Subtitle>
        </HeaderText>

        <FilterArea>
          <FilterSelect>
            <option>All Categories</option>
            <option>Antibiotics</option>
            <option>Pain Relief</option>
          </FilterSelect>
          <FilterButton>
            <Icon name="filter_list" size={18} />
          </FilterButton>
        </FilterArea>
      </Header>

      <ItemsGrid>
        {inventoryItems.map((item) => (
          <InventoryItem key={item.name} $critical={item.critical}>
            <ItemIconWrapper $critical={item.critical}>
              <Icon name={item.icon} size={22} />
            </ItemIconWrapper>
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemMetrics>
                <ItemQty $critical={item.critical}>{item.qty}</ItemQty>
                <ItemTrend $type={item.trendType}>{item.trend}</ItemTrend>
              </ItemMetrics>
            </ItemInfo>
          </InventoryItem>
        ))}
      </ItemsGrid>

      <ViewAllButton>
        VIEW FULL INVENTORY <Icon name="arrow_forward" size={16} />
      </ViewAllButton>
    </Root>
  );
}
