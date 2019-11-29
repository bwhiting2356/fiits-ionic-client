import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { LatLng } from '../shared/latlng.model';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  SetSearchAddressType,
  SearchAddressType,
  ChangeTimeTarget,
  ChangeTime,
  TripSearchQuery,
  FetchAllStations,
  FetchGeolocation,
  TimeInPastError,
  ActiveSearchTrue,
  ActiveSearchFalse
} from '../actions/search.actions';
import { TimeTarget } from '../shared/time-target';
import { SearchQuery } from '../shared/search-query';
import { StationInfo } from '../shared/trip.model';
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
    this.store.dispatch(new FetchAllStations());
    this.store.dispatch(new FetchGeolocation());
  }

  ionViewDidEnter() {
    this.store.dispatch(new ActiveSearchTrue());
  }

  ionViewDidLeave() {
    this.store.dispatch(new ActiveSearchFalse());
  }

  navigateToAddressInput(type: SearchAddressType) {
    this.router.navigate(['address-input']);
    this.store.dispatch(new SetSearchAddressType(type));
  }

  timeTargetChange(e) {
    this.store.dispatch(new ChangeTimeTarget(e.target.value.value));
  }

  timeChange(e) {
    this.store.dispatch(new ChangeTime(new Date(e.target.value)));
  }

  findBikeRentals() {
    this.store.pipe(
      take(1),
      map(state => state.search),
      map(search => {
        const searchQuery: SearchQuery = {
          timeTarget: search.timeTarget,
          time: search.time,
          originAddress: search.originAddress,
          originLatLng: search.originLatLng,
          destinationAddress: search.destinationAddress,
          destinationLatLng: search.destinationLatLng
        };
        return searchQuery;
      })
    ).subscribe(searchQuery => {
      const twoMinutesAgo = new Date(Date.now() - 1000 * 60 * 2);
      if (searchQuery.time < twoMinutesAgo) {
        this.store.dispatch(new TimeInPastError());
      } else {
        this.store.dispatch(new TripSearchQuery(searchQuery));
      }
    });
  }
}
