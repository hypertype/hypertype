import {object} from './check/object';
import {simple} from './check/simple';
import {array} from './check/array';
import {builtinEquals} from './check/builtinEquals';
import {map} from './check/map';
import {set} from './check/set';

export type TChecks = Array<[any, any, boolean]>; // [a, b, expectedResult]

export function checks(): TChecks {
  return [
    ...simple(),
    ...builtinEquals(),
    ...array(),
    ...set(),
    ...map(),
    ...object(),
  ];
}

