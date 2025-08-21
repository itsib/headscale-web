let CANVAS_CACHE: HTMLCanvasElement | null = null;
let CONTEXT_CACHE: CanvasRenderingContext2D | null = null;

function getContext2D(): CanvasRenderingContext2D | null {
  if (!CANVAS_CACHE) {
    CANVAS_CACHE = document.createElement('canvas');
  }
  if (!CONTEXT_CACHE) {
    CONTEXT_CACHE = CANVAS_CACHE.getContext('2d');
  }
  return CONTEXT_CACHE;
}

export interface FontConfig {
  size?: number;
  weight?: number;
  family?: string;
}

export function getStringSize(value: number | string, config: FontConfig) {
  const { size = 14, family = 'sans-serif', weight = 400 } = config;

  const context = getContext2D();
  if (!context) return null;

  context.font = `${weight} ${size}px ${family}`;

  const metric: TextMetrics = context.measureText(`${value}`);

  return {
    width: Math.ceil(metric.width),
    height: Math.ceil(metric.fontBoundingBoxAscent + metric.fontBoundingBoxDescent),
  };
}
