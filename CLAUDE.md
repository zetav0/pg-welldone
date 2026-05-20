# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then build with Vite
npm run lint      # Run ESLint (flat config, v9+)
npm run preview   # Preview the production build locally
```

No test framework is configured.

## Architecture

React 19 + TypeScript + Vite starter. Entry point is `index.html` → `src/main.tsx` → `src/App.tsx`.

- `src/main.tsx` — mounts `<App>` to `#root` via `createRoot`
- `src/App.tsx` — root component; owns application state
- `src/Common.tsx` — reusable presentational component accepting a `label` prop
- `src/assets/` — static images imported by components
- `public/` — files served as-is (favicon, icon sprites)

No external state management, routing, or API integration is present.

## TypeScript & Linting

`tsconfig.app.json` targets ES2023 with strict unused-variable checks (`noUnusedLocals`, `noUnusedParameters`). Build artifacts are cached in `.tmp/`. The build script runs `tsc -b` first, so TypeScript errors block the build.

ESLint uses the flat config format (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. Type-aware lint rules are not enabled by default but can be added.
