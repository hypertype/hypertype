import * as crc32 from "crc-32";
import {ulid} from "ulid";

export const Fn = {
  I<T>(x: T): T {
    return x || null;
  },
  Ib<T>(x: T): boolean {
    return !!x;
  },
  Xor: <(x: any) => any>((x = null) => !x),
  Noop: () => undefined,
  False: () => false,
  True: () => true,
  Of<T>(x: T): () => T {
    return () => x;
  },
  Equal: x => y => x == y,
  NotEqual: x => y => x != y,
  Or: (x, y) => x || y,
  Class: x => function () {
    Object.assign(this, x);
  },
  Prop: prop => x => x[prop],
  Mult: k => x => x * k,
  Neg: x => -x,
  Cast<T>() {
    return <(x: any) => T>Fn.I;
  },
  ulid: ulid,
  combine: (...functions) => {
    return (...args) => {
      return functions.map(f => f(...args)).pop();
    }
  },
  pipe: (...functions) => {
    return functions.reduce((f1, f2) => (...args) => f2(f1(...args)))
  },
  arrayEqual: (arr1, arr2) => {
    if (arr1.length != arr2.length) return false;
    return arr1.every((a, i) => a == arr2[i]);
  },
  cache() {
    return (target, key, descr) => {
      const existed = descr.value;
      const cacheSymbol = Symbol("cache");
      descr.value = function (id) {
        if (!this[cacheSymbol]) this[cacheSymbol] = {};
        return this[cacheSymbol][id] ||
          (this[cacheSymbol][id] = existed.call(this, id))
      };
      return descr;
    }
  },
  crc32(value) {
    return crc32.str(JSON.stringify(value));
  },
  /**
   * Сравнивает два объекта, учитывает DateTime, Duration, array, object
   * @param a
   * @param b
   * @returns {boolean}
   */
  compare: function compare(a, b) {
    if (["string", "number", "boolean", "function"].includes(typeof a))
      return a === b;
    if (a === b)
      return true;
    if (a == null && b == null)
      return true;
    if (a == null || b == null)
      return false;
    if (a.equals && b.equals)
      return a.equals(b);

    const aIsArr = Array.isArray(a);
    const bIsArr =  Array.isArray(b);
    if (aIsArr && bIsArr)
      return compareArrays(a, b);
    else if(aIsArr || bIsArr)
      return false;

    const asIsSet = a instanceof Set;
    const bsIsSet = b instanceof Set;
    if (asIsSet && bsIsSet)
      return compareSets(a, b);
    else if (asIsSet || bsIsSet)
      return false;

    const aIsMap = a instanceof Map;
    const bIsMap = b instanceof Map;
    if (aIsMap && bIsMap)
      return compareMaps(a, b);
    else if (aIsMap || bIsMap)
      return false;

    if (typeof a === "object" && typeof b === "object") {
      const aKeys = Object.getOwnPropertyNames(a);
      const bKeys = Object.getOwnPropertyNames(b);
      return compareArraysOfPrimitives(aKeys, bKeys)
        && aKeys.every(key => compare(a[key], b[key]));
    }
    return false;
  }
};


//region Compare

function compareArrays(a: any[], b: any[]): boolean {
  return a.length === b.length &&
    a.every((x, i) => Fn.compare(x, b[i]));
}

function compareArraysOfPrimitives(a: any[], b: any[]): boolean {
  return a.length === b.length &&
    a.every((x, i) => x === b[i]);
}

function compareSets(a: Set<any>, b: Set<any>): boolean {
  return a.size === b.size
    && compareArrays(Array.from(a).sort(), Array.from(b).sort());
}

function compareMaps(a: Map<any, any>, b: Map<any, any>): boolean {
  if (a.size !== b.size)
    return false;
  const aKeys = Array.from(a.keys()).sort();
  const bKeys = Array.from(b.keys()).sort();
  return compareArrays(aKeys, bKeys)
    && aKeys.every((aKey, i) =>
      Fn.compare(a.get(aKey), b.get(bKeys[i]))
    );
}

//endregion
