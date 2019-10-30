import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from './trip-card/trip-card.component';
import { IonicModule } from '@ionic/angular';
import { GoogleMapComponent } from './google-map/google-map.component';
import { PipesModule } from '../pipes/pipes.module';
import { TripInfoComponent } from './trip-info/trip-info.component';

@NgModule({
  declarations: [
    TripCardComponent,
    TripInfoComponent,
    GoogleMapComponent],
  imports: [
    CommonModule,
    PipesModule,
    IonicModule,
  ],
  exports: [
    TripCardComponent,
    TripInfoComponent,
    GoogleMapComponent
  ]
})
export class ComponentsModule { }
