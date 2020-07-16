import { Redis } from './redis';

const redis = new Redis();

redis.set('asdf2','asfda32')
	.then(console.log)
	.then(d => redis.get('asdf2'))
	.then(console.log)
	.catch(redis.close)
	.then(redis.close);

setTimeout(redis.close, 1000);
