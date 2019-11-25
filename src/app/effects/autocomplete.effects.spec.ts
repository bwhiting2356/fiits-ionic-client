import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { SearchEffects } from './search.effects';
import { AutocompleteService } from '../services/autocomplete.service';
import {
  FetchResults,
  SaveResults,
  ResultsError,
} from '../actions/autocomplete.actions';
import { mockAutocompleteResults } from '../../testing/mock-autocomplete-results';
import { AutocompleteEffects } from './autocomplete.effects';

describe('SearchEffects success', () => {
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
          }
        },
      ]
    });

    effects = TestBed.get<AutocompleteEffects>(AutocompleteEffects);
  });

  it('should return SaveAutocompleteResults on success', () => {
    const action = new FetchResults('123 Main Street');
    const completion = new SaveResults(mockAutocompleteResults);
    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchAutocompleteResults$).toBeObservable(expected);
  });

  it('should debounce the autocomplete requests', () => {
    const action1 = new FetchResults('123 Main Str');
    const action2 = new FetchResults('123 Main Stre');
    const action3 = new FetchResults('123 Main Stree');

    const completion = new SaveResults(mockAutocompleteResults);

    actions$ = hot('--abc-', { a: action1, b: action2, c: action3 });

    const expected = hot('--b', { b: completion });
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
        }
      ]
    });

    effects = TestBed.get<AutocompleteEffects>(AutocompleteEffects);
  });


  it('should return AutocompleteError on error', () => {
    const action = new FetchResults('123 Main Street');
    const completion = new ResultsError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.fetchAutocompleteResults$).toBeObservable(expected);
  });

});
