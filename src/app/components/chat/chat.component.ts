import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
    CommonModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnChanges {
  @Input()
  emptyStateText: string = 'No messages found!';

  @Input()
  chatroomId?: string;

  @Input()
  privateMessage: boolean = false;

  @Input()
  chatroom: Chatroom | null = null;

  inputText: string = '';

  private subscriptions: Subscription[] = [];

  private oldMessagesSubscription: Subscription | null = null;
  private messageSubscription: Subscription | null = null;

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.chatroom = {
      chatroomId: this.chatroomId!,
      messages: [],
    };
    if (this.chatroomId) {
      if(!this.privateMessage) this.socketService.joinPublicRoom(this.chatroom._id!);
      this.privateMessage
        ? this.retrieveOldPrivateMessages()
        : this.retrieveOldComments();
      this.listenForMessages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatroom']) {
      if (this.chatroom) {
        this.chatroomId = this.chatroom.chatroomId;
        this.privateMessage
          ? this.retrieveOldPrivateMessages()
          : this.retrieveOldComments();
        this.listenForMessages();
      }
    }
  }

  private sendPublicMessage() {
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
      this.inputText = '';
    }
  }

  private setPrivateMessage() {
    if (!this.inputText || this.inputText.length === 0) {
      return;
    } else {
      const user = this.authService.getUserInfo();
      const message: MessageDTO = {
        content: this.inputText,
        userId: user?._id!,
      };
      this.socketService.sendPrivateMessage(this.chatroomId!, message);
      this.inputText = '';
    }
  }

  public sendMessage() {
    this.privateMessage ? this.setPrivateMessage() : this.sendPublicMessage();
  }

  public retrieveOldComments() {
    if (!this.chatroomId) return;
    if (this.oldMessagesSubscription)
      this.oldMessagesSubscription.unsubscribe();

    this.oldMessagesSubscription = this.socketService
      .getPublicRoomMessages(this.chatroomId!)
      .subscribe((messages: MessageDTO[] | null) => {
        if (messages) {
          this.chatroom!.messages = messages;
        }
      });
  }

  public retrieveOldPrivateMessages() {
    if (!this.chatroomId) return;
    if (this.oldMessagesSubscription)
      this.oldMessagesSubscription.unsubscribe();

    this.oldMessagesSubscription = this.socketService
      .getPrivateRoomMessages(this.chatroomId)
      .subscribe((messages: MessageDTO[] | null) => {
        if (messages) {
          this.chatroom?.messages == messages;
        }
      });
  }

  public listenForMessages() {
    if (!this.chatroomId) return;
    if (this.messageSubscription) this.messageSubscription.unsubscribe();

    this.messageSubscription = this.socketService
      .getRoomMessageObservable(this.chatroomId!)
      .subscribe((message: MessageDTO | null) => {
        if (message) {
          this.chatroom?.messages.push(message);
        }
      });
  }

  public isUserPost(userId: string) {
    return this.authService.getUserInfo()?._id === userId;
  }

  public unpackName(message: MessageDTO) {
    if (this.isUserPost(message.userId)) {
      return 'You';
    } else if (this.privateMessage) {
      return '';
    } else return message.userName;
  }

  public unpackLastname(message: MessageDTO) {
    if (this.isUserPost(message.userId)) {
      return '';
    } else if (this.privateMessage) {
      return '';
    } else return message.userLastname;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if(this.messageSubscription){
      this.messageSubscription.unsubscribe();
    }
    if(this.oldMessagesSubscription){
      this.oldMessagesSubscription.unsubscribe();
    }
  }
}
