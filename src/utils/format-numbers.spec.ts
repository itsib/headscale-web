import { expect, describe, test } from 'vitest';
import { formatNumbers } from './format-numbers.ts';

describe('utils/format-numbers.ts', () => {
  test('#formatNumbers', () => {
    expect(formatNumbers('1.320865792e+09')).toStrictEqual('1320865792');
    expect(formatNumbers('1.320865792e-09')).toStrictEqual('0.000000001320865792');
    expect(formatNumbers('1e3')).toStrictEqual('1000');
    expect(formatNumbers('1e-3')).toStrictEqual('0.001');
    expect(formatNumbers('1e+0')).toStrictEqual('1');
  });
});
