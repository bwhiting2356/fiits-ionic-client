import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AutocompleteService } from '../services/autocomplete.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { AutocompleteActionTypes, SaveResults, ResultsError, AutocompleteActions } from '../actions/autocomplete.actions';

@Injectable()
export class AutocompleteEffects {

  @Effect()
  fetchAutocompleteResults$: Observable<Action> = this.actions$.pipe(
    ofType(AutocompleteActionTypes.FetchResults),
    map(action => action.input),
    switchMap(input => this.autocompleteService.getPlacePredictions$(input).pipe(
      map(autocompleteResults => new SaveResults(autocompleteResults)),
      catchError(error => of(new ResultsError(error)))
    ))
  );

  constructor(
    private actions$: Actions<AutocompleteActions>,
    private autocompleteService: AutocompleteService) {}
}
