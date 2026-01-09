import { useCallback, useRef } from "react"

export const useLoading = (initialValue: boolean = false) => {
  const loading = useRef<boolean>(initialValue);

  const toggleLoading = useCallback((state?: boolean) => {
    loading.current = state === undefined ? !loading.current : state;
  }, []);

  return {
    loading,
    toggleLoading
  } as const;
}