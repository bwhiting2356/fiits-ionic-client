import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { TripCardComponent } from './trip-card.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { mockTrips } from 'src/testing/mock-trips';

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TripCardComponent],
      imports: [PipesModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;
    component.trip = mockTrips[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render date and departure/arrival times', () => {
    expect(fixture.debugElement.query(By.css('.date-time'))
      .nativeElement.innerText).toBe('12/18 1:00 PM - 1:01 PM');
  });

  it('should render the total price', () => {
    expect(fixture.debugElement.query(By.css('.price'))
      .nativeElement.innerText).toBe('$0.30');
  });

  it('should render miles and minutes', () => {
    expect(fixture.debugElement.query(By.css('.miles-minutes'))
      .nativeElement.innerText).toBe('3.0 mi • 2 hr 59 min');
  });

  xit('should render the trips status', () => {
    expect(fixture.debugElement.query(By.css('.title'))
      .nativeElement.innerText).toBe('Completed Trip');
  });
});
