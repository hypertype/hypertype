/**
 * Created by xamidylin on 2017-01-23.
 */
import {DateTime, Duration} from './luxon';

export function utc(d: (Date | number | string) = undefined): DateTime {
    if (typeof d === "string") {
        return DateTime.fromISO(d).toUTC();
    }
    if (typeof d === "number") {
        return DateTime.fromMillis(d, {zone: 'utc'});
    }
    if (d instanceof Date) {
        return DateTime.fromJSDate(d, {zone: 'utc'});
    }
    return DateTime.utc();
}


export function utcToday() {
    return utc().startOf('day');
}

