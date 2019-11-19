import { Action } from '@ngrx/store';

export enum AuthActionTypes {
    LogInFromMenu = '[Auth] Log In From Menu',
    LogInFromSearch = '[Auth] Log In From Search',
    LogInSuccessFromMenu = '[Auth] Log In Success From Menu',
    LogInSuccessFromSearch = '[Auth] Log In Success From Search',
    LogInErrorFromMenu = '[Auth] Log In Error From Menu',
    LogInErrorFromSearch = '[Auth] Log In Error From Search',
    LogOut = '[Auth] Log Out',
}

export class LogInFromMenu implements Action {
    readonly type = AuthActionTypes.LogInFromMenu;
}

export class LogInFromSearch implements Action {
    readonly type = AuthActionTypes.LogInFromSearch;
}

export class LogInSuccessFromMenu implements Action {
    readonly type = AuthActionTypes.LogInSuccessFromMenu;
    constructor(public uid: string) {}
}

export class LogInSuccessFromSearch implements Action {
    readonly type = AuthActionTypes.LogInSuccessFromSearch;
    constructor(public uid: string) {}
}

export class LogInErrorFromMenu implements Action {
    readonly type = AuthActionTypes.LogInErrorFromMenu;
    constructor(public error: any) {}
}

export class LogInErrorFromSearch implements Action {
    readonly type = AuthActionTypes.LogInErrorFromSearch;
    constructor(public error: any) {}
}

export class LogOut implements Action {
    readonly type = AuthActionTypes.LogOut;
}

export type AuthActions = LogInFromMenu
                        | LogInFromSearch
                        | LogInSuccessFromMenu
                        | LogInSuccessFromSearch
                        | LogInErrorFromMenu
                        | LogInErrorFromSearch
                        | LogOut ;

