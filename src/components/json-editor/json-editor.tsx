import { Component, createRef, type PropsWithChildren } from 'react';
import { Gutters } from './gutters';
import './json-editor.css';

enum RangeType {
  Error = 'error',
  Punctuation = 'punctuation',
  Comment = 'comment',
  Brace = 'brace',
  String = 'string',
  Property = 'property',
}

export interface JsonEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
}

export interface JsonEditorState {
  lines: number;
}

export class JsonEditor extends Component<PropsWithChildren<JsonEditorProps>, JsonEditorState> {
  textarea = createRef<HTMLDivElement>();

  tabSize: number = 0;

  private _observer?: MutationObserver;

  constructor(props: JsonEditorProps, context?: any) {
    super(props, context);

    let lines = 16;
    if (props.value != null) {
      lines = Math.max(lines, props.value.split('\n').length + 4);
    }
    this.state = {
      lines: lines,
    };
  }

  componentDidMount() {
    const textarea = this.textarea.current!;
    textarea.innerHTML = this.props.value || '';

    textarea.addEventListener('input', this.onInput);
    textarea.addEventListener('keydown', this.onKeyDown);

    this._observer = new MutationObserver(this.onMutate);
    this._observer.observe(textarea, {
      childList: true,
      subtree: true,
      characterData: true,
      attributeOldValue: true,
    });

    this._highlight();
  }

  componentWillUnmount() {
    const textarea = this.textarea.current!;
    textarea.removeEventListener('input', this.onInput);
    textarea.removeEventListener('keydown', this.onKeyDown);

    this._observer?.disconnect();
  }

  onInput = () => {
    const textarea = this.textarea.current!;
    this.props.onChange?.(textarea.innerText);
  };

  onMutate = (_mutations: MutationRecord[]) => {
    this._highlight();
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && !event.altKey && !event.shiftKey && !event.ctrlKey) {
      return this.onTabKeyDown(event);
    }

    if (event.code === 'KeyS' && event.ctrlKey && !event.altKey && !event.shiftKey) {
      return this.onSave(event);
    }
  };

  onSave(event: KeyboardEvent): void {
    event.preventDefault();
    this.props.onSave?.();
  }

  onTabKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
  }

  render() {
    return (
      <div className="json-editor">
        <Gutters length={this.state.lines} />
        <code
          ref={this.textarea}
          contentEditable
          className="cm-text-field"
          style={{ height: this.state.lines * 22 + 8 + 'px' }}
        />
      </div>
    );
  }

  private _setRange(type: RangeType, startNode: Node, start: number, endNode: Node, end: number) {
    const textarea = this.textarea.current;
    if (!textarea) return;

    const range = new Range();
    range.setStart(startNode, start);
    range.setEnd(endNode, end);

    const key = `json-code-${type}`;

    if (CSS.highlights.has(key)) {
      CSS.highlights.get(key)?.add(range);
    } else {
      const highlight = new Highlight(range);
      CSS.highlights.set(key, highlight);
    }
  }

  private _highlight() {
    CSS.highlights.clear();

    const textarea = this.textarea.current!;
    const value = textarea.innerText;
    const length = value.length;

    let _line = 1;
    let _lineStart = 0;
    let _position = 0;
    let _nodeOffset = 0;
    let _node = textarea.firstChild as Text;

    const getNode = (pos: number): [Text, number] => {
      if (pos < _nodeOffset + _node.length || !_node.nextSibling) {
        return [_node, pos - _nodeOffset];
      } else {
        _nodeOffset = _nodeOffset + _node.length;
        _node = _node.nextSibling as Text;
        return getNode(pos);
      }
    };

    const readComment = (pos: number) => {
      const lineBreakIndex =
        textarea.innerText.indexOf('\n', pos + 1) || textarea.innerText.length - 1;
      this._setRange(RangeType.Comment, ...getNode(pos), ...getNode(lineBreakIndex + 1));
      _position = lineBreakIndex + 1;
    };

    const readStringOrProp = (pos: number) => {
      const endIndex = value.indexOf('"', pos + 1);
      const lineBreakIndex = value.indexOf('\n', pos + 1);
      if (endIndex === -1 || (lineBreakIndex !== -1 && lineBreakIndex < endIndex)) {
        this._setRange(RangeType.Error, ...getNode(pos), ...getNode(lineBreakIndex));
        _position = lineBreakIndex;
        return;
      }

      const start = pos;
      const end = endIndex + 1;

      for (let i = 0; i <= lineBreakIndex - end; i++) {
        const charCode = value.charCodeAt(end + i);
        if (charCode === 0x003a) {
          this._setRange(RangeType.Property, ...getNode(start), ...getNode(end));
          _position = endIndex + 1;
          return;
        }
        if (charCode !== 0x0020) {
          break;
        }
      }
      this._setRange(RangeType.String, ...getNode(start), ...getNode(end));
      _position = endIndex + 1;
    };

    while (_position < length) {
      const code = textarea.innerText.charCodeAt(_position);

      switch (code) {
        case 0xfeff: // <BOM>
        case 0x0009: // \t
        case 0x0020: // <space>
          ++_position;
          continue;
        case 0x000a: // \n
          ++_position;
          ++_line;
          _lineStart = _position;
          continue;
        case 0x000d: // \r
          if (value.charCodeAt(_position + 1) === 0x000a) {
            _position += 2;
          } else {
            ++_position;
          }

          ++_line;
          _lineStart = _position;
          continue;
        case 0x0022: // "
          readStringOrProp(_position);
          continue;
        case 0x0023: // #
          readComment(_position);
          continue;
        case 0x002f: // /
          if (value.charCodeAt(_position + 1) === 0x002f) {
            readComment(_position);
            continue;
          }

          ++_position;
          continue;
        case 0x003a: // :
        case 0x002c: // ,
          this._setRange(RangeType.Punctuation, ...getNode(_position), ...getNode(_position + 1));
          ++_position;
          continue;
        case 0x007d:
        case 0x007b:
        case 0x005d:
        case 0x005b: // [
          this._setRange(RangeType.Brace, ...getNode(_position), ...getNode(_position + 1));
          ++_position;
          continue;
        default:
          ++_position;
      }

      console.debug(_lineStart);
    }
  }
}
