import {Rabbit} from '../../core/logger/amqp';
import {Exchange, Message} from 'amqp-ts';
import {suite, test} from 'mocha-typescript';
import {utc} from "@hypertype/core";

@suite
export class AmqpSpec{
    private exchange: Exchange;
    private rabbit: Rabbit;

    before(){
        this.rabbit = new Rabbit();
        this.exchange = this.rabbit.getExchange("log-messages");
    }

    @test
    public ShouldSendData(){
        this.exchange.send(new Message({
            "version": "1.0",
            "host": "www1",
            "short_message": "Short message",
            "full_message": "Backtrace here\n\nmore stuff",
            "timestamp": +utc() / 1000,
            "level": 1,
            "domain": "render",
            "facility": "payment-backend",
            "file": "/var/www/somefile.rb",
            "line": 356,
            "_user_id": 42,
            "_something_else": "foo"
        }));
    }

    async after(){
        await this.exchange.close().then(() => {
            return this.rabbit.close();
        });
    }
}