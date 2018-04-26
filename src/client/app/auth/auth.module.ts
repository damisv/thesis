import {NgModule} from '@angular/core';

import {MaterialModule} from '../material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuthenticationComponent} from './authentication.component';
import {SignupComponent} from './signup/signup.component';
import {SigninComponent} from './signin/signin.component';
import {AuthRoutingModule} from './auth-routing.module';
import {AuthService} from '../services/auth.service';

@NgModule({
  declarations: [
    AuthenticationComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    AuthRoutingModule
  ],
  providers: [],
  entryComponents: []
})

export class AuthModule {}
