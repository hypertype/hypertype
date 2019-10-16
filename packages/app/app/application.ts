import {Container, Injectable, Provider} from "@hypertype/core";
import {init} from "@hypertype/ui";

@Injectable()
export class Application {

    constructor(private container: Container) {
    }


    public Init(){
        init(this.container);
    }

    public Provide(...providers: Provider[]){
        this.container.provide(providers);
    }

    public get<T>(type){
        return this.container.get<T>(type);
    }
}
