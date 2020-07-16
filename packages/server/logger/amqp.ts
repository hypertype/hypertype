import {Connection, Exchange} from 'amqp-ts';

export class Rabbit {
    private connection: Connection;

    public static URL: string;

    constructor() {
        this.connection = new Connection(`amqp://admin:admin@${Rabbit.URL}`, {
            host: Rabbit.URL,
            port: 5672,
            login: 'admin',
            password: 'admin',
            // authMechanism: 'AMQPLAIN',
            // vhost: '/',
            // noDelay: true,
            // ssl: {enabled: false}
        });
    }

    public getExchange(name: string): Exchange {
        return new Exchange(this.connection, name, '', {noCreate: true});
    }

    close() {
        this.connection.close();
    }
}


