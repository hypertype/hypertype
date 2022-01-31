import chalk from 'chalk';

export function logErr(title: string, ...message: string[]): void {
  log({type: 'error', title, message});
}

export function logWarn(title: string, ...message: string[]): void {
  log({type: 'warning', title, message});
}

export function logSuccess(title: string, ...message: string[]): void {
  log({type: 'success', title, message});
}

export function logAction(title: string, asLine = true): void {
  log({type: 'action', title, asLine});
}

export function logOption(option: string, value: string): void {
  log({type: 'success', title: option, message: value, asLine: true});
}


export function logBundlerErr(...message: string[]): void {
  logErr('Bundler:', ...message);
}


interface ILog {
  type: 'error' | 'warning' | 'success' | 'action';
  title?: string;
  message?: string[] | any;
  asLine?: boolean;
}

export function log({type, title, message, asLine}: ILog): void {
  if (message)
    message = Array.isArray(message) ? message : [message];
  switch (type) {
    case 'error':
      title = title && chalk.black.bgRed(title);
      message = message && chalk.red(...message);
      break;
    case 'warning':
      title = title && chalk.black.bgYellow(title);
      message = message && chalk.black(...message);
      break;
    case 'success':
      title = title && chalk.black.bgGreen(title);
      message = message && chalk.green(...message);
      break;
    case 'action':
      title = title && chalk.black.bgCyan(title);
      message = message && chalk.black(...message);
      break;
    default:
      logBundlerErr(`Unknown message type "${type}"`);
      throw '';
  }
  if (asLine) {
    if (title)
      console.log(title, message || '');
    else if (message)
      console.log(message);
  } else {
    if (title)
      console.log(title);
    if (message)
      console.log(message);
    console.log(' '); // empty line after message
  }
}
