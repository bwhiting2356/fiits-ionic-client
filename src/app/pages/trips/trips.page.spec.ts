import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TripsPage } from './trips.page';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../reducers';

describe('TripsPage', () => {
  let component: TripsPage;
  let fixture: ComponentFixture<TripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            url: 'trips/upcoming'
          }
        },
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the current time direction capitalized', () => {
    expect(component.timeDirectionCapitalized).toBe('Upcoming');
  });
});
