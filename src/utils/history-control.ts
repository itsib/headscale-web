import { HistoryConfig, HistoryMutation, HistoryMutationType } from '@app-types';
import { Emitter } from 'react-just-ui/utils/emitter';

export class HistoryControl extends Emitter {
  /**
   * Mutation store
   * @private
   */
  private readonly _mutations = new Map<number, HistoryMutation>();

  private _value: string;

  private _limit: number;

  private _indexFirst = 0;
  private _indexLast = -1;
  private _index = -1;

  constructor(config: HistoryConfig = {}) {
    super();
    this._value = config.value || '';
    this._limit = config.limit || 300;
  }

  get value() {
    return this._value;
  }

  get history() {
    const history: HistoryMutation[] = [];
    for (let i = this._indexFirst; i <= this._index; i++) {
      history.push(this._mutations.get(i)!);
    }

    return history;
  }

  private _rollback(mutation: HistoryMutation, skipCursor?: boolean): void {
    let cursor: number | null = null;

    switch (mutation.type) {
      case HistoryMutationType.Insert:
        this._removeFrom(mutation.cursor, mutation.cursor + mutation.text.length);

        if (mutation.sub) {
          this._rollback(mutation.sub);
        }
        break;
      case HistoryMutationType.Delete:
        this._insertTo(mutation.cursor, mutation.text);
        cursor = mutation.cursor + mutation.text.length;
        break;
      case HistoryMutationType.Backspace:
        this._insertTo(mutation.cursor, mutation.text);
        cursor = mutation.cursor;
        break;
      case HistoryMutationType.Drag:
        if (mutation.sub) {
          this._rollback(mutation.sub);
        }
        this._insertTo(mutation.cursor, mutation.text);
        cursor = mutation.cursor + mutation.text.length;
        break;
      case HistoryMutationType.Drop:
        this._removeFrom(mutation.cursor, mutation.cursor + mutation.text.length);
        break;
    }

    if (cursor && !skipCursor) {
      this._emitCursor(cursor);
    }
  }

  private _rollup(mutation: HistoryMutation, skipCursor?: boolean) {
    let cursor: number | null = null;

    switch (mutation.type) {
      case HistoryMutationType.Insert:
        if (mutation.sub) {
          this._rollup(mutation.sub, true);
        }
        this._insertTo(mutation.cursor, mutation.text);
        cursor = mutation.cursor + mutation.text.length;
        break;
      case HistoryMutationType.Delete:
        this._removeFrom(mutation.cursor, mutation.cursor + mutation.text.length);
        cursor = mutation.cursor;
        break;
      case HistoryMutationType.Backspace:
        this._removeFrom(mutation.cursor, mutation.cursor + mutation.text.length);
        cursor = mutation.cursor;
        break;
      case HistoryMutationType.Drag:
        this._removeFrom(mutation.cursor, mutation.cursor + mutation.text.length);
        if (mutation.sub) {
          this._rollup(mutation.sub);
        }
        break;
      case HistoryMutationType.Drop:
        this._insertTo(mutation.cursor, mutation.text);
        cursor = mutation.cursor + mutation.text.length;
    }

    if (cursor && !skipCursor) {
      this._emitCursor(cursor);
    }
  }

  private _push(mutation: HistoryMutation): void {
    if (this._index < this._indexLast) {
      for (let i = this._index + 1; i <= this._indexLast; i++) {
        this._mutations.delete(i);
      }
      this._indexLast = this._index;
    }

    this._index += 1;
    this._indexLast = this._index;
    this._mutations.set(this._index, mutation);

    while (this._mutations.size > this._limit) {
      this._mutations.delete(this._indexFirst);
      this._indexFirst += 1;
    }
  }

  private _validateRange(start: number, end: number) {
    if (start < 0 || start > end) {
      throw new Error('WRONG_RANGE');
    }
  }

  private _emitCursor(position: number): void {
    this.emit('cursor', { position });
  }

  /**
   * Insert string in other string to index
   * @param index
   * @param text
   * @private
   */
  private _insertTo(index: number, text: string) {
    const beginText = this._value.slice(0, index);
    const endText = this._value.slice(index);

    this._value = beginText + text + endText;

    this.emit('change', { value: this._value });
  }

  /**
   * Remove string part between start and end index.
   * @param start
   * @param end
   * @return Returns substring to have been removed.
   * @private
   */
  private _removeFrom(start: number, end: number): string {
    const removes = this._value.slice(start, end);

    this._value = this._value.slice(0, start) + this._value.slice(end);

    this.emit('change', { value: this._value });

    return removes;
  }

  insertText(start: number, end: number, text: string): void {
    this._validateRange(start, end);
    if (!text) {
      throw new Error('NO_TEXT');
    }

    let removeMutation: HistoryMutation | undefined = undefined;
    if (start !== end) {
      removeMutation = {
        type: HistoryMutationType.Delete,
        text: this._removeFrom(start, end),
        cursor: start,
      };
    }

    const last = removeMutation || text.length !== 1 ? undefined : this._mutations.get(this._index);
    if (
      last &&
      last.type === HistoryMutationType.Insert &&
      last.cursor === end - last.text.length
    ) {
      this._insertTo(end, text);
      last.text = last.text + text;

      return this._emitCursor(end + 1);
    }

    this._insertTo(start, text);

    const mutation: HistoryMutation = {
      type: HistoryMutationType.Insert,
      text: text,
      cursor: start,
    };
    if (removeMutation) {
      mutation.sub = removeMutation;
    }

    this._push(mutation);
    return this._emitCursor(start + text.length);
  }

  deleteText(start: number, end: number): void {
    this._validateRange(start, end);

    const last = end - start === 1 ? this._mutations.get(this._index) : undefined;
    if (last && last.type === HistoryMutationType.Delete && start === last.cursor) {
      const removes = this._removeFrom(start, end);
      last.text = last.text + removes;

      return this._emitCursor(start);
    }

    const removes = this._removeFrom(start, end);
    const mutation: HistoryMutation = {
      type: HistoryMutationType.Delete,
      text: removes,
      cursor: start,
    };
    this._push(mutation);

    return this._emitCursor(start);
  }

  backspaceText(start: number, end: number): void {
    this._validateRange(start, end);

    const last = end - start === 1 ? this._mutations.get(this._index) : undefined;
    if (last && last.type === HistoryMutationType.Backspace && start === last.cursor - 1) {
      const removes = this._removeFrom(start, end);
      last.text = removes + last.text;
      last.cursor = start;

      return this._emitCursor(start);
    }

    const removes = this._removeFrom(start, end);
    const mutation: HistoryMutation = {
      type: HistoryMutationType.Backspace,
      text: removes,
      cursor: start,
    };
    this._push(mutation);

    return this._emitCursor(start);
  }

  dragText(start: number, end: number) {
    this._validateRange(start, end);

    const removes = this._removeFrom(start, end);
    const mutation: HistoryMutation = {
      type: HistoryMutationType.Drag,
      text: removes,
      cursor: start,
    };
    this._push(mutation);
  }

  dropText(start: number, end: number, text: string) {
    this._validateRange(start, end);
    if (start !== end) {
      throw new Error('RANGE_NOT_SAME');
    }

    const last = this._mutations.get(this._index);
    if (last && last.type === HistoryMutationType.Drag) {
      this._insertTo(start, text);
      last.sub = {
        type: HistoryMutationType.Drop,
        text: text,
        cursor: start,
      };

      return this._emitCursor(start + text.length);
    }

    this._insertTo(start, text);
    const mutation: HistoryMutation = {
      type: HistoryMutationType.Insert,
      text: text,
      cursor: start,
    };
    this._push(mutation);
    this._emitCursor(start + text.length);
  }

  undo(): void {
    const mutation = this._mutations.get(this._index);
    if (!mutation) return;

    this._rollback(mutation);

    this._index -= 1;
  }

  redo(): void {
    const mutation = this._mutations.get(this._index + 1);
    if (!mutation) return;

    this._rollup(mutation);

    this._index += 1;
  }

  reset(value?: string): void {
    this._mutations.clear();
    this._indexFirst = 0;
    this._indexLast = -1;
    this._index = -1;
    this._value = value == null ? this._value : value;
  }
}
