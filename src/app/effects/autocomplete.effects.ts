import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { AutocompleteService } from '../services/autocomplete.service';
import { Observable, of, SchedulerLike } from 'rxjs';
import { Action } from '@ngrx/store';

import { AutocompleteActionTypes, SaveResults, ResultsError, AutocompleteActions } from '../actions/autocomplete.actions';
import { async } from 'rxjs/internal/scheduler/async';

export const AUTOCOMPLETE_DEBOUNCE = new InjectionToken<number>('Test Debounce');
export const AUTOCOMPLETE_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('AutocompleteEffects Scheduler');

@Injectable()
export class AutocompleteEffects {


  @Effect()
  fetchAutocompleteResults$: Observable<Action> = this.actions$.pipe(
    ofType(AutocompleteActionTypes.FetchResults),
    debounceTime(this.debounce || 300, this.scheduler || async),
    map(action => action.input),
    switchMap(input => this.autocompleteService.getPlacePredictions$(input).pipe(
      map(autocompleteResults => new SaveResults(autocompleteResults)),
      catchError(error => of(new ResultsError(error)))
    ))
  );

  constructor(
    private actions$: Actions<AutocompleteActions>,
    private autocompleteService: AutocompleteService,

    @Optional()
    @Inject(AUTOCOMPLETE_DEBOUNCE)
    private debounce: number,

    @Optional()
    @Inject(AUTOCOMPLETE_EFFECTS_SCHEDULER)
    private scheduler: SchedulerLike) {}
}
