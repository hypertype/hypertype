import {DateTime, Duration} from 'luxon';
import {TTask} from './tasks';

export function luxonTasks(): TTask {
  const date1 = DateTime.local();
  const duration1 = Duration.fromObject({year: 2022, month: 2, day: 16});

  return [
    [date1, DateTime.fromISO(date1.toISO()), true],
    [duration1, Duration.fromISO(duration1.toISO()), true],
    [date1, duration1, false]
  ];
}
