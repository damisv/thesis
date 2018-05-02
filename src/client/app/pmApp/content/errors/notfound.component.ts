import {Component, OnDestroy} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-404-error',
    template: `
        <div    fxLayout
                fxLayout.xs="column"
                fxLayoutAlign="center"
                fxLayoutGap="10px"
                fxLayoutGap.xs="0">
            <div fxFlex="auto">
                <mat-card class="card" >
                    <mat-card-header>
                        <mat-card-title>
                            404
                        </mat-card-title>
                        <mat-card-subtitle>
                            Oops ! It seems you're lost
                        </mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                        The page you are looking for, doesn't exist ... Yet !
                        <br>
                        <br>
                      <mat-form-field>
                        <mat-icon matPrefix>search</mat-icon>
                        <input matInput placeholder="Search for something">
                      </mat-form-field>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styles: [`
      .card {
            text-align: center!important;
            border-radius: 6px!important;
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
            0 6px 30px 5px rgba(0, 0, 0, 0.12),
            0 8px 10px -5px rgba(0, 0, 0, 0.2) !important;
      }
        .card:hover { 
          box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.34),
          0 6px 30px 5px rgba(0, 0, 0, 0.32),
          0 8px 10px -5px rgba(0, 0, 0, 0.6) !important;
            transition: all 0.3s cubic-bezier(.25,.8,.25,1) !important; }`]
})
export class NotFoundErrorComponent implements OnDestroy {
    constructor(private titleService: Title) {
        this.titleService.setTitle('404 Error');
    }
    ngOnDestroy() {
        this.titleService.setTitle('Project Management');
    }
}
