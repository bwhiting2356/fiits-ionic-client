import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, Scheduler } from 'rxjs';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';

import { AutocompleteService } from '../services/autocomplete.service';
import {
  FetchResults,
  SaveResults,
  ResultsError,
} from '../actions/autocomplete.actions';
import { mockAutocompleteResults } from '../../testing/mock-autocomplete-results';
import { AutocompleteEffects, AUTOCOMPLETE_DEBOUNCE, AUTOCOMPLETE_EFFECTS_SCHEDULER } from './autocomplete.effects';

describe('AutocompleteEffects success', () => {
  let actions$: Observable<any>;
  let effects: AutocompleteEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutocompleteEffects,
        provideMockActions(() => actions$),
        {
          provide: AutocompleteService,
          useValue: {
            getPlacePredictions$: () => of(mockAutocompleteResults)
          },
        },
        { provide: AUTOCOMPLETE_DEBOUNCE, useValue: 30 },
        { provide: AUTOCOMPLETE_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
      ]
    });

    effects = TestBed.get<AutocompleteEffects>(AutocompleteEffects);
  });

  it('should return SaveAutocompleteResults on success', () => {
    const action = new FetchResults('123 Main Street');
    const completion = new SaveResults(mockAutocompleteResults);
    actions$ = hot('--a-', { a: action });
    const expected = hot('-----b', { b: completion });
    expect(effects.fetchAutocompleteResults$).toBeObservable(expected);
  });

  it('should debounce the autocomplete requests', async () => {
    const action1 = new FetchResults('123 Main Str');
    const action2 = new FetchResults('123 Main Stre');
    const action3 = new FetchResults('123 Main Stree');

    const completion = new SaveResults(mockAutocompleteResults);

    actions$ = hot('--abc-', { a: action1, b: action2, c: action3 });

    const expected = hot('-------b', { b: completion });
    expect(effects.fetchAutocompleteResults$).toBeObservable(expected);
  });

});

describe('AutocompleteEffects errors', () => {
  let actions$: Observable<any>;
  let effects: AutocompleteEffects;
  const error = new Error();

  beforeEach(() => {
    const errorResponse = cold('#|', {}, error);

    TestBed.configureTestingModule({
      providers: [
        AutocompleteEffects,
        provideMockActions(() => actions$),
        {
          provide: AutocompleteService,
          useValue: {
            getPlacePredictions$: () => errorResponse
          }
        },
        { provide: AUTOCOMPLETE_DEBOUNCE, useValue: 30 },
        { provide: AUTOCOMPLETE_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
      ]
    });

    effects = TestBed.get<AutocompleteEffects>(AutocompleteEffects);
  });

  it('should return AutocompleteError on error', async () => {
    const action = new FetchResults('123 Main Street');
    const completion = new ResultsError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('-----b', { b: completion });
    expect(effects.fetchAutocompleteResults$).toBeObservable(expected);
  });

});
