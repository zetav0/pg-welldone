import styled from "styled-components";
import { useApp } from "../../context/AppContext";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";

/* ── Styled components ──────────────────────────────── */

const CardRoot = styled.div`
  background: ${(p) => p.theme.colors.surface};
  padding: 2.4rem;
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s;

  &:hover {
    border-color: rgba(0, 108, 117, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.6rem;
`;

const IconWrapper = styled.div`
  padding: 0.8rem;
  border-radius: 0.8rem;
  background: ${(p) => p.theme.colors.primaryBg};
  color: ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const MetricLabel = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MetricValue = styled.p`
  margin: 0.4rem 0 0;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.6rem;
`;

const StepButton = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  background: transparent;
  color: ${(p) => p.theme.colors.textSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const ResetButton = styled.button`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 0.8rem;
  font-family: inherit;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

/* ── Component ──────────────────────────────────────── */

export function CounterCard() {
  const { count, increment, decrement, reset } = useApp();

  return (
    <CardRoot>
      <CardHeader>
        <IconWrapper>
          <Icon name="123" size={22} />
        </IconWrapper>
        <Badge variant="neutral">Contexto</Badge>
      </CardHeader>

      <MetricLabel>Contador global</MetricLabel>
      <MetricValue>{count}</MetricValue>

      <Controls>
        <StepButton onClick={decrement}>
          <Icon name="remove" size={16} />
        </StepButton>
        <ResetButton onClick={reset}>Reset</ResetButton>
        <StepButton onClick={increment}>
          <Icon name="add" size={16} />
        </StepButton>
      </Controls>
    </CardRoot>
  );
}
