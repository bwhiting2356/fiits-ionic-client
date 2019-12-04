import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { selectUID } from '../reducers/auth.reducer';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private store: Store<State>,
        private firebaseAuth: AngularFireAuth) {}

    async login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.firebaseAuth.auth.signInWithPopup(provider);
        return result.user.uid;
    }

    login$() {
        return from(this.login());
    }

    isLoggedIn$(): Observable<boolean> {
        return this.store.select(selectUID).pipe(map(uid => uid !== ''));
    }
}
