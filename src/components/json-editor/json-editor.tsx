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

  private _unsubscribe?: () => void;

  constructor(props: JsonEditorProps, context?: any) {
    super(props, context);
    this.state = {
      code: (props.value || ''),
    };

    this.history = new HistoryControl({ value: props.value });
  }

  componentDidMount() {
    const sub0 = this.history.sub<{ value: string }>('change', ({ value }) => {
      this.setState({ code: value });
      this.isOnChange = true;
      this.props.value = value;
      this.props.onChange?.(value);
    });

    const sub1 = this.history.sub<{ position: number }>('cursor', ({ position }) => {
      this.updateCursor(position);
    });

    this._unsubscribe = () => {
      sub0();
      sub1();
    };
  }

  componentWillUnmount() {
    this._unsubscribe?.();
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

    const range = event.getTargetRanges()[0];
    const data = event.data;
    const { selectionStart, selectionEnd } = this._getSelection(range);

    switch (event.inputType) {
      // Input text
      case 'insertText': {
        this.history.insertText(selectionStart, selectionEnd, data || '');
        break;
      }
      // Backspace key
      case 'deleteContentBackward': {
        this.history.backspaceText(selectionStart, selectionEnd);
        break;
      }
      // Delete key
      case 'deleteContentForward': {
        this.history.deleteText(selectionStart, selectionEnd);
        break;
      }
      // Enter key
      case 'insertParagraph': {
        this.history.insertText(selectionStart, selectionEnd, '\n');
        break;
      }
      // Ctrl + X
      case 'deleteByCut': {
        this.history.deleteText(selectionStart, selectionEnd);
        break;
      }
      // Ctrl + V
      case 'insertFromPaste': {
        const text = event.dataTransfer?.getData('text');
        if (text) {
          this.history.insertText(selectionStart, selectionEnd, text);
        }
        break;
      }
      case 'deleteByDrag': {
        this.history.dragText(selectionStart, selectionEnd);
        break;
      }
      case 'insertFromDrop': {
        const text = event.dataTransfer?.getData('text');
        if (text) {
          const startCharCode = text.codePointAt(0);
          if (startCharCode === 10) {
            const begin = this.state.code.slice(0, selectionStart);
            if (begin.codePointAt(begin.length - 1) === 10) {
              this.history.dropText(selectionStart - 1, selectionEnd - 1, text);
              break;
            }
          }
          this.history.dropText(selectionStart, selectionEnd, text);
        }
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
      event.preventDefault();
      this.history.undo();
      return;
    }

    if (event.code === 'KeyZ' && event.ctrlKey && !event.altKey && event.shiftKey) {
      event.preventDefault();
      this.history.redo();
      return;
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
    const range = selection?.getRangeAt(0);
    if (!range) return;
    const { selectionStart, selectionEnd } = this._getSelection(range);

    const lastLine = this.state.code.slice(0, selectionStart).split('\n').pop() || '';
    const spaces = lastLine.length % this.tabSize || this.tabSize;

    this.history.insertText(selectionStart, selectionEnd, ' '.repeat(spaces));
  }

  updateCursor(position: number) {
    this.isLocked = true;

    queueMicrotask(() => this._setCursorPosition(position));
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

  private _getSelection(event: AbstractRange) {
    const { startOffset, endOffset, startContainer, endContainer, collapsed } = event;

    const isLine = (_node?: Node | null): boolean => {
      return !!_node && _node.nodeType === Node.ELEMENT_NODE && (_node as HTMLElement).classList.contains('cm-line');
    }

    const getPrevNode = (_node?: Node | null): Node | null => {
      if (!_node) return null;

      if (_node.previousSibling) {
        return _node.previousSibling;
      }

      while (true) {
        _node = _node?.parentNode;
        if (!_node || _node === this.editable.current) return null;

        if (_node.previousSibling) {
          return _node.previousSibling;
        }
      }
    }

    const getNextNode = (_node?: Node | null): Node | null => {
      if (!_node) return null;

      if (_node.nextSibling) {
        return _node.nextSibling;
      }

      while (true) {
        _node = _node?.parentNode;
        if (!_node || _node === this.editable.current) return null;

        if (_node.nextSibling) {
          return _node.nextSibling;
        }
      }
    }

    let lengthToStart = startOffset;
    let element = getPrevNode(startContainer);

    // Compute start of selection (string index)
    while (element && element !== this.editable.current) {
      lengthToStart += element.textContent?.length || 0;
      if (isLine(element)) {
        lengthToStart += 1;
      }
      element = getPrevNode(element);
    }

    // If not selected (selectionStart === selectionEnd)
    if (collapsed) {
      return {
        selectionStart: lengthToStart,
        selectionEnd: lengthToStart,
      };
    }

    // Selection inside one container
    if (startContainer === endContainer) {
      return {
        selectionStart: lengthToStart,
        selectionEnd: lengthToStart + (endOffset - startOffset),
      };
    }

    // Compute selection length
    let selectionLength = (startContainer.textContent?.length || 0) - startOffset;
    element = getNextNode(startContainer);

    while (element && !element.contains(endContainer) && element !== this.editable.current) {
      selectionLength += element.textContent?.length || 0;
      if (isLine(element)) {
        selectionLength += 1;
      }
      element = getNextNode(element);
    }

    if (isLine(element)) {
      selectionLength += 1;
    }

    element = element?.firstChild || null;
    while (element && element !== endContainer) {
      selectionLength += element.textContent?.length || 0;

      element = element.nextSibling;
      if (element && element.contains(endContainer)) {
        element = element.firstChild;
      }
    }

    if (element && element.textContent) {
      selectionLength += endOffset;
    }

    return {
      selectionStart: lengthToStart,
      selectionEnd: lengthToStart + selectionLength,
    };
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