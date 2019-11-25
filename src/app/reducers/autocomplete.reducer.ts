import { AutocompleteActions, AutocompleteActionTypes } from '../actions/autocomplete.actions';
import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import { createSelector, createFeatureSelector } from '@ngrx/store';
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

export const autocompleteKey = 'autocomplete';
const selectAutocomplete = createFeatureSelector<State, AutocompleteState>(autocompleteKey);
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


export function autocompleteReducer(state = initialAutocompleteState, action: AutocompleteActions): AutocompleteState {
    switch (action.type) {
        case AutocompleteActionTypes.ClearResults:
            return {
                ...state,
                autocompleteResults: [],
                autocompleteDirty: false,
            };
        case AutocompleteActionTypes.FetchResults:
            return {
                ...state,
                autocompleteResults: [],
                autocompleteFetching: true,
                autocompleteDirty: true
            };
        case AutocompleteActionTypes.SaveResults:
            return {
                ...state,
                autocompleteResults: action.autocompleteResults,
                autocompleteFetching: false
            };
        default:
            return state;
    }
}
