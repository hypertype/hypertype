import {Factory, ILogSender, Log, LogLevel} from "./types";

export class Logger {
  private static _default: Logger;

  public static get Default(): Logger {

    if (!this._default)
      this._default = this.Factory();
    return this._default;
  }

  public static Factory: Factory<Logger>;

  constructor(private logSender: ILogSender) {
  }

  public Log<TLog extends Log>(data: TLog) {
    this.logSender.send(data);
  }

  public MeasureSync<TResult, TLog extends Log>(fn: () => TResult, log: TLog) {
    const start = new Date();
    try {
      const result = fn();
      const elapsedMs = +new Date() - +start;
      this.Log({
        ...log,
        Level: LogLevel.Success,
        ElapsedMs: elapsedMs
      });
      return result;
    } catch (e) {
      const elapsedMs = +new Date() - +start;
      this.Log({
        ...log,
        Level: LogLevel.Error,
        ExceptionMessage: e?.message,
        StackTrace: e?.stack,
        ElapsedMs: elapsedMs
      });
      throw e;
    }
  }


  public async Measure<TResult, TLog extends Log>(fn: () => Promise<TResult>, log: TLog): Promise<TResult> {
    const start = new Date();
    try {
      const result = await fn();
      const elapsedMs = +new Date() - +start;
      this.Log({
        ...log,
        Level: LogLevel.Success,
        ElapsedMs: elapsedMs
      });
      return result;
    } catch (e) {
      const elapsedMs = +new Date() - +start;
      this.Log({
        ...log,
        Level: LogLevel.Error,
        ExceptionMessage: e?.message,
        StackTrace: e?.stack,
        ElapsedMs: elapsedMs
      });
      throw e;
    }
  }

}

