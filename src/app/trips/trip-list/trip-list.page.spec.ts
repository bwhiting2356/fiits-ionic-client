import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, inject } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { TripListPage } from './trip-list.page';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';

import { of } from 'rxjs';
import { mockTrips } from 'src/testing/mock-trips';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../../reducers';
import { Store } from '@ngrx/store';
import { initialUserState } from 'src/app/reducers/user.reducer';

describe('TripListPage trip list', () => {
  let component: TripListPage;
  let fixture: ComponentFixture<TripListPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            url: 'trips/past'
          }
        },
        {
          provide: TripService,
          useValue: {
            getTrips: () => {},
            getFilteredTrips: () => of(mockTrips)
          }
        },
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the current time direction capitalized', () => {
    expect(component.timeDirection).toBe('Past');
  });

  it('should render list of trips', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        trips: mockTrips
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-text'))).toBeFalsy();
    expect(fixture.debugElement.queryAll(By.css('app-trip-card')).length).toBe(4);
  });
});

describe('TripListPage no trips', () => {
  let component: TripListPage;
  let fixture: ComponentFixture<TripListPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            url: 'trips/upcoming'
          }
        },
        {
          provide: TripService,
          useValue: {
            getTrips: () => {},
            getFilteredTrips: () => of([])
          }
        },
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render "no trips" if no trips are provided, is not fetching', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        tripsFetching: false,
        trips: []
      }
    });
    expect(fixture.debugElement.query(By.css('ion-text')).nativeElement.innerText).toBe('No trips');
    expect(fixture.debugElement.queryAll(By.css('app-trip-card')).length).toBe(0);
  });

  it('should render spinner trips are fetching', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        tripsFetching: true,
        trips: []
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#fetching'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('ion-text'))).toBeFalsy();
    expect(fixture.debugElement.queryAll(By.css('app-trip-card')).length).toBe(0);
  });
});
