import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, searchReducer, initialSearchState } from './search.reducer';
import { FeedbackState, feedbackReducer, initialFeedbackState } from './feedback.reducer';
import { AuthState, initialAuthState, authReducer } from './auth.reducer';

import { AutocompleteState, initialAutocompleteState, autocompleteReducer } from './autocomplete.reducer';

export interface State {
  search: SearchState;
  feedback: FeedbackState;
  auth: AuthState;
  autocomplete: AutocompleteState;
}

export const initialState: State = {
  search: initialSearchState,
  feedback: initialFeedbackState,
  auth: initialAuthState,
  autocomplete: initialAutocompleteState
};

export const reducers: ActionReducerMap<State> = {
  search: searchReducer,
  feedback: feedbackReducer,
  auth: authReducer,
  autocomplete: autocompleteReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
