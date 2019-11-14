import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, inject } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { TripListPage } from './trip-list.page';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';

import { of } from 'rxjs';
import { mockTrips } from 'src/testing/mock-trips';

describe('TripListPage trip list', () => {
  let component: TripListPage;
  let fixture: ComponentFixture<TripListPage>;

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
            getFilteredTrips: () => of(mockTrips)
          }
        }
      ]
    })
    .compileComponents();
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
    expect(component.timeDirection).toBe('Upcoming');
  });

  it('should render list of trips', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-text'))).toBeFalsy();
    expect(fixture.debugElement.queryAll(By.css('app-trip-card')).length).toBe(4);
  });
});

describe('TripListPage no trips', () => {
  let component: TripListPage;
  let fixture: ComponentFixture<TripListPage>;

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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render "no trips" if no trips are provided', () => {
    expect(fixture.debugElement.query(By.css('ion-text')).nativeElement.innerText).toBe('No trips');
    expect(fixture.debugElement.queryAll(By.css('app-trip-card')).length).toBe(0);
  });
});
