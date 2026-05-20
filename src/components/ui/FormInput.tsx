import { forwardRef, useState } from "react";
import styled from "styled-components";
import { Icon } from "./Icon";

/* ── Styled components ──────────────────────────────── */

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FieldLabel = styled.label`
  font-size: 1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const InputShell = styled.div`
  position: relative;
`;

const IconSlot = styled.span`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

const StyledInput = styled.input<{ $hasError: boolean; $hasToggle: boolean }>`
  width: 100%;
  box-sizing: border-box;
  background: ${(p) => p.theme.colors.inputBg};
  border: 1px solid ${(p) => (p.$hasError ? p.theme.colors.danger : p.theme.colors.borderStrong)};
  border-radius: 0.8rem;
  padding: 1.2rem ${(p) => (p.$hasToggle ? "4.4rem" : "1.6rem")} 1.2rem 4rem;
  font-size: 1.4rem;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }

  &:focus {
    border-color: ${(p) => (p.$hasError ? p.theme.colors.danger : p.theme.colors.primary)};
    box-shadow: 0 0 0 3px
      ${(p) => (p.$hasError ? "rgba(239,68,68,0.12)" : p.theme.colors.primaryBg)};
  }
`;

const ErrorHint = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

/* ── Props ──────────────────────────────────────────── */

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  error?: string;
}

/* ── Component ──────────────────────────────────────── */

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, error, type, id, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <FieldGroup>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <InputShell>
          <IconSlot>
            <Icon name={icon} size={18} />
          </IconSlot>

          <StyledInput
            ref={ref}
            id={id}
            type={resolvedType}
            $hasError={!!error}
            $hasToggle={isPassword}
            {...rest}
          />

          {isPassword && (
            <ToggleButton
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} size={18} />
            </ToggleButton>
          )}
        </InputShell>

        {error && (
          <ErrorHint>
            <Icon name="error" size={14} />
            {error}
          </ErrorHint>
        )}
      </FieldGroup>
    );
  }
);

FormInput.displayName = "FormInput";
