import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trips',
    pathMatch: 'full'
  },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  { path: 'trips', loadChildren: './trips/trips.module#TripsPageModule', canActivate: [AuthGuard] },
  { path: 'payments', loadChildren: './payments/payments.module#PaymentsPageModule', canActivate: [AuthGuard] },
  { path: 'sign-in', loadChildren: './sign-in/sign-in.module#SignInPageModule' },
  { path: 'address-input', loadChildren: './address-input/address-input.module#AddressInputPageModule' },
  { path: 'trip-details', loadChildren: './trip-details/trip-details.module#TripDetailsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
