export interface Chatroom {
  _id?: string;
  chatroomId: string;
  user1?: string;
  user2?: string;
  messages: MessageDTO[];
}

export interface MessageDTO {
  _id?: string;
  userId: string;
  userName?: string;
  userLastname?: string;
  date?: string;
  content: string;
}
