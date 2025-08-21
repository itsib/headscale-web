const toggleSelection = () => {
  const selection = document.getSelection();
  if (!selection || !selection.rangeCount) {
    return () => {};
  }
  let active = document.activeElement;

  const ranges: Range[] = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (
    active?.tagName.toUpperCase() // .toUpperCase handles XHTML
  ) {
    case 'INPUT':
    case 'TEXTAREA':
      (active as any).blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return () => {
    if (selection.type === 'Caret') {
      selection.removeAllRanges();
    }

    if (!selection.rangeCount) {
      ranges.forEach((range) => selection.addRange(range));
    }

    if (active) {
      (active as any).focus();
    }
  };
};

const format = (message: string) => {
  const copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
  return message.replace(/#{\s*key\s*}/g, copyKey);
};

export const copyText = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const reselectPrevious = toggleSelection();
    let message;
    let range: Range | null = null;
    let selection: Selection | null = null;
    let mark;
    let success = false;
    try {
      range = document.createRange();
      selection = document.getSelection();

      mark = document.createElement('span');
      mark.textContent = text;
      // avoid screen readers from reading out loud the text
      mark.ariaHidden = 'true';
      // reset user styles for span element
      mark.style.all = 'unset';
      // prevents scrolling to the end of the page
      mark.style.position = 'fixed';
      mark.style.top = '0';
      (mark.style as any).clip = 'rect(0, 0, 0, 0)';
      // used to preserve spaces and line breaks
      mark.style.whiteSpace = 'pre';
      // do not inherit user-select (it may be `none`)
      (mark.style as any).webkitUserSelect = 'text';
      (mark.style as any).MozUserSelect = 'text';
      (mark.style as any).msUserSelect = 'text';
      mark.style.userSelect = 'text';
      mark.addEventListener('copy', function (e) {
        e.stopPropagation();
        resolve(true);
      });

      document.body.appendChild(mark);

      range.selectNodeContents(mark);
      selection?.addRange(range);

      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('copy command was unsuccessful');
      }
      success = true;
    } catch {
      try {
        (window as any).clipboardData.setData('text', text);
        return resolve(true);
      } catch {
        message = format('Copy to clipboard: #{key}, Enter');
        window.prompt(message, text);
      }
    } finally {
      if (selection) {
        if (typeof selection.removeRange == 'function' && range) {
          selection.removeRange(range);
        } else {
          selection.removeAllRanges();
        }
      }

      if (mark) {
        document.body.removeChild(mark);
      }
      reselectPrevious();
    }

    return resolve(success);
  });
};
