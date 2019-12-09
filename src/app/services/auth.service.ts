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
    constructor(private firebaseAuth: AngularFireAuth) {}

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
