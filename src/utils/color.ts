/* eslint-disable prefer-const,no-case-declarations */
/**
 * Generates the same unique color for the string value (salt).
 * CYRB53 Hash Algorithm
 *
 * @param str any string
 * @param seed if you need different colors for same string
 */
export function hexColorByAnyString(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return '#' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).substring(0, 6);
}

export function rgbToHex(r: number, g: number, b: number, a?: number): string {
  let rHex = r.toString(16).padStart(2, '0');
  let gHex = g.toString(16).padStart(2, '0');
  let bHex = b.toString(16).padStart(2, '0');
  let aHex = '';

  if (a != null) {
    aHex = Math.round((255 * a)).toString(16).padStart(2, '0');
  }

  return '#' + rHex + gHex + bHex + aHex;
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number];
export function rgbToHsl(r: number, g: number, b: number, a: number): [number, number, number, number];
export function rgbToHsl(r: number, g: number, b: number, a?: number): [number, number, number] | [number, number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  let cMin = Math.min(r, g, b),
    cMax = Math.max(r, g, b),
    delta = cMax - cMin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) {
    h = 0;
  }

  // Red is max
  else if (cMax == r) {
    h = ((g - b) / delta) % 6;
  }
  // Green is max
  else if (cMax == g) {
    h = (b - r) / delta + 2;
  }
  // Blue is max
  else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) {
    h += 360;
  }

  // Calculate lightness
  l = (cMax + cMin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return a == null ? [h, s, l] : [h, s, l, a];
}

export function hexToRgb(hex: string): [number, number, number];
export function hexToRgb(hex: string): [number, number, number, number];
export function hexToRgb(hex: string): [number, number, number, number] | [number, number, number] {
  let r = 0, g = 0, b = 0, a = 1;

  // 3 digits
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);

    // 6 digits
  } else if (hex.length == 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }  else if (hex.length == 9) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
    a = Math.floor(parseInt(hex.substring(7, 9), 16) / 255 * 1000) / 1000;
  }

  return hex.length == 9 ? [r, g, b, a] : [r, g, b];
}

export function hexToHsl(hex: string): [number, number, number];
export function hexToHsl(hex: string): [number, number, number, number];
export function hexToHsl(hex: string): [number, number, number, number] | [number, number, number] {
  return hslToRgb(...hexToRgb(hex));
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number];
export function hslToRgb(h: number, s: number, l: number, a: number): [number, number, number, number];
export function hslToRgb(h: number, s: number, l: number, a?: number): [number, number, number] | [number, number, number, number] {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return a == null ? [r, g, b] : [r, g, b, a];
}

export function hslToHex(h: number, s: number, l: number, a?: number): string {
  return rgbToHex(...hslToRgb(h, s, l), a);
}

export class Color {
  /**
   * Hue
   * @private
   */
  private _h: number;
  /**
   * Saturation
   * @private
   */
  private _s: number;
  /**
   * Lightness
   * @private
   */
  private _l: number;
  /**
   * Alfa canal (opacity 0-1)
   * @private
   */
  private _a: number;

  static fromString(str: string, seed = 0): Color {
    const hex = hexColorByAnyString(str, seed);
    return Color.fromHex(hex);
  }

  static fromHex(hex: string): Color {
    hex = hex.startsWith('#') ? hex : `#${hex}`;
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(...rgb);

    return new Color(...hsl);
  }

  static fromRgb(rgbStr: string): Color {
    const result = /^rgba?\((\d+)(?:\s|,)\s?(\d+)(?:\s|,)\s?(\d+)(?:(?:\s|,|\s?\/)\s?([\d.]+%?))?\)/.exec(rgbStr);
    if (!result) {
      throw new Error(`RGB color parse error - "${rgbStr}"`);
    }
    const r = parseInt(result[1]);
    const g = parseInt(result[2]);
    const b = parseInt(result[3]);
    const opacity = result[4]?.trim();
    let a = 1;

    if (opacity) {
      if (opacity.includes('%')) {
        a = Math.floor(parseFloat(opacity) * 1000) / 100000;
      } else {
        a = parseFloat(opacity);
      }
    }

    if (!Color.validateRgb(r, g, b) || !Color.validateAlfa(a)) {
      throw new Error(`Invalid color ${rgbStr}`);
    }

    return new Color(...rgbToHsl(r, g, b, a));
  }

  static validateRgb(r: number, g: number, b: number): boolean {
    if (isNaN(r) || r < 0 || r > 255) {
      return false;
    } else if (isNaN(g) || g < 0 || g > 255) {
      return false;
    } else if (isNaN(b) || b < 0 || b > 255) {
      return false;
    }
    return true;
  }

  static validateAlfa(a: number): boolean {
    return !isNaN(a) && a >= 0 && a <= 1;
  }

  constructor(h: number, s: number, l: number, a = 1) {
    this._h = h;
    this._s = s;
    this._l = l;
    this._a = a;
  }

  clone(): Color {
    return new Color(this._h, this._s, this._l, this._a);
  }

  setHue(deg: number): Color {
    const _color = this.clone();
    _color.hue = deg;
    return _color;
  }

  rotateHue(deg: number): Color {
    this.hue += deg;
    return this;
  }

  setLightness(value: number): Color {
    const _color = this.clone();
    _color.lightness = value;
    return _color;
  }

  addLightness(value: number): Color {
    if (value > 0) {
      this.lightness = Math.min(100, this.lightness + value);
    } else if (value < 0) {
      this.lightness = Math.max(0, this.lightness - Math.abs(value));
    }

    return this;
  }

  setSaturation(value: number): Color {
    const _color = this.clone();
    _color.saturation = value;
    return _color;
  }

  addSaturation(value: number): Color {
    if (value > 0) {
      this.saturation = Math.min(100, this.saturation + value);
    } else if (value < 0) {
      this.saturation = Math.max(0, this.saturation - Math.abs(value));
    }

    return this;
  }

  setAlfa(value: number): Color {
    this.alfa = value;
    return this;
  }

  set hue(value: number) {
    if (value % 1) {
      throw new Error('Invalid hue. Value should be integer number');
    }
    this._h = Math.round((value / 360) % 1 * 360);
  }

  get hue(): number {
    return this._h;
  }

  set lightness(value: number) {
    if (value > 100 || value < 0) {
      throw new Error('Invalid lightness');
    }
    this._l = Math.floor(value * 1000) / 1000;
  }

  get lightness(): number {
    return this._l;
  }

  set saturation(value: number) {
    if (value > 100 || value < 0) {
      throw new Error('Invalid saturation');
    }
    this._s = Math.floor(value * 1000) / 1000;
  }

  get saturation(): number {
    return this._s;
  }

  set alfa(value: number) {
    if (value > 1 || value < 0) {
      throw new Error('Invalid opacity');
    }
    this._a = value;
  }

  get alfa(): number {
    return this._a;
  }

  get text(): Color {
    let lightness = 30 - this._l * 100;
    lightness = Math.min(lightness, 100);
    lightness = Math.max(lightness, 0);

    return new Color(0, 100, lightness);
  }

  get dark(): Color {
    return new Color(this._h, this._s, this._l / 1.1, this._a);
  }

  get light(): Color {
    return new Color(this._h, this._s, Math.min(this._l * 1.1, 100), this._a);
  }

  toString(format: 'rgb' | 'hex' | 'hsl' = 'hex'): string {
    let alfa = '';
    switch (format) {
      case 'hex':
        return rgbToHex(...hslToRgb(this._h, this._s, this._l), this._a === 1 ? undefined : this._a);
      case 'hsl':
        alfa = this._a === 1 ? '' : ` / ${this._a}`;
        return `hsl(${this._h} ${this._s}% ${this._l}%${alfa})`;
      case 'rgb':
        const [r, g, b] = hslToRgb(this._h, this._s, this._l);
        alfa = this._a === 1 ? '' : ` / ${this._a}`;
        return `rgb(${r} ${g} ${b}${alfa})`;
    }
  }
}