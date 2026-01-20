import { useCallback, useState } from "react";

export type Store<T extends { id: string }> = {
  entities: Record<string, T>;
  order: string[];
};

export const useNormalizedStore = <
  T extends { id: string }
>() => {
  const [state, setState] = useState<Store<T>>({
    entities: {},
    order: [],
  });

  const append = useCallback((entity: T) => {
    setState(previous => {
      if (previous.entities[entity.id]) {
        return previous;
      }

      return {
        entities: {
          ...previous.entities,
          [entity.id]: entity,
        },
        order: [...previous.order, entity.id],
      };
    });
  }, []);

  const prependMany = useCallback((entities: T[]) => {
    setState(previous => {
      const newEntities: Record<string, T> = {};
      const newIds: string[] = [];
      
      for (const entity of entities) {
        if (!previous.entities[entity.id]) {
          newEntities[entity.id] = entity;
          newIds.push(entity.id);
        }
      }

      return {
        entities: { ...previous.entities, ...newEntities },
        order: [...newIds, ...previous.order],
      };
    });
  }, []);

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setState(previous => {
        const current = previous.entities[id];
        if (!current) {
          return previous;
        }

        const changed = (Object.keys(patch) as (keyof T)[]).some(
          key => current[key] !== patch[key]
        );
        if (!changed) {
          return previous;
        }
        
        const next = {
          ...current,
          ...patch,
        };

        return {
          ...previous,
          entities: {
            ...previous.entities,
            [id]: next,
          },
        };
      });
    },
    [],
  );

  const replaceId = useCallback(
    (id: string, entity: T) => {
      setState(previous => {
        const index = previous.order.indexOf(id);
        if (index === -1) {
          return previous;
        }

        const order = [...previous.order];
        order[index] = entity.id;

        const entities = { ...previous.entities };
        delete entities[id];
        entities[entity.id] = entity;

        return { entities, order };
      });
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setState(previous => {
      if (!previous.entities[id]) {
        return previous;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _none, ...entities } = previous.entities;

      return {
        entities,
        order: previous.order.filter(x => x !== id),
      };
    });
  }, []);

  const getById = useCallback(
    (id: string) => state.entities[id],
    [state.entities],
  );

  const getAll = useCallback(
    () => state.order.map(id => state.entities[id]),
    [state.order, state.entities],
  );

  return {
    entities: state.entities,
    order: state.order,
    store: state,

    append,
    prependMany,
    update,
    replaceId,
    remove,

    getById,
    getAll,
  } as const;
};
