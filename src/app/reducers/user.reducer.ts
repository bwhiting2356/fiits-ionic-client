import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import { State } from '.';
import { TripDetails } from '../shared/trip-details.model';

export interface UserState {
    uid: string;
    displayName: string;
    authFetching: boolean;
    tripsFetching: boolean;
    trips: TripDetails[];
    error?: any;
}

export const initialUserState: UserState = {
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

export const selectTrips = createSelector(
    selectUser,
    state => state.trips);

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
        default:
            return state;
    }
}
