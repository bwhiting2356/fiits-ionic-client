import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AddressTypeValidGuard } from './guards/address-type-valid.guard';
import { TripValidGuard } from './guards/trip-valid.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'trips',
    loadChildren: () => import('./pages/trips/trips.module').then(m => m.TripsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in/:context',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'address-input',
    loadChildren: () => import('./pages/address-input/address-input.module').then(m => m.AddressInputPageModule),
    canActivate: [AddressTypeValidGuard]
  },
  {
    path: 'trip-details',
    loadChildren: () => import('./pages/trip-details/trip-details.module').then(m => m.TripDetailsPageModule),
    canActivate: [TripValidGuard]
  },
  {
    path: 'confirm-booking',
    loadChildren: () => import('./pages/confirm-booking/confirm-booking.module').then(m => m.ConfirmBookingPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
