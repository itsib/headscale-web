import { tags as tags, styleTags } from '@lezer/highlight';
import { LRParser } from '@lezer/lr';
import {
  HighlightStyle,
  syntaxHighlighting,
  LRLanguage,
  indentNodeProp,
  foldNodeProp,
  continuedIndent,
  foldInside,
  LanguageSupport,
} from '@codemirror/language';

export function languageHJSON() {
  const jsonHighlighting = styleTags({
    LineComment: tags.lineComment,
    BlockComment: tags.blockComment,
    String: tags.string,
    Number: tags.number,
    "True False": tags.bool,
    PropertyName: tags.propertyName,
    Null: tags.null,
    ",": tags.separator,
    "[ ]": tags.squareBracket,
    "{ }": tags.brace
  });

  const parser = LRParser.deserialize({
    version: 14,
    states: "$bOYQPOOOOQO'#Cc'#CcOqQPO'#CfOyQPO'#CkOOQO'#Cq'#CqQOQPOOOOQO'#Ch'#ChO!QQPO'#CgO!VQPO'#CsOOQO,59Q,59QO!_QPO,59QO!dQPO'#CvOOQO,59V,59VO!lQPO,59VOYQPO,59ROtQPO'#ClO!qQPO,59_OOQO1G.l1G.lOYQPO'#CmO!yQPO,59bOOQO1G.q1G.qOOQO1G.m1G.mOOQO,59W,59WOOQO-E6j-E6jOOQO,59X,59XOOQO-E6k-E6k",
    stateData: "#R~OdOSPOS~ORSOSSOTSOUSOXQO^ROfPO~OWXOfUO~O][O~PYOh^O~Oi_OWgX~OWaO~OibO]jX~O]dO~Oi_OWga~OibO]ja~O",
    goto: "!lkPPPPPPPlPPlrxPPl|!SPPP!YP!fPP!iXSOR^bQWQRf_TVQ_Q`WRg`QcZRicQTOQZRQe^RhbRYQR]R",
    nodeNames: "⚠ LineComment JsonText True False Null Number String } { Object Property PropertyName ] [ Array",
    maxTerm: 26,
    nodeProps: [
      ["isolate", -3,1,7,12,""],
      ["openedBy", 8,"{",13,"["],
      ["closedBy", 9,"}",14,"]"]
    ],
    propSources: [jsonHighlighting],
    skippedNodes: [0,1],
    repeatNodeCount: 2,
    tokenData: ")n~RbXY!ZYZ!Z]^!Zpq!Zrs!`|}$x}!O$}!P!Q&w!Q!R%W!R![&f![!]'f!}#O'k#P#Q'p#Y#Z'u#b#c(d#h#i({#o#p)d#q#r)i~!`Od~~!cWpq!`qr!`rs!{s#O!`#O#P#Q#P;'S!`;'S;=`$r<%lO!`~#QOf~~#TXrs!`!P!Q!`#O#P!`#U#V!`#Y#Z!`#b#c!`#f#g!`#h#i!`#i#j#p~#sR!Q![#|!c!i#|#T#Z#|~$PR!Q![$Y!c!i$Y#T#Z$Y~$]R!Q![$f!c!i$f#T#Z$f~$iR!Q![!`!c!i!`#T#Z!`~$uP;=`<%l!`~$}Oi~~%QQ!Q!R%W!R![&f~%]RU~!O!P%f!g!h%z#X#Y%z~%iP!Q![%l~%qRU~!Q![%l!g!h%z#X#Y%z~%}R{|&W}!O&W!Q![&^~&ZP!Q![&^~&cPU~!Q![&^~&kSU~!O!P%f!Q![&f!g!h%z#X#Y%z~&zP!P!Q&}~'SSP~OY&}Z;'S&};'S;=`'`<%lO&}~'cP;=`<%l&}~'kOh~~'pO^~~'uO]~~'xP#T#U'{~(OP#`#a(R~(UP#g#h(X~([P#X#Y(_~(dOS~~(gP#i#j(j~(mP#`#a(p~(sP#`#a(v~({OT~~)OP#f#g)R~)UP#i#j)X~)[P#X#Y)_~)dOR~~)iOX~~)nOW~",
    tokenizers: [0],
    topRules: {"JsonText":[0,2]},
    tokenPrec: 0
  });


  const JSON_LANGUAGE = LRLanguage.define({
    name: 'json',
    parser: parser.configure({
      props: [
        indentNodeProp.add({
          Object: continuedIndent({ except: /^\s*}/ }),
          Array: continuedIndent({ except: /^\s*]/ }),
        }),
        foldNodeProp.add({
          "Object Array": foldInside,
          BlockComment: tree => ({ from: tree.from + 2, to: tree.to - 2 }),
        }),
      ]
    }),
    languageData: {
      commentTokens: {
        line: "//",
      },
      closeBrackets: {
        brackets: [
          "[", "{", '"'
        ]
      },
      indentOnInput: /^\s*[}\]]$/,
    }
  });

  const JSON_HIGHLIGHT_STYLE = HighlightStyle.define([
    { tag: tags.lineComment, color: 'var(--code-highlight-comments)' },
    { tag: tags.propertyName, color: 'var(--code-highlight-property)' },
    { tag: tags.string, color: 'var(--code-highlight-string)' },
    { tag: tags.number, color: 'var(--code-highlight-number)' },
    { tag: tags.null, color: 'var(--code-highlight-null)' },
    { tag: tags.separator, color: 'var(--code-highlight-brace)' },
    { tag: tags.brace, color: 'var(--code-highlight-brace)' },
  ]);

  return new LanguageSupport(JSON_LANGUAGE, {
    extension: [
      syntaxHighlighting(JSON_HIGHLIGHT_STYLE),
    ]
  });
}