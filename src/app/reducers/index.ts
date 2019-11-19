import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, searchReducer, initialSearchState } from './search.reducer';
import { FeedbackState, feedbackReducer, initialFeedbackState } from './feedback.reducer';
import { AuthState, initialAuthState, authReducer } from './auth.reducer';

export interface State {
  search: SearchState;
  feedback: FeedbackState;
  auth: AuthState;
}

export const initialState: State = {
 search: initialSearchState,
 feedback: initialFeedbackState,
 auth: initialAuthState
};

export const reducers: ActionReducerMap<State> = {
  search: searchReducer,
  feedback: feedbackReducer,
  auth: authReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
