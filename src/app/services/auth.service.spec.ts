import { AuthService } from './auth.service';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { initialAuthState } from '../reducers/auth.reducer';

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

    it('should return true if the user is logged in', async () => {
        const service: AuthService = TestBed.get(AuthService);
        store.setState({
            ...initialState,
            auth: {
                ...initialAuthState,
                uid: 'authenticated-user'
            }
        });
        service.isLoggedIn$().subscribe(result => expect(result).toBeTruthy());
    });

    it('should return false if the user is logged in', async () => {
        const service: AuthService = TestBed.get(AuthService);
        store.setState({
            ...initialState,
            auth: {
                ...initialAuthState,
                uid: ''
            }
        });
        service.isLoggedIn$().subscribe(result => expect(result).toBeFalsy());
    });
});
