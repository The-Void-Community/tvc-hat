import { MaybeFrontendMessage } from "@/types";
import { useRef } from "react";

export const useMessagesPending = () => {
  const ref = useRef<Map<string, boolean>>(new Map());
  
  const clearPending = (id: string) => {
    ref.current.delete(id);
  }

  const createPending = (message: MaybeFrontendMessage) => {
    ref.current.set(message.id, true);
    return true;
  }

  return {
    pendingRef: ref,
    clearPending,
    createPending,
  }
}