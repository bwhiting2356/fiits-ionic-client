import {
    clearAutocompleteResults,
    autocompleteError,
    fetchAutocompleteResults,
    saveAutocompleteResults
} from '../actions/autocomplete.actions';
import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import { createSelector, createFeatureSelector, createReducer, on, Action } from '@ngrx/store';
import { State } from '.';

export interface AutocompleteState {
    autocompleteResults: AutocompleteResult[];
    autocompleteFetching: boolean;
    autocompleteDirty: boolean;
    error: any;
}

export const initialAutocompleteState: AutocompleteState = {
    autocompleteResults: [],
    autocompleteFetching: false,
    autocompleteDirty: false,
    error: undefined
};

const selectAutocomplete = createFeatureSelector<State, AutocompleteState>('autocomplete');
export const selectAutocompleteResults = createSelector(
    selectAutocomplete,
    state => state.autocompleteResults);

export const selectAutocompletFetching = createSelector(
    selectAutocomplete,
    state => state.autocompleteFetching);

export const selectAutocompleteDirty = createSelector(
    selectAutocomplete,
    state => state.autocompleteDirty);

export const selectShowAutocompleteSuggestions = createSelector(
    selectAutocompleteResults,
    selectAutocompletFetching,
    (results, fetching) => results.length < 1 && !fetching
);

export const selectAutocompleteShowNoResults = createSelector(
    selectAutocompleteResults,
    selectAutocompletFetching,
    selectAutocompleteDirty,
    (results, fetching, dirty) => results.length < 1 && !fetching && dirty
);

const autocompleteReducer = createReducer(
    initialAutocompleteState,
    on(clearAutocompleteResults, state => ({ ...state, autocompleteResults: [], autocompleteDirty: false })),
    on(autocompleteError, (state, { error }) => ({ ...state, error })),
    on(fetchAutocompleteResults, state => ({ ...state, autocompleteResults: [], autocompleteFetching: true, autocompleteDirty: true })),
    on(saveAutocompleteResults, (state, { results }) => ({ ...state, autocompleteResults: results, autocompleteFetching: false }))
);

export function reducer(state: AutocompleteState | undefined, action: Action) {
    return autocompleteReducer(state, action);
}
