import { initialUserState, userReducer } from './user.reducer';
import {
    LogIn,
    LogInSuccess,
    LogInError,
    LogOut,
    FetchTrips,
    FetchTripsSuccess,
    FetchTripsError,
    ChangeEmail,
    ChangePassword,
    SignUpSuccess,
    SignUp,
    FetchAccountInfo,
    FetchAccountInfoSuccess,
    FetchAccountInfoError
} from '../actions/user.actions';
import { mockTrips } from 'src/testing/mock-trips';
import { initialState } from '.';
import { mockAccountInfo } from 'src/testing/mock-account-info';

describe('User Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = {} as any;

            const result = userReducer(initialUserState, action);

            expect(result).toBe(initialUserState);
          });
    });

    describe('user actions', () => {
        it('should save the uid to state, set fetching to false, clear email and password', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                email: 'test@testy.com',
                password: 'secret',
                authFetching: true
            };

            const action = new LogInSuccess('mock-uid');

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                email: '',
                password: '',
                authFetching: false,
                uid: 'mock-uid'
            });
        });

        it('should save the uid to state, set fetching to false, clear email and password', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                email: 'test@testy.com',
                password: 'secret',
                authFetching: true
            };

            const action = new SignUpSuccess('mock-uid');

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                email: '',
                password: '',
                authFetching: false,
                uid: 'mock-uid'
            });
        });

        it('login should set fetching to true', () => {
            const action = new LogIn();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: true,
            });
        });

        it('signup should set fetching to true', () => {
            const action = new SignUp();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: true,
            });
        });

        it('login error should save the error to state, set fetching to false', () => {
            const action = new LogInError('oops');

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: false,
                error: 'oops'
            });
        });

        it('sigup error should save the error to state, set fetching to false', () => {
            const action = new LogInError('oops');

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

            const action = new LogOut();

            const result = userReducer(initialUserStateWithUid, action);

            expect(result).toEqual(initialUserState);
        });

        it('should set trips fetching to true', () => {
            const action = new FetchTrips();

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
            const action = new FetchTripsSuccess(mockTrips);

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

            const action = new FetchTripsError(error);

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                tripsFetching: false,
                error
            });

        });

        it('should change the email to the new value', () => {
            const action = new ChangeEmail('test@test.com');

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                email: 'test@test.com'
            });
        });

        it('should change the password to the new value', () => {
            const action = new ChangePassword('secret-password');

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                password: 'secret-password'
            });
        });

        it('should set fetching account info to true', () => {
            const action = new FetchAccountInfo();

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
            const action = new FetchAccountInfoSuccess(mockAccountInfo);

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

            const action = new FetchAccountInfoError('oops');

            const result = userReducer(initialStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                accountInfoFetching: false,
                error: 'oops'
            });
        });
    });
});
