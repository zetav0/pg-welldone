import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { sidebarNavItems } from "../../data/dashboard";
import { InputCustom } from "../common/Input";
import { SelectCustom } from "../common/Select";
import { CheckboxCustom } from "../common/Checkbox";
import { RadioGroupCustom } from "../common/Radio";

/* ── Styled components ──────────────────────────────── */

const Root = styled.aside<{ $collapsed: boolean }>`
  width: ${(p) => (p.$collapsed ? "6.4rem" : "25.6rem")};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  background: ${(p) => p.theme.colors.background};
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.25s ease;
`;

const LogoArea = styled.div<{ $collapsed: boolean }>`
  padding: 2rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  gap: 1.2rem;
  flex-shrink: 0;
`;

const LogoIcon = styled(motion.div)`
  height: 4rem;
  width: 4rem;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.white};
  box-shadow: 0 4px 12px -2px ${(p) => p.theme.colors.primaryBgStrong};
  flex-shrink: 0;
`;

const LogoTextWrapper = styled.div<{ $collapsed: boolean }>`
  overflow: hidden;
  max-width: ${(p) => (p.$collapsed ? "0" : "20rem")};
  opacity: ${(p) => (p.$collapsed ? 0 : 1)};
  transition:
    max-width 0.25s ease,
    opacity 0.15s ease;
  white-space: nowrap;
`;

const AppName = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: -0.05rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1;
`;

const AppSub = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0.8rem 0.8rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow: hidden;
`;

const NavItem = styled(motion.div)<{ $active?: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  gap: 1.2rem;
  padding: ${(p) => (p.$collapsed ? "1rem" : "1rem 1.2rem")};
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  background: ${(p) => (p.$active ? p.theme.colors.primaryBg : "transparent")};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    padding 0.25s;
  white-space: nowrap;

  &:hover {
    background: ${(p) => !p.$active && p.theme.colors.chipBg};
    color: ${(p) => !p.$active && p.theme.colors.text};
  }
`;

const NavLabel = styled.span<{ $collapsed: boolean }>`
  overflow: hidden;
  max-width: ${(p) => (p.$collapsed ? "0" : "16rem")};
  opacity: ${(p) => (p.$collapsed ? 0 : 1)};
  transition:
    max-width 0.25s ease,
    opacity 0.15s ease;
`;

const SectionLabel = styled.p<{ $collapsed: boolean }>`
  margin: 1.6rem 0 0.4rem;
  padding: 0 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  max-height: ${(p) => (p.$collapsed ? "0" : "3.2rem")};
  opacity: ${(p) => (p.$collapsed ? 0 : 1)};
  overflow: hidden;
  transition:
    max-height 0.25s ease,
    opacity 0.15s ease;
`;

const ToggleArea = styled.div`
  padding: 0.8rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  justify-content: center;
`;

const ToggleButton = styled.button`
  width: 3.6rem;
  height: 3.6rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0.8rem;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primaryBg};
  }
`;

const Footer = styled.div`
  padding: 1.2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const LogoutIconButton = styled.button`
  width: 4rem;
  height: 4rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    opacity: 0.88;
  }
`;

/* ── Component ──────────────────────────────────────── */

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const categorias = [
    { id: "antibioticos", title: "Antibióticos" },
    { id: "analgesicos", title: "Analgésicos" },
  ];

  return (
    <Root $collapsed={collapsed}>
      <LogoArea $collapsed={collapsed}>
        <LogoIcon whileHover={{ rotate: 5, scale: 1.08 }} transition={{ duration: 0.2 }}>
          <Icon name="medical_services" filled size={20} />
        </LogoIcon>
        <LogoTextWrapper $collapsed={collapsed}>
          <AppName>PharmaCore</AppName>
          <AppSub>Central Hub</AppSub>
        </LogoTextWrapper>
      </LogoArea>

      <Nav>
        <NavItem
          $active={isActive("/dashboard")}
          $collapsed={collapsed}
          onClick={() => navigate("/dashboard")}
          title="Dashboard"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          <Icon name="dashboard" size={20} />
          <NavLabel $collapsed={collapsed}>Dashboard</NavLabel>
        </NavItem>

        {sidebarNavItems.map((item) => (
          <NavItem
            key={item.label}
            $active={isActive(item.path)}
            $collapsed={collapsed}
            onClick={() => item.path !== "#" && navigate(item.path)}
            title={item.label}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <Icon name={item.icon} size={20} />
            <NavLabel $collapsed={collapsed}>{item.label}</NavLabel>
          </NavItem>
        ))}

        <SectionLabel $collapsed={collapsed}>System</SectionLabel>

        <NavItem
          $active={isActive("/settings")}
          $collapsed={collapsed}
          onClick={() => navigate("/settings")}
          title="Settings"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          <Icon name="settings" size={20} />
          <NavLabel $collapsed={collapsed}>Settings</NavLabel>
        </NavItem>
      </Nav>

      <ToggleArea>
        <ToggleButton
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expandir panel" : "Contraer panel"}
        >
          <Icon name={collapsed ? "chevron_right" : "chevron_left"} size={20} />
        </ToggleButton>
      </ToggleArea>

      <Footer>
        <InputCustom
          label="Buscar producto"
          icon="inventory_2"
          onActionClick={(term) => {
            console.log("Buscar:", term);
          }}
          debounceMs={400}
          minChars={2}
          onClear={() => {
            console.log("Búsqueda limpia");
          }}
        />
        <SelectCustom
          title="Categoría"
          required
          options={categorias}
          selectedOption={""}
          onChange={() => {}}
          onClear={() => {}}
          error={""}
        />
        <CheckboxCustom label="Acepto los términos" checked={false} onChange={() => {}} required />

        <RadioGroupCustom
          title="Tipo de envío"
          name="envio"
          direction="row"
          options={[
            { id: "normal", title: "Normal" },
            { id: "express", title: "Express" },
            { id: "retiro", title: "Retiro en tienda", disabled: true },
          ]}
          selectedOption={"normal"}
          onChange={(value) => {
            console.log("Opción seleccionada:", value);
          }}
          required
        />

        {collapsed ? (
          <LogoutIconButton onClick={onLogout} title="Cerrar sesión">
            <Icon name="logout" size={20} />
          </LogoutIconButton>
        ) : (
          <Button variant="primary" fullWidth onClick={onLogout}>
            <Icon name="logout" size={18} />
            Cerrar sesión xd
          </Button>
        )}
      </Footer>
    </Root>
  );
}
