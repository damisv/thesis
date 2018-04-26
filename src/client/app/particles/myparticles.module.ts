import {NgModule} from '@angular/core';

import {ParticlesComponent} from './particles.component';

import {ParticlesModule} from 'angular-particle';

@NgModule({
  declarations: [ParticlesComponent],
  imports: [ParticlesModule],
  exports: [ParticlesComponent]
})

export class MyParticlesModule {}
