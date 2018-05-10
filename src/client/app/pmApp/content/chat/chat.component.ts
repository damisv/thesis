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
      this.threads = threads;
      if (this.currentThread) {
        this.currentThread$.next(this.threads.get(this.currentThread.id));
      }
    });
  threads: Map<string, ChatThread>;

  currentThread$ = new Subject<ChatThread>();
  currentThread: ChatThread;
  threadSelected = false;
  sorted = false;

  // Message Sending Properties
  messageInput;
  user: User;
  constructor(public chatService: ChatService,
              private userService: UserService) {
   this.currentThread$.subscribe( thread => {
     this.currentThread = thread;
     this.threadSelected = true;
   });
   userService.user$.subscribe( user => this.user = user);
  }

  // Public methods
  sayHi() {
    const messageTemp = new Message(this.user.email, this.currentThread.id, `Hi #${this.currentThread.name}`, new Date());
    this.send(messageTemp);
  }

  sendMessage() {
    if (!this.messageInput || this.currentThread === undefined ) { return; }
    const messageTemp = new Message(this.user.email, this.currentThread.id, this.messageInput, new Date());
    this.send(messageTemp);
  }

  private send(message: Message) {
    this.chatService.send(message)
      .subscribe(
        res => { this.messageInput = null; },
        error => { }
      );
  }

  ngOnDestroy() { if (this.threadsSubscription !== undefined) { this.threadsSubscription.unsubscribe(); } }
}
