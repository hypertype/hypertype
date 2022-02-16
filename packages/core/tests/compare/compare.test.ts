import * as console2 from 'console';
import {checks} from './checks';
import {compare} from '../../utils/compare';
import {suite, test} from "@testdeck/jest";
import {expect} from "@jest/globals";

global.console = console2;

const isDebug = false;

@suite
export class CompareTest{

  @test
  nullEqualsUndefined(){
    for (const [a, b, expectedResult] of checks()) {
      log(a, b, expectedResult);
      expect(compare(a, b)).toBe(expectedResult);
    }
  }

}

function log(a: any, b: any, expectedResult: boolean): void {
  if (isDebug)
    console.log('compare(', a, b, `) expect ${expectedResult}`);
}
