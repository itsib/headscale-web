/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="react-just-ui" />
/// <reference types="@types/react" />
/// <reference lib="webworker" />


interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly VITE_BUILD_ID: string;
  readonly VITE_ACCESS_URL?: string;
  readonly VITE_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
