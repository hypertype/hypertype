import {utc} from "../../";
import {suite, test} from "@testdeck/jest";
import {expect} from "@jest/globals";

@suite
export class UtcSpec {

  @test
  now() {
    const now = utc();
    expect(now).not.toBeNull();

  }


  @test
  nowByNumber() {
    const now = utc(+new Date());
    expect(now).not.toBeNull();
  }

  @test
  nowByString() {
    const now = utc(new Date().toISOString());
    expect(now).not.toBeNull();
  }
}
