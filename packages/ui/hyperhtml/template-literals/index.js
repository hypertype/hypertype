let isNoOp = typeof document !== 'object';

let templateLiteral = function (tl) {
  const RAW = 'raw';
  const isBroken = function (UA) {
    return /(Firefox|Safari)\/(\d+)/.test(UA) &&
        !/(Chrom[eium]+|Android)\/(\d+)/.test(UA);
  };
  const broken = isBroken((document.defaultView.navigator || {}).userAgent);
  const FTS = !(RAW in tl) ||
      tl.propertyIsEnumerable(RAW) ||
      !Object.isFrozen(tl[RAW]);
  if (broken || FTS) {
    const forever = {};
    const foreverCache = function (tl) {
      for (var key = '.', i = 0; i < tl.length; i++)
        key += tl[i].length + '.' + tl[i];
      return forever[key] || (forever[key] = tl);
    };
    // Fallback TypeScript shenanigans
    if (FTS)
      templateLiteral = foreverCache;
    // try fast path for other browsers:
    // store the template as WeakMap key
    // and forever cache it only when it's not there.
    // this way performance is still optimal,
    // penalized only when there are GC issues
    else {
      const wm = new WeakMap;
      const set = function (tl, unique) {
        wm.set(tl, unique);
        return unique;
      };
      templateLiteral = function (tl) {
        return wm.get(tl) || set(tl, foreverCache(tl));
      };
    }
  } else {
    isNoOp = true;
  }
  return TL(tl);
};

export {TL};

function TL(tl) {
  return isNoOp ? tl : templateLiteral(tl);
}
