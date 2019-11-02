import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { Observable } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ErrorEffects {

    @Effect({
        dispatch: false
    })

    fetchingStationError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.FetchAllStationsError),
        tap(_ => this.presentToast('Error fetching station info'))
    );

    searchQueryError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.TripSearchQueryError),
        tap(_ => this.presentToast('Error getting trip info'))
    );

    geocodeError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.GeocodeError),
        tap(_ => this.presentToast('Error fetching location coordinates'))
    );

    autocompleteError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.AutocompleteResultsError),
        tap(_ => this.presentToast('Error fetching locations'))
    );

    async presentToast(message) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000,
            position: 'top'
        });

        toast.present();
    }
    constructor(
        private toastCtrl: ToastController,
        private actions$: Actions<SearchActions>) {}
}
