import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import { State } from '.';

export interface UserState {
    uid: string;
    displayName: string;
    authFetching: boolean;
    error?: any;
}

export const initialUserState: UserState = {
    uid: '',
    displayName: '',
    authFetching: false
};

const selectUser = createFeatureSelector<State, UserState>('user');

export const selectUID = createSelector(
    selectUser,
    state => state.uid);

export function userReducer(state = initialUserState, action: UserActions): UserState {
    switch (action.type) {
        case UserActionTypes.LogInFromSearch:
            return {
                ...state,
                authFetching: true
            };
        case UserActionTypes.LogInSuccessFromSearch:
            return {
                ...state,
                uid: action.uid,
                authFetching: false
            };
        case UserActionTypes.LogInErrorFromSearch:
            return {
                ...state,
                error: action.error,
                authFetching: false
            };
        case UserActionTypes.LogOut:
            return {
                ...initialUserState
            };
        default:
            return state;
    }
}
