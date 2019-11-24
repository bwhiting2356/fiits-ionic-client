import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, IonInput } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { State } from '../reducers';
import {
  ChooseOriginLocation,
  ChooseDestinationLocation,
  FetchAutocompleteResults,
  ClearAutocompleteResults,
  FetchGeocodeOriginResult,
  FetchGeocodeDestinationResult,
  SearchAddressType,
  ChooseCurrentLocationAsDestination,
  ChooseCurrentLocationAsOrigin,
  SaveOriginLatLng,
  SaveDestinationLatLng
} from '../actions/search.actions';

import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import {
  selectAutocompleteResults,
  selectAutocompletFetching,
  selectAutocompleteDirty,
  selectAddressType,
  selectShowAutocompleteSuggestions,
  selectAutocompleteShowNoResults,
  selectShowCurrentLocation,
  selectPosition
} from '../reducers/search.reducer';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.page.html',
  styleUrls: ['./address-input.page.scss'],
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
    this.store.dispatch(new FetchAutocompleteResults(e.target.value));
  }

  chooseLocation(result: AutocompleteResult) {
    this.searchAddressType.pipe(take(1))
      .subscribe(type => {
        if (type === 'Origin') {
          this.store.dispatch(new ChooseOriginLocation(result.structured_formatting.main_text));
          this.store.dispatch(new FetchGeocodeOriginResult(result.structured_formatting.main_text));
        } else { // (type === 'Destination')
          this.store.dispatch(new ChooseDestinationLocation(result.structured_formatting.main_text));
          this.store.dispatch(new FetchGeocodeDestinationResult(result.structured_formatting.main_text));
        }
        this.navCtrl.back();
        this.store.dispatch(new ClearAutocompleteResults());
      });
  }

  chooseCurrentLocation() {
    combineLatest([
      this.searchAddressType,
      this.store.select(selectPosition)
    ])
    .pipe(take(1))
    .subscribe(([type, position]) => {
      if (type === 'Origin') {
        this.store.dispatch(new SaveOriginLatLng(position));
        this.store.dispatch(new ChooseCurrentLocationAsOrigin(position));
      } else { // (type === 'Destination')
        this.store.dispatch(new SaveDestinationLatLng(position));
        this.store.dispatch(new ChooseCurrentLocationAsDestination(position));
      }
      this.navCtrl.back();
    });
  }
}
