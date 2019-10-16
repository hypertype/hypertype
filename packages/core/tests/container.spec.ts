import {Container} from "../di/container";
import {expect, suite, test} from "@hypertype/tools/test/index.js";

@suite
export class ContainerSpec {

    @test
    getContainer(){
        const container = new Container();
        const child = new Container();
        child.provide(container);
        expect(child.get(Container)).to.be.equal(child);
        expect(container.get(Container)).to.be.equal(container);
    }
}