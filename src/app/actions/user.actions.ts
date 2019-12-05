import { Action } from '@ngrx/store';

export enum UserActionTypes {
    LogInFromMenu = '[User] Log In From Menu',
    LogInFromSearch = '[User] Log In From Search',
    LogInSuccessFromMenu = '[User] Log In Success From Menu',
    LogInSuccessFromSearch = '[User] Log In Success From Search',
    LogInErrorFromMenu = '[User] Log In Error From Menu',
    LogInErrorFromSearch = '[User] Log In Error From Search',
    LogOut = '[User] Log Out',
}

export class LogInFromMenu implements Action {
    readonly type = UserActionTypes.LogInFromMenu;
}

export class LogInFromSearch implements Action {
    readonly type = UserActionTypes.LogInFromSearch;
}

export class LogInSuccessFromMenu implements Action {
    readonly type = UserActionTypes.LogInSuccessFromMenu;
    constructor(public uid: string) {}
}

export class LogInSuccessFromSearch implements Action {
    readonly type = UserActionTypes.LogInSuccessFromSearch;
    constructor(public uid: string) {}
}

export class LogInErrorFromMenu implements Action {
    readonly type = UserActionTypes.LogInErrorFromMenu;
    constructor(public error: any) {}
}

export class LogInErrorFromSearch implements Action {
    readonly type = UserActionTypes.LogInErrorFromSearch;
    constructor(public error: any) {}
}

export class LogOut implements Action {
    readonly type = UserActionTypes.LogOut;
}

export type UserActions = LogInFromMenu
                        | LogInFromSearch
                        | LogInSuccessFromMenu
                        | LogInSuccessFromSearch
                        | LogInErrorFromMenu
                        | LogInErrorFromSearch
                        | LogOut ;

