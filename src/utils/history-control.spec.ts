import { describe, test, expect } from 'vitest';
import { HistoryControl } from './history-control';

describe('utils/history-control.ts', () => {

  describe('#insert', () => {
    test('should save input', () => {
      const state = new HistoryControl({ value: '' });
      state.insert(0, 0, 'a');
      expect(state.value).toBe('a');
      state.insert(0, 0, 'b');
      expect(state.value).toBe('ba');
      state.insert(1, 1, 'c');
      expect(state.value).toBe('bca');
      state.insert(0, 3, '345');
      expect(state.value).toBe('345');
      state.insert(1, 3, 'aa');
      expect(state.value).toBe('3aa');

      expect(state.history).toStrictEqual([
        { cursor: 0, adds: 'a', removes: '' },
        { cursor: 0, adds: 'bc', removes: '' },
        { cursor: 0, adds: '345', removes: 'bca' },
        { cursor: 1, adds: 'aa', removes: '45' },
      ]);
    });

    test('should save delete', () => {
      const state = new HistoryControl({ value: '123456789' });
      state.insert(3, 4);
      expect(state.value).toBe('12356789');
      state.insert(5, 5);
      expect(state.value).toBe('12356789');
      state.insert(5, 7, 'a');
      expect(state.value).toBe('12356a9');

      expect(state.history).toStrictEqual([
        { cursor: 3, adds: '', removes: '4' },
        { cursor: 5, adds: 'a', removes: '78' },
      ]);
    });

    test('should merge next one symbol input', () => {
      const state = new HistoryControl({ value: '' });
      state.insert(0, 0, 'a');
      expect(state.value).toBe('a');
      state.insert(1, 1, 'b');
      expect(state.value).toBe('ab');
      state.insert(2, 2, 'c');
      expect(state.value).toBe('abc');
      state.insert(3, 4, 'de');
      expect(state.value).toBe('abcde');

      expect(state.history).toStrictEqual([
        { cursor: 0, adds: 'abc', removes: '' },
        { cursor: 3, adds: 'de', removes: '' },
      ]);
    });

    test('should merge next one symbol remove (Delete)', () => {
      const state = new HistoryControl({ value: '123456789' });
      state.insert(2, 3);
      expect(state.value).toBe('12456789');
      state.insert(2, 3);
      expect(state.value).toBe('1256789');
      state.insert(2, 3);
      expect(state.value).toBe('126789');
      state.insert(2, 4);
      expect(state.value).toBe('1289');


      expect(state.history).toStrictEqual([
        { cursor: 2, adds: '', removes: '345' },
        { cursor: 2, adds: '', removes: '67' },
      ]);
    });

    test('should merge prev one symbol remove (Backspace)', () => {
      const state = new HistoryControl({ value: '123456789' });
      state.insert(6, 7);
      expect(state.value).toBe('12345689');
      state.insert(5, 6);
      expect(state.value).toBe('1234589');
      state.insert(4, 5);
      expect(state.value).toBe('123489');
      state.insert(2, 4);
      expect(state.value).toBe('1289');


      expect(state.history).toStrictEqual([
        { cursor: 4, adds: '', removes: '567' },
        { cursor: 2, adds: '', removes: '34' },
      ]);
    });
  });

  describe('#undo', () => {
    test('should restore value after input', () => {
      const state = new HistoryControl({ value: '' });
      state.insert(0, 0, 'a');
      state.insert(0, 0, 'b');
      state.insert(1, 1, 'c');
      state.insert(0, 3, '345');
      state.insert(1, 3, 'aa');

      expect(state.history).toStrictEqual([
        { cursor: 0, adds: 'a', removes: '' },
        { cursor: 0, adds: 'bc', removes: '' },
        { cursor: 0, adds: '345', removes: 'bca' },
        { cursor: 1, adds: 'aa', removes: '45' },
      ]);

      expect(state.value).toBe('3aa');
      expect(state.undo()).toBe(3);
      expect(state.value).toBe('345');
      expect(state.undo()).toBe(3);
      expect(state.value).toBe('bca');
      expect(state.undo()).toBe(0);
      expect(state.value).toBe('a');
      expect(state.undo()).toBe(0);
      expect(state.value).toBe('');
    });
  });

  describe('#redo', () => {
    test('should restore value after undo', () => {
      const state = new HistoryControl({ value: '' });
      state.insert(0, 0, 'qwerty');
      state.insert(6, 6, '123456');

      expect(state.history).toStrictEqual([
        { cursor: 0, adds: 'qwerty', removes: '' },
        { cursor: 6, adds: '123456', removes: '' },
      ]);

      expect(state.value).toBe('qwerty123456');
      state.undo();
      expect(state.value).toBe('qwerty');
      expect(state.redo()).toBe(12);
      expect(state.value).toBe('qwerty123456');
    });
  });
})