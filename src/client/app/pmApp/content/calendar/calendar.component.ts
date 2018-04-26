import {Component} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-pmapp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  constructor(private bottomSheet: MatBottomSheet) {}

  selectedDate(event) {
    console.log(event);
    this.bottomSheet.open(ExampleComponent);
  }
}

@Component({
  selector: 'app-bottom-sheet-overview-example-sheet',
  template: `<p>this is a bottom sheet <button (click)="openLink($event)">PRESs</button></p>`,
  styles: [`.mat-bottom-sheet-container { background: #424242 !important; }`]
})
export class ExampleComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<ExampleComponent>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
