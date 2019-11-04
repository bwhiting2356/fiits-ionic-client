import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // { title: 'Search', icon: 'search', component: SearchPage }
  public appPages = [
    {
      title: 'Search',
      url: '/search',
      icon: 'search'
    },
    {
      title: 'Trips',
      url: '/trips',
      icon: 'bicycle',
    },
    {
      title: 'Sign In',
      url: '/sign-in',
      icon: 'person',
    },
    {
      title: 'Payments',
      url: '/payments',
      icon: 'card',
    },
    {
      title: 'Feedback',
      url: '/feedback',
      icon: 'bulb'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
