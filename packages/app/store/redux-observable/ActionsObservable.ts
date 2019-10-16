import {Observable} from "@hypertype/core";
import {of} from "@hypertype/core";
import {from} from "@hypertype/core";
import {ofType} from './operators';

export class ActionsObservable<T> extends Observable<T> {
    static of(...actions) {
        return new this(of(...actions));
    }

    static from(actions, scheduler) {
        return new this(from(actions, scheduler));
    }

    constructor(actionsSubject) {
        super();
        this.source = actionsSubject;
    }

    ofType(...keys) {
        return ofType(...keys)(this);
    }
}
