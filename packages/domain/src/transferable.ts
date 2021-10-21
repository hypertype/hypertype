/**
 * Список объектов, которые могут быть Transferable:
 *   https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects#supported_objects
 */
const hasOffscreenCanvas = 'OffscreenCanvas' in globalThis;
const hasImageBitmap = 'ImageBitmap' in globalThis;
const hasArrayBuffer = 'ArrayBuffer' in globalThis;
const hasReadableStream = 'ReadableStream' in globalThis;
const hasWritableStream = 'WritableStream' in globalThis;
const hasTransformStream = 'TransformStream' in globalThis;
const hasMessagePort = 'MessagePort' in globalThis;
const hasAudioData = 'AudioData' in globalThis;
const hasVideoFrame = 'VideoFrame' in globalThis;

function isTransferable(value): boolean {
  if (isNotJustObject(value))
    return false;
  return (
    (hasOffscreenCanvas && value instanceof OffscreenCanvas) ||
    (hasImageBitmap && value instanceof ImageBitmap) ||
    (hasArrayBuffer && value instanceof ArrayBuffer) ||
    (hasReadableStream && value instanceof ReadableStream) ||
    (hasWritableStream && value instanceof WritableStream) ||
    (hasTransformStream && value instanceof TransformStream) ||
    (hasMessagePort && value instanceof MessagePort) ||
    //@ts-ignore
    (hasAudioData && value instanceof AudioData) ||
    //@ts-ignore
    (hasVideoFrame && value instanceof VideoFrame)
  );
}

/**
 * Чтобы исключить утечки памяти надо подготовить массив с передаваемыми Transferable-объектами (из тех,
 * что были указаны в аргументе message), на которые передаются права собственности.
 * Если право на объект передаётся, то он становится непригодным (neutered) в контексте-отправителе и становится
 * доступным только в контексте-получателе.
 */
export function getTransferable(data): any[] {
  const result = [];
  walkThroughValues(data, (value) => {
    if (isTransferable(value))
      result.push(value);
  });
  return result;
}

/**
 * Обойти значения переданной структуры.
 * Значениями считаются:
 *   - значение поля объекта;
 *   - элемент массива.
 */
function walkThroughValues(data, callback: (value, key?: string) => void): void {
  if (isNotJustObject(data))
    return;
  else if (Array.isArray(data)) {
    for (const value of data) {
      callback(value);
      walkThroughValues(value, callback);
    }
    return;
  }
  for (const key in data) {
    const value = data[key];
    callback(value, key);
    walkThroughValues(value, callback);
  }
}

function isNotJustObject(value): boolean { // это не просто объект? Например, функция это тоже объект, но здесь она нас не интересует.
  return typeof value !== 'object' || value === null;
}
