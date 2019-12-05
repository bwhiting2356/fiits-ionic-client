import { initialUserState, userReducer } from './user.reducer';
import {
    LogInFromMenu,
    LogInFromSearch,
    LogInSuccessFromMenu,
    LogInSuccessFromSearch,
    LogInErrorFromMenu,
    LogInErrorFromSearch,
    LogOut
} from '../actions/user.actions';

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
    });
});
