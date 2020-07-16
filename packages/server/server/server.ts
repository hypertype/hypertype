// import { WsApp } from './ws.app';
import * as express from 'express';
import {Router} from 'express';
import * as http from 'http';
import {App} from "./app";
const bodyParser = require('body-parser');

// import { HmrApp } from './hmr.app';

export interface IServer {
    registerApp(app: App, path: string);
    start(): Promise<void>;
}

export class Server implements IServer {
    private app: express.Application = express();
    private Router: Router;
    // private wsApp = new WsApp();

    // private hmrApp = new HmrApp('hmr');
    constructor() {
        // this.initProxy();
        this.initSettings();
        this.initRoutes();
    }

    private initRoutes() {
        this.Router = Router();
        // this.app.use('/hmr', this.hmrApp.getRouter());
        // appRouter.use(this.browserApp.getRouter());
        //   this.app.use('/gm2', appRouter);
        this.app.use(this.Router);
    }

    public registerApp(app: App, path) {
        this.Router.use(path, app.getRouter());
    }

    public async start() {
        const server = await this.runServer();
        server.timeout = 10 * 60 * 1000;
        console.log(`Process ${process.pid} is listening on: http://localhost:${server.address()['port']}`);
        process.on('uncaughtException', function (err) {
            console.error('Catching uncaught errors to avoid process crash', err);
        });
    }

    // private initProxy() {
    //     const globalTunnel = require('global-tunnel');
    //     console.log('proxy enabling...');
    //     try {
    //         globalTunnel.initialize({
    //             host: 'localhost',
    //             port: 8888,
    //             tunnel: 'both'
    //         });
    //
    //         const origAddRequest = http.globalAgent['addRequest'];
    //         http.globalAgent['addRequest'] = function (req, host, port, localAddress) {
    //             return origAddRequest.call(this, req, host.host, host.port, localAddress);
    //         };
    //     } catch (e) {
    //         console.log('proxy failed, fiddler at localhost:8888 not available;');
    //     }
    //     console.log('proxy enabled');
    // }

    private initSettings() {

        // this.app.use((req,res,next)=>{
        //     console.log(req.url);
        //     next();
        // });
        this.app.set('port', process.env.PORT || 4203);
        this.app.set('views', [
            require('path').join(__dirname, '../..'),
            require('path').join(__dirname, '../../..')
        ]);
        this.app.set('view engine', 'html');
        this.app.set('json spaces', 2);

        this.app.use(bodyParser.json());
    }

    private runServer(): Promise<http.Server> {
        return new Promise(resolve => {
            const server = this.app.listen(this.app.get('port'), () => resolve(server));
            // this.wsApp.Register(server, '/ws');
            // this.hmrApp.listen(server, '/hmr');
        });
    }
}
