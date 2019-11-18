import { FeedbackActions, FeedbackActionTypes } from '../actions/feedback.actions';

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

export function feedbackReducer(state = initialFeedbackState, action: FeedbackActions): FeedbackState {
    switch (action.type) {
        case FeedbackActionTypes.ChangeComment:
            return {
                ...state,
                comment: action.comment
            };
        case FeedbackActionTypes.FeedbackError:
            return {
                ...state,
                feedbackPosting: false,
                error: action.error
            };
        case FeedbackActionTypes.FeedbackSuccess:
            return {
                ...state,
                comment: '',
                feedbackPosting: false,
            };
        case FeedbackActionTypes.SendFeedback:
            return {
                ...state,
                feedbackPosting: true
            };
        default:
            return state;
    }
}
