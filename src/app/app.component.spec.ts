import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { AuthService } from './services/auth.service';

describe('AppComponent: user logged in', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

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
        { provide: AuthService, useValue: { isLoggedIn$: () => of(true)}}
      ],
      imports: [ RouterTestingModule.withRoutes([])],
    }).compileComponents();
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

  it('if the user is logged in, app pages should include /payments and /trips', done => {
    component.appPages.subscribe(pages => {
      expect(pages).toContain({
        title: 'Payments',
        url: '/payments',
        icon: 'card',
      });
      done();
    });
  });

  it('if the user is not logged in, app pages should not include /payments and /trips', async () => {
    component.appPages.subscribe(pages => {
      expect(pages).toContain({
        title: 'Payments',
        url: '/payments',
        icon: 'card',
      });
      expect(pages).toContain({
        title: 'Trips',
        url: '/trips',
        icon: 'bicycle',
      });
    });
  });

});


describe('AppComponent: user not logged in', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

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
        { provide: AuthService, useValue: { isLoggedIn$: () => of(false)}}
      ],
      imports: [ RouterTestingModule.withRoutes([])],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('if the user is not logged in, app pages should not include /payments and /trips', async () => {
    component.appPages.subscribe(pages => {
      expect(pages).not.toContain({
        title: 'Payments',
        url: '/payments',
        icon: 'card',
      });
      expect(pages).not.toContain({
        title: 'Trips',
        url: '/trips',
        icon: 'bicycle',
      });
    });
  });

});
