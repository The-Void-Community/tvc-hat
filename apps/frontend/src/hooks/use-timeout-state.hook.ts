import { useCallback, useRef, useState } from "react";

export type SetTimeoutStateParameter<T> = T | ((previous: T) => T);

export const useTimeoutState = <T>(delay: number, initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const previousTimeout = useRef<NodeJS.Timeout | null>(null);

  const setTimeoutState = useCallback(
    (value: SetTimeoutStateParameter<T>, timeoutEnabled: boolean = true) => {
      if (previousTimeout.current) {
        clearTimeout(previousTimeout.current);
      }

      if (!timeoutEnabled) {
        return setState(value);
      }

      previousTimeout.current = setTimeout(() => {
        setState(value);
      }, delay);
    },
    [delay],
  );

  return [state, setTimeoutState, setState] as const;
};
