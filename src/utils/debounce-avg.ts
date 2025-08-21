type DebounceCallback<T> = (value: T) => void;

export function debounceAvg(
  callback: (value: number) => void,
  delay: number
): DebounceCallback<number> {
  let _sumValues: number = 0;
  let _countValues: number = 0;
  let _skip = false;

  const _fn = () => {
    const avg = _sumValues / _countValues;
    _sumValues = 0;
    _countValues = 0;

    callback(avg);
    _skip = false;
  };

  return (v: number) => {
    _sumValues += v;
    _countValues++;
    if (!_skip) {
      _skip = true;
      setTimeout(_fn, delay);
    }
  };
}
