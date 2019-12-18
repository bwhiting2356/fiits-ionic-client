import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavController, IonInput } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AutocompleteResult } from '../../shared/maps/autocomplete-result';
import { State } from '../../reducers';
import {
  SearchAddressType,
  chooseOriginLocation,
  chooseDestinationLocation,
  fetchGeocodeOriginResult,
  fetchGeocodeDestinationResult,
  chooseCurrentLocationAsDestination,
  chooseCurrentLocationAsOrigin,
  saveOriginLatLng,
  saveDestinationLatLng
} from '../../actions/search.actions';

import {
  selectAddressType,
  selectShowCurrentLocation,
  selectPosition
} from '../../reducers/search.reducer';
import { fetchAutocompleteResults, clearAutocompleteResults } from '../../actions/autocomplete.actions';
import {
  selectAutocompleteResults,
  selectAutocompletFetching,
  selectAutocompleteDirty,
  selectShowAutocompleteSuggestions,
  selectAutocompleteShowNoResults
} from '../../reducers/autocomplete.reducer';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.page.html',
  styleUrls: ['./address-input.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressInputPage implements OnInit {
  @ViewChild('input', { static: false }) input: IonInput;
  autocompleteResults: Observable<AutocompleteResult[]>;
  autocompleteFetching: Observable<boolean>;
  autocompleteDirty: Observable<boolean>;
  showNoResults: Observable<boolean>;
  showSuggestions: Observable<boolean>;
  showCurrentLocation: Observable<boolean>;
  searchAddressType: Observable<SearchAddressType>;
  placeholderText: Observable<string>;

  constructor(
    public navCtrl: NavController,
    public store: Store<State>
  ) { }

  ngOnInit() {
    this.autocompleteResults = this.store.select(selectAutocompleteResults);
    this.autocompleteFetching = this.store.select(selectAutocompletFetching);
    this.autocompleteDirty = this.store.select(selectAutocompleteDirty);
    this.searchAddressType = this.store.select(selectAddressType);
    this.showSuggestions = this.store.select(selectShowAutocompleteSuggestions);
    this.showNoResults = this.store.select(selectAutocompleteShowNoResults);
    this.showCurrentLocation = this.store.select(selectShowCurrentLocation);
    this.placeholderText = this.searchAddressType.pipe(
      map(type => `Enter ${type} Address`)
    );

    this.searchAddressType.pipe(take(1)).subscribe(type => {
      if (!type) {
        this.navCtrl.navigateForward('/search');
      }
    });
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }

  async inputChange(e) {
    this.store.dispatch(fetchAutocompleteResults({ input: e.target.value }));
  }

  chooseLocation(result: AutocompleteResult) {
    this.navCtrl.back();
    this.store.dispatch(clearAutocompleteResults());
    this.searchAddressType.pipe(take(1))
      .subscribe(type => {
        if (type === 'Origin') {
          this.store.dispatch(chooseOriginLocation({ location: result.structured_formatting.main_text }));
          this.store.dispatch(fetchGeocodeOriginResult({ placeId: result.place_id }));
        } else { // (type === 'Destination')
          this.store.dispatch(chooseDestinationLocation({ location: result.structured_formatting.main_text }));
          this.store.dispatch(fetchGeocodeDestinationResult({ placeId: result.place_id }));
        }
      });
  }

  chooseCurrentLocation() {
    this.navCtrl.back();
    combineLatest([
      this.searchAddressType,
      this.store.select(selectPosition)
    ])
    .pipe(take(1))
    .subscribe(([type, latlng]) => {
      if (type === 'Origin') {
        this.store.dispatch(saveOriginLatLng({ latlng }));
        this.store.dispatch(chooseCurrentLocationAsOrigin({ location: latlng }));
      } else { // (type === 'Destination')
        this.store.dispatch(saveDestinationLatLng({ latlng }));
        this.store.dispatch(chooseCurrentLocationAsDestination({ location: latlng }));
      }
    });
  }
}
