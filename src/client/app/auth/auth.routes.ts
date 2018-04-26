import {Routes} from '@angular/router';

import {SignupComponent} from './signup/signup.component';
import {SigninComponent} from './signin/signin.component';
import {AuthenticationComponent} from './authentication.component';

// import {LockComponent} from './lock/lock.component';

export const AUTH_ROUTES: Routes = [
    { path: '', component: AuthenticationComponent, children: [
        { path: '', redirectTo: 'signup', pathMatch: 'full'},
        { path: 'signup', component: SignupComponent},
        { path: 'signin', component: SigninComponent}
      ] }
  // { path: 'lock', component: LockComponent}
];
