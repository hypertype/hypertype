import {Observable} from "@hypertype/core";

export abstract class ModelStream<TState, TActions> {
  Action: IInvoker<TActions>;
  State$: Observable<TState>;
  Input$?: Observable<any>;

  public SubStream<UState, UActions>(): ModelStream<UState, UActions> {
    return this as unknown as ModelStream<UState, UActions>;
  }
}


export interface IInvoker<TActions> {
  (action: IAction<TActions>): any;
}

// export type BaseAction = {
//   [key: string]: (...args: any[]) => Promise<any> | Promise<void> | void;
// };


export type IAction<TActions> = {
  path: any[],
  method: (keyof TActions) & string,
  args: any[],
  lastUpdate?: string,
  _id?: any, // для прокси action может прийти уже с _id
}


export const getMessageId = (action: IAction<any>) =>
  `${+performance.now()}.${action.method as string}.${Math.random()}.${(action.path ?? []).join('.')}`
;

