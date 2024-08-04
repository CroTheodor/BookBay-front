export enum SocketEmitEvents {
  RETRIEVE_PUBLIC_MESSAGES = 'retrieve public messages',
  RETRIEVE_PRIVATE_MESSAGES = 'retrieve private messages',
  RETRIVE_USER_CHATROOMS = 'retrieve chatrooms',
  SEND_PUBLIC_MESSAGE = 'send public message',
  SEND_PRIVATE_MESSAGE = 'send private message',
  JOIN_ROOM = 'join room',
  MESSAGE_VIEWED = 'messages viewed',
}

export enum SocketListenEvents {
  OLD_PUBLIC_MESSAGES = 'old public messages',
  OLD_PRIVATE_MESSAGES = 'old private messages',
  USER_CHATROOMS = 'user chatrooms',
  PRIVATE_MESSAGE = 'private message',
  PUBLIC_MESSAGE = 'public message',
  NEW_ROOM = 'new private room',
}
