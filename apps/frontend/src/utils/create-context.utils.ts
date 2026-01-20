import {
  createContext as createReactContext,
  useContext as useReactContext,
} from "react";

export const createContext = <T>() => {
  const context = createReactContext<T | null>(null);
  const useContext = () => {
    const reactContext = useReactContext(context);
    if (!reactContext) {
      throw new Error("useChat must be used within ChatProvider");
    }

    return reactContext;
  };

  return [context, useContext] as const;
};
