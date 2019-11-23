import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { SendFeedback, ChangeComment } from '../actions/feedback.actions';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectFeedbackPosting, selectFeedbackComment, selectFeedbackDisableSend } from '../reducers/feedback.reducer';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage {
  disableSend: Observable<boolean>;
  feedbackPosting: Observable<boolean>;
  comment: Observable<string>;

  constructor(private store: Store<State>) {
    this.feedbackPosting = store.select(selectFeedbackPosting);
    this.comment = store.select(selectFeedbackComment);
    this.disableSend = store.select(selectFeedbackDisableSend);
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
