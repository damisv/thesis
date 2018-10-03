import {Component, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth,
  isSameDay, isSameMonth, addHours} from 'date-fns';
import { CalendarEventAction, CalendarEventTimesChangedEvent,  CalendarMonthViewDay} from 'angular-calendar';
import {Subject} from 'rxjs/Subject';
import {colors} from '../../../utils/utils';
import {EventActionType, MyCalendarEvent, Project} from '../../../models';
import {CalendarService, ProjectService} from '../../../services';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {CalendarEventDialogComponent} from './calendareventdialog.component';

@Component({
  selector: 'app-pmapp-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  actionType = EventActionType;
  period = 'month';
  viewDate: Date = new Date();

  activeDayIsOpen = true;

  refresh: Subject<any> = new Subject();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="material-icons">mode_edit</i>',
      onClick: ({ event }: { event: MyCalendarEvent }): void => {
        this.handleEvent(EventActionType.edit, event);
      }
    },
    {
      label: '<i class="material-icons">delete</i>',
      onClick: ({ event }: { event: MyCalendarEvent }): void => {
        this.handleEvent(EventActionType.delete, event);
      }
    }
  ];

  events: MyCalendarEvent[] = [
    new MyCalendarEvent(subDays(startOfDay(new Date()), 1), addDays(new Date(), 1), 'A 3 day event', colors.red, this.actions),
    new MyCalendarEvent(subDays(startOfDay(new Date()), 1), addDays(new Date(), 1), 'A 3 day event', colors.blue, this.actions, {type: 'info'}),
    new MyCalendarEvent(subDays(startOfDay(new Date()), 1), addDays(new Date(), 1), 'A 3 day event', colors.red, this.actions)
  ];

  private projects: Project[] = [];

  constructor(private calendarService: CalendarService,
              private projectService: ProjectService,
              private dialog: MatDialog) {
    projectService.projects$.subscribe(projects => this.projects = projects); // need projects for creating
    Observable.combineLatest(this.calendarService.myEvents$, this.calendarService.projectEvents$,
      (myEvents: MyCalendarEvent[], projectEvents: MyCalendarEvent[]) => ({my: myEvents, project: projectEvents}))
      .subscribe( events => {
        events.my.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        events.project.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        this.events = events.my.concat(events.project);
        this.refresh.next();
      });
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event: MyCalendarEvent) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      cell['eventGroups'] = Object.entries(groups);
    });
  }

  handleEvent(action: EventActionType, event: MyCalendarEvent): void {
    switch (action) {
      case EventActionType.edit:
        this.viewAndEdit(event);
        break;
      case EventActionType.delete:
        this.delete(event);
        break;
    }
  }

  // Clicked a day
  dayClicked({ date, events }: { date: Date; events: MyCalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  // When event dragged changed it's date
  eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.calendarService.edit(event)
      .subscribe(_ => this.refresh.next());
  }

  // Add event
  addEvent(startDate) { this.viewAndEdit(new MyCalendarEvent(startDate)); }

  // Private methods
  private viewAndEdit(event: MyCalendarEvent = null) {
    const viewDialog = this.dialog.open(CalendarEventDialogComponent,
      { data: {event: event, projects: this.projects}});
    viewDialog.afterClosed().subscribe( result => {
      if (result) {
        if (result.create) {
          this.calendarService.create(result.event, result.projectID)
            .subscribe(value => {
              console.log(value);
              const tempEvent = result.event;
              tempEvent._id = value._id;
              this.events.push(tempEvent);
              this.refresh.next();
            });
        } else {
          this.calendarService.edit(result.event)
            .subscribe(_ => {
              const tempIndex = this.events.findIndex(val => val === event);
              this.events[tempIndex] = result.event;
              this.refresh.next();
            });
        }
      }
    });
  }
  private delete(event: MyCalendarEvent) {
    this.calendarService.delete(event)
      .subscribe( _ => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.refresh.next();
      });
  }
}
