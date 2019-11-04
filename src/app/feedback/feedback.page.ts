import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { SendFeedback, ChangeComment } from '../actions/feedback.actions';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage {
  disableSend: Observable<boolean>;
  feedbackPosting: Observable<boolean>;
  comment: Observable<string>;
  // comment$ = new BehaviorSubject('');

  constructor(private store: Store<State>) {
    this.feedbackPosting = store.select(state => state.feedback.feedbackPosting);
    this.comment = store.select(state => state.feedback.comment);

    this.disableSend = combineLatest([
      this.feedbackPosting,
      this.comment
    ]).pipe(
       map(([feedbackPosting, comment]) => feedbackPosting || !comment)
    );
  }

  changeComment(comment: string) {
    this.store.dispatch(new ChangeComment(comment));
  }

  sendFeedback() {
    this.comment.pipe(
      take(1)
    ).subscribe(comment => {
      this.store.dispatch(new SendFeedback({ comment }));
    });
  }
}
