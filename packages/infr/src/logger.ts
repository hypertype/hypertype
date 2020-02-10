
export class Logger {
  protected send(data) {
  }

  private sendMessage(data, level: LoggerLevel) {
    if (typeof data === 'string') {
      this.send({
        message: data,
        level: level
      });
    } else {
      this.send({
        ...data,
        level: level
      });
    }
  }

  public error(data) {
    this.sendMessage(data, LoggerLevel.Error);
  }

  public success(data) {
    this.sendMessage(data, LoggerLevel.Success);
  }

  public info(data) {
    this.sendMessage(data, LoggerLevel.Info);
  }

  public debug(data) {
    this.sendMessage(data, LoggerLevel.Debug);
  }

  public warning(data) {
    this.sendMessage(data, LoggerLevel.Warning);
  }

  public failure(data) {
    this.sendMessage(data, LoggerLevel.Failure);
  }
}

export enum LoggerLevel {
  Info = -1,
  Debug = 0,
  Warning = 1,
  Error = 2,
  Failure = 3,
  Success = 4
}
