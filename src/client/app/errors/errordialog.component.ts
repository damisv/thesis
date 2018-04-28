import {Component, OnInit, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Error } from '../models/error';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-error-dialog',
    template: `
        <h1 mat-dialog-title>{{error?.title}}</h1>
        <div mat-dialog-content>{{error?.message}}</div>
        <div mat-dialog-actions>
            <button mat-button mat-dialog-close>Close</button>
        </div>
    `
})
export class ErrorDialogComponent implements OnInit {
    error: Error;

    constructor(
      public dialogRef: MatDialogRef<ErrorDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ) {}
    ngOnInit() { this.error = this.dialogData; }
}
