export type Message = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  senderId: string;
  chatId: string;
};

export type MessageBody = Pick<Message, "chatId" | "text">;

export type FrontendMessageProperties = {
  pending: boolean;
  failed: boolean;
};

export type FrontendMessage = Message & FrontendMessageProperties;
export type MaybeFrontendMessage = Message | FrontendMessage;
export type MaybeFrontendMessagePartial = Message & Partial<FrontendMessage>;

export type MessagesMap = Map<string, MaybeFrontendMessage>;
export type ChatMessages = Map<string, MessagesMap>;
