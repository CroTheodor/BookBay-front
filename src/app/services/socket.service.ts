import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = io("localhost:3500");
  }

  public getSocket(): Socket {
    return this.socket;
  }
}
