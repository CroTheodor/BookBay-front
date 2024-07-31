import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chatroom, MessageDTO } from '../../interfaces/chat.interface';
import { UserMessageComponent } from '../user-message/user-message.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    UserMessageComponent,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  @Input()
  emptyStateText: string = 'No messages found!';

  @Input()
  chatroomId?: string;

  @Input()
  privateMessage: boolean = false;

  chatroom?: Chatroom;

  inputText: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.chatroom = {
      chatroomId: this.chatroomId!,
      messages: [],
    };
    if(this.chatroomId){
      this.socketService.joinRoom(this.chatroomId);
      this.retrieveOldComments();
      this.listenForMessages();
    }
  }

  public sendMessage() {
    if (!this.inputText || this.inputText.length === 0) {
      return;
    } else {
      const user = this.authService.getUserInfo();
      const message: MessageDTO = {
        content: this.inputText,
        userId: user?._id!,
        userName: user?.name,
        userLastname: user?.lastname,
      };
      this.socketService.sendPublicMessage(this.chatroomId!, message);
      this.inputText = "";
    }
  }

  public retrieveOldComments(){
    this.subscriptions.push(
      this.socketService.getPublicRoomMessages(this.chatroomId!)
        .subscribe(
          (messages: MessageDTO[] | null)=>{
            if(messages){
              this.chatroom!.messages = messages;
            }
          }
        )
    )
  }

  public listenForMessages(){
    this.subscriptions.push(
      this.socketService.getRoomMessageObservable(this.chatroomId!)
        .subscribe(
          (message: MessageDTO | null)=>{
            if(message){
              this.chatroom?.messages.push(message);
            }
          }
        )
    )
  }

  public isUserPost(userId: string){
    return this.authService.getUserInfo()?._id === userId;
  }

  public unpackName(message: MessageDTO){
    if(this.isUserPost(message.userId)){
      return "You";
    }else if(this.privateMessage){
      return ""
    } else return message.userName;
  }

  public unpackLastname(message: MessageDTO){
    if(this.isUserPost(message.userId)){
      return "";
    }else if(this.privateMessage){
      return ""
    }else
    return message.userLastname;
  }

  ngOnDestroy(){
    this.subscriptions.forEach(
      (sub)=>sub.unsubscribe()
    )
  }
}
