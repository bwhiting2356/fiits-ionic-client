
import { AutocompleteService } from './autocomplete.service';
import { TestBed } from '@angular/core/testing';
import { MapsAPILoader } from '@agm/core';
import { mockAutocompleteResults } from '../shared/maps/mock-autocomplete-results';

describe('AutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [{
       provide: MapsAPILoader,
       useValue: {
         load: () => Promise.resolve(),
       }
      }]
  }));

  it('should be created', () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    expect(service).toBeTruthy();
  });

  it('should assign instance of google autocomplete service when initializeAutocomplete is called ', async () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    await service.initializeAutocomplete();
    expect((service as any).googleAutocompleteService).toBeTruthy();
  });

  it('should initialize the service if there\'s no instance yet', async () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    spyOn(service, 'initializeAutocomplete');
    await service.getPlacePredictions('');
    expect(service.initializeAutocomplete).toHaveBeenCalled();
  });

  it('should not initialize a new instance of the service is there already was one', async () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    await service.initializeAutocomplete();
    spyOn(service, 'initializeAutocomplete');
    await service.getPlacePredictions('');
    expect(service.initializeAutocomplete).not.toHaveBeenCalled();
  });

  it('should return an empty list if there is no input', async () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    await service.initializeAutocomplete();
    const results = await service.getPlacePredictions('');
    expect(results).toEqual([]);
  });

  it('should return a list of autocomplete predictions', async () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    await service.initializeAutocomplete();
    spyOn((service as any).googleAutocompleteService, 'getPlacePredictions')
      .and.callFake((_, cb) => cb(mockAutocompleteResults));
    const results = await service.getPlacePredictions('123 Main Street');
    expect(results).toEqual(mockAutocompleteResults);
  });

  it('should return empty list if the google autocomplete service returns null', async () => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    await service.initializeAutocomplete();
    spyOn((service as any).googleAutocompleteService, 'getPlacePredictions')
      .and.callFake((_, cb) => cb(null));
    const results = await service.getPlacePredictions('123 Main Street');
    expect(results).toEqual([]);
  });

  it('should return an observable of autocomplete results', async (done) => {
    const service: AutocompleteService = TestBed.get(AutocompleteService);
    await service.initializeAutocomplete();
    spyOn((service as any).googleAutocompleteService, 'getPlacePredictions')
      .and.callFake((_, cb) => cb(mockAutocompleteResults));
    const results$ = service.getPlacePredictions$('123 Main Street');

    // can't use jasmine marbles with observable from promise
    // https://stackoverflow.com/questions/46106985/observable-frompromise-empty-during-unit-testing
    results$.subscribe(results => {
      expect(results).toBe(mockAutocompleteResults);
      done();
    });
  });
});
