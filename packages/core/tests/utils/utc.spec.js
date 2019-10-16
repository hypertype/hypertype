import {utc} from "../../";
import {expect, suite, test} from "@hypertype/tools/test/index.js";

@suite
export class UtcSpec {

    @test
    now(){
        const now = utc();
        expect(now).to.be.not.null;

    }


    @test
    nowByNumber(){
        const now = utc(+new Date());
        expect(now).to.be.not.null;

    }
}
