import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from './reducers';
import { selectLoggedIn } from './reducers/user.reducer';

interface Page {
  title: string;
  url: string;
  icon: string;
}

const basePages: Page[] = [
    {
      title: 'Search',
      url: '/search',
      icon: 'search'
    },
    {
      title: 'Sign In',
      url: '/sign-in',
      icon: 'person',
    },
    {
      title: 'Feedback',
      url: '/feedback',
      icon: 'bulb'
    }
];

const protectedPages: Page[] = [
  {
    title: 'Payments',
    url: '/payments',
    icon: 'card',
  },
  {
    title: 'Trips',
    url: '/trips',
    icon: 'bicycle',
  },

];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public appPages: Observable<Page[]>;

  constructor(
    private store: Store<State>,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.appPages = store.select(selectLoggedIn)
      .pipe(
        map(loggedIn => {
          if (loggedIn) {
            return [...basePages, ...protectedPages ];
          } else {
            return basePages;
          }
        })
      );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
