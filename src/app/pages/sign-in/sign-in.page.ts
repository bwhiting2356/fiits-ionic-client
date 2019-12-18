import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { logIn, signUp, changeEmail, changePassword } from '../../actions/user.actions';
import { Observable, combineLatest } from 'rxjs';
import { selectEmail, selectPassword, selectAuthFetching } from '../../reducers/user.reducer';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInPage {
  email: Observable<string>;
  password: Observable<string>;
  authFetching: Observable<boolean>;
  showMenu: Observable<boolean>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store<State>) {
    this.email = store.select(selectEmail);
    this.password = store.select(selectPassword);
    this.authFetching = store.select(selectAuthFetching);
    this.showMenu = activatedRoute.params.pipe(
      map(params => params.context === 'from-menu')
    );
  }

  changeEmail(email: string) {
    this.store.dispatch(changeEmail({ email }));
  }

  changePassword(password: string) {
    this.store.dispatch(changePassword({ password }));
  }

  logIn() {
    this.store.dispatch(logIn());
  }

  signUp() {
    this.store.dispatch(signUp());
  }
}
