import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TripsPage } from './trips.page';
import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TripsPage,
    children: [
      { path: '', redirectTo: 'upcoming'},
      { path: 'upcoming', loadChildren: () => import('./trip-list/trip-list.module').then(m => m.TripListPageModule) },
      { path: 'past', loadChildren: () => import('./trip-list/trip-list.module').then(m => m.TripListPageModule) },
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TripsPage]
})
export class TripsPageModule {}
