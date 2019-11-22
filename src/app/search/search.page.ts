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
  FetchGeolocation
} from '../actions/search.actions';
import { TimeTarget } from '../shared/time-target';
import { SearchQuery } from '../shared/search-query';
import { StationInfo } from '../shared/trip.model';

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
    this.originLatLng = store
      .select(state => state.search.originLatLng);

    this.originAddress = store
      .select(state => state.search.originAddress);

    this.destinationLatLng = store
      .select(state => state.search.destinationLatLng);

    this.destinationAddress = store
      .select(state => state.search.destinationAddress);

    this.searchQueryFetching = store
      .select(state => state.search.searchQueryFetching);

    this.rentalButtonDisabled = combineLatest([
      this.originLatLng,
      this.destinationLatLng,
      this.searchQueryFetching
    ]).pipe(
      map(([origin, destination, searchQueryFetching]) =>  {
        return !origin || !destination || searchQueryFetching;
      })
    );

    this.showSpinner = combineLatest([
      this.searchQueryFetching,
      store.select(state => state.search.geocodeFetching),
      store.select(state => state.search.stationsFetching),
    ]).pipe(
      map(([searchQueryFetching, geocodeFetching, stationsFetching]) => {
        return searchQueryFetching || geocodeFetching || stationsFetching;
      })
    );

    this.timeString = store
      .select(state => state.search.time)
      .pipe(
        map(time => time.toString())
      );

    this.stations = store
        .select(state => state.search.stations);

    this.position = store
        .select(state => state.search.position);
  }

  async ngOnInit() {
    this.store.dispatch(new FetchAllStations());
    this.store.dispatch(new FetchGeolocation());
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
      this.store.dispatch(new TripSearchQuery(searchQuery));
    });
  }
}
