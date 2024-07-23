import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bayb';
  socket;

  constructor(
    private socketService: SocketService,
  ) {
    this.socket = this.socketService.getSocket();
  }

  ngAfterViewInit(){
    this.socket.emit("retrieve chatrooms")
    this.socket.on("user chatrooms", (chatrooms)=>{
      console.log(chatrooms);
    })
  }
}
