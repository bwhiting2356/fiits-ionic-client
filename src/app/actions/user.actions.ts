import { createAction, props } from '@ngrx/store';
import { TripDetails } from '../shared/trip-details.model';
import { AccountInfo } from '../shared/account-info.model';

export const changeEmail = createAction('[User] Change Email', props<{email: string}>());
export const changePassword = createAction('[User] Change Password', props<{password: string}>());
export const logIn = createAction('[User] Log In');
export const signUp = createAction('[User] Sign Up');
export const logInSuccess = createAction('[User] Log In Success', props<{uid: string}>());
export const signUpSuccess = createAction('[User] Sign Up Success', props<{uid: string}>());
export const logInError = createAction('[User] Log In Error', props<{error: any}>());
export const signUpError = createAction('[User] Sign Up Error', props<{error: any}>());
export const logOut = createAction('[User] Log Out');
export const fetchTrips = createAction('[User] Fetch Trips');
export const fetchTripsSuccess = createAction('[User] Fetch Trips Success', props<{trips: TripDetails[]}>());
export const fetchTripsError = createAction('[User] Fetch Trips Error', props<{error: any}>());
export const fetchAccountInfo = createAction('[User] Fetch Account Info');
export const fetchAccountInfoSuccess = createAction('[User] Fetch Account Info Success', props<{accountInfo: AccountInfo}>());
export const fetchAccountInfoError = createAction('[User] Fetch Account Info Error', props<{error: any}>());
