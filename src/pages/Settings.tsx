import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { PageShell } from "../components/layout/PageShell";
import { Icon } from "../components/ui/Icon";
import { useToast } from "../components/common/Toast";

/* ── Layout ──────────────────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  flex: 1;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
`;

const PageTitle = styled.h2`
  margin: 0 0 0.4rem;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Glass card base ─────────────────────────────────── */

const Glass = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
`;

/* ── Profile header ──────────────────────────────────── */

const ProfileSection = styled(Glass)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.2rem;
  padding: 2.4rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
`;

const AvatarWrap = styled.div`
  position: relative;
`;

const AvatarCircle = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primaryBg};
  border: 3px solid ${(p) => p.theme.colors.surface};
  box-shadow: 0 4px 16px -4px rgba(113, 42, 226, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
`;

const VerifiedBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2.4rem;
  height: 2.4rem;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppNameText = styled.h3`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.05rem;
  color: ${(p) => p.theme.colors.text};
`;

const AppVersionText = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Admin options grid ──────────────────────────────── */

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
`;

const OptionIcon = styled.span`
  color: ${(p) => p.theme.colors.primary};
  display: flex;
`;

const OptionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 4px 16px -4px ${(p) => p.theme.colors.primaryBg};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const OptionLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Toggle row ──────────────────────────────────────── */

const ToggleSection = styled(Glass)`
  padding: 1.6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
`;

const ToggleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
`;

const ToggleIconWrap = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primaryBg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
`;

const ToggleTitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const ToggleSub = styled.p<{ $active: boolean }>`
  margin: 0.2rem 0 0;
  font-size: 1.2rem;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  transition: color 0.2s;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
`;

const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchTrack = styled.div<{ $on: boolean }>`
  width: 4.8rem;
  height: 2.8rem;
  border-radius: 9999px;
  background: ${(p) => (p.$on ? p.theme.colors.primary : p.theme.colors.chipBg)};
  border: 1.5px solid ${(p) => (p.$on ? p.theme.colors.primary : p.theme.colors.borderStrong)};
  position: relative;
  transition: background 0.2s, border-color 0.2s;

  &::after {
    content: "";
    position: absolute;
    top: 0.2rem;
    left: ${(p) => (p.$on ? "2.2rem" : "0.2rem")};
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.white};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transition: left 0.2s;
  }
`;

/* ── Users list ──────────────────────────────────────── */

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.4rem;
`;

const SectionLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const SectionLink = styled.span`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.6rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const UserAvatar = styled.div<{ $color: string }>`
  width: 4rem;
  height: 4rem;
  border-radius: 0.8rem;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  flex-shrink: 0;
`;

const UserName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
`;

const RoleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
`;

const RoleDot = styled.span<{ $color: string }>`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const RoleLabel = styled.span`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  padding: 0.4rem;
  border-radius: 0.6rem;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.chipBg};
  }
`;

/* ── Activity chart ──────────────────────────────────── */

const ChartSection = styled(Glass)`
  padding: 2rem 2.4rem;
  position: relative;
  overflow: hidden;
`;

const ChartTitle = styled.p`
  margin: 0 0 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 4.8rem;
`;

const Bar = styled.div<{ $h: number; $strong?: boolean }>`
  flex: 1;
  height: ${(p) => p.$h}%;
  border-radius: 0.4rem 0.4rem 0 0;
  background: ${(p) =>
    p.$strong
      ? p.theme.colors.primary
      : p.theme.colors.primaryBg};
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`;

const ChartSub = styled.p`
  margin: 1.2rem 0 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ChartGlow = styled.div`
  position: absolute;
  top: -4rem;
  right: -4rem;
  width: 12rem;
  height: 12rem;
  background: ${(p) => p.theme.colors.primaryBg};
  border-radius: 50%;
  filter: blur(32px);
  pointer-events: none;
`;

/* ── Data ────────────────────────────────────────────── */

const ADMIN_OPTIONS = [
  { icon: "group",           label: "Usuarios y Roles" },
  { icon: "account_balance", label: "Configuración SUNAT" },
  { icon: "business",        label: "Datos Empresa" },
  { icon: "history_edu",     label: "Logs Sistema" },
] as const;

const USERS = [
  { name: "Carlos Méndez", role: "Admin",    initials: "CM", avatarBg: "rgba(113,42,226,0.10)", dotColor: "#712ae2" },
  { name: "Ana Valdivia",  role: "Vendedor", initials: "AV", avatarBg: "rgba(22,163,74,0.10)",  dotColor: "#16a34a" },
  { name: "Jorge Ruiz",    role: "Contador", initials: "JR", avatarBg: "rgba(180,83,9,0.10)",   dotColor: "#b45309" },
];

const BARS: Array<{ h: number; strong?: boolean }> = [
  { h: 40 }, { h: 60 }, { h: 30 }, { h: 90, strong: true }, { h: 50 }, { h: 70 }, { h: 40 },
];

/* ── Page ────────────────────────────────────────────── */

export default function Settings() {
  const [sunatTest, setSunatTest] = useState(true);
  const { toast } = useToast();

  function handleToggle() {
    const next = !sunatTest;
    setSunatTest(next);
    toast({
      variant: next ? "info" : "warning",
      title: next ? "Modo Beta SUNAT activado" : "Entorno de Producción",
      description: next
        ? "Las operaciones se procesarán en el entorno de pruebas."
        : "Las operaciones se procesarán en producción.",
    });
  }

  return (
    <PageShell>
      <ContentArea>
        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <PageTitle>Configuración</PageTitle>
          <PageSubtitle>Gestiona usuarios, credenciales y ajustes del sistema.</PageSubtitle>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Profile header */}
          <motion.div variants={fadeUp}>
            <ProfileSection>
              <AvatarWrap>
                <AvatarCircle>PC</AvatarCircle>
                <VerifiedBadge>
                  <Icon name="verified" filled size={13} />
                </VerifiedBadge>
              </AvatarWrap>
              <div>
                <AppNameText>PharmaCore</AppNameText>
                <AppVersionText>Admin Premium • v2.4.0-Stable</AppVersionText>
              </div>
            </ProfileSection>

            {/* Admin options grid — visually attached to profile card */}
            <OptionsGrid
              style={{
                borderTop: "1px solid rgba(232,234,236,0.8)",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                borderLeft: "1px solid rgba(232,234,236,0.8)",
                borderRight: "1px solid rgba(232,234,236,0.8)",
                borderBottom: "1px solid rgba(232,234,236,0.8)",
                borderRadius: "0 0 1.6rem 1.6rem",
                padding: "1.6rem",
                gap: "1rem",
              }}
            >
              {ADMIN_OPTIONS.map((opt) => (
                <OptionCard key={opt.label} whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }}>
                  <OptionIcon><Icon name={opt.icon} size={28} /></OptionIcon>
                  <OptionLabel>{opt.label}</OptionLabel>
                </OptionCard>
              ))}
            </OptionsGrid>
          </motion.div>

          {/* SUNAT toggle */}
          <motion.div variants={fadeUp}>
            <ToggleSection>
              <ToggleLeft>
                <ToggleIconWrap>
                  <Icon name="science" size={20} />
                </ToggleIconWrap>
                <div>
                  <ToggleTitle>Entorno de Pruebas</ToggleTitle>
                  <ToggleSub $active={sunatTest}>
                    {sunatTest ? "Modo Beta SUNAT activo" : "Entorno de Producción"}
                  </ToggleSub>
                </div>
              </ToggleLeft>
              <SwitchLabel>
                <SwitchInput type="checkbox" checked={sunatTest} onChange={handleToggle} />
                <SwitchTrack $on={sunatTest} />
              </SwitchLabel>
            </ToggleSection>
          </motion.div>

          {/* Users list */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <SectionHeader>
              <SectionLabel>Usuarios Activos</SectionLabel>
              <SectionLink>Ver todos</SectionLink>
            </SectionHeader>
            <UsersList>
              {USERS.map((u) => (
                <UserItem key={u.name}>
                  <UserLeft>
                    <UserAvatar $color={u.avatarBg}>
                      {u.initials}
                    </UserAvatar>
                    <div>
                      <UserName>{u.name}</UserName>
                      <RoleBadge>
                        <RoleDot $color={u.dotColor} />
                        <RoleLabel>{u.role}</RoleLabel>
                      </RoleBadge>
                    </div>
                  </UserLeft>
                  <MoreButton title="Opciones">
                    <Icon name="more_vert" size={20} />
                  </MoreButton>
                </UserItem>
              ))}
            </UsersList>
          </motion.div>

          {/* Activity chart */}
          <motion.div variants={fadeUp}>
            <ChartSection>
              <ChartGlow />
              <ChartTitle>Actividad de Logs</ChartTitle>
              <ChartBars>
                {BARS.map((b, i) => (
                  <Bar key={i} $h={b.h} $strong={b.strong} />
                ))}
              </ChartBars>
              <ChartSub>+12% peticiones hoy</ChartSub>
            </ChartSection>
          </motion.div>
        </motion.div>
      </ContentArea>
    </PageShell>
  );
}
