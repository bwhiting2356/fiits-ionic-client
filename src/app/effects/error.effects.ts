import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { Observable } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ErrorEffects {

    @Effect({ dispatch: false })
    fetchingStationError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.FetchAllStationsError),
        tap(_ => this.presentToast('Error fetching station info'))
    );

    @Effect({ dispatch: false })
    searchQueryError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.TripSearchQueryError),
        tap(action => this.presentToast(action.error.error ? action.error.error.message : 'Error fetching trip info'))
    );

    @Effect({ dispatch: false })
    geocodeError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.GeocodeError),
        tap(_ => this.presentToast('Error fetching location coordinates'))
    );

    @Effect({ dispatch: false })
    autocompleteError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.AutocompleteResultsError),
        tap(_ => this.presentToast('Error fetching locations'))
    );

    async presentToast(message) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 5000,
            position: 'bottom',
            color: 'danger',
        });
        toast.present();
    }
    constructor(
        private toastCtrl: ToastController,
        private actions$: Actions<SearchActions>) {}
}
