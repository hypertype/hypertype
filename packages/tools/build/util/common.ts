import { join } from "path";
import {BASE_DIR} from './params';

export const relativeToBase = (...paths: string[]) => join(BASE_DIR, ...paths);
