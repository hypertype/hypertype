import {Observable} from "@hypertype/core";

export abstract class IRequestService {
    abstract request<T>(method,
                        url,
                        body,
                        options: IRequestOptions): Observable<T>;
}

export interface IRequestOptions {
    headers?: any;
    reportProgress?: boolean;
    params?: any;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
}
