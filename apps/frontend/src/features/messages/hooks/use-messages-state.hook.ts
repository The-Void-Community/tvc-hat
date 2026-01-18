import { useRef } from "react"
import { useMessagesMap } from "./use-messages-map.hook";

export const useMessagesState = () => {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const map = useMessagesMap();

  return {
    messagesRef,
    map
  };
}
