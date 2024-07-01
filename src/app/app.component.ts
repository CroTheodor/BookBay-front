import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Socket, io } from "socket.io-client";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bayb';
  socket: Socket = io("http://localhost:3500");
  // socket = io('http://localhost:3500', {
  //   reconnectionDelay: 1000,
  //   reconnection: true,
  //   transports: ['websocket'],
  //   agent: false,
  //   upgrade: false,
  //   rejectUnauthorized: false
  // });

  constructor() {
    this.socket.on("message", (bid) => {
      console.log(bid);

    })
    this.socket.on("bid", (bid)=>{
      console.log(bid);
    })
    this.socket.on("connect_error", (err:any) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });
  }
}
