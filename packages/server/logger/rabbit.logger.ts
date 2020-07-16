import {Rabbit} from './amqp';
import {Exchange, Message} from 'amqp-ts';
import * as os from "os";
import {Logger} from "@hypertype/infr";
import {utc} from "@hypertype/core";

export class RabbitLogger extends Logger {
    private static rabbit: Rabbit = new Rabbit();
    private static exchange: Exchange = RabbitLogger.rabbit.getExchange('log-messages');

    private host = os.hostname();

    send(logInfo): void {
        const freeMemory = os.freemem() / (1 << 30);
        RabbitLogger.exchange.send(new Message({
            version: '1.0',
            host: os.hostname(),
            freememingb: freeMemory,
            short_message: "Short message",
            full_message: "Backtrace here\n\nmore stuff",
            level: 1,
            timestamp: +utc() / 1000,
            domain: 'render',
            facility: 'GELF',
            ...logInfo,
        }));
    }
}
