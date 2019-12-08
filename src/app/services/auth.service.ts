import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';

export class EmailPasswordCredentials {
    email: string;
    password: string;
}

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

    emailSignUp(email: string, password: string) {
        return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    emailSignUp$(email: string, password: string) {
        return from(this.emailSignUp(email, password));
    }

    emailLogin(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    emailLogin$(email: string, password: string) {
        return from(this.emailLogin(email, password));
    }
}
