import {suite, test} from "@hypertype/tools";
import {wire} from "../hyperhtml"

@suite
export class TestHypertypeSpec {
    @test
    test1(){
        const header = wire()`
            <header>Hello!</header>
        `;
    }
}
