import { useCallback, useState } from "react"

export const useMap = <T extends object>() => {
  const [map, setMap] = useState<Map<string, T>>(new Map());

  const addMany = useCallback((data: T[], groupBy: keyof T, to: "start"|"end" = "end") => {
    return setMap((previous) => {
      const newData = data.map((value) => [value[groupBy], value] as [string, T]);
      const oldData = Array.from(previous.entries());

      if (to === "end") {
        return new Map([
          ...oldData,
          ...newData
        ]);
      };

      return new Map([
        ...newData,
        ...oldData,
      ]);
    });
  }, []);

  const add = useCallback((key: string, data: T) => {
    return setMap((previous) => new Map(previous).set(key, data));
  }, [])
  
  return {
    map,
    add,
    addMany,
    setMap
  } as const
}