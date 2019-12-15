import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SignInPage } from './sign-in.page';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { changePassword, changeEmail, logIn, signUp } from '../actions/user.actions';
import { initialUserState } from '../reducers/user.reducer';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { params: new BehaviorSubject({}) }}
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to change the password value', () => {
    spyOn(store, 'dispatch');
    component.changePassword('new-password');
    expect(store.dispatch).toHaveBeenCalledWith(changePassword({ password: 'new-password' }));
  });

  it('should dispatch an action to change the email value', () => {
    spyOn(store, 'dispatch');
    component.changeEmail('mock@email.com');
    expect(store.dispatch).toHaveBeenCalledWith(changeEmail({ email: 'mock@email.com' }));
  });

  it('should dispatch an action to sign up', () => {
    spyOn(store, 'dispatch');
    component.signUp();
    expect(store.dispatch).toHaveBeenCalledWith(signUp());
  });

  it('should dispatch an action to log in', () => {
    spyOn(store, 'dispatch');
    component.logIn();
    expect(store.dispatch).toHaveBeenCalledWith(logIn());
  });

  it('should render spinner auth are fetching', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        authFetching: true,
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#fetching'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.sign-in-container'))).toBeFalsy();

  });

  it('should not render spinner auth are fetching', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        authFetching: false,
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#fetching'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.sign-in-container'))).toBeTruthy();
  });

  it('should show the menu icon if the navigation context is from-menu', inject(
    [ActivatedRoute],
    async (activatedRoute: ActivatedRoute) => {
      (activatedRoute.params as BehaviorSubject<any>).next({ context: 'from-menu' });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('ion-menu-button'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ion-back-button'))).toBeFalsy();
    }
  ));

  it('should show the menu icon if the navigation context is from-search', inject(
    [ActivatedRoute],
    async (activatedRoute: ActivatedRoute) => {
      (activatedRoute.params as BehaviorSubject<any>).next({ context: 'from-search' });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('ion-menu-button'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('ion-back-button'))).toBeTruthy();
    }
  ));
});
