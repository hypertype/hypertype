import * as console2 from 'console';
import {tasks} from './task/tasks';
import {compare} from '../../utils/compare';
import {suite, test} from "@testdeck/jest";
import {expect} from "@jest/globals";


global.console = console2;

@suite
export class CompareTest{
  @test
  nullEqualsUndefined(){

    for (const [a, b, check] of tasks()) {
      // log(a, b, check);
      expect(compare(a, b)).toBe(check);
    }
  }
}


function log(a: any, b: any, check: boolean): void {
  console.log('compare(', a, b, `) expect ${check}`);
}
