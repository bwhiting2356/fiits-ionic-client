import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { FeedbackActions, FeedbackActionTypes } from '../actions/feedback.actions';
import { AutocompleteActions, AutocompleteActionTypes } from '../actions/autocomplete.actions';
import { UserActionTypes, UserActions } from '../actions/user.actions';

@Injectable()
export class ToastEffects {

    @Effect({ dispatch: false })
    fetchingStationError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.FetchAllStationsError),
        tap(_ => this.presentToast('Error fetching station info', 'danger'))
    );

    @Effect({ dispatch: false })
    searchQueryError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.TripSearchQueryError),
        tap(action => this.presentToast(
            action.error.error && action.error.error.message
                ? action.error.error.message
                : 'Error fetching trip info',
            'danger'
        ))
    );

    @Effect({ dispatch: false })
    geocodeError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.GeocodeError),
        tap(_ => this.presentToast('Error fetching location coordinates', 'danger'))
    );

    @Effect({ dispatch: false })
    autocompleteError$: Observable<any> = this.actions$.pipe(
        ofType(AutocompleteActionTypes. Error),
        tap(_ => this.presentToast('Error fetching locations', 'danger'))
    );

    @Effect({ dispatch: false })
    feedbackError$: Observable<any> = this.actions$.pipe(
        ofType(FeedbackActionTypes.FeedbackError),
        tap(_ => this.presentToast('Error sending feedback', 'danger'))
    );

    @Effect({ dispatch: false })
    bookTripError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.BookTripFailure),
        tap(action => this.presentToast(
            action.error.error && action.error.error.message
                ? action.error.error.message
                : 'Error booking trip',
            'danger'
        ))
    );

    @Effect({ dispatch: false })
    bookTripSuccess$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.BookTripSuccess),
        tap(_ => this.presentToast('Trip booked successfully!', 'success'))
    );

    @Effect({ dispatch: false })
    timeInPastError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.TimeInPastError),
        tap(_ => this.presentToast('Time cannot be in the past.', 'danger'))
    );

    @Effect({ dispatch: false })
    feedbackSuccess$: Observable<any> = this.actions$.pipe(
        ofType(FeedbackActionTypes.FeedbackSuccess),
        tap(_ => this.presentToast('Feedback sent successfully!', 'success'))
    );

    @Effect({ dispatch: false })
    loginSuccess$: Observable<any> = this.actions$.pipe(
        ofType(UserActionTypes.LogInSuccess),
        tap(_ => this.presentToast('Logged in successfully!', 'success'))
    );

    @Effect({ dispatch: false })
    loginError$: Observable<any> = this.actions$.pipe(
        ofType(UserActionTypes.LogInError),
        tap(action => this.presentToast(
            action.error.message
                ? action.error.message
                : 'Error logging in',
            'danger'
        ))
    );

    @Effect({ dispatch: false })
    signupError$: Observable<any> = this.actions$.pipe(
        ofType(UserActionTypes.SignUpError),
        tap(action => this.presentToast(
            action.error.message
                ? action.error.message
                : 'Error signing up',
            'danger'
        ))
    );

    @Effect({ dispatch: false })
    signupSuccess$: Observable<any> = this.actions$.pipe(
        ofType(UserActionTypes.SignUpSuccess),
        tap(_ => this.presentToast('Signed up successfully!', 'success'))
    );

    @Effect({ dispatch: false })
    logOut$: Observable<any> = this.actions$.pipe(
        ofType(UserActionTypes.LogOut),
        tap(_ => this.presentToast('Logged out successfully!', 'success'))
    );

    async presentToast(message, color) {
        const toast = await this.toastCtrl.create({
            message,
            color,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
    constructor(
        private toastCtrl: ToastController,
        private actions$: Actions<SearchActions | FeedbackActions | AutocompleteActions | UserActions>) {}
}
