import {Middleware, Action} from 'redux';
import {Observable} from "@hypertype/core";
import {Subject} from "@hypertype/core";

export declare class ActionsObservable<T extends Action> extends Observable<T> {
    constructor(input$: Observable<T>);

    ofType<R extends T = T>(...key: R['type'][]): ActionsObservable<R>;
}

export declare class StateObservable<S> extends Observable<S> {
    source: Subject<S>;

    constructor(stateSubject: Subject<S>, initialState: S);

    value: S
}

export declare interface Epic<Input extends Action = any, Output extends Input = Input, State = any, Dependencies = any> {
    (action$: ActionsObservable<Input>, state$: StateObservable<State>, dependencies: Dependencies): Observable<Output>;
}

export interface EpicMiddleware<T extends Action, O extends T = T, S = void, D = any> extends Middleware {
    run(rootEpic: Epic<T, O, S, D>): void;
}

interface Options<D = any> {
    dependencies?: D;
}

export declare function createEpicMiddleware<T extends Action, O extends T = T, S = void, D = any>(options?: Options<D>): EpicMiddleware<T, O, S, D>;

export declare function combineEpics<T extends Action, O extends T = T, S = void, D = any>(...epics: Epic<T, O, S, D>[]): Epic<T, O, S, D>;
export declare function combineEpics<E>(...epics: E[]): E;
export declare function combineEpics(...epics: any[]): any;

export declare function ofType<T extends Action, R extends T = T, K extends R['type'] = R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;