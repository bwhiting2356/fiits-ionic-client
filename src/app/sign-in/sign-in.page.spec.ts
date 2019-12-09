import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPage } from './sign-in.page';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { ChangePassword, ChangeEmail } from '../actions/user.actions';
import { initialUserState } from '../reducers/user.reducer';
import { By } from '@angular/platform-browser';

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState })
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
    expect(store.dispatch).toHaveBeenCalledWith(new ChangePassword('new-password'));
  });

  it('should dispatch an action to change the email value', () => {
    spyOn(store, 'dispatch');
    component.changeEmail('mock@email.com');
    expect(store.dispatch).toHaveBeenCalledWith(new ChangeEmail('mock@email.com'));
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
});
