import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessageDTO } from '../interfaces/chat.interface';
import { SocketEmitEvents, SocketListenEvents } from '../utils/socket.utils';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private messageSignalList: Map<string, BehaviorSubject<MessageDTO | null>> = new Map<string, BehaviorSubject<MessageDTO | null>>();

  constructor(private authService: AuthService) {
    this.socket = io('localhost:3500', {
      query: {
        userId: this.authService.getUserInfo()?._id,
      },
    });
    this.socket.on(SocketListenEvents.PRIVATE_MESSAGE, (message: MessageDTO, roomId: string)=>{
      const roomSubject = this.messageSignalList.get(roomId);
      if(!roomSubject){
        console.log("Room id not fond");
        return;
      }
      roomSubject.next(message);
    })
    this.socket.on(SocketListenEvents.PUBLIC_MESSAGE, (message: MessageDTO, roomId: string)=>{
      const roomSubject = this.messageSignalList.get(roomId);
      if(!roomSubject){
        console.log("Room id not fond");
        return;
      }
      roomSubject.next(message);
    })
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public getRoomMessageObservable(id: string): Observable<MessageDTO | null> {
    let roomSubject = this.messageSignalList.get(id);
    if(!roomSubject){
      roomSubject = new BehaviorSubject<MessageDTO | null>(null);
      this.messageSignalList.set(id, roomSubject);
    }
    console.log(id);
    console.log(roomSubject);
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

  public retrieveChatrooms(): Observable<string[] | null> {
    const chatrooms = new BehaviorSubject<string[] | null>(null);
    this.socket.on(SocketListenEvents.USER_CHATROOMS, (rooms) => {
      console.log(rooms);
      if (rooms) {
        chatrooms.next(rooms);
      }
    });
    const authId = this.authService.getUserInfo()?._id;
    this.socket.emit(SocketEmitEvents.RETRIVE_USER_CHATROOMS, authId);

    return chatrooms.asObservable();
  }

  public sendPublicMessage(roomId: string, message: MessageDTO) {
    this.socket.emit(SocketEmitEvents.SEND_PUBLIC_MESSAGE, roomId, message);
  }

  public joinRoom(roomId: string){
    this.socket.emit(SocketEmitEvents.JOIN_ROOM, roomId);
  }
}
