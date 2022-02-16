import {TTask} from './tasks';

const data = [
  [undefined] as undefined[],
  [null] as null[],
  [true, false] as boolean[],
  [-9.35, -7, -0, 0, NaN, 1, 7, 9.35] as number[],
  [-15n, 0n, 7n] as bigint[],
  ['hello', '-1', '0', '', '1'] as string[],
  [Symbol(), Symbol('id')] as symbol[],
  [{hello: 123}, {}] as object[],
  [() => 'world'] as Array<() => void>,
]

/**
 * Каждое значение из data сравнивается с каждым значением из data
 * либо по === либо по ==.
 */
export function simpleTasks(): TTask {
  const result: TTask = [];
  for (const values of data) {
    values.forEach(value => {
      result.push(...fillSimpleTask(value));
    });
  }
  return result;
}

function fillSimpleTask(targetValue: any): TTask {
  const result: TTask = [];
  for (const values of data) {
    values.forEach(value => {
      const check = isBothNullOrUndefined(targetValue, value)
        ? true
        : targetValue === value;
      result.push([targetValue, value, check]);
    });
  }
  return result;
}

function isBothNullOrUndefined(a: any, b: any): boolean {
  return a == null && b == null;
}
