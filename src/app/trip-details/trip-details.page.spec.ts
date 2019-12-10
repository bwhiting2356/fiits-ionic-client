import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { TripDetailsPage } from './trip-details.page';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialState } from '../reducers';
import { Store } from '@ngrx/store';
import { NavController } from '@ionic/angular';
import { initialUserState } from '../reducers/user.reducer';

describe('TripDetailPage', () => {
  let component: TripDetailsPage;
  let fixture: ComponentFixture<TripDetailsPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: { navigateForward: () => {} }},
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
    spyOn(component.showMap, 'next');
    component.ionViewDidEnter();
    expect(component.showMap.next).toHaveBeenCalledWith(true);
  });

  it('should not show the map, should show the placeholder, if showMap is false', async () => {
    component.showMap.next(false);
    fixture.detectChanges();
    expect(fixture.debugElement
      .query(By.css('app-google-map')))
      .toBeFalsy();

    expect(fixture.debugElement
      .query(By.css('#placeholder')))
      .toBeTruthy();
  });

  it('should show the map, should not show the placeholder, if showMap is false', async () => {
    component.showMap.next(true);
    fixture.detectChanges();
    expect(fixture.debugElement
      .query(By.css('app-google-map')))
      .toBeTruthy();

    expect(fixture.debugElement
      .query(By.css('#placeholder')))
      .toBeFalsy();
  });

  it('should navigate to /sign-in if the user was not logged in', inject(
    [NavController],
    async (navCtrl: NavController) => {
      store.setState({
        ...initialState,
        user: {
          ...initialUserState,
          uid: ''
        }
      });
      spyOn(navCtrl, 'navigateForward');
      fixture.detectChanges();
      component.confirmBooking();
      expect(navCtrl.navigateForward).toHaveBeenCalledWith('/sign-in/from-search');
  }));

  it('should navigate to /confirm-booking if the user was logged in', inject(
    [NavController],
    async (navCtrl: NavController) => {
      store.setState({
        ...initialState,
        user: {
          ...initialUserState,
          uid: 'mock-uid'
        }
      });
      spyOn(navCtrl, 'navigateForward');
      fixture.detectChanges();
      component.confirmBooking();
      expect(navCtrl.navigateForward).toHaveBeenCalledWith('/confirm-booking');
  }));
});
