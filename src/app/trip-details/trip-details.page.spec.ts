import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsPage } from './trip-details.page';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialSearchState } from '../reducers/search.reducer';
import { Store } from '@ngrx/store';

describe('TripDetailPage', () => {
  let component: TripDetailsPage;
  let fixture: ComponentFixture<TripDetailsPage>;
  let store: MockStore<State>;

  const initialState = {
    search: initialSearchState
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title \'Trip Details\'', () => {
    expect(fixture.debugElement
        .query(By.css('ion-title'))
        .nativeElement.innerText)
      .toBe('Trip Details');
  });

  it('should change showMap from false to true when ionViewDidEnter is called', () => {
    expect(component.showMap).toBeFalsy();
    component.ionViewDidEnter();
    expect(component.showMap).toBeTruthy();
  });

  it('should not show the map, should show the placeholder, if showMap is false', async () => {
    component.showMap = false;
    fixture.detectChanges();
    expect(fixture.debugElement
      .query(By.css('app-google-map')))
    .toBeFalsy();

    expect(fixture.debugElement
      .query(By.css('#placeholder')))
    .toBeTruthy();
  });

  it('should show the map, should not show the placeholder, if showMap is false', async () => {
    component.showMap = true;
    fixture.detectChanges();
    expect(fixture.debugElement
      .query(By.css('app-google-map')))
    .toBeTruthy();

    expect(fixture.debugElement
      .query(By.css('#placeholder')))
    .toBeFalsy();
  });
});
