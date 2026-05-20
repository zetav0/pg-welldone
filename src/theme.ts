import { createGlobalStyle } from "styled-components";

export interface AppTheme {
  colors: {
    primary: string;
    primaryBg: string;
    primaryBgStrong: string;
    background: string;
    surface: string;
    danger: string;
    dangerBg: string;
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    border: string;
    borderStrong: string;
    inputBg: string;
    chipBg: string;
    white: string;
  };
  fonts: {
    sans: string;
  };
}

export const theme: AppTheme = {
  colors: {
    primary: "#006c75",
    primaryBg: "rgba(0,108,117,0.10)",
    primaryBgStrong: "rgba(0,108,117,0.25)",
    background: "#0f172a",
    surface: "#1e293b",
    danger: "#ef4444",
    dangerBg: "rgba(239,68,68,0.10)",
    success: "#22c55e",
    successBg: "rgba(34,197,94,0.10)",
    warning: "#eab308",
    warningBg: "rgba(234,179,8,0.10)",
    text: "#f1f5f9",
    textMuted: "#64748b",
    textSubtle: "#94a3b8",
    border: "#1e293b",
    borderStrong: "#334155",
    inputBg: "#0f172a",
    chipBg: "#1e293b",
    white: "#ffffff",
  },
  fonts: {
    sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
};

export const GlobalStyle = createGlobalStyle`
  html {
    /*
      Fluid font scale — 1rem tracks screen width:
        ≤ 640px   → 8px   (mobile)
           768px  → ~8.4px
          1024px  → ~9.2px
          1440px  → 10px  (design base)
          1920px  → 11.4px
          2560px  → 13px  (QHD / 4K cap)
        > 2560px  → 13px  (capped)

      Formula: 0.36em = 5.76px fixed offset
               0.29vw = grows with viewport
      Anchored: 0.36×16 + 0.29×14.4 = 5.76 + 4.18 ≈ 10px at 1440px
    */
    font-size: clamp(50%, calc(0.36em + 0.29vw), 81.25%);
  }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: ${(p) => p.theme.fonts.sans};
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    min-height: 100svh;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    user-select: none;
    display: inline-flex;
    line-height: 1;
  }

  .filled-icon {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
`;
