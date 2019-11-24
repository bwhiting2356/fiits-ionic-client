import { AuthActions, AuthActionTypes } from '../actions/auth.actions';

export interface AuthState {
    uid: string;
    displayName: string;
    authFetching: boolean;
    error?: any;
}

export const initialAuthState: AuthState = {
    uid: '',
    displayName: '',
    authFetching: false
};

export const authKey = 'auth';
export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.LogInFromSearch:
            return {
                ...state,
                authFetching: true
            };
        case AuthActionTypes.LogInSuccessFromSearch:
            return {
                ...state,
                uid: action.uid,
                authFetching: false
            };
        case AuthActionTypes.LogInErrorFromSearch:
            return {
                ...state,
                error: action.error,
                authFetching: false
            };
        case AuthActionTypes.LogOut:
            return {
                ...initialAuthState
            };
        default:
            return state;
    }
}
