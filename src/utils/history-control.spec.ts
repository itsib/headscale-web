import { describe, test, expect } from 'vitest';
import { HistoryControl } from './history-control';

describe('utils/history-control.ts', () => {

  describe('#insertText', () => {
    test('should save input', () => {
      const state = new HistoryControl({ value: '' });
      state.insertText(0, 0, 'a');
      expect(state.value).toBe('a');
      state.insertText(0, 0, 'b');
      expect(state.value).toBe('ba');
      state.insertText(1, 1, 'c');
      expect(state.value).toBe('bca');
      state.insertText(0, 3, '345');
      expect(state.value).toBe('345');
      state.insertText(1, 3, 'aa');
      expect(state.value).toBe('3aa');

      expect(state.history).toStrictEqual([
        { type: 0, cursor: 0, text: 'a' },
        { type: 0, cursor: 0, text: 'bc' },
        { type: 0, cursor: 0, text: '345', sub: { type: 1, cursor: 0, text: 'bca' } },
        { type: 0, cursor: 1, text: 'aa', sub: { type: 1, cursor: 1, text: '45' } },
      ]);
    });

    test('should merge next one symbol input', () => {
      const state = new HistoryControl({ value: '' });
      state.insertText(0, 0, 'a');
      expect(state.value).toBe('a');
      state.insertText(1, 1, 'b');
      expect(state.value).toBe('ab');
      state.insertText(2, 2, 'c');
      expect(state.value).toBe('abc');
      state.insertText(3, 4, 'de');
      expect(state.value).toBe('abcde');

      expect(state.history).toStrictEqual([
        { type: 0, cursor: 0, text: 'abc' },
        { type: 0, cursor: 3, text: 'de', sub: { type: 1, cursor: 3, text: '' } },
      ]);
    });
  });

  describe('#deleteText', () => {
    test('should merge next one symbol remove (Delete)', () => {
      const state = new HistoryControl({ value: '123456789' });
      state.deleteText(2, 3);
      expect(state.value).toBe('12456789');
      state.deleteText(2, 3);
      expect(state.value).toBe('1256789');
      state.deleteText(2, 3);
      expect(state.value).toBe('126789');
      state.deleteText(2, 4);
      expect(state.value).toBe('1289');


      expect(state.history).toStrictEqual([
        { type: 1, cursor: 2, text: '345' },
        { type: 1, cursor: 2, text: '67' },
      ]);
    });

    test('should save delete', () => {
      const state = new HistoryControl({ value: '123456789' });
      state.deleteText(3, 4);
      expect(state.value).toBe('12356789');
      state.deleteText(5, 5);
      expect(state.value).toBe('12356789');
      state.insertText(5, 7, 'a');
      expect(state.value).toBe('12356a9');

      expect(state.history).toStrictEqual([
        { type: 1, cursor: 3, text: '4' },
        { type: 1, cursor: 5, text: '' },
        { type: 0, cursor: 5, text: 'a', sub: { type: 1, cursor: 5, text: '78' } },
      ]);
    });
  });

  describe('#backspaceText', () => {
    test('should merge prev one symbol remove (Backspace)', () => {
      const state = new HistoryControl({ value: '123456789' });
      state.backspaceText(6, 7);
      expect(state.value).toBe('12345689');
      state.backspaceText(5, 6);
      expect(state.value).toBe('1234589');
      state.backspaceText(4, 5);
      expect(state.value).toBe('123489');
      state.backspaceText(2, 4);
      expect(state.value).toBe('1289');


      expect(state.history).toStrictEqual([
        { type: 2, cursor: 4, text: '567' },
        { type: 2, cursor: 2, text: '34' },
      ]);
    });
  });

  describe('#undo', () => {
    test('should restore value after input', () => {
      const state = new HistoryControl({ value: '' });
      state.insertText(0, 0, 'a');
      state.insertText(0, 0, 'b');
      state.insertText(1, 1, 'c');
      state.insertText(0, 3, '345');
      state.insertText(1, 3, 'aa');

      expect(state.history).toStrictEqual([
        { type: 0, cursor: 0, text: 'a' },
        { type: 0, cursor: 0, text: 'bc' },
        { type: 0, cursor: 0, text: '345', sub: { type: 1, cursor: 0, text: 'bca' } },
        { type: 0, cursor: 1, text: 'aa', sub: { type: 1, cursor: 1, text: '45' } },
      ]);

      expect(state.value).toBe('3aa');
      state.undo()
      expect(state.value).toBe('345');
      state.undo()
      expect(state.value).toBe('bca');
      state.undo()
      expect(state.value).toBe('a');
      state.undo()
      expect(state.value).toBe('');
    });
  });

  describe('#redo', () => {
    test('should restore value after undo', () => {
      const state = new HistoryControl({ value: '' });
      state.insertText(0, 0, 'qwerty');
      state.insertText(6, 6, '123456');

      expect(state.history).toStrictEqual([
        { type: 0, cursor: 0, text: 'qwerty' },
        { type: 0, cursor: 6, text: '123456' },
      ]);

      expect(state.value).toBe('qwerty123456');
      state.undo();
      expect(state.value).toBe('qwerty');
      state.redo()
      expect(state.value).toBe('qwerty123456');
    });
  });
})