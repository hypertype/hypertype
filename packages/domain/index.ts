export * from './src/model.proxy';
export * from './src/model.stream';
export * from './src/model';
import {SharedWebworkerEntry} from './src/shared-webworker.entry';
import { SimpleWebWorkerEntry } from './src/simple-webworker.entry';
export * from './src/websocket.entry';
export * from './src/container';
export * from './helpers/DomainError';

export const WebworkerEntry = SimpleWebWorkerEntry;//('SharedArrayBuffer' in self) ? SharedWebworkerEntry : SimpleWebWorkerEntry;

