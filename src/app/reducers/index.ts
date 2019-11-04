import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, searchReducer, initialSearchState } from './search.reducer';
import { FeedbackState, feedbackReducer, initialFeedbackState } from './feedback.reducer';

export interface State {
  search: SearchState;
  feedback: FeedbackState;
}

export const initialState: State = {
 search: initialSearchState,
 feedback: initialFeedbackState
};

export const reducers: ActionReducerMap<State> = {
  search: searchReducer,
  feedback: feedbackReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
