import {Subject} from "@hypertype/core";
import {from} from "@hypertype/core";
import {map} from "@hypertype/core";
import {mergeMap} from "@hypertype/core";
import {ActionsObservable} from './ActionsObservable';
import {StateObservable} from './StateObservable';
import {Middleware, StoreEnhancer} from "redux";
import {Epic} from "./types";

export function createEpicMiddleware(options: any = {}) {
    const epic$ = new Subject<any>();
    let store;

    const epicMiddleware = (_store => {
        store = _store;
        const actionSubject$ = new Subject().pipe(
        ) as Subject<any>;
        const stateSubject$ = new Subject().pipe(
        ) as Subject<any>;
        const action$ = new ActionsObservable(actionSubject$);
        const state$ = new StateObservable(stateSubject$, store.getState());

        const result$ = epic$.pipe(
            map(epic => {
                const output$ = 'dependencies' in options
                    ? epic(action$, state$, options.dependencies)
                    : epic(action$, state$);

                if (!output$) {
                    throw new TypeError(`Your root Epic "${epic.name || '<anonymous>'}" does not return a stream. Double check you\'re not missing a return statement!`);
                }

                return output$;
            }),
            mergeMap(output$ =>
                from(output$).pipe(
                )
            )
        );

        result$.subscribe(store.dispatch);

        return next => {
            return action => {
                // Downstream middleware gets the action first,
                // which includes their reducers, so state is
                // updated before epics receive the action
                const result = next(action);

                // It's important to update the state$ before we emit
                // the action because otherwise it would be stale
                stateSubject$.next(store.getState());
                actionSubject$.next(action);

                return result;
            };
        };
    }) as Middleware<any,any,any> & { run(epic: Epic): void; };

    epicMiddleware.run = rootEpic => {
        epic$.next(rootEpic);
    };

    return epicMiddleware;
}
