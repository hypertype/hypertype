import {Observable} from "@hypertype/core";
import {Model} from "../model";
import {IAction, IInvoker, ModelStream} from "../model.stream";


export class SimpleModelStream<TState, TActions> extends ModelStream<TState, TActions> {
    public State$: Observable<TState> = this.model.State$;

    constructor(private model: Model<TState, TActions>) {
        super();
    }

    public Action: IInvoker<TActions> = (action: IAction<TActions>) => {
        return this.model.Invoke(action);
    };
}

