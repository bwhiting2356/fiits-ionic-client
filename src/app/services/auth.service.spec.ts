import { AuthService } from './auth.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { mock } from 'ts-mockito';

describe('AuthService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            AuthService,
            {
                provide: AngularFireAuth,
                useValue: {
                    auth: {
                        createUserWithEmailAndPassword: () => {},
                        signInWithEmailAndPassword: () => {}
                    }
                }
            }
          ]
        })
        .compileComponents();
    }));

    it('should be created', () => {
        const service: AuthService = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });

    it('should sign up with email and password', inject(
        [AngularFireAuth, AuthService],
        async (firebaseAuth: AngularFireAuth, authService: AuthService) => {
            const mockCredentials = mock<firebase.auth.UserCredential>();
            spyOn(firebaseAuth.auth, 'createUserWithEmailAndPassword')
                .and.returnValue(Promise.resolve(mockCredentials));

            const result = authService.emailSignUp$('test@test.com', 'secret-password');

            result.subscribe(credentials => {
                expect(credentials).toEqual(mockCredentials);
            });
            expect(firebaseAuth.auth.createUserWithEmailAndPassword)
                .toHaveBeenCalledWith('test@test.com', 'secret-password');
        }
    ));

    it('should log in with email and password', inject(
        [AngularFireAuth, AuthService],
        async (firebaseAuth: AngularFireAuth, authService: AuthService) => {
            const mockCredentials = mock<firebase.auth.UserCredential>();
            spyOn(firebaseAuth.auth, 'signInWithEmailAndPassword')
                .and.returnValue(Promise.resolve(mockCredentials));

            const result = authService.emailLogin$('test@test.com', 'secret-password');

            result.subscribe(credentials => {
                expect(credentials).toEqual(mockCredentials);
            });
            expect(firebaseAuth.auth.signInWithEmailAndPassword)
                .toHaveBeenCalledWith('test@test.com', 'secret-password');
        }
    ));

});
