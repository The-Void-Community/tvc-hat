import { useCallback, useEffect, useState } from "react"

export const useMedia = (query: string) => {
  const [targetReached, setTargetReached] = useState<boolean>(false)

  const updateTarget = useCallback((event: MediaQueryListEvent) => {
    if (event.matches) {
      setTargetReached(true)
    } else {
      setTargetReached(false)
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia(query);
    media.addEventListener('change', updateTarget);

    if (media.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetReached(true)
    };

    return () => media.removeEventListener('change', updateTarget)
  }, [query, updateTarget]);

  return targetReached;
}

export default useMedia;