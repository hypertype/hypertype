import {Serializer} from "../../utils/serializer";
import {expect, suite, test} from "@hypertype/tools/test/index.js";

@suite()
export class SerializerSpec {


    @test
    testUTF(){
        const obj = {
            a: 'sadfvdas‡‰'
        };
        const ser = Serializer.serialize(obj);
        const obj2 = Serializer.deserialize(ser);
        expect(obj2).to.be.deep.equal(obj2);
    }

    @test()
    testBig(){
        // const ser = Serializer.serialize(obj);
        // console.log(ser.length);
        // const obj2 = Serializer.deserialize(ser);
        // expect(obj2).to.be.deep.equal(obj2);
    }
}

