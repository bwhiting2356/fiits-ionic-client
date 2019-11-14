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
  SearchAddressType
} from '../actions/search.actions';

import { AutocompleteResult } from '../shared/maps/autocomplete-result';

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
  searchAddressType: Observable<SearchAddressType>;
  placeholderText: Observable<string>;

  constructor(
    private navCtrl: NavController,
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.autocompleteResults = this.store
      .select(state => state.search.autocompleteResults);

    this.autocompleteFetching = this.store
      .select(state => state.search.autocompleteFetching);

    this.autocompleteDirty = this.store
      .select(state => state.search.autocompleteDirty);

    this.searchAddressType = this.store
      .select(state => state.search.searchAddressType);

    this.placeholderText = this.searchAddressType.pipe(
      map(type => `Enter ${type} Address`)
    );

    this.showNoResults = combineLatest([
      this.autocompleteResults,
      this.autocompleteFetching,
      this.autocompleteDirty
    ]).pipe(
      map(([results, fetching, dirty]) => {
        return results.length < 1 && !fetching && dirty;
      })
    );

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
}
