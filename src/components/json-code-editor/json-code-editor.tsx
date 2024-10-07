import { FC, useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightSpecialChars,
  highlightTrailingWhitespace,
  keymap,
  lineNumbers, ViewUpdate,
} from '@codemirror/view';
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
import { languageHJSON } from '../../utils/language-hjson.ts';
import './json-code-editor.css';

export interface JsonCodeEditorPops {
  value?: string;
  onChange?: (value: string) => void;
}

export const JsonCodeEditor: FC<JsonCodeEditorPops> = ({ value, onChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef(value);
  const changeRef = useRef(onChange);
  changeRef.current = onChange;
  const [view, setView] = useState<EditorView>();

  // Create editor view and attach to HTMLDivElement
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    const state = EditorState.create({
      doc: valueRef.current || '',
      extensions: [
        lineNumbers(),
        highlightSpecialChars(),
        highlightTrailingWhitespace(),
        history(),
        drawSelection(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorState.tabSize.of(4),
        languageHJSON(),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (!update.docChanged) {
            return;
          }
          const doc = update.state.doc as unknown as { children?: { text: string[] }[]; text?: string[] } | null;
          if (!doc) return;

          let value = '';
          if (doc.children) {
            value = doc.children.reduce((acc, child) => acc + '\n' + child.text.join('\n'), '');
          } else if (doc.text) {
            value = doc.text.join('\n');
          }
          valueRef.current = value.trim();

          changeRef.current?.(valueRef.current);
        }),
      ],
    });

    const view = new EditorView({ state, parent });

    setView(view);

    return () => {
      view.destroy();
      setView(undefined);
    };
  }, []);

  // Update code from props
  useEffect(() => {
    if (!view || valueRef.current === value) return;

    const transaction = view.state.update({
      changes: {
        from: 0,
        to: valueRef.current?.length || undefined,
        insert: value,
      },
    });
    valueRef.current = value;

    view.dispatch(transaction);
  }, [value, view]);

  return (
    <div className="json-code-editor" ref={containerRef} />
  )
}