import {HttpClient, HttpRequest, HttpResponse} from "./signalr";
import {ApiService} from "./api.service";
import {Injectable} from "@hypertype/core";

@Injectable()
export class ApiHttpClient extends HttpClient {
    constructor(private apiService: ApiService) {
        super();
    }

    send(request: HttpRequest): Promise<HttpResponse> {
        return this.apiService.request(request.method, request.url, request.content, {
            headers: request.headers,
        }).toPromise()
            .then(res => new HttpResponse(200, 'OK', JSON.stringify(res)))
            .catch(err => new HttpResponse(err.code, err.message, err));
    }

}
