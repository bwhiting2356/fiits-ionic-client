import { Action } from '@ngrx/store';
import { TripDetails } from '../shared/trip-details.model';
import { AccountInfo } from '../shared/account-info.model';

export enum UserActionTypes {
    ChangeEmail = '[User] Change Email',
    ChangePassword = '[User] Change Password',
    LogIn = '[User] Log In',
    LogInSuccess = '[User] Log In Success',
    LogInError = '[User] Log In Error',
    SignUp = '[User] Sign Up',
    SignUpSuccess = '[User] Sign Up Success',
    SignUpError = '[User] Sign Up Error',
    LogOut = '[User] Log Out',
    FetchTrips = '[User] Fetch Trips',
    FetchTripsSuccess = '[User] Fetch Trips Success',
    FetchTripsError = '[User] Fetch Trips Error',
    FetchAccountInfo = '[User] Fetch Account Info',
    FetchAccountInfoSuccess = '[User] Fetch Account Info Success',
    FetchAccountInfoError = '[User] Fetch Account Info Error'
}

export class ChangeEmail implements Action {
    readonly type = UserActionTypes.ChangeEmail;
    constructor(public newValue: string) {}
}

export class ChangePassword implements Action {
    readonly type = UserActionTypes.ChangePassword;
    constructor(public newValue: string) {}
}

export class LogIn implements Action {
    readonly type = UserActionTypes.LogIn;
}

export class SignUp implements Action {
    readonly type = UserActionTypes.SignUp;
}

export class LogInSuccess implements Action {
    readonly type = UserActionTypes.LogInSuccess;
    constructor(public uid: string) {}
}

export class SignUpSuccess implements Action {
    readonly type = UserActionTypes.SignUpSuccess;
    constructor(public uid: string) {}
}

export class SignUpError implements Action {
    readonly type = UserActionTypes.SignUpError;
    constructor(public error: any) {}
}

export class LogInError implements Action {
    readonly type = UserActionTypes.LogInError;
    constructor(public error: any) {}
}

export class LogOut implements Action {
    readonly type = UserActionTypes.LogOut;
}

export class FetchTrips implements Action {
    readonly type  = UserActionTypes.FetchTrips;
}

export class FetchTripsSuccess implements Action {
    readonly type  = UserActionTypes.FetchTripsSuccess;
    constructor(public trips: TripDetails[]) {}
}

export class FetchTripsError implements Action {
    readonly type = UserActionTypes.FetchTripsError;
    constructor(public error: any) {}
}

export class FetchAccountInfo implements Action {
    readonly type  = UserActionTypes.FetchAccountInfo;
}

export class FetchAccountInfoSuccess implements Action {
    readonly type = UserActionTypes.FetchAccountInfoSuccess;
    constructor(public accountInfo: AccountInfo) {}
}

export class FetchAccountInfoError implements Action {
    readonly type = UserActionTypes.FetchAccountInfoError;
    constructor(public error: any) {}
}

export type UserActions = ChangeEmail
                        | ChangePassword
                        | LogIn
                        | LogInSuccess
                        | LogInError
                        | LogOut
                        | SignUp
                        | SignUpSuccess
                        | SignUpError
                        | LogOut
                        | FetchTrips
                        | FetchTripsSuccess
                        | FetchTripsError
                        | FetchAccountInfo
                        | FetchAccountInfoSuccess
                        | FetchAccountInfoError;

