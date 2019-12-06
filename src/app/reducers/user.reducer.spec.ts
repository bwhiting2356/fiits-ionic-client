import { initialUserState, userReducer } from './user.reducer';
import {
    LogInFromMenu,
    LogInFromSearch,
    LogInSuccessFromMenu,
    LogInSuccessFromSearch,
    LogInErrorFromMenu,
    LogInErrorFromSearch,
    LogOut,
    FetchTrips,
    FetchTripsSuccess,
    FetchTripsError
} from '../actions/user.actions';
import { mockTrips } from 'src/testing/mock-trips';

describe('User Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = {} as any;

            const result = userReducer(initialUserState, action);

            expect(result).toBe(initialUserState);
          });
    });

    describe('user actions', () => {
        it('should save the uid to state, set fetchig to false', () => {
            const initialUserStateWithFetching = {
                ...initialUserState,
                authFetching: true
            };

            const action = new LogInSuccessFromSearch('mock-uid');

            const result = userReducer(initialUserStateWithFetching, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: false,
                uid: 'mock-uid'
            });
        });

        it('should set fetching to true', () => {
            const action = new LogInFromSearch();

            const result = userReducer(initialUserState, action);

            expect(result).toEqual({
                ...initialUserState,
                authFetching: true,
            });
        });

        it('should save the error to state, set fetching to false', () => {
            const action = new LogInErrorFromSearch('oops');

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

            const result = userReducer(initialUserState, action);

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
    });
});
