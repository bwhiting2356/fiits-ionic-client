import { initialAuthState, authReducer } from './auth.reducer';
import {
    LogInFromMenu,
    LogInFromSearch,
    LogInSuccessFromMenu,
    LogInSuccessFromSearch,
    LogInErrorFromMenu,
    LogInErrorFromSearch,
    LogOut
} from '../actions/auth.actions';

describe('Auth Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = {} as any;

            const result = authReducer(initialAuthState, action);

            expect(result).toBe(initialAuthState);
          });
    });

    describe('auth actions', () => {
        it('should save the uid to state, set fetchig to false', () => {
            const initialAuthStateWithFetching = {
                ...initialAuthState,
                authFetching: true
            };

            const action = new LogInSuccessFromSearch('mock-uid');

            const result = authReducer(initialAuthStateWithFetching, action);

            expect(result).toEqual({
                ...initialAuthState,
                authFetching: false,
                uid: 'mock-uid'
            });
        });

        it('should set fetching to true', () => {
            const action = new LogInFromSearch();

            const result = authReducer(initialAuthState, action);

            expect(result).toEqual({
                ...initialAuthState,
                authFetching: true,
            });
        });

        it('should save the error to state, set fetching to false', () => {
            const action = new LogInErrorFromSearch('oops');

            const result = authReducer(initialAuthState, action);

            expect(result).toEqual({
                ...initialAuthState,
                authFetching: false,
                error: 'oops'
            });
        });

        it('should clear the uid from state', () => {
            const initialAuthStateWithUid = {
                ...initialAuthState,
                uid: 'mock-uid'
            };

            const action = new LogOut();

            const result = authReducer(initialAuthStateWithUid, action);

            expect(result).toEqual(initialAuthState);
        });
    });
});
