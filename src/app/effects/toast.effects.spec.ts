import { Observable } from 'rxjs';
import { ToastEffects } from './toast.effects';
import { TestBed, inject } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';
import {
    fetchAllStationsError,
    searchQueryError,
    geocodeError,
    bookTripSuccess,
    bookTripFailure,
    timeInPastError
} from '../actions/search.actions';
import {
    autocompleteError
} from '../actions/autocomplete.actions';
import { feedbackError, feedbackSuccess } from '../actions/feedback.actions';
import { logInSuccess, signUpSuccess, logInError, signUpError, logOut } from '../actions/user.actions';

describe('Toast Effects ', () => {
    let actions$: Observable<any>;
    let effects: ToastEffects;
    let toastCtrl: ToastController;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            provideMockActions(() => actions$),
            ToastEffects,
            ToastController
          ]
        });

        effects = TestBed.get<ToastEffects>(ToastEffects);
        toastCtrl = TestBed.get<ToastController>(ToastController);
    });

    it('should create a toast and present it', inject(
        [ToastController, ToastEffects],
        async (toastController: ToastController, toastEffects: ToastEffects) => {
            const mockToast = { present: () => {}} as HTMLIonToastElement;
            spyOn(mockToast, 'present');
            spyOn(toastController, 'create').and.returnValue(Promise.resolve(mockToast));
            await toastEffects.presentToast('Error fetching station info', 'danger');
            expect(toastController.create).toHaveBeenCalledWith({
                message: 'Error fetching station info',
                duration: 5000,
                position: 'top',
                color: 'danger',
                buttons: [
                    {
                        text: 'OK',
                        role: 'cancel'
                    }
                ]
            });
            expect(mockToast.present).toHaveBeenCalled();
      }));


    it('should call presentToast with the message \'Error fetching station info\'', async () => {
        const action = fetchAllStationsError({ error: 'oops' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.fetchingStationError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching station info', 'danger');
    });

    it('should call presentToast with the message \'Error booking trip\'', async () => {
        const action = bookTripFailure({ error: 'oops' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.bookTripError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error booking trip', 'danger');
    });

    it('should call presentToast with the message \'Custom error message\'', async () => {
        const action = bookTripFailure({ error: { error: { message: 'Custom error message' }}});
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.bookTripError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Custom error message', 'danger');
    });

    it('should call presentToast with the specific message', async () => {
        const action = searchQueryError({ error: { error: { message: 'Stations too far apart' }}});
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.searchQueryError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Stations too far apart', 'danger');
    });

    it('should call presentToast with a generic message', async () => {
        const action = searchQueryError({ error: 'oops' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.searchQueryError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching trip info', 'danger');
    });

    it('should call presentToast with the message \'Error fetching location coordinates\'', async () => {
        const action = geocodeError({ error: 'oops' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.geocodeError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching location coordinates', 'danger');
    });

    it('should call presentToast with the message \'Error fetching locations\'', async () => {
        const action = autocompleteError({ error: 'oops'});
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.autocompleteError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching locations', 'danger');
    });

    it('should call presentToast with the message \'Error sending feedback\'', async () => {
        const action = feedbackError({ error: 'oops'});
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.feedbackError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error sending feedback', 'danger');
    });

    it('should call presentToast with the message \'Feedback sent successfully!\'', async () => {
        const action = feedbackSuccess();
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.feedbackSuccess$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Feedback sent successfully!', 'success');
    });

    it('should call presentToast with the message \'Logged in successfully!\'', () => {
        const action = logInSuccess({ uid: 'mock-uid' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.loginSuccess$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Logged in successfully!', 'success');
    });

    it('should call presentToast with the message \'Signed up successfully!\'', () => {
        const action = signUpSuccess({ uid: 'mock-uid' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.signupSuccess$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Signed up successfully!', 'success');
    });

    it('should call presentToast with the message \'Error logging in\'', async () => {
        const action = logInError({ error: 'oops' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.loginError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error logging in', 'danger');
    });

    it('should call presentToast with the message \'Error signing up\'', async () => {
        const action = signUpError({ error: 'oops' });
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.signupError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error signing up', 'danger');
    });

    it('should call presentToast with the message \'Trip booked successfully!\'', async () => {
        const action = bookTripSuccess();
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.bookTripSuccess$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Trip booked successfully!', 'success');
    });

    it('should call presentToast with the message \'Logged out successfully!\'', async () => {
        const action = logOut();
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.logOut$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Logged out successfully!', 'success');

    });

    it('should call presentToast with the message \'Time cannot be in the past.\'', () => {
        const action = timeInPastError();
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.timeInPastError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Time cannot be in the past.', 'danger');
    });
});

