import {Routes} from '@angular/router';

import {HomepageComponent} from './homepage/homepage.component';
import {AuthGuard} from './pmApp/guards/auth.guard';

 export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full'},
  { path: 'homepage', component: HomepageComponent },
  { path: 'app', loadChildren: './pmApp/pmapp.module#PMAppModule', canLoad: [AuthGuard]},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  { path: '**', redirectTo: 'homepage', pathMatch: 'full'},
  // { path: '404', component: NotFoundRedirectComponent}
];

