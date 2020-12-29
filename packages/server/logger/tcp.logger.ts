import {Logger} from "@hypertype/infr";
import {Socket, createConnection} from "net";
import * as os from "os";
import {utc} from "@hypertype/core";

export class TcpLogSender {
    private tcpClient: Socket;
    public static URL: string;
    constructor() {
        const [host, port] = TcpLogSender.URL.split(':');
        this.tcpClient = createConnection(+port, host);
        // this.tcpClient.connect(5045, '172.20.154.101', ()=>{
        //     console.log('tcp connected')
        // });

        this.tcpClient.on('connect', () => {
            console.log('tcp connected');
        });
        this.tcpClient.on('close', function () {
            console.log('Connection closed');
        });
    }

    send(data) {
        const str = JSON.stringify({
            host: os.hostname(),
            '@timestamp': utc().toISO(),
            domain: 'render',
            ...data
        });
        this.tcpClient.write(str+'\n');
    }
}
