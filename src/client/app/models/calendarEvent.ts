import {colors} from '../utils/utils';
import { CalendarEvent } from 'angular-calendar';

export class MyCalendarEvent implements CalendarEvent {
  constructor(public start: Date = new Date(),
              public end: Date = null,
              public title: string = 'default',
              public color: any = colors.red,
              public actions: any[] = [],
              public meta: any = {type: 'danger'},
              public draggable: boolean = true,
              public _id?: string) {}
}

export enum EventActionType { create, edit, delete }
