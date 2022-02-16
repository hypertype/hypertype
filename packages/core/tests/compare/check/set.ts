import {TChecks} from '../checks';

export function set(): TChecks {
  const s1 = new Set();
  const s2 = new Set();
  const s3 = new Set([1, 2, 3, 4, 5]);

  [undefined, null, true, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '', '1'].forEach(value => {
    s1.add(value);
    s2.add(value);
  })

  return [
    [s1, s2, true],
    [s1, s3, false],
    [s3, s2, false],
  ];
}
