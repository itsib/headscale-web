import { Component, createRef, VNode } from 'preact';
import { Gutters } from './gutters';
import { TokenizedCode } from './tokenized-code.ts';
import { HistoryControl } from '@app-utils/history-control.ts';
import './json-editor.css';


export interface JsonEditorProps {
  value?: string
  onChange?: (value: string) => void
  onSave?: () => void
}

export interface JsonEditorState {
  code: string;
}

export class JsonEditor extends Component<JsonEditorProps, JsonEditorState> {

  editable = createRef<HTMLDivElement>();

  history: HistoryControl;

  tabSize: number = 0;

  isLocked: boolean = false;

  isOnChange: boolean = false;

  constructor(props: JsonEditorProps, context?: any) {
    super(props, context);
    this.state = {
      code: (props.value || ''),
    };

    this.history = new HistoryControl({ value: props.value });

    this.history.onChange(value => {
      this.setState({ code: value });
      this.isOnChange = true;
      this.props.value = value;
      this.props.onChange?.(value);
    });
  }

  componentDidMount() {
    const editable = this.editable.current;
    if (!editable) return;


  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps: Readonly<JsonEditorProps>) {
    if (this.isOnChange) {
      this.isOnChange = false;
      return;
    }
    this.history.reset(nextProps.value || '');
  }

  onBeforeInput(event: InputEvent) {
    if (this.isLocked) return;
    event.preventDefault();
    const data = event.data;
    const selection: Selection | null = document.getSelection();

    if (!selection) return;

    const { selectionStart, selectionEnd } = this._getRangePosition(selection);

    switch (event.inputType) {
      case 'insertText': {
        const text = data || '';
        this.history.insert(selectionStart, selectionEnd, text);

        this.updateCursor(selectionStart + text.length);
        break;
      }
      case 'deleteContentBackward': {
        let cursorPosition = 0;

        if (selectionStart === selectionEnd) {
          this.history.insert(selectionStart - 1, selectionStart);
          cursorPosition = selectionStart - 1;
        } else {
          this.history.insert(selectionStart, selectionEnd);
          cursorPosition = selectionStart;
        }

        this.updateCursor(cursorPosition);
        break;
      }
      case 'deleteContentForward': {
        if (selectionStart === selectionEnd) {
          this.history.insert(selectionStart, selectionStart + 1);
        } else {
          this.history.insert(selectionStart, selectionEnd);
        }
        this.updateCursor(selectionStart);
        break;
      }
      case 'insertParagraph': {
        this.history.insert(selectionStart, selectionEnd, '\n');

        this.updateCursor(selectionStart + 1);
        break;
      }
      default:
        console.log(event.inputType);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' && !event.altKey && !event.shiftKey && !event.ctrlKey) {
      return this.onTabKeyDown(event);
    }

    if (event.code === 'KeyZ' && event.ctrlKey && !event.altKey && !event.shiftKey) {
      return this.onUndo(event);
    }

    if (event.code === 'KeyZ' && event.ctrlKey && !event.altKey && event.shiftKey) {
      return this.onRedo(event);
    }

    if (event.code === 'KeyS' && event.ctrlKey && !event.altKey && !event.shiftKey) {
      return this.onSave(event);
    }
  }

  onSave(event: KeyboardEvent): void {
    event.preventDefault();
    this.props.onSave?.();
  }

  onTabKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    const selection: Selection | null = document.getSelection();
    if (!selection) return;
    const { selectionStart, selectionEnd } = this._getRangePosition(selection);

    const lastLine = this.state.code.slice(0, selectionStart).split('\n').pop() || '';
    const spaces = lastLine.length % this.tabSize || this.tabSize;

    this.history.insert(selectionStart, selectionEnd, ' '.repeat(spaces));

    this.updateCursor(selectionStart + spaces);
  }

  onUndo(event: KeyboardEvent): void {
    event.preventDefault();
    const selection: Selection | null = document.getSelection();
    if (!selection) return;
    const { selectionStart } = this._getRangePosition(selection);

    const newPos = this.history.undo();

    this.updateCursor(newPos !== null ? newPos : selectionStart);
  }

  onRedo(event: KeyboardEvent): void {
    event.preventDefault();
    const selection: Selection | null = document.getSelection();
    if (!selection) return;
    const { selectionStart } = this._getRangePosition(selection);

    const newPos = this.history.redo();
    this.updateCursor(newPos !== null ? newPos : selectionStart);
  }

  render(): VNode {
    const tokenized = TokenizedCode.tokenize(this.history.value);
    this.tabSize = tokenized.getTabSize();

    const lines = tokenized.toLines();
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
            style={{ tabSize: this.tabSize }}
            role="textbox"
            aria-multiline="true"
            data-language="json"
            onBeforeInput={this.onBeforeInput.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            ref={this.editable}
          >
            {lines.map((line, i) => <div key={i} data-line={i} className="cm-line" dangerouslySetInnerHTML={{ __html: line }}></div>)}
          </div>
        </div>
      </div>
    );
  }

  updateCursor(position: number) {
    this.isLocked = true;

    queueMicrotask(() => this._setCursorPosition(position));
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

    this.isLocked = false;
  }
}

