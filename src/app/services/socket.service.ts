import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { AUTH_EVENT, AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subscription, of} from 'rxjs';
import { Chatroom, JoindChatroom, MessageDTO } from '../interfaces/chat.interface';
import { SocketEmitEvents, SocketListenEvents } from '../utils/socket.utils';
import { UserDTO } from '../interfaces/user.model';
import { ListingDTO } from '../interfaces/listing.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private messageSignalList: Map<string, BehaviorSubject<MessageDTO | null>> = new Map<string, BehaviorSubject<MessageDTO | null>>();

  private joinedRoomSubject: BehaviorSubject<JoindChatroom | null> = new BehaviorSubject<JoindChatroom | null>(null);
  private tempChatroom: Chatroom | null = null;

  public joinedRooms: JoindChatroom[] = [];
  public redirectChatroomId: string | null = null;

  private roomSubscription: Subscription | null = null;

  constructor(private authService: AuthService) {
    this.socket = io('localhost:3500', {
      query: {
        auth: this.authService.getAuthToken(),
      },
    });

    this.authService.authEvents.subscribe((event: AUTH_EVENT)=>{
      this.refreshSocket();
      if(event === AUTH_EVENT.login){
        this.socket.auth = {token: this.authService.getAuthToken()!};
        this.roomSubscription = this.retrieveChatrooms().subscribe(
          (rooms: Chatroom[] | null)=>{
            if(rooms){
              rooms.forEach(room=>this.joinPrivateRoom(room));
            }
          }
        )
      } else {
        this.socket.auth = {}
        if(this.roomSubscription){
          this.roomSubscription.unsubscribe();
        }
        this.joinedRooms = [];
        this.joinedRoomSubject.next(null);
        this.tempChatroom = null;
        this.redirectChatroomId = null;
      }
    })

    this.socket.on(SocketListenEvents.PRIVATE_MESSAGE, (message: MessageDTO, roomId: string)=>{
      const roomSubject = this.messageSignalList.get(roomId);
      if(!roomSubject){
        return;
      }
      roomSubject.next(message);
    })

    this.socket.on(SocketListenEvents.PUBLIC_MESSAGE, (message: MessageDTO, roomId: string)=>{
      const roomSubject = this.messageSignalList.get(roomId);
      if(!roomSubject){
        return;
      }
      roomSubject.next(message);
    })

    this.socket.on(SocketListenEvents.NEW_ROOM, (chatroom: Chatroom)=>{
      this.joinPrivateRoom(chatroom);
    })
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public refreshSocket() {
    this.socket.disconnect().connect();
  }

  public getRoomMessageObservable(id: string): Observable<MessageDTO | null> {
    let roomSubject = this.messageSignalList.get(id);
    if(!roomSubject){
      roomSubject = new BehaviorSubject<MessageDTO | null>(null);
      this.messageSignalList.set(id, roomSubject);
    }
    return roomSubject.asObservable();
  }

  public getPublicRoomMessages(
    roomId: string,
  ): Observable<MessageDTO[] | null> {
    const msgSubject = new BehaviorSubject<MessageDTO[] | null>(null);
    this.socket.on(SocketListenEvents.OLD_PUBLIC_MESSAGES, (messages) => {
      msgSubject.next(messages);
    });

    this.socket.emit(SocketEmitEvents.RETRIEVE_PUBLIC_MESSAGES, roomId);
    return msgSubject.asObservable();
  }

  public getPrivateRoomMessages(roomId: string){
    const msgSubject = new BehaviorSubject<MessageDTO[] | null>(null);
    this.socket.on(SocketListenEvents.OLD_PRIVATE_MESSAGES, (messages)=>{
      msgSubject.next(messages);
    })
    this.socket.emit(SocketEmitEvents.RETRIEVE_PRIVATE_MESSAGES,roomId);
    return msgSubject.asObservable();
  }

  public retrieveChatrooms(): Observable<Chatroom[] | null> {
    const chatrooms = new BehaviorSubject<Chatroom[] | null>(null);
    this.socket.on(SocketListenEvents.USER_CHATROOMS, (rooms) => {
      if (rooms) {
        chatrooms.next(rooms);
      }
    });
    const authId = this.authService.getUserInfo()?._id;
    this.socket.emit(SocketEmitEvents.RETRIVE_USER_CHATROOMS, authId);

    return chatrooms.asObservable();
  }

  public newRoomsObservable(){
    return this.joinedRoomSubject.asObservable();
  }

  public sendPublicMessage(roomId: string, message: MessageDTO) {
    this.socket.emit(SocketEmitEvents.SEND_PUBLIC_MESSAGE, roomId, message);
  }

  public sendPrivateMessage(roomId: string, message: MessageDTO){
    this.socket.emit(SocketEmitEvents.SEND_PRIVATE_MESSAGE, roomId, message)
  }

  public joinPrivateRoom(room: Chatroom){
    if(this.joinedRooms.find(el=>el.chatroom.chatroomId === room.chatroomId))
      return;

    let hasNewMessages = false;
    if(room.user1?._id === this.authService.getUserInfo()?._id){
      hasNewMessages = !(room.user1read!);
    } else {
      hasNewMessages = !room.user2read!;
    }
    this.joinedRooms.push({chatroom: room, newMessages: hasNewMessages})
    this.joinedRoomSubject.next({chatroom: room, newMessages: hasNewMessages});
    this.socket.emit(SocketEmitEvents.JOIN_ROOM, room.chatroomId);
  }

  public joinPublicRoom(roomId: string){
    this.socket.emit(SocketEmitEvents.JOIN_ROOM, roomId);
  }

  public createTempChatroom(user: UserDTO, listing: ListingDTO, owner: UserDTO){
    const listingId = listing._id;
    const ownerId = owner._id;
    const userId: string = user._id;
    const tempRoomId = `${userId}-${listingId}-${ownerId}`;
    this.redirectChatroomId = tempRoomId;
    const chatroomAlreadyExists = this.joinedRooms.find(room=>room.chatroom.chatroomId === tempRoomId);
    if(chatroomAlreadyExists){
      return;
    }
    this.tempChatroom = {
      chatroomId: tempRoomId,
      messages: [],
      user1: user,
      user2: owner,
      listingId: listing
    }
  }

  public clearTempChatroom(){
    this.tempChatroom = null;
  }

  public getTempChatroom(){
    return this.tempChatroom;
  }
}
