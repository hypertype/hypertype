// import color from 'chalk'; // все отображается без заданных цветов, если запускать через lerna
import color from 'colors';

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
    message = Array.isArray(message) ? message.join(' ') : message;
  switch (type) {
    case 'error':
      title = title && color.black.bgRed(title);
      message = message && color.red(message);
      break;
    case 'warning':
      title = title && color.black.bgYellow(title);
      message = message && color.black(message);
      break;
    case 'success':
      title = title && color.black.bgGreen(title);
      message = message && color.green(message);
      break;
    case 'action':
      title = title && color.black.bgCyan(title);
      message = message && color.black(message);
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
