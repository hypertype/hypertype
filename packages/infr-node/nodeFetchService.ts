import {Observable} from "@hypertype/core";
import {fetchUrl} from 'fetch';
import {IRequestOptions, IRequestService} from "@hypertype/infr";


export class NodeFetchService extends IRequestService {
    request<T>(method, url, body, options: IRequestOptions): Observable<T> {
        if (options.params) {
            url += '?' + Object.keys(options.params)
                .map(key => `${key}=${options.params[key]}`)
                .join('&');
        }
        return new Observable(subscr =>
            fetchUrl(url, {
                method,
                payload: JSON.stringify(body),
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
            }, (error, meta, body) => {
                if (meta.status > 300) {
                    subscr.error({
                        status: meta.status,
                        exception: body
                    });

                } else if (options.responseType == "blob") {
                    subscr.next(body);
                } else if (meta.status == 204) {
                    subscr.next();
                } else if (meta.status == 200) {
                    subscr.next(JSON.parse(body));
                }
                subscr.complete();
            }));
    }

}
