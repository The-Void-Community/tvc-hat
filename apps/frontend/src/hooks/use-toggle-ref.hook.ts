import { useCallback, useRef } from "react"

export const useToggleRef = (initialValue: boolean = false) => {
  const ref = useRef<boolean>(initialValue);

  const toggle = useCallback((state?: boolean) => {
    ref.current = state || !ref.current;
  }, []);

  return [ ref, toggle ] as const;
}