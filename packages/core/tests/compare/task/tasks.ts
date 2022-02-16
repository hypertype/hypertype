import {objectTasks} from './object.tasks';
import {simpleTasks} from './simple.tasks';
import {arrayTasks} from './array.tasks';
import {luxonTasks} from './luxon.tasks';
import {mapTasks} from './map.tasks';
import {setTasks} from './set.tasks';

export type TTask = Array<[any, any, boolean]>; // [a, b, check]

export function tasks() {
  return [
    ...simpleTasks(),
    ...luxonTasks(),
    ...arrayTasks(),
    ...setTasks(),
    ...mapTasks(),
    ...objectTasks(),
  ];
}

