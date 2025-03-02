import { TokenizedCode } from './src/components/json-editor/tokenized-code';
import { HistoryControl } from './src/utils/history-control';

const CODE = `{
  "groups": {
    "group:admin": [
      "itsib.su@gmail.com"
    ],
    "group:user": [
      "kitogonal@gmail.com",
      "arina.kraynova7@gmail.com",
      "itsib.su@gmail.com"
    ],
    "group:resident": [
      "itsib.su@gmail.com"
    ]
  },
  //// Commnet text
  "tagOwners": {
    "tag:user": ["group:user"],
    "tag:resident": ["group:resident"],
    "tag:admin": ["group:admin"],
    "tag:exit": [],
    "tag:ssh": []
  },
  "test": 12.342,
  "hosts": {
    "home.ts.net": "100.64.0.4",
    "router.home.ts.net": "100.64.0.4",
    "nginx.home.ts.net": "100.64.0.4",
    "am.ts.net": "100.64.0.5",
    "amsterdam.ts.net": "100.64.0.5"
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:admin"],
      "dist": [
        "tag:ssh:*",
        "192.168.0.0/24:*"
      ]
    },
    {
      "action": "accept",
      "src":    ["tag:user"],
      "dst":    [
          "tag:exit:*",
          "autogroup:internet:*"
       ],
    },
    {
      "action": "accept",
      "src": ["tag:resident"],
      "dst": ["tag:home:*"]
    }
  ]
}`;

const CODE_HISTORY = `qwerty asd zxc`;

const tokenized = TokenizedCode.tokenize(CODE);
console.log(tokenized.length);


let history = new HistoryControl(CODE_HISTORY);
history.insert('insertText', [3, 3], '1');
history.insert('insertText', [4, 4], '2');
console.log('history 1', history.value);
console.log('history 1', history.undo());
console.log('history 1', history.redo());

history = new HistoryControl(CODE_HISTORY);
history.insert('deleteContentBackward', [2, 3]);
history.insert('deleteContentBackward', [1, 2]);
console.log('history 2', history.value);

history = new HistoryControl(CODE_HISTORY);
history.insert('deleteContentForward', [3, 4]);
history.insert('deleteContentForward', [3, 4]);
console.log('history 3', history.value);


console.log('\x1b[1;92mTab Size:\x1b[0m %s', tokenized.getTabSize());

