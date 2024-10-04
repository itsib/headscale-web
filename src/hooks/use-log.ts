import { useEffect, useRef, useState } from 'react';
import { Color } from '../utils/color';

const STACK_CALL_REGEX = /^at\s([a-zA-Z0-9]+)\s/;

function getCallsTrace(): string[] {
  const stack = new Error().stack || '';
  return stack
    .split('\n')
    .map((line: string): string => {
      line = line.trim();
      if (line === 'Error' || line.includes('getCallsTrace') || line.includes('useLog')) {
        return '';
      }
      const result = STACK_CALL_REGEX.exec(line);
      return result === null || result[1] === undefined ? '' : result[1];
    })
    .filter(i => !!i);
}

function renderCallTrace(callsTrace: string[]): void {
  console.groupCollapsed('%cCall trace', 'color: #77777a; font-weight: 400');
  callsTrace.forEach((call, index) => {
    console.info(`${index}:%c ${call}`, 'color: #bada55');
  });
  console.groupEnd();
}

export interface LogOpts {
  showTrace?: boolean;
  color?: boolean;
}

export function useLog(_values: { [name: string]: any }, { showTrace = false, color = true }: LogOpts = {}): void {
  const callsTrace = showTrace ? getCallsTrace() : undefined;
  const [values, setValues] = useState<{ [name: string]: any } | null>(null);
  const valuesRef = useRef({} as { [name: string]: any });

  // Watch to values changes
  useEffect(() => {
    if (!_values || typeof _values !== 'object') {
      valuesRef.current = {};
      return setValues(null);
    }

    const names = Object.keys(_values);
    if (names.length !== Object.keys(valuesRef.current).length) {
      setValues(_values);
      valuesRef.current = _values;
    }

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const value = _values[name];

      if (valuesRef.current[name] === value) {
        continue;
      }
      setValues(_values);
      break;
    }
    valuesRef.current = _values;
  }, [_values]);

  // Print logs
  useEffect(() => {
    if (/*import.meta.env.PROD || */!values) {
      return;
    }

    const names = Object.keys(values);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      if (color) {
        const _color = name.toLowerCase().includes('err') ? Color.fromHex('#FF0000') : Color.fromString(name);
        if (_color.lightness < 30) {
          _color.lightness = 50;
        }
        console.log(`%c${name}:`, `color: ${_color.toString()}`, values[name]);
      } else {
        console.log(`${name}:`, values[name]);
      }
    }

    if (callsTrace) {
      renderCallTrace(callsTrace);
    }
  }, [values, callsTrace, color]);
}