import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import { State } from '.';
import { TripDetails } from '../shared/trip-details.model';

export interface UserState {
    email: string;
    password: string;
    uid: string;
    displayName: string;
    authFetching: boolean;
    tripsFetching: boolean;
    trips: TripDetails[];
    error?: any;
}

export const initialUserState: UserState = {
    email: '',
    password: '',
    uid: '',
    displayName: '',
    authFetching: false,
    tripsFetching: false,
    trips: []
};

const selectUser = createFeatureSelector<State, UserState>('user');

export const selectUID = createSelector(
    selectUser,
    state => state.uid);

export const selectLoggedIn = createSelector(
    selectUID,
    uid => uid !== '');

export const selectTrips = createSelector(
    selectUser,
    state => state.trips);

export const selectTripsFetching = createSelector(
    selectUser,
    state => state.tripsFetching);

export const selectShowNoTrips = createSelector(
    selectTrips,
    selectTripsFetching,
    (trips, fetching) => trips.length === 0 && !fetching);

export const selectEmail = createSelector(
    selectUser,
    state => state.email);

export const selectPassword = createSelector(
    selectUser,
    state => state.password);

export const selectAuthFetching = createSelector(
    selectUser,
    state => state.authFetching);

export function userReducer(state = initialUserState, action: UserActions): UserState {
    switch (action.type) {
        case UserActionTypes.LogIn:
        case UserActionTypes.SignUp:
            return {
                ...state,
                authFetching: true
            };
        case UserActionTypes.SignUpSuccess:
        case UserActionTypes.LogInSuccess:
            return {
                ...state,
                email: '',
                password: '',
                uid: action.uid,
                authFetching: false
            };
        case UserActionTypes.SignUpError:
        case UserActionTypes.LogInError:
            return {
                ...state,
                error: action.error,
                authFetching: false
            };
        case UserActionTypes.LogOut:
            return {
                ...initialUserState
            };

        case UserActionTypes.FetchTrips:
            return {
                ...state,
                tripsFetching: true
            };

        case UserActionTypes.FetchTripsSuccess:
            return {
                ...state,
                tripsFetching: false,
                trips: action.trips
            };

        case UserActionTypes.FetchTripsError:
            return {
                ...state,
                tripsFetching: false,
                error: action.error
            };

        case UserActionTypes.ChangeEmail:
            return {
                ...state,
                email: action.newValue
            };

        case UserActionTypes.ChangePassword:
            return {
                ...state,
                password: action.newValue
            };


        default:
            return state;
    }
}
