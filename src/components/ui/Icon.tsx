import styled from "styled-components";

interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
}

const IconSpan = styled.span<{ $size: number }>`
  font-size: ${(p) => p.$size / 10}rem;
  flex-shrink: 0;
`;

export function Icon({ name, filled = false, size = 24 }: IconProps) {
  const className = filled ? "material-symbols-outlined filled-icon" : "material-symbols-outlined";
  return (
    <IconSpan className={className} $size={size}>
      {name}
    </IconSpan>
  );
}
