/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="react-just-ui" />
/// <reference types="preact" />
/// <reference types="preact-iso" />
/// <reference lib="webworker" />

interface ImportMetaEnv {
  readonly NODE_ENV: string;
  readonly BUILD_ID: string;
  readonly VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm' {
  export interface RenderConfig {
    autoResize?: boolean;
    devicePixelRatio?: number;
    freezeOnOffscreen?: boolean;
  }

  export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

  export type Data = string | ArrayBuffer | Record<string, unknown>;

  export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

  export interface Layout {
    align: [number, number];
    fit: Fit;
  }

  export interface Config {
    autoplay?: boolean;
    backgroundColor?: string;
    canvas: HTMLCanvasElement;
    data?: Data;
    layout?: Layout;
    loop?: boolean;
    marker?: string;
    mode?: Mode;
    renderConfig?: RenderConfig;
    segment?: [number, number];
    speed?: number;
    src?: string;
    themeId?: string;
    useFrameInterpolation?: boolean;
  }

  export class DotLottie {
    loop: boolean;
    backgroundColor: string;
    speed: number;
    mode: Mode;
    isPlaying: boolean;
    constructor(config: DotLottieConfig);
    setLoop(loop: boolean): void;
    setBackgroundColor(backgroundColor: string): void;
    setMode(mode: Mode): void;
    setSpeed(speed: number): void;
    play(): void;
    stop(): void;
    load(config: Omit<DotLottieConfig, 'canvas'>): void;
    destroy(): void;
    resize(): void;
  }

  export class DotLottieWorker extends DotLottie {
    workerId: string;
  }
}