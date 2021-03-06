import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import {HomepageComponent} from './homepage/homepage.component';
import {ThemeService} from './services/themeService';
import {ScrollService} from './services/scrollService';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'angular-universal-seed'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ScrollToModule.forRoot()
  ],
  providers: [ThemeService, ScrollService],
  bootstrap: [AppComponent]
})
export class AppModule {}
