import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';

import { AutocompleteService } from '../services/autocomplete.service';
import {
  fetchAutocompleteResults,
  saveAutocompleteResults,
  autocompleteError,
} from '../actions/autocomplete.actions';
import { mockAutocompleteResults } from '../../testing/mock-autocomplete-results';
import { AutocompleteEffects, AUTOCOMPLETE_DEBOUNCE, AUTOCOMPLETE_EFFECTS_SCHEDULER } from './autocomplete.effects';

describe('AutocompleteEffects', () => {
  let actions$: Observable<any>;
  let effects: AutocompleteEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutocompleteEffects,
        provideMockActions(() => actions$),
        { provide: AutocompleteService, useValue: { getPlacePredictions$: () => {} }},
        { provide: AUTOCOMPLETE_DEBOUNCE, useValue: 30 },
        { provide: AUTOCOMPLETE_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
      ]
    });

    effects = TestBed.get<AutocompleteEffects>(AutocompleteEffects);
  });

  it('should return SaveAutocompleteResults on success', inject(
    [AutocompleteService, AutocompleteEffects],
    async (autocompleteService: AutocompleteService, autocompleteEffects: AutocompleteEffects) => {
      spyOn(autocompleteService, 'getPlacePredictions$').and.returnValue(of(mockAutocompleteResults));
      const action = fetchAutocompleteResults({ input: '123 Main Street' });
      const completion = saveAutocompleteResults({ results: mockAutocompleteResults });
      actions$ = hot('--a-', { a: action });
      const expected = hot('-----b', { b: completion });
      expect(autocompleteEffects.fetchAutocompleteResults$).toBeObservable(expected);
  }));

  it('should return AutocompleteError on error', inject(
    [AutocompleteService, AutocompleteEffects],
    async (autocompleteService: AutocompleteService, autocompleteEffects: AutocompleteEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(autocompleteService, 'getPlacePredictions$').and.returnValue(errorResponse);
      const action = fetchAutocompleteResults({ input: '123 Main Street' });
      const completion = autocompleteError({ error });
      actions$ = hot('--a-', { a: action });
      const expected = cold('-----b', { b: completion });
      expect(autocompleteEffects.fetchAutocompleteResults$).toBeObservable(expected);
  }));

  it('should debounce the autocomplete requests', inject(
    [AutocompleteService, AutocompleteEffects],
    async (autocompleteService: AutocompleteService, autocompleteEffects: AutocompleteEffects) => {
      spyOn(autocompleteService, 'getPlacePredictions$').and.returnValue(of(mockAutocompleteResults));
      const action1 = fetchAutocompleteResults({ input: '123 Main Str' });
      const action2 = fetchAutocompleteResults({ input: '123 Main Stre' });
      const action3 = fetchAutocompleteResults({ input: '123 Main Stree' });

      const completion = saveAutocompleteResults({ results: mockAutocompleteResults });

      actions$ = hot('--abc-', { a: action1, b: action2, c: action3 });

      const expected = hot('-------b', { b: completion });
      expect(autocompleteEffects.fetchAutocompleteResults$).toBeObservable(expected);
  }));

});
