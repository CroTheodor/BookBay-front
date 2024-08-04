import { ListingDTO } from './listing.model';
import { UserDTO } from './user.model';

export interface Chatroom {
  _id?: string;
  chatroomId: string;
  user1?: UserDTO;
  user2?: UserDTO;
  messages: MessageDTO[];
  user1read?: boolean;
  user2read?: boolean;
  listingId?: ListingDTO;
}

export interface MessageDTO {
  _id?: string;
  userId: string;
  userName?: string;
  userLastname?: string;
  date?: string;
  content: string;
}

export interface JoindChatroom {
  chatroom: Chatroom;
  newMessages: boolean;
}
