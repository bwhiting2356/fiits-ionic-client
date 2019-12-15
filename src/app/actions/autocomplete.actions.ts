import { createAction, props } from '@ngrx/store';

import { AutocompleteResult } from '../shared/maps/autocomplete-result';

export const autocompleteError = createAction('[Autocomplete] Error', props<{error: any}>());
export const clearAutocompleteResults = createAction('[Autocomplete] Clear Results');
export const fetchAutocompleteResults = createAction('[Autocomplete] Fetch Results', props<{input: string}>());
export const saveAutocompleteResults = createAction('[Autocomplete] Save Results', props<{results: AutocompleteResult[]}>());
