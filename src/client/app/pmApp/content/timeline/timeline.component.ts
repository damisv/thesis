import {Component, OnDestroy} from '@angular/core';
import {TimelineLog, TimelineService} from '../../../services/timeline.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-pmapp-project-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnDestroy {
  timelineLogs: TimelineLog[] = [];
  timelineSubscription: Subscription = this.timelineService.timelineLogs$.subscribe(logs => this.timelineLogs = logs);

  constructor(private timelineService: TimelineService) {}

  ngOnDestroy() { this.timelineSubscription.unsubscribe(); }
}
