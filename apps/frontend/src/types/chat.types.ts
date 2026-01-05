import { ChatType } from "@/enums";

export type Chat = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  chatname: string | null;
  ownerId: string;
  type: ChatType;
  rights: Record<string, string>;
  members: string[];
  messages: string[];
};