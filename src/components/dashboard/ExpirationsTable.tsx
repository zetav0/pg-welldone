import styled from "styled-components";
import { Icon } from "../ui/Icon";
import { expirations } from "../../data/dashboard";

/* ── Styled components ──────────────────────────────── */

const Root = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 2.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const DangerIconWrapper = styled.span`
  color: ${(p) => p.theme.colors.danger};
  display: flex;
`;

const PeriodLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: rgba(15, 23, 42, 0.5);
`;

const Th = styled.th`
  padding: 1.2rem 2.4rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

const Tbody = styled.tbody`
  tr + tr {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }
`;

const Tr = styled.tr`
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Td = styled.td`
  padding: 1.6rem 2.4rem;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.text};
`;

const ProductName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const ProductDetail = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const BatchCode = styled.span`
  font-family: ui-monospace, monospace;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const DateBadge = styled.span<{ $urgent: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1rem;
  font-weight: 700;
  background: ${(p) => (p.$urgent ? p.theme.colors.dangerBg : p.theme.colors.warningBg)};
  color: ${(p) => (p.$urgent ? p.theme.colors.danger : p.theme.colors.warning)};
`;

const ActionButton = styled.button`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

/* ── Component ──────────────────────────────────────── */

export function ExpirationsTable() {
  return (
    <Root>
      <Header>
        <Title>
          <DangerIconWrapper>
            <Icon name="notification_important" filled size={20} />
          </DangerIconWrapper>
          Urgent: Product Expirations
        </Title>
        <PeriodLabel>Next 30 Days</PeriodLabel>
      </Header>

      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>Product Name</Th>
              <Th>Batch ID</Th>
              <Th style={{ textAlign: "center" }}>Expiry Date</Th>
              <Th>Remaining</Th>
              <Th style={{ textAlign: "right" }}>Action</Th>
            </tr>
          </Thead>
          <Tbody>
            {expirations.map((row) => (
              <Tr key={row.batch}>
                <Td>
                  <ProductName>{row.name}</ProductName>
                  <ProductDetail>{row.detail}</ProductDetail>
                </Td>
                <Td>
                  <BatchCode>{row.batch}</BatchCode>
                </Td>
                <Td style={{ textAlign: "center" }}>
                  <DateBadge $urgent={row.urgent}>{row.date}</DateBadge>
                </Td>
                <Td>{row.units}</Td>
                <Td style={{ textAlign: "right" }}>
                  <ActionButton>{row.action}</ActionButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableWrapper>
    </Root>
  );
}
