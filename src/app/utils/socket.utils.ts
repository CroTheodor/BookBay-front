export enum SocketEmitEvents {
  RETRIEVE_PUBLIC_MESSAGES = 'retrieve public messages',
  RETRIEVE_PRIVATE_MESSAGES = 'retrieve private messages',
  RETRIVE_USER_CHATROOMS = 'retrieve chatrooms',
  SEND_PUBLIC_MESSAGE = 'send public message',
  JOIN_ROOM = "join room"
}

export enum SocketListenEvents {
  OLD_PUBLIC_MESSAGES = 'old public messages',
  USER_CHATROOMS = 'user chatrooms',
  PRIVATE_MESSAGE = "private message",
  PUBLIC_MESSAGE = "public message",
}
