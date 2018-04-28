import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import {HomepageComponent} from './homepage/homepage.component';

import {ThemeService} from './services/theme.service';
import {ScrollService} from './services/scroll.service';

import {ErrorDialogComponent} from './errors/errordialog.component';
import {AuthService} from './services/auth.service';
import {ProgressBarService} from './services/progressbar.service';
import {MyParticlesModule} from './particles/myparticles.module';
import {RequestInterceptor} from './services/request.interceptor';
import {AuthGuard} from './pmApp/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'angular-universal-seed'}),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ScrollToModule.forRoot(),
    MyParticlesModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
  }, ThemeService, ScrollService, ProgressBarService, AuthService, AuthGuard],
  entryComponents: [ErrorDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
