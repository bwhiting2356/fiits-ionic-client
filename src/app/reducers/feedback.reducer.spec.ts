import { initialFeedbackState, reducer as feedbackReducer } from './feedback.reducer';
import { sendFeedback, feedbackSuccess, feedbackError, changeComment } from '../actions/feedback.actions';

describe('Feedback Reducer', () => {
    describe('an unknown action', () => {
      it('should return the previous state', () => {
        const action = {} as any;

        const result = feedbackReducer(initialFeedbackState, action);

        expect(result).toBe(initialFeedbackState);
      });
    });

    describe('feedback actions', () => {
        it('should set feedback posting to true', () => {
            const action = sendFeedback();

            const result = feedbackReducer(initialFeedbackState, action);

            expect(result).toEqual({
                ...initialFeedbackState,
                feedbackPosting: true,
            });
        });

        it('should set feedback posting to false on success, clear comment', () => {
            const initialStateWithPostingTrue = {
                ...initialFeedbackState,
                comment: 'cool app',
                feedbackPosting: true,
            };

            const action = feedbackSuccess();

            const result = feedbackReducer(initialStateWithPostingTrue, action);

            expect(result).toEqual({
                ...initialFeedbackState,
                feedbackPosting: false,
                comment: ''
            });
        });

        it('should set feedback posting to false on error, save error', () => {
            const initialStateWithPostingTrue = {
                ...initialFeedbackState,
                feedbackPosting: true,
            };

            const action = feedbackError({ error: 'oops'});

            const result = feedbackReducer(initialStateWithPostingTrue, action);

            expect(result).toEqual({
                ...initialFeedbackState,
                feedbackPosting: false,
                error: 'oops'
            });
        });

        it('should change the comment', () => {
            const action = changeComment({ comment: 'cool app' });

            const result = feedbackReducer(initialFeedbackState, action);

            expect(result).toEqual({
                ...initialFeedbackState,
                comment: 'cool app'
            });
        });
    });
});
