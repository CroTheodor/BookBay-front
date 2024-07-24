import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageDTO } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor(
    private authService: AuthService
  ) {
    this.socket = io("localhost:3500", {
      query: {
        userId: this.authService.getUserInfo()?._id
      }
    });
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public getPublicRoomMessages(roomId: string): Observable<MessageDTO[] | null>{
    this.socket.emit("retrieve public messages", roomId);
    const msgSubject = new BehaviorSubject<MessageDTO[] | null>(null);
    this.socket.on("old public messages", (messages)=>{
      msgSubject.next(messages);
    })
    return msgSubject.asObservable();
  }
}
