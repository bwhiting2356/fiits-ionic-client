import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsPage } from './trip-details.page';
import { By } from '@angular/platform-browser';

xdescribe('TripDetailPage', () => {
  let component: TripDetailsPage;
  let fixture: ComponentFixture<TripDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title \'Trip Details\'', () => {
    expect(fixture.debugElement
        .query(By.css('ion-title'))
        .nativeElement.innerText)
      .toBe('Trip Details');
  });
});
