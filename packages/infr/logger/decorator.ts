import {Logger} from "./logger";

function logDecorator(logInfo, info = (...args) => ({})) {
  return (target, key, descr) => {
    return {
      ...descr,
      value(...args) {
        return Logger.Default.Measure(()=> descr.value.apply(this, args),{
          Domain: 'web',
          Phase: `${target.constructor.name}.${key}`,
          ...logInfo,
          ...info(...args)
        });
      }
    };
  }
}

export function log(target, property, descriptor)
export function log(logInfo, info?)
export function log(...args) {
  if (args.length == 3)
    return logDecorator({})(args[0], args[1], args[2]);
  return logDecorator(args[0], args[1]);
}
