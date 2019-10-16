import {
    catchError,
    fromEvent,
    InjectionToken,
    map,
    mergeMap,
    Observable,
    of,
    ReplaySubject,
    startWith,
    tap,
    throwError
} from '@hypertype/core';
import {IRequestOptions, IRequestService} from "./request.service";

export const ApiUrlInjectionToken = new InjectionToken('apiUrl');

export class ApiService {
    // protected http: IRequestService;

    private isBSON = false;

    constructor(protected http: IRequestService,
                public ApiUrl: string) {
    }

    get<T>(url: string, options: IRequestOptions = {}): Observable<T> {
        return this.request<T>('GET', url, null, options);
    }

    post<T>(url: string, body: any, options: IRequestOptions = {}): Observable<T> {
        return this.request<T>('POST', url, body, options);
    }

    delete<T>(url: string): Observable<T> {
        return this.request<T>('DELETE', url);
    }

    put<T>(url: string, body: any, options: IRequestOptions = {}): Observable<T> {
        return this.request<T>('PUT', url, body, options);
    }

    private loadingCounter = 0;
    private loadingSubject$ = new ReplaySubject<number>();
    public Loading$: Observable<number> = this.loadingSubject$.asObservable().pipe(
        // map(d => d != 0),
        startWith(0),
    );

    public request<T>(method, url: string, body = null, options: IRequestOptions = {}): Observable<T> {
        //WTF?
        if (!/accessTime/.test(url)) {
            this.loadingCounter++;
            this.loadingSubject$.next(this.loadingCounter);
        }
        if (!/^(http|ws)s?:\/\//.test(url))
            url = this.ApiUrl.toString() + url;
        const res = this.http.request(method, url, body, {
            headers: {
                ...(options.headers || {}),
                'Accept': this.isBSON ? 'application/bson' : 'application/json'
            },
            params: options.params,
            responseType: options.responseType || (this.isBSON ? 'blob' : 'json')
        }).pipe(
            // filter(event => {
            //   return (event instanceof HttpResponse);
            // }),
            // map(event => (<HttpResponse<Blob>>event).body),
            tap(() => {
                this.loadingCounter--;
                this.loadingSubject$.next(this.loadingCounter)
            }),
            catchError(e => {
                this.loadingCounter--;
                this.loadingSubject$.next(this.loadingCounter);
                return throwError(e);
            }),
            mergeMap(this.processResult),
        );
        return res;
    }

    private processResult = (body) => {
        if (!this.isBSON) {
            return of(body);
        }
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(body);
        return fromEvent(fileReader, 'loadend').pipe(
            map(_ => fileReader.result as ArrayBuffer),
            map(array => new Uint8Array(array)),
            // map(array => bson.deserialize(array)),
            // tap(console.log)
        );
    };
}
