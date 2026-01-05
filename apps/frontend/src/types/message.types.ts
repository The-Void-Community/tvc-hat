export type Message = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  senderId: string;
  chatId: string;
  deliveredTo: string[];
  readedBy: string[];
};
