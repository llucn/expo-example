import {Href, router} from 'expo-router';

type AnyFunction = (...args: any[]) => any;

const callbackMap = new Map<string | string[], AnyFunction>();

function randomStringId() {
  return (new Date().getTime().toString() + Math.random().toString()).replace('.', '');
}

export function navigateWithCallback(
  options: Href &
  object & {
    callback: AnyFunction;
  }
): string {
  if (!options.callback) throw Error('options.callback can not be null');
  const id = randomStringId();
  callbackMap.set(id, options.callback);
  router.navigate({
    pathname: options.pathname,
    params: {
      ...options?.params,
      callbackHandle: id,
    },
  });
  return id;
}

export function getCallback(callbackHandle: string | string[]) {
  const callback = callbackMap.get(callbackHandle);
  if (!callback) throw Error('callback not found, check the callBackHandle:' + callbackHandle);
  return callback;
}

export function deleteCallback(callbackHandle: string | string[]) {
  callbackMap.delete(callbackHandle);
}