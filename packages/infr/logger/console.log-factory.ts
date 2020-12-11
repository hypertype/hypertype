import {Factory, Log, LogLevel} from "./types";
import {Logger} from "./logger";

export const ConsoleLogFactory: Factory<Logger> = () => new Logger({
  send(log: Log) {
    switch (log.Level){
      case LogLevel.Info:
        return console.log(log);
      case LogLevel.Debug:
        return console.info(log);
      case LogLevel.Success:
        return console.log(`%cSUCCESS`, "background: green; color:white;", log);
      case LogLevel.Error:
      case LogLevel.Failure:

        return console.error(`%cERROR`, "background: red; color:white;", log);
      case LogLevel.Warning:
        return console.warn(log);
      default:
        throw new Error(`unknown log format ${JSON.stringify(log)}`);
    }
  }
})
