import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { from, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private firebaseAuth: AngularFireAuth) {}

    async login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.firebaseAuth.auth.signInWithPopup(provider);
        return result.user.uid;
    }

    login$() {
        return from(this.login());
    }
}
