import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';


import { FeedbackPage } from './feedback.page';
import { initialState } from '../reducers';
import { State } from '../reducers';
import { SendFeedback, ChangeComment } from '../actions/feedback.actions';
import { initialFeedbackState } from '../reducers/feedback.reducer';

describe('FeedbackPage', () => {
  let component: FeedbackPage;
  let fixture: ComponentFixture<FeedbackPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set disableSend to true if the comment is an empty string', () => {
    store.setState({
      ...initialState,
      feedback: {
        ...initialFeedbackState,
        feedbackPosting: false,
        comment: ''
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.disableSend).toBeObservable(expected);

  });

  it('should set disableSend to true if feedback is currently posting', () => {
    store.setState({
      ...initialState,
      feedback: {
        ...initialFeedbackState,
        comment: 'cool app',
        feedbackPosting: true
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.disableSend).toBeObservable(expected);
  });

  it('should set disableSend to false if feedback is not posting and there is a comment value', () => {
    store.setState({
      ...initialState,
      feedback: {
        ...initialFeedbackState,
        comment: 'cool app',
        feedbackPosting: false
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.disableSend).toBeObservable(expected);
  });

  it('should disable the send button if disableSend is true', () => {
    component.disableSend = of(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-button')).nativeElement.disabled).toBeTruthy();
  });

  it('should not disable the send button if disableSend is false', () => {
    component.disableSend = of(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-button')).nativeElement.disabled).toBeFalsy();
  });

  it('should call the sendFeedback method when they click the send feedback button', () => {
    spyOn(component, 'sendFeedback');
    const button = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    button.click();
    fixture.detectChanges();
    expect(component.sendFeedback).toHaveBeenCalled();
  });

  it('should dispatch send feedback when the sendFeedback method is called', () => {
    store.setState({
      ...initialState,
      feedback: {
        ...initialFeedbackState,
        comment: 'cool app',
        feedbackPosting: false
      }
    });
    spyOn(store, 'dispatch');
    fixture.detectChanges();
    component.sendFeedback();
    expect(store.dispatch).toHaveBeenCalledWith(new SendFeedback({ comment: 'cool app' }));
  });

  it('should disable the textarea if feedback is currently posting', () => {
    component.feedbackPosting = of(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-textarea')).nativeElement.disabled).toBeTruthy();
  });

  it('should not disable the textarea if feedback is currently not posting', () => {
    component.feedbackPosting = of(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ion-textarea')).nativeElement.disabled).toBeFalsy();
  });

  it('should call changeComment when the user changes their comment in the textarea', () => {
    spyOn(component, 'changeComment');
    const textarea = fixture.debugElement.query(By.css('ion-textarea'));
    textarea.triggerEventHandler('keyup', { target: { value: 'cool app'} });
    expect(component.changeComment).toHaveBeenCalledWith('cool app');
  });

  it('should dispatch ChangeComment when changeComment is called', () => {
    spyOn(store, 'dispatch')
    component.changeComment('cool app');
    expect(store.dispatch).toHaveBeenCalledWith(new ChangeComment('cool app'));
  });
});
