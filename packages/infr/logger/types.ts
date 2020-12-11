export type Factory<T> = () => T;

export interface ILogSender {
  send(log: Log);
}

export enum LogLevel{
  Info = -1,
  Debug = 0,
  Warning = 1,
  Error = 2,
  Failure = 3,
  Success = 4
}

export type Log = {
  Level: LogLevel;
  ShortMessage?: string;
  FullMessage?: string;
  Environment?: string;
  StackTrace?: string;
  ExceptionMessage?: string;
  Domain?: string;
  SubDomain?: string;
  Phase?: string;
  ElapsedMs?: number;
}
