import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController, IonInput } from '@ionic/angular';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { Store } from '@ngrx/store';

import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { mockAutocompleteResults } from '../../../testing/mock-autocomplete-results';

import { AddressInputPage } from './address-input.page';
import { AutocompleteService } from '../../services/autocomplete.service';
import { State } from '../../reducers';
import { initialState } from '../../reducers';
import {
  chooseOriginLocation,
  chooseDestinationLocation,
  fetchGeocodeOriginResult,
  fetchGeocodeDestinationResult,
  chooseCurrentLocationAsDestination,
  chooseCurrentLocationAsOrigin,
  saveOriginLatLng,
  saveDestinationLatLng,
} from '../../actions/search.actions';
import { initialSearchState } from '../../reducers/search.reducer';
import { DEFAULT_LOCATION } from '../../shared/constants';
import { clearAutocompleteResults, fetchAutocompleteResults } from '../../actions/autocomplete.actions';
import { initialAutocompleteState } from '../../reducers/autocomplete.reducer';

describe('AddressInputPage', () => {
  let component: AddressInputPage;
  let fixture: ComponentFixture<AddressInputPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AutocompleteService,
          useValue: {
            getPlacePredictions$: () => of(mockAutocompleteResults)
          }
        },
        {
          provide: NavController,
          useValue: {
            back: () => {},
            navigateForward: () => {}
          }
        },
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to fetch autocomplete results when input changes', async () => {
    spyOn(store, 'dispatch');
    await component.inputChange({ target: { value: '123 Main Street' }});
    expect(store.dispatch)
      .toHaveBeenCalledWith(fetchAutocompleteResults({ input: '123 Main Street' }));
  });

  it('should not show the no-results text if there are results', () => {
    expect(fixture.debugElement.query(By.css('#no-results'))).toBeFalsy();
  });

  it('should render a list item for each autocomplete result', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin',
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: mockAutocompleteResults
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('#autocomplete-results ion-item')).length)
      .toBe(2);
  });

  it('should render text in each item for the main and secondary text', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin',
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: mockAutocompleteResults
      }
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#autocomplete-results ion-item h2')).nativeElement.innerText)
      .toBe('Oyster Point');
    expect(fixture.debugElement.query(By.css('#autocomplete-results ion-item p')).nativeElement.innerText)
      .toBe('South San Francisco, CA, USA');
  });

  it('should show the no-results text if showNoResults is true', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteDirty: true,
        autocompleteFetching: false,
        autocompleteResults: []
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#no-results'))
      .nativeElement.innerText).toBe('No addresses found for this search');
  });

  it('should not show the suggestions section if showSuggestions is false', () => {
    component.showSuggestions = of(false);
    component.searchAddressType = of('Origin');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#suggestions'))).toBeFalsy();
  });

  it('should make showNoResults false if there are no results but is pristine', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: [],
        autocompleteDirty: false,
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.showNoResults).toBeObservable(expected);
    expect(fixture.debugElement.query(By.css('#no-results'))).toBeFalsy();
  });

  it('should make showNoResults false if there are results', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: mockAutocompleteResults,
        autocompleteDirty: true,
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.showNoResults).toBeObservable(expected);
    expect(fixture.debugElement.query(By.css('#no-results'))).toBeFalsy();
  });

  it('should make snowNoResults true if there are no results and is dirty', async () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: [],
        autocompleteDirty: true,
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.showNoResults).toBeObservable(expected);
    expect(fixture.debugElement.query(By.css('#no-results'))
      .nativeElement.innerText).toBe('No addresses found for this search');
  });

  it('should make showSuggestions true if there are no results and is not fetching', async () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin',
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: [],
        autocompleteFetching: false,
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.showSuggestions).toBeObservable(expected);
    expect(fixture.debugElement.query(By.css('#suggestions'))).toBeTruthy();
  });

  it('should make showSuggestions false if there are results and is not fetching', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin',
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: mockAutocompleteResults,
        autocompleteFetching: false,
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.showSuggestions).toBeObservable(expected);
  });

  it('should make showSuggestions false if there are no results and is fetching', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      },
      autocomplete: {
        ...initialAutocompleteState,
        autocompleteResults: [],
        autocompleteFetching: true,
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.showSuggestions).toBeObservable(expected);
  });

  it('should set showCurrentLocation to true if their position is not the default location', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        position: { lat: 0, lng: 0}
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.showCurrentLocation).toBeObservable(expected);
  });

  it('should set showCurrentLocation to false if their position is the default location', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        position: DEFAULT_LOCATION
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.showCurrentLocation).toBeObservable(expected);
  });

  it('should show current location is showCurrentLocation is true', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      }
    });
    component.showCurrentLocation = of(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#current-location'))).toBeTruthy();
  });

  it('should not show current location is showCurrentLocation is false', () => {
    component.showCurrentLocation = of(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#current-location'))).toBeFalsy();
  });

  it('should return the origin placeholder text', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      }
    });
    const expected = cold('a', { a: 'Enter Origin Address' } );
    expect(component.placeholderText).toBeObservable(expected);
  });

  it('should dispatch actions to choose origin location, fetch geocode result, and clear autocomplete results', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin'
      }
    });
    spyOn(store, 'dispatch');
    spyOn(component.navCtrl, 'back');
    fixture.detectChanges();

    component.chooseLocation(mockAutocompleteResults[0]);
    expect(store.dispatch)
      .toHaveBeenCalledWith(chooseOriginLocation({ location: mockAutocompleteResults[0].structured_formatting.main_text }));
    expect(store.dispatch)
      .toHaveBeenCalledWith(fetchGeocodeOriginResult({ placeId: mockAutocompleteResults[0].place_id }));
    expect(store.dispatch)
      .toHaveBeenCalledWith(clearAutocompleteResults());

    expect(component.navCtrl.back).toHaveBeenCalled();
  });

  it('should return the destination placeholder text', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Destination'
      }
    });
    const expected = cold('a', { a: 'Enter Destination Address' } );
    expect(component.placeholderText).toBeObservable(expected);
  });

  it('should dispatch actions to choose destination location and clear autocomplete results', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Destination'
      }
    });
    spyOn(store, 'dispatch');
    spyOn(component.navCtrl, 'back');
    fixture.detectChanges();

    component.chooseLocation(mockAutocompleteResults[1]);

    expect(store.dispatch)
      .toHaveBeenCalledWith(chooseDestinationLocation({ location: mockAutocompleteResults[1].structured_formatting.main_text }));
    expect(store.dispatch)
      .toHaveBeenCalledWith(fetchGeocodeDestinationResult({ placeId: mockAutocompleteResults[1].place_id }));
    expect(store.dispatch)
      .toHaveBeenCalledWith(clearAutocompleteResults());
    expect(component.navCtrl.back).toHaveBeenCalled();
  });

  it('should set focus to the input element after the view finishes animating in', () => {
    component.input = { setFocus: () => Promise.resolve() } as IonInput;
    spyOn(component.input, 'setFocus');

    (component as any).ionViewDidEnter();

    expect(component.input.setFocus).toHaveBeenCalled();
  });

  it('should call chooseCurrentLocation if they click on the current location line item', async () => {
    spyOn(component, 'chooseCurrentLocation');
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin',
        position: { lat: 0, lng: 0 }
      }
    });
    fixture.detectChanges();
    const currentLocation = fixture.debugElement.query(By.css('#current-location')).nativeElement;
    currentLocation.click();
    expect(component.chooseCurrentLocation).toHaveBeenCalled();
  });

  it('should dispatch ChooseCurrentLocationAsOrigin, SaveOriginLatLng when chooseCurrentLocation is called', () => {
    spyOn(store, 'dispatch');
    spyOn(component.navCtrl, 'back');
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Origin',
        position: { lat: 0, lng: 0 }
      }
    });

    component.chooseCurrentLocation();
    expect(store.dispatch).toHaveBeenCalledWith(chooseCurrentLocationAsOrigin({ location: { lat: 0, lng: 0 }}));
    expect(store.dispatch).toHaveBeenCalledWith(saveOriginLatLng({ latlng: { lat: 0, lng: 0 }}));
    expect(component.navCtrl.back).toHaveBeenCalled();
  });

  it('should dispatch ChooseCurrentLocationAsDestination, SaveDestinationLatLng when chooseCurrentLocation is called', () => {
    spyOn(store, 'dispatch');
    spyOn(component.navCtrl, 'back');
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        searchAddressType: 'Destination',
        position: { lat: 0, lng: 0 }
      }
    });

    component.chooseCurrentLocation();
    expect(store.dispatch).toHaveBeenCalledWith(chooseCurrentLocationAsDestination({ location: {lat: 0, lng: 0 }}));
    expect(store.dispatch).toHaveBeenCalledWith(saveDestinationLatLng({ latlng: {lat: 0, lng: 0 }}));
    expect(component.navCtrl.back).toHaveBeenCalled();
  });
});
