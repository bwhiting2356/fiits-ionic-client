import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';

describe('AuthService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            AuthService,
            { provide: AngularFireAuth, useValue: {} }
        ]
    }));

    it('should be created', () => {
        const service: AuthService = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });
});
