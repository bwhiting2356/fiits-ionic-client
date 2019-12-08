import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { LogIn, SignUp, ChangeEmail, ChangePassword } from '../actions/user.actions';
import { Observable, combineLatest } from 'rxjs';
import { selectEmail, selectPassword } from '../reducers/user.reducer';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInPage {
  email: Observable<string>;
  password: Observable<string>;

  constructor(private store: Store<State>) {
    this.email = store.select(selectEmail);
    this.password = store.select(selectPassword);
  }

  changeEmail(newValue: string) {
    this.store.dispatch(new ChangeEmail(newValue));
  }

  changePassword(newValue: string) {
    this.store.dispatch(new ChangePassword(newValue));
  }

  logIn() {
    this.store.dispatch(new LogIn());
  }

  signUp() {
    this.store.dispatch(new SignUp());
  }

}
