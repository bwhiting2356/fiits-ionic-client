import { createSelector, createFeatureSelector, createReducer, Action, on } from '@ngrx/store';

import { State } from '.';
import { TripDetails } from '../shared/trip-details.model';
import { AccountInfo } from '../shared/account-info.model';
import {
    logIn,
    signUp,
    logInSuccess,
    signUpSuccess,
    logInError,
    signUpError,
    logOut,
    fetchTripsSuccess,
    fetchTrips,
    fetchTripsError,
    changeEmail,
    changePassword,
    fetchAccountInfo,
    fetchAccountInfoSuccess,
    fetchAccountInfoError
} from '../actions/user.actions';
import { bookTripSuccess } from '../actions/search.actions';

export interface UserState {
    email: string;
    password: string;
    uid: string;
    newUser: boolean;
    displayName: string;
    authFetching: boolean;
    tripsFetching: boolean;
    accountInfoFetching: boolean;
    trips: TripDetails[];
    accountInfo: AccountInfo;
    error?: any;
}

export const initialUserState: UserState = {
    email: '',
    password: '',
    uid: '',
    newUser: false,
    displayName: '',
    authFetching: false,
    tripsFetching: false,
    accountInfoFetching: false,
    trips: [],
    accountInfo: undefined
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

export const selectFilteredTrips = createSelector(
    selectTrips,
    (trips, props) => {
        if (props.direction === 'upcoming') {
            return trips.filter(trip => trip.status !== 'Completed');
        } else {
            return trips.filter(trip => trip.status === 'Completed');
        }
    }
);

export const selectTripsFetching = createSelector(
    selectUser,
    state => state.tripsFetching);

export const selectShowNoTrips = createSelector(
    selectTripsFetching,
    selectTrips,
    (fetching, trips, props) => {
        if (fetching) {
            return false;
        }
        let filteredTrips;
        if (props.direction === 'upcoming') {
            filteredTrips = trips.filter(trip => trip.status !== 'Completed');
        } else {
            filteredTrips = trips.filter(trip => trip.status === 'Completed');
        }
        return filteredTrips.length === 0;
    }
);

export const selectEmail = createSelector(
    selectUser,
    state => state.email);

export const selectPassword = createSelector(
    selectUser,
    state => state.password);

export const selectAuthFetching = createSelector(
    selectUser,
    state => state.authFetching);

export const selectAccountInfoFetching = createSelector(
    selectUser,
    state => state.accountInfoFetching);

export const selectAccountInfo = createSelector(
    selectUser,
    state => state.accountInfo);

export const selectNewUser = createSelector(
    selectUser,
    state => state.newUser);

const userReducer = createReducer(
    initialUserState,
    on(bookTripSuccess, state => ({ ...state, newUser: false })),
    on(logIn, signUp, state => ({ ...state, authFetching: true })),
    on(logInSuccess, (state, { uid }) => ({ ...state, uid, authFetching: false, password: '' })),
    on(signUpSuccess, (state, { uid }) => ({ ...state, uid, authFetching: false, password: '', newUser: true })),
    on(logInError, signUpError, (state, { error }) => ({ ...state, error, authFetching: false })),
    on(logOut, () => ({ ...initialUserState })),
    on(fetchTrips, state => ({ ...state, tripsFetching: true })),
    on(fetchTripsSuccess, (state , { trips }) => ({ ...state, trips, tripsFetching: false })),
    on(fetchTripsError, (state, { error }) => ({ ...state, error, tripsFetching: false })),
    on(changeEmail, (state, { email }) => ({ ...state, email })),
    on(changePassword, (state, { password }) => ({ ...state, password })),
    on(fetchAccountInfo, state => ({ ...state, accountInfoFetching: true })),
    on(fetchAccountInfoSuccess, (state, { accountInfo }) => ({ ...state, accountInfo, accountInfoFetching: false })),
    on(fetchAccountInfoError, (state, { error }) => ({ ...state, error, accountInfoFetching: false }) ),
);

export function reducer(state: UserState | undefined, action: Action) {
    return userReducer(state, action);
}
