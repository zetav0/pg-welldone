# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then build with Vite
npm run lint      # Run ESLint (flat config, v9+)
npm run format    # Prettier --write over src/**/*.{ts,tsx}
npm run preview   # Preview the production build locally
```

No test framework is configured.

## Architecture

"PharmaCore" — a React 19 + TypeScript + Vite pharmacy-management dashboard SPA. UI copy is in Spanish; code identifiers are in English. Entry flow: `index.html` → `src/main.tsx` → `src/App.tsx`.

- **Routing** lives in `src/App.tsx` via `createBrowserRouter` (react-router-dom v7). `/` redirects to `/login`; routes are `/login`, `/dashboard`, `/inventory`, `/sales`. There is no auth guard — `Login` navigates to `/dashboard` on submit and `Sidebar` logout navigates back to `/login`. `/sales` is currently a component playground (WIP).
- **Provider stack** (in `App.tsx`): styled-components `ThemeProvider` → `GlobalStyle` → `AppProvider` → `RouterProvider`.
- **Pages** (`src/pages/`) compose the app. Authenticated pages wrap their content in `<PageShell>` (`src/components/layout/`), which renders `Sidebar` + `TopHeader` and animates route transitions with `AnimatePresence` keyed on `location.pathname`.
- **Global state** is `src/context/AppContext.tsx` (`useApp` hook). Currently only a demo counter — this is the place to add real app-wide state.
- **Data** is static mock data in `src/data/` (`dashboard.ts`, `inventory.ts`) with exported TS types (e.g. `Product`, `StockStatus`). No API/backend integration exists.

## Styling (important)

Two styling systems coexist: **styled-components** (most existing components) and **Tailwind v4** (now wired up). Match whichever the file/feature you are editing already uses.

- `src/theme.ts` is the source of truth for styled-components: the `theme` object (colors, fonts), the `AppTheme` type, and `GlobalStyle`. `src/styled.d.ts` augments styled-components' `DefaultTheme` so `p.theme.colors.*` is typed in every styled block. Pull colors from the theme rather than hardcoding hex values.
- **Tailwind v4** is enabled via the `@tailwindcss/vite` plugin (`vite.config.ts`) and `@import "tailwindcss"` in `src/index.css`. The theme colors are mirrored there in an `@theme` block as CSS tokens, so semantic utilities work: `bg-primary`, `text-text-muted`, `border-border-strong`, `bg-surface`, etc. (kebab-case of the `theme.colors` keys). Keep that `@theme` block in sync with `src/theme.ts`.
- **Fluid rem scale**: `GlobalStyle` sets `html { font-size: clamp(...) }` so **1rem ≈ 10px** (at the 1440px design base). This affects Tailwind too — its rem-based spacing/text scale is shrunk. To preserve the original design, components use arbitrary rem values in Tailwind (e.g. `px-[1.6rem]`, `text-[1.4rem]`) rather than the default scale. Keep this 10px-per-rem mental model when adding styles.
- **Transient props**: styled components take `$`-prefixed props (e.g. `$variant`, `$size`, `$hasError`) so they aren't forwarded to the DOM. Follow this convention for any styling-only prop.

## Patterns & conventions

- **Animations**: framer-motion. Reusable `Variants` (`fadeUp`, `fadeIn`, `staggerContainer`, `slideInRight`) live in `src/lib/variants.ts` — reuse these rather than redefining inline. When combining `styled(motion.x)` with HTML attribute props, note `Button` (`src/components/ui/Button.tsx`) omits framer/HTML event-handler type conflicts via a `ConflictingEvents` Omit — mirror that approach.
- **Forms**: react-hook-form + Zod via `@hookform/resolvers/zod`. See `src/pages/Login.tsx` — define a `z.object` schema, `z.infer` the field type, wire with `zodResolver`. Inputs use the `forwardRef` `FormInput` (`src/components/ui/`) which spreads `register()` and renders the error message.
- **Icons**: Material Symbols (loaded via Google Fonts in `index.html`). Use the `Icon` component (`src/components/ui/Icon.tsx`) — `name` is the symbol ligature, `filled` toggles the fill axis, `size` is in px (converted to rem internally).
- **Reusable UI** splits across two directories. `src/components/ui/` holds the original components (styled-components or mixed). `src/components/common/` holds a newer Tailwind-only layer: `ButtonCustom`, `InputCustom`, `SelectCustom`, `CheckboxCustom`, `RadioCustom`, `RadioGroupCustom`. All `common/` components follow three conventions: a `Custom` name suffix, `forwardRef`, and a `dataCy` prop for test selectors. Dashboard widgets live in `src/components/dashboard/`, layout chrome in `src/components/layout/`.
- **Modal** (`src/components/ui/Modal.tsx`) is built on `@radix-ui/react-dialog` + framer-motion + styled-components. Props: `open`, `onClose`, `title`, `description`, `size` (`sm`/`md`/`lg`/`xl`), `hideClose`, `preventClose`. Use `<Modal.Footer>` for the action row.
- **`cn()` utility** (`src/lib/utils.ts`) wraps clsx + tailwind-merge. Use it to merge conditional Tailwind classes instead of string concatenation.
- **Path alias**: `@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig`). Prefer `@/lib/utils`, `@/components/...`, etc. over relative paths that cross directory boundaries.

Note: `src/Common.tsx` and `src/App.css` are leftovers from the Vite starter and are not imported anywhere.

## TypeScript & Linting

`tsconfig.app.json` targets ES2023, bundler module resolution, `verbatimModuleSyntax` (use `import type` for type-only imports) and `erasableSyntaxOnly`. Strict unused checks (`noUnusedLocals`, `noUnusedParameters`) are on. `build` runs `tsc -b` first, so type errors block the build; build-info cache lives under `node_modules/.tmp/`.

ESLint uses the flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. `dist` is ignored. Type-aware lint rules are not enabled by default.
