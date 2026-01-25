"use client"

import {
  createContext as createReactContext,
  useContext as useReactContext,
} from "react";

export const createContext = <T>(name: string = "context") => {
  const context = createReactContext<T | null>(null);
  const useContext = () => {
    const reactContext = useReactContext(context);
    if (!reactContext) {
      throw new Error(name + " must be used within ChatProvider");
    }

    return reactContext;
  };

  return [context, useContext] as const;
};
