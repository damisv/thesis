import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MyCalendarEvent} from '../../../models/calendarEvent';
import {Project} from '../../../models/project';
import {areDatesCorrect, colors} from '../../../utils/utils';
import {SnackbarService} from '../../../services/snackbar.service';


@Component({
  selector: 'app-pmapp-calendardialog',
  templateUrl: './calendareventdialog.component.html',
  styles: [`
    .flex_container {
      display: flex;
      flex-direction: column;
      align-content: center;
      margin: 1em;
    }`]
})
export class CalendarEventDialogComponent {
  event = new MyCalendarEvent();
  projects: Project[] = [];
  createDialog = true; // if this Dialog is for creating or not

  colors = colors;
  panelColor = 'red';
  projectID: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<CalendarEventDialogComponent>,
              private snackBar: SnackbarService) {
    if (data.event) {
      this.event = data.event;
      this.createDialog = !data.event.end;
    }
    this.projects = data.projects;
  }

  addMetaType() {
    this.event.meta = { type: this.event.color === colors.red ? 'danger' : this.event.color === colors.yellow ? 'warning' : 'info' };
  }

  close() {
    console.log(this.event.start + '===' + this.event.end);
    if (!areDatesCorrect(this.event.start, this.event.end)) {
      this.snackBar.show('Check Dates. Start shouldn\'t be bigger than end.');
      return;
    }
    this.dialogRef.close({event: this.event, create: this.createDialog, projectID: this.projectID ? this.projectID : null});
  }
}
