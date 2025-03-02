type Keyword = '[' | ']' | '{' | '}' | '"' | ':' | '//' | ',' | 'true' | 'false' | 'null' | 'undefined' | '\n';

type Token = [string, string, string];

const DEFAULT_TAB_SIZE = 2;

function isSpaces(value: string): boolean {
  return /^\s+$/.test(value);
}

function isNumber(value: string): boolean {
  return /^ *-?\d+(:?\.\d+)? *$/.test(value);
}

function collapse(token: Token): string {
  return token[1] + token[0] + token[2];
}

export class TokenizedCode {
  private _length = 0;

  private _tokens: Token[] = [];

  private _tokenLines: Token[][] = [];

  static tokenize(code: string): TokenizedCode {
    const regex = /(\[|]|\{|}|"|:|(:?\/\/)|,|(:?true)|(:?false)|(:?null)|(:?undefined)|\n)/g;
    let match: RegExpExecArray | null = null;
    let isString = false;
    let isComment = false;

    const tokenized = new TokenizedCode();

    while ((match = regex.exec(code))) {
      const keyword = match[0] as Keyword;
      const word = code.slice(tokenized.length, match.index);

      if (isString) {
        if (keyword === '\n') {
          tokenized.concatLastWord(word);
          tokenized.breakLine();
          isString = false;
          continue;
        }

        tokenized.concatLastWord(word + keyword);
        if (keyword === '"') {
          isString = false;
        }
        continue;
      }

      if (isComment) {
        if (keyword === '\n') {
          isComment = false;
          tokenized.concatLastWord(word);
          tokenized.breakLine();
        } else {
          tokenized.concatLastWord(word + keyword);
        }
        continue;
      }

      // Wrap spaces
      if (word && isSpaces(word)) {
        tokenized.add(word, 'cm-space');
      }
      // Wrap numbers
      else if (word && isNumber(word)) {
        const number = word.trim();
        const [prefix, suffix] = word.split(number);

        if (prefix) {
          tokenized.add(prefix, isSpaces(prefix) ? 'cm-space' : 'cm-bad');
        }

        tokenized.add(number, 'cm-number');

        if (suffix) {
          tokenized.add(suffix, isSpaces(suffix) ? 'cm-space' : 'cm-bad');
        }
      }
      // Wrap other word
      else if (word) {
        tokenized.add(word, 'cm-bad');
      }

      switch(keyword) {
        case '//':
          isComment = true;
          tokenized.add('//', 'cm-comment');
          break;
        case '{':
          tokenized.add('{', 'cm-brace');
          break;
        case '}':
          tokenized.add('}', 'cm-brace');
          break;
        case '[':
          tokenized.add('[', 'cm-brace');
          break;
        case ']':
          tokenized.add(']', 'cm-brace');
          break;
        case '"':
          isString = true;
          tokenized.add('"', 'cm-string');
          break;
        case ':':
          tokenized.add(':', 'cm-punctuation');
          tokenized.replaceStringToProperty();
          break;
        case ',':
          tokenized.add(',', 'cm-punctuation');
          break;
        case 'true':
        case 'false':
        case 'null':
        case 'undefined':
          tokenized.add(keyword, 'cm-keyword');
          break;
        case '\n':
          tokenized.breakLine();
          break;
      }
    }

    tokenized.finalize();
    return tokenized;
  }

  private constructor() {
  }

  get length() {
    return this._length;
  }

  get lines() {
    return this._tokenLines.length;
  }

  getTabSize() {
    let tabSize: number | null = null;
    for (let i = 0; i < this._tokenLines.length; i++) {
      if (i > 5) break;

      const [spaces, spanTag] = this._tokenLines[i][0];
      if (spanTag === '<span class="cm-space">') {
        if (spaces.length <= 1) continue;

        if (tabSize === null) {
          tabSize = Math.ceil(spaces.length / 2) * 2;
        } else if (tabSize < spaces.length) {
          const nextTabSize = Math.ceil(spaces.length / 4) * 2;
          if (nextTabSize === tabSize) {
            return tabSize;
          }
        }
      }
    }

    return tabSize !== null ? tabSize : DEFAULT_TAB_SIZE;
  }

  add(word: string, className: string) {
    this._tokens.push([word, `<span class="${className}">`, '</span>']);
    this._length += word.length;
  }

  concatLastWord(word: string) {
    this._tokens[this._tokens.length - 1][0] += word;
    this._length += word.length;
  }

  replaceStringToProperty(): void {
    for (let i = this._tokens.length - 1; i >= 0; i--) {
      if (this._tokens[i][1] === '<span class="cm-string">') {
        this._tokens[i][1] = '<span class="cm-property">';
        return;
      }
    }
  }

  breakLine() {
    const alreadyIndexedLength = this._tokenLines.reduce((count, tokensLine) => count + tokensLine.length, 0);

    this._tokenLines.push(this._tokens.slice(alreadyIndexedLength));

    this._length += 1;
  }

  finalize() {
    const alreadyIndexedLength = this._tokenLines.reduce((count, tokensLine) => count + tokensLine.length, 0);
    if (this._tokens.length > alreadyIndexedLength) {
      this.breakLine();
    }
  }

  getTokens(): Token[] {
    return this._tokens;
  }

  toLines(): string[] {
    return this._tokenLines.map((tokens: Token[]) => tokens.map(collapse).join(''));
  }

  toString(): string {
    return this.toLines().join('\n');
  }
}