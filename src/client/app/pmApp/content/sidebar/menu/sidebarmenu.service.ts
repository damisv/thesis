import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';

export class Option {
  path: string;
  icon: string;
  name: string;
  description: string;
  constructor(path: string, icon: string, name: string, description: string) {
    this.path = path;
    this.icon = icon;
    this.name = name;
    this.description = description;
  }
}

// Side Navigators in app
export const userSideNav = [
  new Option('dashboard', 'dashboard', 'Dashboard', 'Live stats'),
  new Option('myprojects', 'business_center', 'My Projects', 'All projects you\'re part of'),
  new Option('mytasks', 'list', 'My Tasks', 'Upcoming Tasks across all projects'),
  new Option('myissues', 'warning', 'My Issues', 'Upcoming Issues across all projects'),
  new Option('profile', 'account_circle', 'My Profile', ''),
  new Option('calendar', 'schedule', 'Calendar', 'Schedule personal, team or projects events'),
  new Option('chat', 'chat', 'Chat', 'Project Threads to chat'),
  new Option('invites', 'group_add', 'Invites', 'Latest invites to projects')
];
export const projectSideNav = [
  new Option('dashboard', 'dashboard', 'Dashboard', 'Project Live Stats'),
  new Option('tasks', 'format_list_bulleted', 'Tasks', 'All tasks which belong to this project'),
  new Option('gantt', 'show_chart', 'Gantt', 'Gantt chart view for project tasks'),
  new Option('issues', 'warning', 'Issues', 'All issues which belong to this project'),
  new Option('team', 'group', 'Team', 'Members who contribute'),
  new Option('timeline', 'timeline', 'Action Log', 'Timeline feed'),
  new Option('chat', 'chat', 'Chat', 'Project Threads'),
  new Option('settings', 'settings', 'Settings', 'Basic and advanced settings')
];

@Injectable()
export class SidebarMenuService {
  private status = new BehaviorSubject<boolean>(true);
  status$ = this.status.asObservable();

  changeStatus() { this.status.next(!this.status.value); }
}
