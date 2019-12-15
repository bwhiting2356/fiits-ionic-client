import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { LatLng } from '../shared/latlng.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  SearchAddressType,
  setSearchAddressType,
  changeTimeTarget,
  changeTime,
  searchQuery,
  fetchAllStations,
  fetchGeolocation,
  timeInPastError,
  activeSearchTrue,
  activeSearchFalse
} from '../actions/search.actions';
import { TimeTarget } from '../shared/time-target.model';
import { StationInfo } from '../shared/trip-details.model';
import {
  selectSearchOriginLatLng,
  selectSearchOriginAddress,
  selectSearchDestinationLatLng,
  selectSearchDestinationAddress,
  selectSearchQueryFetching,
  selectSearchButtonDisabled,
  selectSearchShowSpinner,
  selectStations,
  selectPosition
} from '../reducers/search.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage implements OnInit {
  originLatLng: Observable<LatLng>;
  originAddress: Observable<string>;
  destinationLatLng: Observable<LatLng>;
  destinationAddress: Observable<string>;
  rentalButtonDisabled: Observable<boolean>;
  searchQueryFetching: Observable<boolean>;
  showSpinner: Observable<boolean>;
  timeString: Observable<string>;
  stations: Observable<StationInfo[]>;
  position: Observable<LatLng>;

  selectOptionValues: { display: string, value: TimeTarget }[] = [
    { display: 'Depart at', value: 'DEPART_AT'},
    { display: 'Arrive by', value: 'ARRIVE_BY'}
  ];

  constructor(
    public router: Router,
    public store: Store<State>) {

    this.originLatLng = store.select(selectSearchOriginLatLng);
    this.originAddress = store.select(selectSearchOriginAddress);
    this.destinationLatLng = store.select(selectSearchDestinationLatLng);
    this.destinationAddress = store.select(selectSearchDestinationAddress);
    this.searchQueryFetching = store.select(selectSearchQueryFetching);
    this.rentalButtonDisabled = store.select(selectSearchButtonDisabled);
    this.showSpinner = store.select(selectSearchShowSpinner);
    this.stations = store.select(selectStations);
    this.position = store.select(selectPosition);

    this.timeString = store
      .select(state => state.search.time)
      .pipe(
        map(time => time.toString())
      );
  }

  async ngOnInit() {
    this.store.dispatch(fetchAllStations());
    this.store.dispatch(fetchGeolocation());
  }

  ionViewDidEnter() {
    this.store.dispatch(activeSearchTrue());
  }

  ionViewDidLeave() {
    this.store.dispatch(activeSearchFalse());
  }

  navigateToAddressInput(addressType: SearchAddressType) {
    this.router.navigate(['address-input']);
    this.store.dispatch(setSearchAddressType({ addressType }));
  }

  timeTargetChange(e) {
    this.store.dispatch(changeTimeTarget({ timeTarget: e.target.value.value} ));
  }

  timeChange(e) {
    this.store.dispatch(changeTime({ time: new Date(e.target.value) }));
  }

  findBikeRentals() {
    this.store.dispatch(searchQuery());
  }
}
