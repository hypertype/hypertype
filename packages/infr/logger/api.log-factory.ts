import {ApiService} from "../src/api.service";
import {Logger} from "./logger";
import {Factory, Log} from "./types";
import {bufferTime, Container, filter, Subject} from "@hypertype/core";

export const LogApiUrl = Symbol('LogApiUrl');

export function ApiLogFactory(container: Container, apiLogUrl: string): Factory<Logger> {
  const apiService = container.get<ApiService>(ApiService);
  return () => {
    const subject = new Subject<Log>();
    const subscr = subject.pipe(
      bufferTime(3000),
      filter(arr => arr.length > 0)
    ).subscribe(logs => {
      apiService.post(apiLogUrl, logs);
    });
    return new Logger({
      send: (log: Log) => subject.next(log)
    })
  }
}
