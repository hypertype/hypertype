export * from './src/model.proxy';
export * from './src/model.stream';
export * from './src/model';
import {SharedWebworkerEntry} from './src/shared-webworker.entry';
import { SimpleWebWorkerEntry } from './src/simple-webworker.entry';
export {ParentWindowStreamProxy} from './src/parent-window-stream.proxy';
export * from './src/websocket.entry';
export * from './src/container';
export * from './helpers/DomainError';
export {TChild, TDetachState, IChildWindowMetadata} from './src/contract';

export const WebworkerEntry = SimpleWebWorkerEntry;//('SharedArrayBuffer' in self) ? SharedWebworkerEntry : SimpleWebWorkerEntry;

