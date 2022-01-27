import {switchThrottle} from "../../frp";
import {expect, suite, test} from "@hypertype/tools/dist/test";
import {delayAsync} from "../../frp/delay-async";

@suite
export class SwitchThrottleSpec {
  private start: number;

  @test
  async one(){
    this.start = performance.now();
    this.testFunc(1);
    this.testFunc(2);
    await delayAsync(100);
    this.testFunc(3);
    await delayAsync(700);
    this.testFunc(5);
    await delayAsync(700);
  }

  @test
  async two(){
    this.start = performance.now();
    const interval = setInterval(() => this.testFunc('x'))
    await delayAsync(2600);
    clearInterval(interval);
    this.testFunc('o');
    await delayAsync(500);
  }

  @switchThrottle(500, {leading: false, trailing: true})
  private testFunc(args){
    console.log(args, 'at', performance.now() - this.start);
  }
}
