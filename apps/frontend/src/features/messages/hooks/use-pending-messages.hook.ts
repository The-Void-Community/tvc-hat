import type { MaybeFrontendMessage } from '@/types';
import { useTimeoutPending } from '@/features/use-pending.hook';

export type UsePendingMessagesProps = {
  onTimeout: (message: MaybeFrontendMessage) => void;
};

export const usePendingMessages = ({ onTimeout }: UsePendingMessagesProps) => {
  const { pendingRef, createPending, clearPending } = useTimeoutPending<[MaybeFrontendMessage]>(
    8000,
    onTimeout
  );

  return {
    pendingRef,
    createPending,
    clearPending,
  };
};