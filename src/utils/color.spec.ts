import { expect, describe, test } from 'vitest';
import { Color, hexColorByAnyString, hexToRgb, rgbToHex, rgbToHsl } from './color';

describe('utils/color.ts', () => {
  test('#hexColorByAnyString', () => {
    expect(hexColorByAnyString('some-string')).toBe('#197134');
    expect(hexColorByAnyString('some-string')).toBe('#197134');
    expect(hexColorByAnyString('second-string')).toBe('#17e0ad');
    expect(hexColorByAnyString('second-string')).toBe('#17e0ad');
  });
  test('#rgbToHex', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    expect(rgbToHex(3, 3, 3)).toBe('#030303');
    expect(rgbToHex(3, 3, 3, 1)).toBe('#030303ff');
    expect(rgbToHex(3, 3, 3, 0)).toBe('#03030300');
  });
  test('#rgbToHsl', () => {
    expect(rgbToHsl(255, 255, 255)).toMatchObject([0, 0, 100]);
    expect(rgbToHsl(0, 0, 0)).toMatchObject([0, 0, 0]);
    expect(rgbToHsl(255, 255, 255, 0.5)).toMatchObject([0, 0, 100, 0.5]);
    expect(rgbToHsl(0, 0, 0, 0.8)).toMatchObject([0, 0, 0, 0.8]);
  });
  test('#hexToRgb', () => {
    expect(hexToRgb('#ffffff')).toMatchObject([255, 255, 255]);
    expect(hexToRgb('#030303')).toMatchObject([3, 3, 3]);
    expect(hexToRgb('#ffffff00')).toMatchObject([255, 255, 255, 0]);
    expect(hexToRgb('#03030308')).toMatchObject([3, 3, 3, 0.031]);
    expect(hexToRgb('#030303ff')).toMatchObject([3, 3, 3, 1]);
    expect(hexToRgb('#0303037f')).toMatchObject([3, 3, 3, 0.498]);
  });

  describe('Color class', () => {
    test('#Color.fromRgb', () => {
      const colorRed = Color.fromRgb('rgb(255, 0, 0, 0.3)');
      const colorGreen = Color.fromRgb('rgb(0 255 0 / 34.65%)');
      const colorBlue = Color.fromRgb('rgb(0 0 255 / 0.6)');

      expect(colorRed).toBeInstanceOf(Color);
      expect(colorRed).toMatchObject({ _h: 0, _s: 100, _l: 50, _a: 0.3 });
      expect(colorGreen).toMatchObject({ _h: 120, _s: 100, _l: 50, _a: 0.3465 });
      expect(colorBlue).toMatchObject({ _h: 240, _s: 100, _l: 50, _a: 0.6 });
    });

    test('#Color.fromRgb', () => {
      const colorRed = Color.fromHex('#ff0000');
      const colorGreen = Color.fromHex('#0f0');
      const colorBlue = Color.fromHex('#0000ff08');

      expect(colorRed).toBeInstanceOf(Color);
      expect(colorRed).toMatchObject({ _h: 0, _s: 100, _l: 50, _a: 1 });
      expect(colorGreen).toMatchObject({ _h: 120, _s: 100, _l: 50, _a: 1 });
      expect(colorBlue).toMatchObject({ _h: 240, _s: 100, _l: 50, _a: 0.031 });
    });

    test('#Color.toString', () => {
      const colorRed = Color.fromHex('#ff0000');
      const colorGreen = Color.fromHex('#0f0');
      const colorGreen05 = Color.fromHex('#00ff007f');
      const colorBlue = Color.fromHex('#0000fff3');

      expect(colorRed.toString('rgb')).toBe('rgb(255 0 0)');
      expect(colorGreen.toString('hex')).toBe('#00ff00');
      expect(colorGreen05.toString('hex')).toBe('#00ff007f');
      expect(colorBlue.toString('hsl')).toBe('hsl(240 100% 50% / 0.952)');
    });
  });
});