import { props, createAction } from '@ngrx/store';
import { Feedback } from '../shared/feedback.model';

export const changeComment = createAction('[Feedback] Change Comment', props<{comment: string}>());
export const sendFeedback = createAction('[Feedback] Send Feedback', props<{feedback: Feedback}>());
export const feedbackError = createAction('[Feedback] Error', props<{error: any}>());
export const feedbackSuccess = createAction('[Feedback] Success');
