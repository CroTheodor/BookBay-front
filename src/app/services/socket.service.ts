import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { AuthService } from './auth.service';

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
}
