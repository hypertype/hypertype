import {TChecks} from '../checks';

export function array(): TChecks {
  return [
    [
      [undefined, null, true, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '', '1'],
      [undefined, null, true, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '', '1'],
      true
    ],
    [
      [true, null, undefined, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '', '1'],
      [undefined, null, true, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '', '1'],
      false
    ],
    [
      [undefined, null, true, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '', '1'],
      [undefined, null, true, false, -9.35, -7, -0, 0, 1, 7, 9.35, -15n, 0n, 7n, 'hello', '-1', '0', '1', ''],
      false
    ],
    [
      [1, 'world', null],
      ['world', null],
      false
    ]
  ];

}
