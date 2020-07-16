import {Redis} from './redis';
import {Request} from 'express';

const redis = new Redis();
const crc32 = require('crc-32');

const keyMap = {};
declare const Env;

export function cacheMiddleware(req: Request, res, next) {
  // let key = '__express__' + req.originalUrl || req.url;
  const crc = crc32.str(req.url);

  function responseFromCache(buffer) {
    console.log('cached item: ', buffer);
    return redis.get<ICacheItem>(`headers${crc}`)
      .then(headers => {
        for (let key in headers) {
          console.log(key, headers[key]);
          res.setHeader(key, headers[key]);
        }
        res.send(buffer);
      });
  }

  function response() {
    res['sendResponse'] = res.send;
    const headers = {};
    const setHeader = res.setHeader;
    res.setHeader = (key, value) => {
      headers[key] = value;
      setHeader.call(res, key, value);
    };
    res.send = (body) => {
      redis.set<any>(`data${crc}`, body).then(console.log);
      redis.set<any>(`headers${crc}`, headers).then(console.log);
      res['sendResponse'](body);
    };
    next();
  }

  if ((Env.IsProd && req.headers["cache-control"] != 'no-cache') || req.query.cache) {
    redis.get<ICacheItem>(`data${crc}`, true)
      .then(responseFromCache)
      .catch(response)
      .catch(err => res.send(err));
  } else {
    next();
  }
}

interface ICacheItem {
  headers: any;
  body: any;
}
