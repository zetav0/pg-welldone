import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useApp, type AuthUser } from "../context/AppContext";
import { Icon } from "../components/ui/Icon";
import { FormInput } from "../components/ui/FormInput";
import { useToast } from "../components/common/Toast";
import { RestApi } from "../services/restApi";

/* ── API types ───────────────────────────────────────── */

interface LoginResponse {
  message: string;
  user: AuthUser;
  access_token: string;
  token_type: string;
}

/* ── Validation schema ──────────────────────────────── */

const loginSchema = z.object({
  email: z.string().min(1, "El correo es requerido").email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginFields = z.infer<typeof loginSchema>;

/* ── Styled components ──────────────────────────────── */

const Page = styled.div`
  min-height: 100svh;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 42rem;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 3.2rem;
`;

const LogoIcon = styled.div`
  height: 4.8rem;
  width: 4.8rem;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.white};
  box-shadow: 0 10px 15px -3px ${(p) => p.theme.colors.primaryBgStrong};
`;

const AppName = styled.p`
  margin: 0;
  font-size: 2.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.05rem;
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

const Card = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border-radius: 2rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  padding: 3.2rem;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 2.4rem;
  font-weight: 900;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.05rem;
`;

const CardSubtitle = styled.p`
  margin: 0.4rem 0 2.4rem;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const CounterBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  background: ${(p) => p.theme.colors.primaryBg};
  border: 1px solid ${(p) => p.theme.colors.primaryBgStrong};
  border-radius: 0.8rem;
  margin-bottom: 2.4rem;
  color: ${(p) => p.theme.colors.primary};
`;

const CounterText = styled.span`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textMuted};
`;

const CounterValue = styled.strong`
  color: ${(p) => p.theme.colors.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  border-radius: 0.8rem;
  font-weight: 700;
  font-size: 1.4rem;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 14px -2px ${(p) => p.theme.colors.primaryBgStrong};
  transition:
    background 0.15s,
    opacity 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.88;
  }
`;

const PageFooter = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textSubtle};
  margin: 2.4rem 0 0;
`;

/* ── Component ──────────────────────────────────────── */

export default function Login() {
  const navigate = useNavigate();
  const { count, login } = useApp();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email:    "admin@sistema-sunat.com",
      password: "Admin123!@#",
    },
  });

  function onSubmit(data: LoginFields) {
    setLoading(true);
    RestApi.post<LoginResponse>("/api/auth/login", {
      email:      data.email,
      password:   data.password,
      token_name: "API Access Token",
      abilities:  ["*"],
    }).subscribe({
      next: (response) => {
        login(response.user, response.access_token);
        navigate("/dashboard");
      },
      error: (error: unknown) => {
        setLoading(false);
        const message =
          error instanceof Error ? error.message : "Error al conectar con el servidor";
        toast({ variant: "error", title: "Error de autenticación", description: message });
      },
    });
  }

  return (
    <Page>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Container>
          <LogoArea>
            <LogoIcon>
              <Icon name="medical_services" filled size={24} />
            </LogoIcon>
            <div>
              <AppName>PharmaCore</AppName>
              <AppSub>Central Hub</AppSub>
            </div>
          </LogoArea>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          >
            <Card>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardSubtitle>Ingresa tus credenciales para continuar</CardSubtitle>

              <CounterBadge>
                <Icon name="123" size={18} />
                <CounterText>
                  Contador global: <CounterValue>{count}</CounterValue>
                </CounterText>
              </CounterBadge>

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormInput
                  id="email"
                  label="Correo electrónico"
                  icon="mail"
                  type="email"
                  placeholder="usuario@pharmacore.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <FormInput
                  id="password"
                  label="Contraseña"
                  icon="lock"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? "Verificando…" : "Ingresar al sistema"}
                </SubmitButton>
              </Form>
            </Card>
          </motion.div>

          <PageFooter>PharmaCore v2.4.0-Stable • Acceso restringido</PageFooter>

        </Container>
      </motion.div>
    </Page>
  );
}
