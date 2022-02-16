import {Container} from "../di/container";
import {suite, test} from "@testdeck/jest";
import {expect} from "@jest/globals";

@suite
export class ContainerSpec {

    @test
    getContainer(){
        const container = new Container();
        const child = new Container();
        child.provide(container);
        expect(child.get(Container)).toEqual(child);
        expect(container.get(Container)).toEqual(container);
        expect(container.get(Container)).toEqual(container);
    }
}
