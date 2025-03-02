type Listener = (value: string) => void;

interface Commit {
  cursor: number;
  adds: string;
  removes: string;
}

export interface HistoryConfig {
  value?: string;
  limit?: number;
}

export class HistoryControl {

  private readonly _history: Commit[] = [];

  private readonly _listeners: Set<Listener>;

  private _value: string;

  private _limit: number;

  private _index = -1;

  constructor(config: HistoryConfig = {}) {
    this._value = config.value || '';
    this._limit = config.limit || 300;
    this._listeners = new Set<Listener>();
  }

  get value() {
    return this._value;
  }

  get history() {
    return this._history;
  }

  private _updateValue(newValue: string) {
    this._value = newValue;
    for (const cb of this._listeners.values()) {
      cb(this._value);
    }
  }

  private _beforePush() {
    const removedCount = this._history.length - (this._index + 1);
    if (removedCount > 0) {
      this._history.splice(this._index, removedCount);
    }
  }

  private _afterPush() {
    if (this._history.length > this._limit) {
      this._history.shift();
    }
  }

  private _replaceByRange(start: number, end: number, text = ''): string {
    if (start > end) {
      throw new Error('WRONG_RANGE');
    }
    const removes = this._value.slice(start, end);

    this._updateValue(this._value.slice(0, start) + text + this._value.slice(end));

    return removes;
  }

  onChange(callback: Listener): () => void {
    this._listeners.add(callback);

    return () => {
      this._listeners.delete(callback);
    }
  }

  insert(start: number, end: number, text = '') {
    this._beforePush();

    if (start === end && !text) return;
    if (start < 0 || start > end) {
      throw new Error('WRONG_RANGE');
    }

    // Merging changes of the same type into one commit.
    const last = this._history[this._index];
    if (last) {
      // Delete
      if (!text && last.adds.length === 0 && start === last.cursor && end - start === 1) {
        const removes = this._replaceByRange(start, end);
        last.removes = last.removes + removes;
        return;
      }
      // Backspace
      if (!text && last.adds.length === 0 && end - start === 1 && start === (last.cursor - 1)) {
        const removes = this._replaceByRange(start, end);
        last.removes = removes + last.removes;
        last.cursor = start;
        return;
      }
      // Input symbol
      if (text?.length === 1 && start === end && last.removes.length === 0 && (start - last.adds.length) === last.cursor) {
        this._replaceByRange(start, end, text);
        last.adds = last.adds + text;
        return;
      }
    }

    const removes = this._replaceByRange(start, end, text);
    const commit: Commit = {
      cursor: start,
      adds: text,
      removes,
    };

    this._history.push(commit);
    this._index++;
    this._afterPush();
  }

  undo(): number | null {
    const commit = this._history[this._index];
    if (!commit) return null;

    const newValue = this._value.slice(0, commit.cursor) + commit.removes + this._value.slice(commit.cursor + commit.adds.length);
    this._index -= 1;

    this._updateValue(newValue);
    return commit.cursor + commit.removes.length;
  }

  redo(): number | null {
    const commit = this._history[this._index + 1];
    if (!commit) return null;

    const newValue = this._value.slice(0, commit.cursor) + commit.adds + this._value.slice(commit.cursor + commit.removes.length);
    this._index += 1;

    this._updateValue(newValue);

    return commit.cursor + commit.adds.length;
  }

  reset(value?: string): void {
    this._history.length = 0;
    this._index = -1;
    this._value = value == null ? this._value : value;
  }
}