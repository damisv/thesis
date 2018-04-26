import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PMAPP_ROUTES} from './pmapp.routes';

@NgModule({
  imports: [RouterModule.forChild(PMAPP_ROUTES)],
  exports: [RouterModule]
})
export class PMAppRoutingModule {}
