import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, searchReducer, initialSearchState } from './search.reducer';
import { FeedbackState, feedbackReducer, initialFeedbackState } from './feedback.reducer';
import { AuthState, initialAuthState, authReducer } from './auth.reducer';

import { searchKey } from './search.reducer';
import { feedbackKey } from './feedback.reducer';
import { authKey } from './auth.reducer';
import { autocompleteKey, AutocompleteState, initialAutocompleteState, autocompleteReducer } from './autocomplete.reducer';

export interface State {
  [searchKey]: SearchState;
  [feedbackKey]: FeedbackState;
  [authKey]: AuthState;
  [autocompleteKey]: AutocompleteState;
}

export const initialState: State = {
  [searchKey]: initialSearchState,
  [feedbackKey]: initialFeedbackState,
  [authKey]: initialAuthState,
  [autocompleteKey]: initialAutocompleteState
};

export const reducers: ActionReducerMap<State> = {
  [searchKey]: searchReducer,
  [feedbackKey]: feedbackReducer,
  [authKey]: authReducer,
  [autocompleteKey]: autocompleteReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
