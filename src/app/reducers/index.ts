import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, searchReducer, initialSearchState } from './search.reducer';
import { FeedbackState, feedbackReducer, initialFeedbackState } from './feedback.reducer';
import { UserState, initialUserState, userReducer } from './user.reducer';

import { AutocompleteState, initialAutocompleteState, autocompleteReducer } from './autocomplete.reducer';

export interface State {
  search: SearchState;
  feedback: FeedbackState;
  user: UserState;
  autocomplete: AutocompleteState;
}

export const initialState: State = {
  search: initialSearchState,
  feedback: initialFeedbackState,
  user: initialUserState,
  autocomplete: initialAutocompleteState
};

export const reducers: ActionReducerMap<State> = {
  search: searchReducer,
  feedback: feedbackReducer,
  user: userReducer,
  autocomplete: autocompleteReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
