/**
 * Сравнивает два значения, учитывает: array, object, Set, Map, DateTime, Duration.
 *
 * Ограничения для: array, Set, Map.
 * Корректное сравнение можно ожидать:
 *   - если массивы были предварительно отсортированы;
 *   - если Set содержит только примитивы;
 *   - если ключи Map состоят только из примитивов.
 *
 * Важно!
 * Предполагается, что нет разницы между null и undefined:
 *   compare(null, undefined)      -> true
 *   compare(undefined, null)      -> true
 *   compare(undefined, undefined) -> true
 *   compare(null, null)           -> true
 */
export function compare(a: any, b: any): boolean {
  switch (typeof a) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'function':
    case 'bigint':
    case 'symbol':
      return a === b;
  }
  if (a === b)
    return true;
  if (a == null && b == null)
    return true;
  if (a == null || b == null)
    return false;
  if (a.equals && b.equals)
    return a.equals(b);

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return compareArrays(a, b);
  else if (aIsArr || bIsArr)
    return false;

  const aIsSet = a instanceof Set;
  const bIsSet = b instanceof Set;
  if (aIsSet && bIsSet)
    return compareSets(a, b);
  else if (aIsSet || bIsSet)
    return false;

  const aIsMap = a instanceof Map;
  const bIsMap = b instanceof Map;
  if (aIsMap && bIsMap)
    return compareMaps(a, b);
  else if (aIsMap || bIsMap)
    return false;

  if (typeof a === 'object' && typeof b === 'object') {
    return compareObjects(a, b);
  }
  return false;
}


function compareArrays(a: any[], b: any[]): boolean {
  return a.length === b.length &&
    a.every((x, i) => compare(x, b[i]));
}

function compareSets(a: Set<any>, b: Set<any>): boolean {
  if (a.size !== b.size)
    return false;
  for (let x of a) {
    if (!b.has(x))
      return false;
  }
  return true;
}

function compareMaps(a: Map<any, any>, b: Map<any, any>): boolean {
  if (a.size !== b.size)
    return false;
  for (let key of a.keys()) {
    if (!b.has(key))
      return false;
    if (!compare(a.get(key), b.get(key)))
      return false;
  }
  return true;
}

function compareObjects(a: object, b: object): boolean {
  for (let key in a) {
    if (!(key in b))
      return false;
    if (!compare(a[key], b[key]))
      return false;
  }
  for (let key in b) {
    if (!(key in a))
      return false;
  }
  return true;
}
