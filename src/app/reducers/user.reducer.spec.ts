import { initialUserState, reducer as userReducer } from './user.reducer';
import {
    logIn,
    logInSuccess,
    logInError,
    logOut,
    fetchTrips,
    fetchTripsSuccess,
    fetchTripsError,
    changeEmail,
    changePassword,
    signUpSuccess,
    signUp,
    fetchAccountInfo,
    fetchAccountInfoSuccess,
    fetchAccountInfoError
} from '../actions/user.actions';
import { mockTrips } from 'src/testing/mock-trips';
import { mockAccountInfo } from 'src/testing/mock-account-info';
import { bookTripSuccess } from '../actions/search.actions';

describe('User Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = {} as any;

            const result = userReducer(initialUserState, action);

            expect(result).toBe(initialUserState);
          });
    });

    describe('user actions', () => {
        it('should save the uid to state, set fetching to false, clear password', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                email: 'test@testy.com',
                password: 'secret',
                authFetching: true
            };

            const action = logInSuccess({ uid: 'mock-uid' });

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                email: 'test@testy.com',
                password: '',
                authFetching: false,
                uid: 'mock-uid'
            });
        });

        it('should save the uid to state, set fetching to false, clear password', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                email: 'test@testy.com',
                password: 'secret',
                authFetching: true,
                newUser: false
            };

            const action = signUpSuccess({ uid: 'mock-uid' });

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                email: 'test@testy.com',
                password: '',
                authFetching: false,
                uid: 'mock-uid',
                newUser: true
            });
        });

        it('login should set fetching to true', () => {
            const action = logIn();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: true,
            });
        });

        it('signup should set fetching to true', () => {
            const action = signUp();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: true,
            });
        });

        it('login error should save the error to state, set fetching to false', () => {
            const action = logInError({ error: 'oops' });

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: false,
                error: 'oops'
            });
        });

        it('sigup error should save the error to state, set fetching to false', () => {
            const action = logInError({ error: 'oops' });

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: false,
                error: 'oops'
            });
        });

        it('should clear the uid from state', () => {
            const initialUserStateWithUid = {
                ...initialUserState,
                uid: 'mock-uid'
            };

            const action = logOut();

            const result = userReducer(initialUserStateWithUid, action);

            expect(result).toEqual(initialUserState);
        });

        it('should set trips fetching to true', () => {
            const action = fetchTrips();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                tripsFetching: true
            });
        });

        it('should set trips fetching to false, save the trips in state', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                tripsFetching: true
            };
            const action = fetchTripsSuccess({ trips: mockTrips });

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                tripsFetching: false,
                trips: mockTrips
            });
        });

        it('should set trips fetching to false, save the error in state', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                tripsFetching: true
            };
            const error = new Error('oops');

            const action = fetchTripsError({ error });

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                tripsFetching: false,
                error
            });
        });

        it('should change the email to the new value', () => {
            const action = changeEmail({ email: 'test@test.com' });

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                email: 'test@test.com'
            });
        });

        it('should change the password to the new value', () => {
            const action = changePassword({ password: 'secret-password' });

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                password: 'secret-password'
            });
        });

        it('should set fetching account info to true', () => {
            const action = fetchAccountInfo();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                accountInfoFetching: true
            });
        });

        it('should set fetching account info to false, save the account info', () => {
            const initialStateWithFetching = {
                ...initialUserState,
                accountInfoFetching: true
            };
            const action = fetchAccountInfoSuccess({ accountInfo: mockAccountInfo });

            const result = userReducer(initialStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                accountInfo: mockAccountInfo,
                accountInfoFetching: false
            });
        });

        it('should set fetching account info to false, save the error', () => {
            const initialStateWithFetching = {
                ...initialUserState,
                accountInfoFetching: true
            };

            const action = fetchAccountInfoError({ error: 'oops' });

            const result = userReducer(initialStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                accountInfoFetching: false,
                error: 'oops'
            });
        });

        it('should set newUser to false after they\'ve successfully booked a trip', () => {
            const initialStateWithNewUser = {
                ...initialUserState,
                newUser: true
            };

            const action = bookTripSuccess();

            const result = userReducer(initialStateWithNewUser, action);

            expect(result).toEqual({
                ...initialUserState,
                newUser: false
            });
        });
    });
});
