import {suite, test, timeout} from '@hypertype/tools/dist/test';
import {RabbitLogger} from "../../core/logger/rabbit.logger";
import {TcpLogger} from "../../core/logger/tcp.logger";
import {of} from "@hypertype/core";
import {delay} from "@hypertype/core";

@suite
export class LoggerSpec {

    // @test
    // public SendToRabbit() {
    //     const logger = new RabbitLogger();
    //     logger.info({
    //     });
    // }

    @test(timeout(10000))
    public async SendToTcp() {
        const logger = new TcpLogger();
        logger.info({
            domain: 'render',
            phase: 'C',
        });
        logger.info({
            domain: 'render',
            phase: 'B',
        });
    }
}
