import { Component, createRef, VNode } from 'preact';
import { Gutters } from './gutters.tsx';
import './json-editor.css';

type Keyword = '[' | ']' | '{' | '}' | '"' | ':' | '//' | ',' | 'true' | 'false' | 'null' | 'undefined';

export interface JsonEditorProps {
  value?: string
  onChange?: (value: string) => void
}

export interface JsonEditorState {
  code: string;
}

export class JsonEditor extends Component<JsonEditorProps, JsonEditorState> {

  editable = createRef<HTMLDivElement>();

  isProperty = true;

  constructor(props: JsonEditorProps, context?: any) {
    super(props, context);
    this.state = {
      code: (props.value || ''),
    };
  }

  componentDidMount() {
    const editable = this.editable.current;
    if (!editable) return;


  }

  componentWillUnmount() {

  }

  onBeforeInput(event: InputEvent) {
    const data = event.data;
    const selection: Selection | null = document.getSelection();
    event.preventDefault();

    if (!selection) return;

    const { selectionStart, selectionEnd } = this._getRangePosition(selection);
    console.log(event.inputType, 'selectionStart', selectionStart, 'selectionEnd', selectionEnd);

    switch (event.inputType) {
      case 'insertText': {
        const text = data || '';
        const code = this.state.code.slice(0, selectionStart) + text + this.state.code.slice(selectionEnd);
        this._emitCode(code);

        requestAnimationFrame(() => this._setCursorPosition(selectionStart + text.length));
        break;
      }
      case 'deleteContentBackward': {
        let code = this.state.code;
        let cursorPosition = 0;
        if (selectionStart === selectionEnd) {
          code = code.slice(0, selectionStart - 1) + code.slice(selectionStart);
          cursorPosition = selectionStart - 1;
        } else {
          code = code.slice(0, selectionStart) + code.slice(selectionEnd);
          cursorPosition = selectionStart;
        }
        this._emitCode(code);

        requestAnimationFrame(() => this._setCursorPosition(cursorPosition));
        break;
      }
      case 'deleteContentForward': {
        let code = this.state.code;

        if (selectionStart === selectionEnd) {
          code = code.slice(0, selectionStart) + code.slice(selectionStart + 1);
        } else {
          code = code.slice(0, selectionStart) + code.slice(selectionEnd);
        }
        this._emitCode(code);

        requestAnimationFrame(() => this._setCursorPosition(selectionStart));
        break;
      }
      case 'insertParagraph': {
        const code = this.state.code.slice(0, selectionStart) + '\n' + this.state.code.slice(selectionEnd);
        this._emitCode(code);

        requestAnimationFrame(() => this._setCursorPosition(selectionStart + 1));
        break;
      }
      default:
        console.log(event.inputType);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' && !event.altKey && !event.shiftKey) {
      event.preventDefault();
    }

  }

  renderLine(line: string, index: number) {
    let output = '';
    let lastIndex = 0;
    let isString = false;
    let match: RegExpExecArray | null = null;
    const regex = /(\[|]|\{|}|"|:|(:?\/\/)|,|(:?true)|(:?false)|(:?null)|(:?undefined))/g;

    const trailingSpaces = line.length - line.trimEnd().length;
    line = trailingSpaces > 0 ? line.slice(0, -trailingSpaces) : line;

    // Handle every special char
    while ((match = regex.exec(line))) {
      const keyword = match[0] as Keyword;
      const word = line.slice(lastIndex, match.index);

      if (isString && keyword !== "\"") {
        continue;
      }

      if (keyword === '//') {
        const comment = line.slice(match.index);

        output += word;
        output += `<span class="cm-comment">${comment}</span>`;
        lastIndex = line.length;
        break;
      }

      // Wrap number or unknown text
      const trimmed = word.trim();
      if (trimmed && keyword !== "\"") {
        let wrapped = '';
        if (/^[0-9\-e.]+$/.test(trimmed)) {
          wrapped = `<span class="cm-number">${trimmed}</span>`;
        } else {
          wrapped = `<span class="cm-bad">${trimmed}</span>`;
        }

        output += word.replace(trimmed, wrapped);
      } else {
        output += word;
      }

      switch(keyword) {
        case '{':
          this.isProperty = true;
          output += `<span class="cm-brace">{</span>`;
          break;
        case '}':
          output += `<span class="cm-brace">}</span>`;
          break;
        case '[':
          this.isProperty = false;
          output += `<span class="cm-brace">[</span>`;
          break;
        case ']':
          output += `<span class="cm-brace">]</span>`;
          break;
        case "\"":
          if (isString) {
            isString = false;
            this.isProperty = true;
            output += `"</span>`;
          } else {
            isString = true;
            if (this.isProperty) {
              output += `<span class="cm-property">"`;
            } else {
              output += `<span class="cm-string">"`;
            }
          }
          break;
        case ':':
          this.isProperty = false;
          output += '<span class="cm-punctuation">:</span>';
          break;
        case ',':
          this.isProperty = true;
          output += '<span class="cm-punctuation">,</span>';
          break;
        case 'true':
        case 'false':
        case 'null':
        case 'undefined':
          output += `<span class="cm-keyword">${keyword}</span>`;
          break;
      }

      lastIndex = match.index + keyword.length;
    }

    if (isString) {
      output += '</span>';
    }

    // End of line
    const tail = line.slice(lastIndex);
    const bad = tail.trim();
    if (bad) {
      if (/^[0-9\-e.]+$/.test(bad)) {
        output += tail.replace(bad, `<span class="cm-number">${bad}</span>`);
      } else {
        output += tail.replace(bad, `<span class="cm-bad">${bad}</span>`);
      }
    } else {
      output += tail;
    }

    // Wrap trailing spaces
    if (trailingSpaces) {
      output += `<span class="cm-trailing-space">${' '.repeat(trailingSpaces)}</span>`
    }

    // Wrap indents
    const spaces = output.match(/^\s+/)?.[0] || '';
    output = spaces.length ? `<span class="cm-space">${spaces}</span>` + output.slice(spaces.length) : output;

    return (
      <div
        key={index}
        className="cm-line"
        data-indent={spaces.length}
        data-line={index}
        dangerouslySetInnerHTML={{ __html: output }}
      />
    );
  }

  render(): VNode {
    const lines = this.state.code.split('\n');
    return (
      <div className="json-editor">
        <Gutters length={lines.length} />
        <div className="cm-scroller">
          <div
            spellcheck={false}
            autocorrect="off"
            autocapitalize="off"
            translate={false}
            contenteditable={true}
            class="cm-editable-area"
            role="textbox"
            aria-multiline="true"
            data-language="json"
            onBeforeInput={this.onBeforeInput.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            ref={this.editable}
          >
            {lines.map((line, i) => this.renderLine(line, i))}
          </div>
        </div>
      </div>
    );
  }

  private _emitCode(code: string): void {
    this.setState({ code });
    this.props.onChange?.(code);
  }

  private _getRangePosition(selection: Selection) {
    const startNode = selection.anchorOffset < selection.focusOffset ? selection.anchorNode : selection.focusNode;
    const startOffset = selection.anchorOffset < selection.focusOffset ? selection.anchorOffset : selection.focusOffset;

    let lineElement = startNode as HTMLElement;
    while (!(lineElement && lineElement.nodeType === Node.ELEMENT_NODE && (lineElement as any).classList.contains('cm-line'))) {
      lineElement = lineElement!.parentElement as HTMLElement;
    }
    const lineIndex = parseInt(lineElement.dataset!.line!);

    let offset = 0;
    for (const node of lineElement!.childNodes) {
      if (node === startNode || node.childNodes[0] === startNode) {
        offset += startOffset;
        break;
      } else {
        offset += node.textContent?.length || 0;
      }
    }

    let selectionStart = 0;
    const lines = this.state.code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === lineIndex) {
        selectionStart += offset;
        break;
      } else {
        selectionStart += line.length + 1;
      }
    }

    const selectionEnd = selectionStart + selection.toString().length;

    return { selectionStart, selectionEnd };
  }

  private _setCursorPosition(position: number): void {
    const editable = this.editable.current!;
    const lines = this.state.code.slice(0, position).split('\n');

    const lineIndex = lines.length - 1;
    const offset = lines[lines.length - 1].length;

    const lineElement = editable.children.item(lineIndex)!;

    // ---------------------------
    let nodeOffset = 0;
    let nodesOffset = 0;
    let nodeToSelect = lineElement.childNodes.item(0)!;

    // Not empty line
    if (lineElement.childNodes.length > 0) {
      for (const node of lineElement.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          nodeToSelect = node.childNodes[0];
        } else {
          nodeToSelect = node;
        }
        nodeOffset = offset - nodesOffset;

        nodesOffset = nodesOffset + (node.textContent?.length || 0);
        if (nodesOffset > offset) {
          break;
        }
      }
    }
    // New empty line
    else {
      nodeToSelect = lineElement;
      nodeOffset = 0;
    }

    const selection = window.getSelection()!;
    const range = document.createRange();

    range.setStart(nodeToSelect!, nodeOffset);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}

