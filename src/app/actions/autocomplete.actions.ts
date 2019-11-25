import { Action } from '@ngrx/store';
import { AutocompleteResult } from '../shared/maps/autocomplete-result';

export enum AutocompleteActionTypes {
    ClearResults = '[Search] Clear Results',
    Dirty = '[Autocomplete] Autocomplete Dirty',
    FetchResults = '[Autocomplete] Fetch Results',
    SaveResults = '[Autocomplete] Save Results',
    Error = '[Autocomplete] Error',
}

export class ResultsError implements Action {
    readonly type = AutocompleteActionTypes.Error;
    constructor(public error: any) {}
}

export class ClearResults implements Action {
    readonly type = AutocompleteActionTypes.ClearResults;
}

export class FetchResults implements Action {
    readonly type = AutocompleteActionTypes.FetchResults;
    constructor(public input: string) {}
  }

export class SaveResults implements Action {
    readonly type = AutocompleteActionTypes.SaveResults;
    constructor(public autocompleteResults: AutocompleteResult[]) {}
}

export type AutocompleteActions = ClearResults
                            | ResultsError
                            | FetchResults
                            | SaveResults;
