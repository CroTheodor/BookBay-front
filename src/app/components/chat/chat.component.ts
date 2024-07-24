import { Component, Input, OnInit } from '@angular/core';
import { Chatroom } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{

  @Input()
  emptyStateText: string = "No messages found!";

  @Input()
  chatroomId?: string;

  chatroom?: Chatroom;

  constructor(){
  }

  ngOnInit(): void {
    this.chatroom = {
      chatroomId: this.chatroomId!,
      messages:[]
    }
  }

}
