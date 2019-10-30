import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { SearchState, searchReducer } from './search.reducer';

export interface State {
  search: SearchState;
}

export const reducers: ActionReducerMap<State> = {
  search: searchReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
