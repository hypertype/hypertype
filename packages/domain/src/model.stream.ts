import {Observable} from "@hypertype/core";

export abstract class ModelStream<TState, TActions> {
    Action: IInvoker<TActions>;
    State$: Observable<TState>;

    public SubStream<UState, UActions>(): ModelStream<UState, UActions> {
        return this as unknown as ModelStream<UState, UActions>;
    }
}


export interface IInvoker<TActions> {
    (action: IAction<TActions>): any;
}

export type IAction<TActions> = {
    path: any[],
    method: keyof TActions,
    args: any[]
}
