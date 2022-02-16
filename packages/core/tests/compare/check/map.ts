import {TChecks} from '../checks';

export function map(): TChecks {
  const m1 = new Map();
  // m1.set({hello: 123}, 1);
  m1.set('obj', {'k': 2});
  // m1.set({world: 77}, 1);
  m1.set('str0', undefined);
  m1.set('str2', 2);
  m1.set('str3', 3);

  const m2 = new Map();
  m2.set('str0', undefined);
  m2.set('obj', {'k': 2});
  // m2.set({hello: 123}, 1);
  m2.set('str3', 3);
  m2.set('str2', 2);
  // m2.set({world: 77}, 1);

  const m3 = new Map(m2);
  m3.delete('str0');

  return [
    [m1, m2, true],
    [m1, m3, false],
    [m3, m2, false],
  ];
}
