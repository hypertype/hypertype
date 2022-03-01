export * from './src/model.proxy';
export * from './src/model';
import {SimpleWebWorkerEntry} from './src/simple-webworker.entry';

export * from './src/container';
export * from './helpers/DomainError';
export {ParentWindowStore} from './src/parent-window.store';
export {ChildWindowConnector} from './src/child-window.connector';
export {IChildWindowMetadata, TDetachState} from './src/contract';

export const WebworkerEntry = SimpleWebWorkerEntry;//('SharedArrayBuffer' in self) ? SharedWebworkerEntry : SimpleWebWorkerEntry;

export {IFactory, Stream} from "@cmmn/domain/proxy";
