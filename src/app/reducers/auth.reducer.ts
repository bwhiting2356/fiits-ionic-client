export interface AuthState {
    feedbackPosting: boolean;
    comment: string;
    error: any;
}

export const initialAuthState: AuthState = {
    feedbackPosting: false,
    comment: '',
    error: undefined
};