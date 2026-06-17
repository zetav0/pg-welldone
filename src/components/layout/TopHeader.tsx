import styled from "styled-components";
import { Icon } from "../ui/Icon";

/* ── Styled components ──────────────────────────────── */

const Root = styled.header`
  height: 6.4rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3.2rem;
  gap: 3.2rem;

  @media (max-width: 768px) {
    padding: 0 1.6rem;
    gap: 1.2rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  flex-shrink: 0;
  padding: 0.8rem;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  border-radius: 0.8rem;
  align-items: center;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 48rem;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${(p) => p.theme.colors.surface};
  border: none;
  border-radius: 0.8rem;
  padding: 0.8rem 1.6rem 0.8rem 4rem;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.colors.primary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 1.2rem;
  }
`;

const IconButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const IconButton = styled.button`
  position: relative;
  padding: 0.8rem;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  width: 0.8rem;
  height: 0.8rem;
  background: ${(p) => p.theme.colors.danger};
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.background};
`;

const Divider = styled.div`
  width: 1px;
  height: 3.2rem;
  background: ${(p) => p.theme.colors.border};
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const UserInfo = styled.div`
  text-align: right;

  @media (max-width: 640px) {
    display: none;
  }
`;

const UserName = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  line-height: 1;
`;

const UserRole = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Avatar = styled.div`
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primaryBg};
  border: 2px solid ${(p) => p.theme.colors.primaryBgStrong};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.primary};
  font-weight: 700;
  font-size: 1.4rem;
`;

/* ── Component ──────────────────────────────────────── */

interface TopHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopHeader({ onMenuClick, showMenuButton }: TopHeaderProps) {
  return (
    <Root>
      {showMenuButton && (
        <MenuButton onClick={onMenuClick} aria-label="Abrir menú" title="Menú">
          <Icon name="menu" size={24} />
        </MenuButton>
      )}
      <SearchWrapper>
        <SearchIcon>
          <Icon name="search" size={18} />
        </SearchIcon>
        <SearchInput placeholder="Search drugs, patient IDs, or orders…" />
      </SearchWrapper>

      <RightSection>
        <IconButtonGroup>
          <IconButton>
            <Icon name="notifications" size={22} />
            <NotificationDot />
          </IconButton>
          <IconButton>
            <Icon name="chat_bubble_outline" size={22} />
          </IconButton>
        </IconButtonGroup>

        <Divider />

        <UserArea>
          <UserInfo>
            <UserName>Dr. Sarah Chen</UserName>
            <UserRole>Lead Pharmacist</UserRole>
          </UserInfo>
          <Avatar>SC</Avatar>
        </UserArea>
      </RightSection>
    </Root>
  );
}
