import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { mockTrips } from '../../trips/mock-trips';
import { TripCardComponent } from './trip-card.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripCardComponent ],
      imports: [ PipesModule ],
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

  it('should calculate the total duration', () => {
    component.trip = mockTrips[0];
    const duration = component.totalDuration;
    expect(duration).toBe(10763);
  });

  it('should calculate the total distance', () => {
    component.trip = mockTrips[0];
    const duration = component.totalDistance;
    expect(duration).toBe(15632);
  });

  it('should calculate the total price', () => {
    component.trip = mockTrips[0];
    const duration = component.totalPrice;
    expect(duration).toBe(0.3);
  });

  it('should render date and departure/arrival times', () => {
    expect(fixture.debugElement.query(By.css('.date-time'))
      .nativeElement.innerText).toBe('12/18 1:00 PM - 1:01 PM');;
  });

  it('should render the total price', () => {
    expect(fixture.debugElement.query(By.css('.price'))
      .nativeElement.innerText).toBe('$0.30');
  });

  it('should render miles and minutes', () => {
    expect(fixture.debugElement.query(By.css('.miles-minutes'))
      .nativeElement.innerText).toBe('2 mi • 2 h');
  });

  xit('should render the trips status', () => {
    // TODO: make this real when I have real statuses
    expect(fixture.debugElement.query(By.css('.title'))
      .nativeElement.innerText).toBe('Completed Trip');
  });
});
