import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent, commonPages, loggedInPages, loggedOutPages } from './app.component';
import { initialState, State } from './reducers';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { initialUserState } from './reducers/user.reducer';
import { LogOut } from './actions/user.actions';

describe('AppComponent: user logged in', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore<State>;

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        provideMockStore({ initialState })
      ],
      imports: [ RouterTestingModule.withRoutes([])],
    }).compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  it('if the user is logged in, app pages should include /payments and /trips', async () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        uid: 'mock-uid'
      }
    });

    fixture.detectChanges();

    component.appPages.subscribe(pages => {
      expect(pages).toEqual([ ...commonPages, ...loggedInPages ]);
    });
  });

  it('if the user is not logged in, app pages should not include /payments and /trips', async () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        uid: ''
      }
    });

    fixture.detectChanges();

    component.appPages.subscribe(pages => {
      expect(pages).toEqual([ ...commonPages, ...loggedOutPages ]);
    });
  });

  it('should dispatch an action to log out when the logout menu item is clicked', () => {
    spyOn(store, 'dispatch');
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        uid: 'mock-uid'
      }
    });

    fixture.detectChanges();

    component.handleClick('Log Out');

    expect(store.dispatch).toHaveBeenCalledWith(new LogOut());
  });
});
