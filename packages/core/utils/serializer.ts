import {addExtension, Packr } from 'msgpackr/pack';
import {utc} from "./utc";
import {DateTime, Duration} from "./luxon";

const packr = new Packr({
    structuredClone: true,
});

export function registerSerializer<T, U>(type: number, classFunction: Function, write: (value: T) => U, read: (value: U) => T) {
    addExtension({
        Class: classFunction,
        write: write,
        read: read,
        type: type
    })
}

export function serialize(data: any) {
    return packr.encode(data);
}

export function deserialize(bytes: Uint8Array) {
    return packr.decode(bytes);
}

registerSerializer<DateTime, number>(1, DateTime,
    x => x.toMillis(),
    millis => utc(millis)
);

registerSerializer<Duration, number>(2, Duration,
    x => x.toMillis(),
    millis => Duration.fromMillis(millis)
);
//
// registerSerializer<Map<any, any>, ReadonlyArray<[number, number]>>(100,
//     perm => perm instanceof Map,
//     perm => [...perm],
//     array => new Map(array)
// );
//
// registerSerializer<Set<any>, ReadonlyArray<[any]>>(100,
//     perm => perm instanceof Set,
//     perm => [...perm],
//     array => new Set(array)
// );
//
// const refBuffer = {
//     serialize(data, cache = new Map()) {
//         if (cache.has(data))
//             return cache.get(data);
//         if (
//             !(typeof data === "object")
//             || data instanceof Map
//             || data instanceof Set
//         )
//             return data;
//         for (const dataKey in data) {
//             if ()
//         }
//     }
// }
