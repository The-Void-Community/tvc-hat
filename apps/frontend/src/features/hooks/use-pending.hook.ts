import { useRef } from "react";

export const useTimeoutPending = <T extends unknown[]>(delay: number, callback: (...parameters: T) => void) => {
  const ref = useRef<Map<string, boolean>>(new Map());
  const timeoutRef = useRef<Map<string, number>>(new Map());

  const clearPending = (key: string) => {
    timeoutRef.current.delete(key);
    return ref.current.delete(key);
  };

  const createPending = (key: string, callbackParameters: T) => {
    ref.current.set(key, true);

    timeoutRef.current.set(key, window.setTimeout(() => {
      callback(...callbackParameters);
    }, delay));

    return true;
  };

  return {
    pendingRef: ref,
    pendingTimeoutRef: timeoutRef,
    clearPending,
    createPending,
  };
};

export const usePending = () => {
  const ref = useRef<Map<string, boolean>>(new Map());

  const clearPending = (id: string) => {
    ref.current.delete(id);
  };

  const createPending = (key: string) => {
    ref.current.set(key, true);
    return true;
  };

  return {
    pendingRef: ref,
    clearPending,
    createPending,
  };
};
