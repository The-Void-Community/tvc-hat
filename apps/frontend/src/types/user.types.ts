import type { UserStatus } from "@/enums";

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  chats: string[];
  nickname: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  isProfilePublic: boolean;
  status: UserStatus;
  lastSeenAt: Date | null;
};
