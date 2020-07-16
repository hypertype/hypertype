import * as redis from 'redis';


export class Redis  {
	client;
	bufferClient;

	private getEnvironmentConfig() {
		const data = require('fs').readFileSync('../environment.json', 'utf8');
		return JSON.parse(data);
	}

	constructor() {
		const redisServer = this.getEnvironmentConfig().RedisServer;
		this.client = redis.createClient({
			host: redisServer,
			port: 6379,
			// return_buffers: true,
			// detect_buffers: true
		});
		this.bufferClient = redis.createClient({
			host: redisServer,
			port: 6379,
			return_buffers: true,
			detect_buffers: true
		});
		this.close = this.close.bind(this);
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
	}

	get<T>(key: string, buffer = false): Promise<any> {
		return Promise.resolve(buffer ? this.bufferClient : this.client)
			.then(client => new Promise((resolve, reject) => client.get(key, (err, res) => {
				try {
					if (!(res instanceof Buffer)) {
						res = JSON.parse(res);
					} else {
						res = JSON.parse(res.toString());
					}
				} catch (e) {
				}
				if (res) resolve(res);
				reject(err);
			})));
	}

	set<T>(key: string, value: any, buffer = (value instanceof Buffer)): Promise<any> {
		if (!(value instanceof Buffer)) value = JSON.stringify(value);
		return Promise.resolve(buffer ? this.bufferClient : this.client)
			.then(client => new Promise((resolve, reject) => client.set(key, value, (err, res) => {
				if (res) {
				    resolve(res);
                }
				reject(err);
			})));
	}

	close() {
		this.client.end(true);
	}

	ngOnDestroy() {
		this.client.close();
		this.bufferClient.close();
	}
}
