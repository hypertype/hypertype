const metadataMap = new Map<object, Map<string, any>>();

declare namespace Reflect {
  function metadata(metadataKey: any, metadataValue: any): {
    (target: Function): void;
    (target: Object, targetKey: string | symbol): void;
  };

  function getMetadata(metadataKey: any, target: Object): any;
}
Reflect.getMetadata = function (metadataKey: any, target: Object): any {
  return metadataMap.get(target)?.get(metadataKey);
}

Reflect.metadata = function metadata(metadataKey: any, metadataValue: any): {
  (target: Function): void;
  (target: Object, targetKey: string | symbol): void;
} {
  return target => {
    if (!metadataMap.has(target))
      metadataMap.set(target, new Map());
    const result = metadataMap.get(target);
    result.set(metadataKey, metadataValue)
  };
}
