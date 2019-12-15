import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { sendFeedback, changeComment } from '../actions/feedback.actions';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';
import { selectFeedbackPosting, selectFeedbackComment, selectFeedbackDisableSend } from '../reducers/feedback.reducer';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    this.store.dispatch(changeComment({ comment }));
  }

  sendFeedback() {
    this.store.dispatch(sendFeedback());
  }
}
