import { expect, describe, test } from 'vitest';
import { parseDate } from '@app-utils/format-date.ts';

describe('utils/format-date.ts', () => {
  test('#parseDate', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('2052-08-22T08:29:10.679837672Z')).toStrictEqual(new Date(2607928150679));
    expect(parseDate('2052-08-22T01:29:10.000Z')).toStrictEqual(new Date(2607902950000));
    expect(parseDate('2607902950')).toStrictEqual(new Date(2607902950000));
    expect(parseDate('2607902950000')).toStrictEqual(new Date(2607902950000));
    expect(parseDate(2607902950)).toStrictEqual(new Date(2607902950000));
    expect(parseDate(2607902950000)).toStrictEqual(new Date(2607902950000));
  });
});
