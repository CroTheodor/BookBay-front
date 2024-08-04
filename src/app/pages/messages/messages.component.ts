import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chatroom, JoindChatroom } from '../../interfaces/chat.interface';
import { SocketService } from '../../services/socket.service';
import { AUTH_EVENT, AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ChatComponent } from '../../components/chat/chat.component';
import { CommonModule } from '@angular/common';

type UserChatroom = {
  chatroom: Chatroom;
  selected: boolean;
  newMessage: boolean;
};

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ChatComponent, CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit, OnDestroy {
  public userChatrooms: UserChatroom[] = [];

  public subscriptions: Subscription[] = [];

  public selectedChatroom: Chatroom | null = null;

  private tempChatroom: Chatroom | null = null;

  public tempChatroomId: string | null = null;

  constructor(
    private socket: SocketService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.tempChatroom = this.socket.getTempChatroom();
    this.tempChatroomId = this.socket.redirectChatroomId;
    this.retrieveChatrooms();
    this.listenForNewRooms();
    this.listenForNewNotifications();
  }

  public retrieveChatrooms() {
    this.userChatrooms = [];
    this.userChatrooms.push(
      ...this.socket.joinedRooms.map((room) => {
        return {
          chatroom: room.chatroom,
          selected: false,
          newMessage: room.newMessages,
        };
      }),
    );
    if (this.tempChatroom) {
      this.userChatrooms.push({
        chatroom: this.tempChatroom,
        selected: true,
        newMessage: false,
      });
    }
    if (this.tempChatroomId) {
      const index = this.userChatrooms.findIndex((el: UserChatroom) => {
        return el.chatroom.chatroomId === this.tempChatroomId;
      });
      this.selectTab(index);
    }
  }

  public listenForNewRooms() {
    this.subscriptions.push(
      this.socket
        .newRoomsObservable()
        .subscribe((chatroom: JoindChatroom | null) => {
          if (chatroom) {
            let foundIndex = this.userChatrooms.findIndex(
              (el) => el.chatroom.chatroomId === chatroom.chatroom.chatroomId,
            );
            if (foundIndex < 0) {
              this.userChatrooms.push({
                chatroom: chatroom.chatroom,
                selected: false,
                newMessage: chatroom.newMessages,
              });
            } else if (chatroom.chatroom.chatroomId === this.tempChatroomId) {
              this.tempChatroomId = null;
              this.tempChatroom = null;
              this.userChatrooms[foundIndex] = {
                chatroom: {
                  ...this.userChatrooms[foundIndex].chatroom,
                  messages: chatroom.chatroom.messages,
                },
                newMessage: false,
                selected: true,
              };
              this.selectedChatroom = this.userChatrooms[foundIndex].chatroom;
            }
            if (chatroom.chatroom.chatroomId === this.tempChatroomId) {
              this.selectTab(this.userChatrooms.length - 1);
            }
          }
        }),
    );
  }

  public getContactName(chatroom: Chatroom) {
    if (chatroom.user1?._id === this.auth.getUserInfo()?._id) {
      return `${chatroom.user2?.lastname} ${chatroom.user2?.name}`;
    } else {
      return `${chatroom.user1?.lastname} ${chatroom.user1?.name}`;
    }
  }

  public selectTab(index: number) {
    this.userChatrooms.forEach((chatroom: UserChatroom) => {
      chatroom.selected = false;
    });
    this.userChatrooms.at(index)!.selected = true;
    this.markChatroomAsRead(this.userChatrooms.at(index)!.chatroom.chatroomId);
    this.selectedChatroom = this.userChatrooms.at(index)!.chatroom;
  }

  private listenForNewNotifications() {
    this.subscriptions.push(
      this.socket.getNotificationObservable().subscribe((id: string | null) => {
        if (id) {
          this.userChatrooms.forEach((userChatroom: UserChatroom) => {
            if (userChatroom.chatroom.chatroomId === id) {
              if(userChatroom.selected){
                this.markChatroomAsRead(id);
              } else {
                userChatroom.newMessage = true;
              }
            }
          });
        }
      }),
    );
  }

  private markChatroomAsRead(id: string) {
    this.userChatrooms.forEach((userChatroom: UserChatroom) => {
      if (userChatroom.chatroom.chatroomId === id) {
        userChatroom.newMessage = false;
      }
    });
    this.socket.removeNotification(id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.socket.clearTempChatroom();
    this.socket.redirectChatroomId = null;
  }
}
