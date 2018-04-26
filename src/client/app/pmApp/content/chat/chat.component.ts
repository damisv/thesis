import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {ChatService, ChatThread} from '../../../services/chat.service';
import {Message} from '../../../models/message';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user';
import {MatSidenavContent} from '@angular/material';

@Component({
  selector: 'app-pmapp-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnDestroy {

  // dev
  array = [
    {id: 'first', sender: 'sender', message: 'message'},
    {id: 'first', sender: 'senadgadfgader', message: 'message'},
    {id: 'first', sender: 'sendadfgadfger', message: 'message'},
    {id: 'first', sender: 'sender', message: 'message'},
    {id: 'first', sender: 'sendadfgadfgader', message: 'message'},
    {id: 'first', sender: 'sender', message: 'message'},
    {id: 'first', sender: 'adgadfg', message: 'message'},
    {id: 'first', sender: 'sendaer', message: 'message'},
    {id: 'first', sender: 'adgfadfg', message: 'message'},
    {id: 'first', sender: 'sender', message: 'message'},
    {id: 'first', sender: 'sender', message: 'message'},
    {id: 'first', sender: 'aadgadfg', message: 'message'},
    {id: 'first', sender: 'sender', message: 'message'},
  ];

  threadsSubscription: Subscription = this.chatService.threads$
    .map( threads => Array.from(threads.values()))
    .subscribe( threadsMapped => this.threads = threadsMapped);
  threads: ChatThread[] = [];

  currentThread$ = new Subject<ChatThread>();
  private currentThreadID;
  sorted = false;

  // Message Sending Properties
  messageInput;
  user: User;
  constructor(public chatService: ChatService,
              private userService: UserService) {
   this.currentThread$.subscribe( thread => this.currentThreadID = thread.id);
   userService.user$.subscribe( user => this.user = user);
  }

  // Public methods
  sendMessage() {
    if (this.messageInput || this.currentThreadID === undefined ) { return; }
    const messageTemp = new Message('', this.user.email, this.currentThreadID, this.messageInput, new Date());
    this.chatService.send(messageTemp)
      .subscribe(
        res => { this.messageInput = null; },
        error => { }
      );
  }

  ngOnDestroy() { if (this.threadsSubscription !== undefined) { this.threadsSubscription.unsubscribe(); } }
}
