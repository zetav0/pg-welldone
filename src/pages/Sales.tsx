import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/variants";
import { PageShell } from "../components/layout/PageShell";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";

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

const Card = styled.div`
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

/* ── Component ───────────────────────────────────────── */

export default function Sales() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);

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
            <Card>
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
            </Card>
          </Section>

          {/* Botones */}
          <Section variants={fadeUp}>
            <SectionTitle>Button</SectionTitle>
            <Card>
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
            </Card>
          </Section>

          {/* Badges */}
          <Section variants={fadeUp}>
            <SectionTitle>Badge</SectionTitle>
            <Card>
              <Row>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </Row>
            </Card>
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
    </PageShell>
  );
}
