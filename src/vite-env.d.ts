/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKOFFICE_BASE_URL: string;
  readonly VITE_GOOGLE_KEY: string;
  readonly VITE_SERVER_WS: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_GOOGLE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
