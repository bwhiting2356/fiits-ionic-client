import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule) },
  { path: 'feedback', loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackPageModule) },
  { path: 'trips', loadChildren: () => import('./trips/trips.module').then(m => m.TripsPageModule) },
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsPageModule), canActivate: [AuthGuard] },
  { path: 'sign-in/:context', loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInPageModule) },
  { path: 'address-input', loadChildren: () => import('./address-input/address-input.module').then(m => m.AddressInputPageModule) },
  { path: 'trip-details', loadChildren: () => import('./trip-details/trip-details.module').then(m => m.TripDetailsPageModule) },
  {
    path: 'confirm-booking',
    loadChildren: () => import('./confirm-booking/confirm-booking.module').then(m => m.ConfirmBookingPageModule),
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
