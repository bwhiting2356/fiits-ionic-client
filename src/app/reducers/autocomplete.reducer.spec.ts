import { reducer as autocompleteReducer, initialAutocompleteState } from './autocomplete.reducer';
import { clearAutocompleteResults, saveAutocompleteResults, fetchAutocompleteResults } from '../actions/autocomplete.actions';
import { mockAutocompleteResults } from 'src/testing/mock-autocomplete-results';

describe('Autocomplete Reducer', () => {
    describe('an unknown action', () => {
      it('should return the previous state', () => {
        const action = {} as any;

        const result = autocompleteReducer(initialAutocompleteState, action);

        expect(result).toBe(initialAutocompleteState);
      });
    });

    describe('autocomplete actions', () => {
        it('should save the autocomplete results', () => {
            const initialStateWithFetching = {
                ...initialAutocompleteState,
                autocompleteFetching: true
              };
            const action = saveAutocompleteResults({ results: mockAutocompleteResults });

            const result = autocompleteReducer(initialStateWithFetching, action);

            expect(result).toEqual({
                ...initialAutocompleteState,
                autocompleteResults: mockAutocompleteResults,
                autocompleteFetching: false
              });
        });

        it('should clear the autocomplete results, set dirty to false, set searchAddressType to undefined', () => {
            const initialStateWithMockResults = {
              ...initialAutocompleteState,
              autocompleteResults: mockAutocompleteResults,
              autocompleteDirty: true,
            };
            const action = clearAutocompleteResults();

            const result = autocompleteReducer(initialStateWithMockResults, action);

            expect(result).toEqual({
              ...initialAutocompleteState,
              autocompleteResults: [],
              autocompleteDirty: false,
            });
          });

        it('should set the fetching state to true, dirty to true', () => {
            const action = fetchAutocompleteResults({ input: '123 Main Street'});

            const result = autocompleteReducer(initialAutocompleteState, action);

            expect(result).toEqual({
              ...initialAutocompleteState,
              autocompleteFetching: true,
              autocompleteDirty: true,
            });
          });

        it('should set the fetching state to true, clear the current results', () => {
            const initialStateWithMockResults = {
              ...initialAutocompleteState,
              autocompleteDirty: true,
              autocompleteResults: mockAutocompleteResults
            };
            const action = fetchAutocompleteResults({ input: '123 Main Street' });

            const result = autocompleteReducer(initialStateWithMockResults, action);

            expect(result).toEqual({
              ...initialAutocompleteState,
              autocompleteDirty: true,
              autocompleteFetching: true,
              autocompleteResults: []
            });
          });

    });
});
