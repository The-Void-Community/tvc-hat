import { useCallback, useRef, useState } from "react";

export const useToggleRef = (initialValue: boolean = false) => {
  const ref = useRef<boolean>(initialValue);

  const toggle = useCallback((state?: boolean) => {
    ref.current = state === undefined ? !ref.current : state;
  }, []);

  return [ref, toggle] as const;
};

export const useToggleState = (initialValue: boolean = false) => {
  const [state, setState] = useState<boolean>(initialValue);

  const toggle = useCallback(
    (newState?: boolean) => {
      setState(newState === undefined ? !state : newState);
    },
    [state],
  );

  return [state, toggle] as const;
};
