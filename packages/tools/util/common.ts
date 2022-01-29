import { join } from "path";
import {BASE_DIR} from './params';

export const relativeToBase = (...paths: string[]) => join(BASE_DIR, ...paths);

export function onProcessExit(callback: () => void): void {
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      callback();
      process.exit();
    });
  });
}
