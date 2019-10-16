import {catchError, filter, map, Observable, of, ReplaySubject, shareReplay, tap} from "@hypertype/core";
import {Model} from "./model";

export class WebsocketEntry {


    public Output$: Observable<any> = this.model.State$.pipe(
        map(s => JSON.stringify(s)),
        shareReplay(1)
    );
    private InputSubject$ = new ReplaySubject();
    private Input$ = this.InputSubject$.asObservable().pipe(
        map((d: string) => JSON.parse(d)),
        tap(console.log),
        catchError(e => of(null)),
        filter<any>(d => d.type),
        shareReplay(1),
    );

    constructor(private model: Model<any, any>) {
    }

    public onMessage = data => {
        const action = JSON.parse(data);
        this.model.Invoke(action);
    }
}
