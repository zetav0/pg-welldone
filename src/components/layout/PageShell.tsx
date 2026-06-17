import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { useIsMobile } from "../../lib/useMediaQuery";

const Layout = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // The drawer is only open while on mobile; navigation closes it via Sidebar's onClose.
  const drawerOpen = isMobile && mobileNavOpen;

  // Lock body scroll while the off-canvas drawer is open (external DOM sync).
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <Layout>
      <Sidebar
        onLogout={() => navigate("/login")}
        isMobile={isMobile}
        mobileOpen={drawerOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <Main>
        <TopHeader onMenuClick={() => setMobileNavOpen(true)} showMenuButton={isMobile} />
        <ScrollArea>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={"/" + location.pathname.split("/")[1]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </Main>
    </Layout>
  );
}
