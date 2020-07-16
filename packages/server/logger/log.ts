import {Logger} from "@hypertype/infr";
import {TcpLogger} from "./tcp.logger";
import {utc} from "@hypertype/core";

let logger: Logger;

function getLogger() {
    if (!logger)
        logger = new TcpLogger();
    return logger;
}

function logDecorator(logInfo, info = (...args) => args) {
    return (target, key, descr) => {
        return {
            ...descr,
            value(...args) {
                const time = +utc();
                const getData = () => ({
                    phase: 'api',
                    durationms: +utc() - time,
                    method: key,
                    controller: target.constructor.name,
                    ...logInfo,
                    ...info(...args)
                });
                try {
                    const res = descr.value.apply(this, args);
                    if (res instanceof Promise) {
                        return res
                            .then((data) => {
                                // console.log(logInfo);
                                getLogger().info(getData());
                                return data;
                            })
                            .catch((e) => {
                                // console.log(logInfo);
                                getLogger().error(getData());
                                throw e;
                            });
                    } else {
                        getLogger().info(getData());
                        return res;
                    }
                } catch (e) {
                    getLogger().error(getData());
                }
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
