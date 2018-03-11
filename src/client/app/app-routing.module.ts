import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full'},
  { path: 'homepage', component: HomepageComponent },
  // { path: 'app', component: WebappComponent,
  //   children: WEBAPP_ROUTES,
  //   canActivate: [AuthGuard],
  //   canActivateChild: [AppGuard]
  // },
  // { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES},
  // { path: '**', redirectTo: '/404', pathMatch: 'full'},
  // { path: '404', component: NotFoundRedirectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
