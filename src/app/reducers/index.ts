import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, initialSearchState, reducer as searchReducer } from './search.reducer';
import { FeedbackState, initialFeedbackState, reducer as feedbackReducer } from './feedback.reducer';
import { UserState, initialUserState, reducer as userReducer } from './user.reducer';

import { AutocompleteState, initialAutocompleteState, reducer as autocompleteReducer } from './autocomplete.reducer';

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
