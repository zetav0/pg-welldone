import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { Table } from "../components/ui/Table";
import type { ColumnDef } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { useToast } from "../components/common/Toast";
import { companyService } from "@/services/companyService";
import type { Company, CompanyListMeta } from "@/services/companyService";

/* ── Helpers ─────────────────────────────────────────── */

const isProduction = (c: Company) => c.modo_produccion === true || c.modo_produccion === 1;

/* ── Styled components ───────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1.6rem;
    gap: 2.4rem;
  }
`;

const PageHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const HeadingText = styled.div``;

const PageTitle = styled.h2`
  margin: 0;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const PageSubtitle = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const HeadingActions = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const KpiGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 2rem;
`;

const KpiCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;
`;

const KpiIcon = styled.div`
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
  opacity: 0.08;
  color: ${(p) => p.theme.colors.text};
`;

const KpiLabel = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const KpiValue = styled.p<{ $color?: string }>`
  margin: 0;
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  line-height: 1;
  color: ${(p) => p.$color ?? p.theme.colors.text};
`;

const KpiSub = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const FilterBar = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 1.6rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
  flex: 1;
  min-width: 22rem;
  max-width: 40rem;

  &:focus-within {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primaryBg};
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  width: 100%;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const TableCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  overflow: hidden;
`;

const CompanyName = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const CompanySub = styled.p`
  margin: 0.2rem 0 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const RucText = styled.span`
  font-size: 1.3rem;
  font-family: monospace;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: 0.04em;
`;

const LocationText = styled.span`
  font-size: 1.3rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
`;

const ActionBtn = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 0.6rem;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.primaryBg};
    color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* ── Component ───────────────────────────────────────── */

export default function Companies() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [meta, setMeta] = useState<CompanyListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activatingId, setActivatingId] = useState<number | null>(null);

  function load() {
    companyService.list().subscribe({
      next: (res) => {
        setCompanies(res.data ?? []);
        setMeta(res.meta ?? null);
        setLoading(false);
      },
      error: (error: unknown) => {
        setLoading(false);
        const message =
          error instanceof Error ? error.message : "Error al conectar con el servidor";
        toast({ variant: "error", title: "No se pudieron cargar las empresas", description: message });
      },
    });
  }

  // Load once on mount.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleActivate(company: Company) {
    setActivatingId(company.id);
    companyService.activate(company.id).subscribe({
      next: () => {
        setActivatingId(null);
        toast({ variant: "success", title: "Empresa activada", description: company.razon_social });
        setLoading(true);
        load();
      },
      error: (error: unknown) => {
        setActivatingId(null);
        const message =
          error instanceof Error ? error.message : "Error al conectar con el servidor";
        toast({ variant: "error", title: "No se pudo activar", description: message });
      },
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.razon_social.toLowerCase().includes(q) ||
        c.ruc.includes(q) ||
        (c.nombre_comercial ?? "").toLowerCase().includes(q)
    );
  }, [companies, search]);

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        key: "razon_social",
        header: "Razón Social",
        sortable: true,
        minWidth: "20rem",
        render: (c) => (
          <>
            <CompanyName>{c.razon_social}</CompanyName>
            {c.nombre_comercial && <CompanySub>{c.nombre_comercial}</CompanySub>}
          </>
        ),
      },
      {
        key: "ruc",
        header: "RUC",
        sortable: true,
        width: "14rem",
        render: (c) => <RucText>{c.ruc}</RucText>,
      },
      {
        key: "departamento",
        header: "Ubicación",
        minWidth: "16rem",
        render: (c) => (
          <LocationText>
            {[c.distrito, c.provincia, c.departamento].filter(Boolean).join(", ") || "—"}
          </LocationText>
        ),
      },
      {
        key: "modo_produccion",
        header: "Modo",
        width: "11rem",
        render: (c) => (
          <Badge variant={isProduction(c) ? "primary" : "neutral"} size="sm" pill>
            {isProduction(c) ? "Producción" : "Pruebas"}
          </Badge>
        ),
      },
      {
        key: "activo",
        header: "Estado",
        width: "10rem",
        render: (c) => (
          <Badge variant={c.activo ? "success" : "neutral"} size="sm" dot pill>
            {c.activo ? "Activa" : "Inactiva"}
          </Badge>
        ),
      },
      {
        key: "id",
        header: "",
        width: "8rem",
        align: "right",
        render: (c) => (
          <ActionRow>
            <ActionBtn
              title={c.activo ? "Empresa activa" : "Activar empresa"}
              disabled={c.activo || activatingId === c.id}
              onClick={(e) => {
                e.stopPropagation();
                handleActivate(c);
              }}
            >
              <Icon name={c.activo ? "check_circle" : "play_circle"} size={18} />
            </ActionBtn>
          </ActionRow>
        ),
      },
    ],
    // activatingId affects the disabled state of the row action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activatingId]
  );

  return (
    <ContentArea>
      {/* Heading */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <PageHeading>
          <HeadingText>
            <PageTitle>Empresas</PageTitle>
            <PageSubtitle>Administra las empresas emisoras registradas en SUNAT.</PageSubtitle>
          </HeadingText>
          <HeadingActions>
            <Button variant="primary" onClick={() => navigate("/settings")}>
              <Icon name="add" size={16} />
              Nueva Empresa
            </Button>
          </HeadingActions>
        </PageHeading>
      </motion.div>

      {/* KPIs */}
      <KpiGrid variants={staggerContainer} initial="hidden" animate="visible">
        <KpiCard variants={fadeUp}>
          <KpiIcon>
            <Icon name="domain" size={56} />
          </KpiIcon>
          <KpiLabel>Total Empresas</KpiLabel>
          <KpiValue>{meta?.total ?? companies.length}</KpiValue>
          <KpiSub>Registradas en el sistema</KpiSub>
        </KpiCard>

        <KpiCard variants={fadeUp}>
          <KpiIcon>
            <Icon name="verified" size={56} />
          </KpiIcon>
          <KpiLabel>Activas</KpiLabel>
          <KpiValue $color="#16a34a">{meta?.active_count ?? "—"}</KpiValue>
          <KpiSub>Habilitadas para operar</KpiSub>
        </KpiCard>

        <KpiCard variants={fadeUp}>
          <KpiIcon>
            <Icon name="rocket_launch" size={56} />
          </KpiIcon>
          <KpiLabel>En Producción</KpiLabel>
          <KpiValue>{meta?.production_count ?? "—"}</KpiValue>
          <KpiSub>Emitiendo a SUNAT real</KpiSub>
        </KpiCard>
      </KpiGrid>

      {/* Filters */}
      <FilterBar>
        <SearchBox>
          <Icon name="search" size={18} />
          <SearchInput
            placeholder="Buscar por razón social, RUC o nombre comercial…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
      </FilterBar>

      {/* Table */}
      <TableCard>
        <Table<Company>
          data={filtered}
          keyField="id"
          columns={columns}
          loading={loading}
          density="default"
          emptyMessage="No hay empresas registradas todavía."
        />
      </TableCard>
    </ContentArea>
  );
}
