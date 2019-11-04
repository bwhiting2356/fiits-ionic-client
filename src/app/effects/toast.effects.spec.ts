import { Observable } from 'rxjs';
import { ToastEffects } from './toast.effects';
import { TestBed, inject } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';
import { FetchAllStationsError, TripSearchQueryError, GeocodeError, AutocompleteResultsError } from '../actions/search.actions';
import { FeedbackError, FeedbackSuccess } from '../actions/feedback.actions';

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
                position: 'bottom',
                color: 'danger'
            });
            expect(mockToast.present).toHaveBeenCalled();
      }));


    it('should call presentToast with the message \'Error fetching station info\'', async () => {
        const action = new FetchAllStationsError('oops');
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.fetchingStationError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching station info', 'danger');
    });

    it('should call presentToast with the specific message', async () => {
        const action = new TripSearchQueryError({ error: { message: 'Stations too far apart' }});
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.searchQueryError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Stations too far apart', 'danger');
    });

    it('should call presentToast with a generic message', async () => {
        const action = new TripSearchQueryError('oops');
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.searchQueryError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching trip info', 'danger');
    });

    it('should call presentToast with the message \'Error fetching location coordinates\'', async () => {
        const action = new GeocodeError('oops');
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.geocodeError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching location coordinates', 'danger');
    });

    it('should call presentToast with the message \'Error fetching locations\'', async () => {
        const action = new AutocompleteResultsError('oops');
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.autocompleteError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error fetching locations', 'danger');
    });

    it('should call presentToast with the message \'Error sending feedback\'', async () => {
        const action = new FeedbackError('oops');
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.feedbackError$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Error sending feedback', 'danger');
    });

    it('should call presentToast with the message \'Feedback sent successfully!\'', async () => {
        const action = new FeedbackSuccess();
        spyOn(effects, 'presentToast');

        actions$ = hot('--a-', { a: action });

        expect(effects.feedbackSuccess$).toBeObservable(actions$);
        expect(effects.presentToast).toHaveBeenCalledWith('Feedback sent successfully!', 'success');
    });
});
