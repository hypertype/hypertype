import {Observable} from "@hypertype/core";
import {ApiService} from "./api.service";
import {IRequestOptions, IRequestService} from "./request.service";

function camelCase<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(camelCase) as any as T;
    }
    if (typeof value === "object" && value != null) {
        return Object.entries(value).reduce((obj, [key, value]) => {

            obj[key[0].toUpperCase() + key.substr(1)] = camelCase(value);
            return obj;
        }, {} as T);
    }
    return value;
}

export class AuthApiService extends ApiService {

    constructor(http: IRequestService,
                ApiUrl: string,
                private tokenStore: ITokenStore) {
        super(http, ApiUrl)
    }

    request<T>(method: any, url: any, body: any = null, options: IRequestOptions = {}): Observable<T> {
        return super.request<T>(method, url, body, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${this.tokenStore.get()}`
            }
        }).pipe(
            // map(t => t && camelCase<T>(t))
        );
    }
}

export abstract class ITokenStore {
    abstract get(): Token;

    abstract set(token: Token);
}

export type Token = string;
