import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { AutocompleteService } from '../services/autocomplete.service';
import { of, SchedulerLike } from 'rxjs';
import { Action } from '@ngrx/store';

import { async } from 'rxjs/internal/scheduler/async';
import { fetchAutocompleteResults, autocompleteError, saveAutocompleteResults } from '../actions/autocomplete.actions';

export const AUTOCOMPLETE_DEBOUNCE = new InjectionToken<number>('Test Debounce');
export const AUTOCOMPLETE_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('AutocompleteEffects Scheduler');

@Injectable()
export class AutocompleteEffects {

  fetchAutocompleteResults$ = createEffect(() => this.actions$.pipe(
    ofType(fetchAutocompleteResults),
    debounceTime(this.debounce || 300, this.scheduler || async),
    map(action => action.input),
    switchMap(input => this.autocompleteService.getPlacePredictions$(input).pipe(
      map(autocompleteResults => saveAutocompleteResults({ results: autocompleteResults })),
      catchError(error => of(autocompleteError({ error })))
    ))
  ));

  constructor(
    private actions$: Actions<Action>,
    private autocompleteService: AutocompleteService,

    @Optional()
    @Inject(AUTOCOMPLETE_DEBOUNCE)
    private debounce: number,

    @Optional()
    @Inject(AUTOCOMPLETE_EFFECTS_SCHEDULER)
    private scheduler: SchedulerLike) {}
}
