import { Action } from '@ngrx/store';
import { Feedback } from '../shared/feedback.model';

export enum FeedbackActionTypes {
    ChangeComment = '[Feedback] Change Comment',
    FeedbackError = '[Feedback] Feedback Error',
    FeedbackSuccess = '[Feedback] Feedback Success',
    SendFeedback = '[Feedback] Send Feedback'
}

export class ChangeComment implements Action {
    readonly type = FeedbackActionTypes.ChangeComment;
    constructor(public comment: string) {}
}

export class FeedbackError implements Action {
    readonly type = FeedbackActionTypes.FeedbackError;
    constructor(public error: any) {}
}

export class FeedbackSuccess implements Action {
    readonly type = FeedbackActionTypes.FeedbackSuccess;
}


export class SendFeedback implements Action {
    readonly type = FeedbackActionTypes.SendFeedback;
    constructor(public feedback: Feedback) {}
}

export type FeedbackActions = ChangeComment
                    | SendFeedback
                    | FeedbackError
                    | FeedbackSuccess;
