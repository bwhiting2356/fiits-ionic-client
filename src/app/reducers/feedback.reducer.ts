import { createFeatureSelector, createSelector, createReducer, on, Action } from '@ngrx/store';
import { State } from '.';
import { changeComment, feedbackError, feedbackSuccess, sendFeedback } from '../actions/feedback.actions';

export interface FeedbackState {
    feedbackPosting: boolean;
    comment: string;
    error: any;
}

export const initialFeedbackState: FeedbackState = {
    feedbackPosting: false,
    comment: '',
    error: undefined
};

const selectFeedback = createFeatureSelector<State, FeedbackState>('feedback');

export const selectFeedbackPosting = createSelector(
    selectFeedback,
    state => state.feedbackPosting);

export const selectFeedbackComment = createSelector(
    selectFeedback,
    state => state.comment);

export const selectFeedbackDisableSend = createSelector(
    selectFeedbackPosting,
    selectFeedbackComment,
    (feedbackPosting, comment) => feedbackPosting || !comment
);

const feedbackReducer = createReducer(
    initialFeedbackState,
    on(changeComment, (state, { comment }) => ({ ...state, comment })),
    on(feedbackError, (state, { error }) => ({ ...state, feedbackPosting: false, error })),
    on(feedbackSuccess, state => ({ ...state, feedbackPosting: false, comment: '' })),
    on(sendFeedback, (state) => ({ ...state, feedbackPosting: true }))
);

export function reducer(state: FeedbackState | undefined, action: Action) {
    return feedbackReducer(state, action);
}
