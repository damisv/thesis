import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {ChatService, ChatThread, UserService} from '../../../services';
import {Message, User} from '../../../models';

@Component({
  selector: 'app-pmapp-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnDestroy {
  threadsSubscription: Subscription = this.chatService.threads$
    .subscribe( threads => {
      console.log(threads);
      this.threads = threads;
    });
  threads: Map<string, ChatThread>;

  currentThread$ = new Subject<ChatThread>();
  messages = [];
  private currentThreadID;
  sorted = false;

  // Message Sending Properties
  messageInput;
  user: User;
  constructor(public chatService: ChatService,
              private userService: UserService) {
   this.currentThread$.subscribe( thread => {
     console.log(thread);
     this.currentThreadID = thread.id;
     this.messages = thread.lastMessages;
   });
   userService.user$.subscribe( user => this.user = user);
  }

  // Public methods
  sendMessage() {
    if (!this.messageInput || this.currentThreadID === undefined ) { return; }
    const messageTemp = new Message('', this.user.email, this.currentThreadID, this.messageInput, new Date());
    this.chatService.send(messageTemp)
      .subscribe(
        res => { this.messageInput = null; },
        error => { }
      );
  }

  ngOnDestroy() { if (this.threadsSubscription !== undefined) { this.threadsSubscription.unsubscribe(); } }
}
