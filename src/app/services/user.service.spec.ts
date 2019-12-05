import { UserService } from './user.service';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { initialUserState } from '../reducers/user.reducer';

describe('UserService', () => {
    let store: MockStore<State>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            UserService,
            { provide: AngularFireAuth, useValue: {} },
            provideMockStore({ initialState })
            ]
        })
        .compileComponents();
        store = TestBed.get<Store<State>>(Store);
    }));

    it('should be created', () => {
        const service: UserService = TestBed.get(UserService);
        expect(service).toBeTruthy();
    });

    it('should return true if the user is logged in', async () => {
        const service: UserService = TestBed.get(UserService);
        store.setState({
            ...initialState,
            user: {
                ...initialUserState,
                uid: 'authenticated-user'
            }
        });
        service.isLoggedIn$().subscribe(result => expect(result).toBeTruthy());
    });

    it('should return false if the user is logged in', async () => {
        const service: UserService = TestBed.get(UserService);
        store.setState({
            ...initialState,
            user: {
                ...initialUserState,
                uid: ''
            }
        });
        service.isLoggedIn$().subscribe(result => expect(result).toBeFalsy());
    });
});
