import { AuthService } from './auth.service';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';

describe('AuthService', () => {
    let store: MockStore<State>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            AuthService,
            { provide: AngularFireAuth, useValue: {} },
            provideMockStore({ initialState })
            ]
        })
        .compileComponents();
        store = TestBed.get<Store<State>>(Store);
    }));

    it('should be created', () => {
        const service: AuthService = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });

});
