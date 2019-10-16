import {from, Observable} from '@hypertype/core';
import {IRequestOptions, IRequestService} from "@hypertype/infr";

export class FetchRequestService implements IRequestService {

    public request<T>(method,
                      url,
                      body = null,
                      options: IRequestOptions = {}): Observable<T> {
        if (options.params) {
            url += '?' + Object.entries(options.params).map(([key, value]) => `${key}=${value}`).join('&');
        }
        return from(fetch(url, {
            method: method,
            body: body && JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        })
            .then(t => {
                if (t.status >= 300) {
                    throw {
                        code: t.status,
                        message: t.text()
                    };
                }
                // if (+t.headers.get('Content-Length') == 0) {
                //     return of('');
                // }
                if (options.responseType == "blob")
                    return t.blob();
                if (/json/.test(t.headers.get('Content-Type'))) {
                    return t.json();
                }
                return t.text();
            }))
    }

}
