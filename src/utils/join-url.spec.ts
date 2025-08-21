import { describe, expect, test } from 'vitest';
import { joinUrl } from './join-url';

describe('utils/join-url.ts', () => {
  test('#joinUrl', () => {
    expect(joinUrl('http://test.com/', '/param')).toStrictEqual('http://test.com/param');
    expect(joinUrl('http://test.com', '/param')).toStrictEqual('http://test.com/param');
    expect(joinUrl('http://test.com', 'param')).toStrictEqual('http://test.com/param');
    expect(joinUrl('http://test.com', 'param/')).toStrictEqual('http://test.com/param/');
    expect(joinUrl('http://test.com', 'param/test')).toStrictEqual('http://test.com/param/test');
  });

  test('#joinUrl to throw', () => {
    expect(() => joinUrl('', '/param')).toThrowError('INVALID_URL');
  });
});
