import styled from "styled-components";
import { Icon } from "../ui/Icon";
import { quickActions, patientQueue } from "../../data/dashboard";

/* ── Styled components ──────────────────────────────── */

const Root = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 1.2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 2.4rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 2.4rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.6rem;
  background: ${(p) => p.theme.colors.inputBg};
  border-radius: 1.2rem;
  border: none;
  cursor: pointer;
  gap: 0.8rem;
  color: ${(p) => p.theme.colors.textMuted};
  font-family: inherit;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primaryBg};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const ActionLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const QueueSection = styled.div`
  margin-top: 3.2rem;
  padding-top: 3.2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const QueueTitle = styled.p`
  margin: 0 0 1.6rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const QueueItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const StatusDot = styled.div<{ $status: "green" | "yellow" }>`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.$status === "green" ? p.theme.colors.success : p.theme.colors.warning)};
`;

const PatientName = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  flex: 1;
`;

const AppointmentTime = styled.span`
  font-family: ui-monospace, monospace;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Component ──────────────────────────────────────── */

export function QuickActionsPanel() {
  return (
    <Root>
      <SectionTitle>Quick Actions</SectionTitle>

      <ActionsGrid>
        {quickActions.map((action) => (
          <ActionButton key={action.label}>
            <Icon name={action.icon} size={28} />
            <ActionLabel>{action.label}</ActionLabel>
          </ActionButton>
        ))}
      </ActionsGrid>

      <QueueSection>
        <QueueTitle>Patient Queue</QueueTitle>
        <QueueList>
          {patientQueue.map((patient) => (
            <QueueItem key={patient.name}>
              <StatusDot $status={patient.status} />
              <PatientName>{patient.name}</PatientName>
              <AppointmentTime>{patient.time}</AppointmentTime>
            </QueueItem>
          ))}
        </QueueList>
      </QueueSection>
    </Root>
  );
}
