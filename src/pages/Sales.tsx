import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { PageShell } from "../components/layout/PageShell";
import { Modal } from "../components/ui/Modal";
import { Drawer } from "../components/common/Drawer";
import { useToast } from "../components/common/Toast";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { Loader } from "../components/ui/Loader";
import { Skeleton } from "../components/ui/Skeleton";
import { Card, StatCard, ProfileCard, ActionCard, AlertCard } from "../components/ui/Card";

/* ── Layout ─────────────────────────────────────────── */

const ContentArea = styled.div`
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  flex: 1;
`;

const PageHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

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

/* ── Playground card ─────────────────────────────────── */

const Section = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const SectionCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.6rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.border};
`;

const Label = styled.span`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
  font-weight: 500;
  min-width: 8rem;
`;

/* ── Modal form demo ─────────────────────────────────── */

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textSubtle};
`;

const FieldInput = styled.input`
  padding: 1rem 1.2rem;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: 0.8rem;
  color: ${(p) => p.theme.colors.text};
  font-size: 1.4rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background: ${(p) => p.theme.colors.dangerBg};
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.8rem;
  color: ${(p) => p.theme.colors.danger};
  font-size: 1.3rem;
`;

/* ── Skeleton demo helpers ───────────────────────────── */

const SkeletonTwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
  width: 100%;
`;

const SkeletonFourGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.6rem;
  width: 100%;
`;

const DemoCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1.2rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const DemoCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const DemoIconBox = styled.div<{ $color: string }>`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 0.8rem;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DemoValue = styled.p`
  margin: 0;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const DemoLabel = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

/* ── Component ───────────────────────────────────────── */

export default function Sales() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(true);
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [removedTags, setRemovedTags] = useState<string[]>([]);

  const [drawerRightOpen, setDrawerRightOpen] = useState(false);
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
  const [drawerFormOpen, setDrawerFormOpen] = useState(false);

  const { toast } = useToast();

  return (
    <PageShell>
      <ContentArea>
        <PageHeading>
          <div>
            <PageTitle>Sales</PageTitle>
            <PageSubtitle>Playground de componentes reutilizables</PageSubtitle>
          </div>
          <Badge variant="primary">WIP</Badge>
        </PageHeading>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", gap: "3.2rem" }}
        >
          {/* Modales */}
          <Section variants={fadeUp}>
            <SectionTitle>Modal</SectionTitle>
            <SectionCard>
              <Row>
                <Label>Básico</Label>
                <Button variant="outline" onClick={() => setBasicOpen(true)}>
                  <Icon name="open_in_new" size={16} />
                  Abrir modal simple
                </Button>
              </Row>

              <Divider />

              <Row>
                <Label>Formulario</Label>
                <Button onClick={() => setFormOpen(true)}>
                  <Icon name="add_circle" size={16} />
                  Nueva venta
                </Button>
              </Row>

              <Divider />

              <Row>
                <Label>Confirmación</Label>
                <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                  <Icon name="delete" size={16} />
                  Eliminar registro
                </Button>
              </Row>

              <Divider />

              <Row>
                <Label>Grande (lg)</Label>
                <Button variant="outline" onClick={() => setLgOpen(true)}>
                  <Icon name="open_in_full" size={16} />
                  Modal lg
                </Button>
              </Row>
            </SectionCard>
          </Section>

          {/* Drawers */}
          <Section variants={fadeUp}>
            <SectionTitle>Drawer</SectionTitle>
            <Card>
              <Row>
                <Label>Derecha</Label>
                <Button variant="outline" onClick={() => setDrawerRightOpen(true)}>
                  <Icon name="dock_to_left" size={16} />
                  Abrir (derecha)
                </Button>
              </Row>

              <Divider />

              <Row>
                <Label>Izquierda</Label>
                <Button variant="outline" onClick={() => setDrawerLeftOpen(true)}>
                  <Icon name="dock_to_right" size={16} />
                  Abrir (izquierda)
                </Button>
              </Row>

              <Divider />

              <Row>
                <Label>Formulario</Label>
                <Button onClick={() => setDrawerFormOpen(true)}>
                  <Icon name="filter_list" size={16} />
                  Panel de filtros
                </Button>
              </Row>
            </Card>
          </Section>

          {/* Toasts */}
          <Section variants={fadeUp}>
            <SectionTitle>Toast</SectionTitle>
            <Card>
              <Row>
                <Label>Variantes</Label>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      variant: "success",
                      title: "Venta registrada",
                      description: "La transacción se guardó correctamente.",
                    })
                  }
                >
                  <Icon name="check_circle" size={16} />
                  Success
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      variant: "error",
                      title: "Error al guardar",
                      description: "No se pudo completar la operación.",
                    })
                  }
                >
                  <Icon name="error" size={16} />
                  Error
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      variant: "warning",
                      title: "Stock bajo",
                      description: "Quedan 3 unidades de Amoxicilina.",
                    })
                  }
                >
                  <Icon name="warning" size={16} />
                  Warning
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({ variant: "info", title: "Sincronización en curso" })}
                >
                  <Icon name="info" size={16} />
                  Info
                </Button>
              </Row>

              <Divider />

              <Row>
                <Label>Persistente</Label>
                <Button
                  onClick={() =>
                    toast({
                      variant: "info",
                      title: "No se cierra solo",
                      description: "duration=0 — debes cerrarlo manualmente.",
                      duration: 0,
                    })
                  }
                >
                  <Icon name="push_pin" size={16} />
                  Sin auto-cierre
                </Button>
              </Row>
            </Card>
          </Section>

          {/* Botones */}
          <Section variants={fadeUp}>
            <SectionTitle>Button</SectionTitle>
            <SectionCard>
              <Row>
                <Label>Variantes</Label>
                <Button variant="primary">Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </Row>
              <Divider />
              <Row>
                <Label>Con icon</Label>
                <Button>
                  <Icon name="add" size={16} />
                  Nuevo
                </Button>
                <Button variant="outline">
                  <Icon name="download" size={16} />
                  Exportar
                </Button>
              </Row>
            </SectionCard>
          </Section>

          {/* Badges */}
          <Section variants={fadeUp}>
            <SectionTitle>Badge</SectionTitle>
            <SectionCard>

              <Row>
                <Label>Subtle</Label>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </Row>
              <Divider />
              <Row>
                <Label>Solid</Label>
                <Badge appearance="solid" variant="primary">Primary</Badge>
                <Badge appearance="solid" variant="success">Success</Badge>
                <Badge appearance="solid" variant="danger">Danger</Badge>
                <Badge appearance="solid" variant="warning">Warning</Badge>
                <Badge appearance="solid" variant="neutral">Neutral</Badge>
              </Row>
              <Divider />
              <Row>
                <Label>Outline</Label>
                <Badge appearance="outline" variant="primary">Primary</Badge>
                <Badge appearance="outline" variant="success">Success</Badge>
                <Badge appearance="outline" variant="danger">Danger</Badge>
                <Badge appearance="outline" variant="warning">Warning</Badge>
                <Badge appearance="outline" variant="neutral">Neutral</Badge>
              </Row>
              <Divider />

              <Row>
                <Label>Tamaños</Label>
                <Badge size="sm" variant="primary">Small</Badge>
                <Badge size="md" variant="primary">Medium</Badge>
                <Badge size="lg" variant="primary">Large</Badge>
                <Badge size="sm" appearance="solid" variant="success">sm</Badge>
                <Badge size="md" appearance="solid" variant="success">md</Badge>
                <Badge size="lg" appearance="solid" variant="success">lg</Badge>
              </Row>
              <Divider />

              <Row>
                <Label>Pill</Label>
                <Badge pill variant="primary">Primary</Badge>
                <Badge pill appearance="solid" variant="success">Activo</Badge>
                <Badge pill appearance="outline" variant="danger">Crítico</Badge>
                <Badge pill appearance="solid" variant="warning">Revisar</Badge>
                <Badge pill variant="neutral">Neutro</Badge>
              </Row>
              <Divider />

              <Row>
                <Label>Con punto</Label>
                <Badge dot variant="success">En línea</Badge>
                <Badge dot variant="warning">Pendiente</Badge>
                <Badge dot variant="danger">Desconectado</Badge>
                <Badge dot pill variant="primary">Activo</Badge>
                <Badge dot variant="neutral">Inactivo</Badge>
              </Row>
              <Divider />

              <Row>
                <Label>Con ícono</Label>
                <Badge icon="check_circle" variant="success">Aprobado</Badge>
                <Badge icon="error" appearance="solid" variant="danger">Error crítico</Badge>
                <Badge icon="warning" variant="warning">Alerta</Badge>
                <Badge icon="schedule" appearance="outline" variant="neutral">Pendiente</Badge>
                <Badge icon="star" appearance="solid" variant="primary">Destacado</Badge>
              </Row>
              <Divider />

              <Row>
                <Label>Interactivo</Label>
                <Badge variant="primary" onClick={() => {}}>Cliqueable</Badge>
                <Badge appearance="outline" variant="success" onClick={() => {}}>Ver más</Badge>
                <Badge icon="add" appearance="solid" variant="primary" pill onClick={() => {}}>
                  Agregar
                </Badge>
                <Badge icon="filter_list" appearance="outline" variant="neutral" size="sm" onClick={() => {}}>
                  Filtrar
                </Badge>
              </Row>
              <Divider />

              <Row>
                <Label>Etiquetas</Label>
                {["React", "TypeScript", "Vite", "styled-components", "Tailwind"].map(
                  (tag) =>
                    !removedTags.includes(tag) && (
                      <Badge
                        key={tag}
                        appearance="outline"
                        variant="neutral"
                        pill
                        onRemove={() => setRemovedTags((prev) => [...prev, tag])}
                      >
                        {tag}
                      </Badge>
                    ),
                )}
                {removedTags.length > 0 && (
                  <Badge
                    appearance="subtle"
                    variant="primary"
                    icon="refresh"
                    onClick={() => setRemovedTags([])}
                  >
                    Restaurar
                  </Badge>
                )}
              </Row>

            </SectionCard>
          </Section>

          {/* Cards */}
          <Section variants={fadeUp}>
            <SectionTitle>Cards</SectionTitle>

            {/* AlertCard */}
            <Card variant="flat">
              <Card.Body padding="0">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {!dismissedAlert && (
                    <AlertCard
                      variant="warning"
                      title="Stock bajo detectado"
                      description="23 productos están por debajo del mínimo recomendado. Revisa el inventario antes del próximo turno."
                      action={{ label: "Ir a inventario", onClick: () => {} }}
                      onDismiss={() => setDismissedAlert(true)}
                    />
                  )}
                  {dismissedAlert && (
                    <AlertCard
                      variant="success"
                      title="Alerta descartada"
                      description="Puedes volver a mostrarla recargando la página."
                    />
                  )}
                  <AlertCard variant="danger" title="3 productos vencidos" description="Deben retirarse del stock de inmediato." />
                  <AlertCard variant="info" title="Actualización disponible" description="Hay una nueva versión del sistema. Se instalará esta noche." />
                </div>
              </Card.Body>
            </Card>

            {/* StatCard */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.6rem" }}>
              <StatCard
                icon="point_of_sale"
                iconVariant="primary"
                label="Ventas del mes"
                value="1 284"
                delta={{ value: "+12%", direction: "up" }}
                badge={{ label: "Mayo", variant: "neutral" }}
              />
              <StatCard
                icon="inventory_2"
                iconVariant="success"
                label="Productos activos"
                value="348"
                delta={{ value: "+3", direction: "up" }}
                badge={{ label: "En stock", variant: "success" }}
              />
              <StatCard
                icon="warning"
                iconVariant="warning"
                label="Stock bajo"
                value="23"
                delta={{ value: "-5", direction: "down" }}
                badge={{ label: "Revisar", variant: "warning" }}
              />
              <StatCard
                icon="event_busy"
                iconVariant="danger"
                label="Por vencer"
                value="7"
                delta={{ value: "sin cambio", direction: "flat" }}
                badge={{ label: "Urgente", variant: "danger" }}
              />
            </div>

            {/* ProfileCard */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.6rem" }}>
              <ProfileCard
                name="Dra. María López"
                role="Farmacéutica Jefe"
                meta="Turno mañana · Ext. 204"
                stats={[{ label: "Atendidos hoy", value: 24 }, { label: "Pendientes", value: 3 }]}
                action={{ label: "Ver perfil completo", onClick: () => {} }}
              />
              <ProfileCard
                name="Carlos Mendoza"
                role="Asistente de Farmacia"
                meta="Turno tarde · Ext. 218"
                stats={[{ label: "Atendidos hoy", value: 18 }, { label: "Pendientes", value: 0 }]}
                action={{ label: "Ver perfil completo", onClick: () => {} }}
              />
            </div>

            {/* ActionCard grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.6rem" }}>
              <ActionCard icon="add_shopping_cart" label="Nueva venta" description="Registrar transacción" onClick={() => {}} badge="Nuevo" variant="primary" />
              <ActionCard icon="inventory_2" label="Inventario" description="Gestionar stock" onClick={() => {}} />
              <ActionCard icon="receipt_long" label="Historial" description="Ver ventas pasadas" onClick={() => {}} />
              <ActionCard icon="local_shipping" label="Pedidos" description="Órdenes de reposición" onClick={() => {}} />
            </div>

            {/* Card compound */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.6rem" }}>
              <Card>
                <Card.Header
                  title="Resumen semanal"
                  subtitle="Del 9 al 15 de junio"
                  action={<Button variant="ghost"><Icon name="more_horiz" size={18} /></Button>}
                />
                <Card.Body>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {[
                      { label: "Ventas totales", value: "S/ 8 420" },
                      { label: "Ticket promedio", value: "S/ 32.40" },
                      { label: "Productos vendidos", value: "260 unid." },
                    ].map((row) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "1.3rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                        <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text)" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer justify="space-between">
                  <span style={{ fontSize: "1.2rem", color: "var(--color-text-muted)" }}>Actualizado hace 5 min</span>
                  <Button variant="outline">Ver detalles</Button>
                </Card.Footer>
              </Card>

              <Card variant="bordered" hover>
                <Card.Header title="Acceso rápido" subtitle="Atajos frecuentes" divider={false} />
                <Card.Divider />
                <Card.Body>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {[
                      { icon: "print", label: "Imprimir cierre del día" },
                      { icon: "cloud_download", label: "Exportar reporte mensual" },
                      { icon: "settings", label: "Configurar alertas de stock" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        style={{ display: "flex", alignItems: "center", gap: "1.2rem", padding: "1rem", borderRadius: "0.8rem", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "1.3rem", color: "var(--color-text-subtle)", transition: "background 0.15s", width: "100%", textAlign: "left" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                      >
                        <Icon name={item.icon} size={18} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Section>

          {/* Skeleton */}
          <Section variants={fadeUp}>
            <SectionTitle>Skeleton</SectionTitle>
            <SectionCard>
              {/* Formas base */}
              <Row style={{ alignItems: "flex-end" }}>
                <Label>Base</Label>
                <div style={{ flex: 1 }}>
                  <Skeleton />
                </div>
                <Skeleton width="14rem" height="1.4rem" />
                <Skeleton width="4rem" height="4rem" radius="0.8rem" />
                <Skeleton width="4rem" circle />
              </Row>

              <Divider />

              {/* Text */}
              <Row style={{ alignItems: "flex-start" }}>
                <Label>Text</Label>
                <div style={{ flex: 1 }}>
                  <Skeleton.Text lines={3} />
                </div>
                <div style={{ flex: 1 }}>
                  <Skeleton.Text lines={4} lineHeight="1.2rem" lastLineWidth="45%" />
                </div>
              </Row>

              <Divider />

              {/* Avatar */}
              <Row style={{ alignItems: "flex-end" }}>
                <Label>Avatar</Label>
                <Skeleton.Avatar size="xs" />
                <Skeleton.Avatar size="sm" />
                <Skeleton.Avatar size="md" />
                <Skeleton.Avatar size="lg" />
                <Skeleton.Avatar size="xl" />
              </Row>

              <Divider />

              {/* Card */}
              <Row style={{ alignItems: "flex-start" }}>
                <Label>Card</Label>
                <SkeletonTwoCol>
                  <Skeleton.Card lines={3} />
                  <Skeleton.Card showAvatar={false} lines={4} />
                </SkeletonTwoCol>
              </Row>

              <Divider />

              {/* KpiCard */}
              <Row style={{ alignItems: "flex-start" }}>
                <Label>KpiCard</Label>
                <SkeletonTwoCol>
                  <Skeleton.KpiCard />
                  <Skeleton.KpiCard />
                </SkeletonTwoCol>
              </Row>

              <Divider />

              {/* Table */}
              <Row style={{ alignItems: "flex-start" }}>
                <Label>Table</Label>
                <div style={{ flex: 1 }}>
                  <Skeleton.Table rows={4} cols={4} />
                </div>
              </Row>

              <Divider />

              {/* Demo carga real */}
              <Row>
                <Label>Demo</Label>
                <Button
                  variant={loadingDemo ? "primary" : "outline"}
                  onClick={() => setLoadingDemo((v) => !v)}
                >
                  <Icon name={loadingDemo ? "check_circle" : "hourglass_empty"} size={16} />
                  {loadingDemo ? "Mostrar datos" : "Simular carga"}
                </Button>
              </Row>
              <SkeletonFourGrid>
                {loadingDemo ? (
                  <>
                    <Skeleton.KpiCard />
                    <Skeleton.KpiCard />
                    <Skeleton.KpiCard />
                    <Skeleton.KpiCard />
                  </>
                ) : (
                  <>
                    <DemoCard>
                      <DemoCardTop>
                        <DemoIconBox $color="rgba(0,108,117,0.15)">
                          <Icon name="medication" size={20} />
                        </DemoIconBox>
                        <Badge variant="primary">+12%</Badge>
                      </DemoCardTop>
                      <div><DemoLabel>Ventas del mes</DemoLabel><DemoValue>1 284</DemoValue></div>
                    </DemoCard>
                    <DemoCard>
                      <DemoCardTop>
                        <DemoIconBox $color="rgba(34,197,94,0.15)">
                          <Icon name="inventory_2" size={20} />
                        </DemoIconBox>
                        <Badge variant="success">OK</Badge>
                      </DemoCardTop>
                      <div><DemoLabel>Productos activos</DemoLabel><DemoValue>348</DemoValue></div>
                    </DemoCard>
                    <DemoCard>
                      <DemoCardTop>
                        <DemoIconBox $color="rgba(234,179,8,0.15)">
                          <Icon name="warning" size={20} />
                        </DemoIconBox>
                        <Badge variant="warning">Revisar</Badge>
                      </DemoCardTop>
                      <div><DemoLabel>Stock bajo</DemoLabel><DemoValue>23</DemoValue></div>
                    </DemoCard>
                    <DemoCard>
                      <DemoCardTop>
                        <DemoIconBox $color="rgba(239,68,68,0.15)">
                          <Icon name="event_busy" size={20} />
                        </DemoIconBox>
                        <Badge variant="danger">Urgente</Badge>
                      </DemoCardTop>
                      <div><DemoLabel>Por vencer</DemoLabel><DemoValue>7</DemoValue></div>
                    </DemoCard>
                  </>
                )}
              </SkeletonFourGrid>
            </SectionCard>
          </Section>

          {/* Loader */}
          <Section variants={fadeUp}>
            <SectionTitle>Loader</SectionTitle>
            <SectionCard>
              <Row>
                <Label>Variantes</Label>
                <Loader variant="spinner" size="md" />
                <Loader variant="dots" size="md" />
                <Loader variant="pulse" size="md" />
              </Row>
              <Divider />
              <Row>
                <Label>Tamaños</Label>
                <Loader size="xs" />
                <Loader size="sm" />
                <Loader size="md" />
                <Loader size="lg" />
                <Loader size="xl" />
              </Row>
              <Divider />
              <Row>
                <Label>Colores</Label>
                <Loader color="primary" />
                <Loader color="success" />
                <Loader color="danger" />
                <Loader color="warning" />
                <Loader color="muted" />
                <Loader color="white" />
              </Row>
              <Divider />
              <Row>
                <Label>Con texto</Label>
                <Loader variant="spinner" text="Cargando..." />
                <Loader variant="dots" text="Procesando" color="success" />
              </Row>
              <Divider />
              <Row style={{ alignItems: "flex-start" }}>
                <Label>Overlay</Label>
                <div style={{ position: "relative", width: "16rem", height: "8rem", background: "var(--color-surface)", borderRadius: "0.8rem", border: "1px solid var(--color-border-strong)" }}>
                  <Loader overlay text="Cargando" size="sm" />
                </div>
              </Row>
            </SectionCard>
          </Section>
        </motion.div>
      </ContentArea>

      {/* ── Modales ──────────────────────────────────────── */}

      {/* 1. Básico */}
      <Modal
        open={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Modal básico"
        description="Este es un modal simple sin formulario."
        size="sm"
      >
        <p style={{ margin: 0, fontSize: "1.4rem", color: "#94a3b8", lineHeight: 1.6 }}>
          Puedes poner cualquier contenido aquí — texto, listas, imágenes. El scroll funciona
          automáticamente si el contenido supera la altura de la pantalla.
        </p>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setBasicOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setBasicOpen(false)}>Aceptar</Button>
        </Modal.Footer>
      </Modal>

      {/* 2. Formulario */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Nueva venta"
        description="Registra los datos de la transacción"
        preventClose
      >
        <FormGrid>
          <FieldLabel>
            Producto
            <FieldInput type="text" placeholder="Buscar producto..." />
          </FieldLabel>
          <FieldLabel>
            Cantidad
            <FieldInput type="number" placeholder="0" min={1} />
          </FieldLabel>
          <FieldLabel>
            Cliente
            <FieldInput type="text" placeholder="Nombre del cliente" />
          </FieldLabel>
        </FormGrid>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setFormOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setFormOpen(false)}>
            <Icon name="check" size={16} />
            Registrar venta
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 3. Confirmación destructiva */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Eliminar registro"
        size="sm"
        preventClose
      >
        <WarningBox>
          <Icon name="warning" filled size={18} />
          <span>
            Esta acción no se puede deshacer. El registro será eliminado permanentemente del
            sistema.
          </span>
        </WarningBox>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => setConfirmOpen(false)}
            style={{ background: "#ef4444", boxShadow: "none" }}
          >
            <Icon name="delete" size={16} />
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 4. Grande */}
      <Modal
        open={lgOpen}
        onClose={() => setLgOpen(false)}
        title="Vista detallada"
        description="Modal tamaño lg para contenido extenso"
        size="lg"
      >
        <p style={{ margin: 0, fontSize: "1.4rem", color: "#94a3b8", lineHeight: 1.6 }}>
          Este modal usa <strong style={{ color: "#f1f5f9" }}>size="lg"</strong> — ideal para
          tablas, formularios complejos o vistas detalle. El ancho máximo es 72rem y el scroll
          vertical se activa automáticamente.
        </p>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setLgOpen(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Drawers ──────────────────────────────────────── */}

      {/* 1. Lateral derecho (default) */}
      <Drawer
        open={drawerRightOpen}
        onClose={() => setDrawerRightOpen(false)}
        title="Detalle de venta"
        description="Panel lateral deslizante desde la derecha"
      >
        <p style={{ margin: 0, fontSize: "1.4rem", color: "#94a3b8", lineHeight: 1.6 }}>
          El Drawer se desliza desde el lateral y es ideal para detalles, filtros o formularios
          secundarios sin perder el contexto de la página.
        </p>
        <Drawer.Footer>
          <Button variant="outline" onClick={() => setDrawerRightOpen(false)}>
            Cerrar
          </Button>
        </Drawer.Footer>
      </Drawer>

      {/* 2. Lateral izquierdo */}
      <Drawer
        open={drawerLeftOpen}
        onClose={() => setDrawerLeftOpen(false)}
        side="left"
        size="sm"
        title="Menú lateral"
        description={'side="left", size="sm"'}
      >
        <p style={{ margin: 0, fontSize: "1.4rem", color: "#94a3b8", lineHeight: 1.6 }}>
          Usa <strong style={{ color: "#f1f5f9" }}>side="left"</strong> para navegación o paneles
          contextuales que entran desde la izquierda.
        </p>
      </Drawer>

      {/* 3. Formulario con preventClose */}
      <Drawer
        open={drawerFormOpen}
        onClose={() => setDrawerFormOpen(false)}
        size="md"
        title="Filtros de ventas"
        description="No se cierra al hacer clic fuera"
        preventClose
      >
        <FormGrid>
          <FieldLabel>
            Cliente
            <FieldInput type="text" placeholder="Nombre del cliente" />
          </FieldLabel>
          <FieldLabel>
            Desde
            <FieldInput type="date" />
          </FieldLabel>
          <FieldLabel>
            Hasta
            <FieldInput type="date" />
          </FieldLabel>
        </FormGrid>
        <Drawer.Footer>
          <Button variant="outline" onClick={() => setDrawerFormOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setDrawerFormOpen(false)}>
            <Icon name="check" size={16} />
            Aplicar filtros
          </Button>
        </Drawer.Footer>
      </Drawer>
    </PageShell>
  );
}
