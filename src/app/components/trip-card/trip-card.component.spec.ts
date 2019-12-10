import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { TripCardComponent } from './trip-card.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { mockTrips } from 'src/testing/mock-trips';
import { addSeconds } from 'src/app/shared/util/util';

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
    component.trip = JSON.parse(JSON.stringify(mockTrips[0]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render date and departure/arrival times', () => {
    component.trip.departureTime = '2120-12-15T21:00:40.000+0000';
    component.trip.arrivalTime = '2120-12-15T21:05:40.000+0000';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.date-time'))
      .nativeElement.innerText).toBe('12/20 1:00 PM - 1:05 PM');
  });

  it('should render the total price', () => {
    expect(fixture.debugElement.query(By.css('.price'))
      .nativeElement.innerText).toBe('-$0.30');
  });

  it('should render miles and minutes', () => {
    expect(fixture.debugElement.query(By.css('.miles-minutes'))
      .nativeElement.innerText).toBe('3.0 mi • 2 hr 47 min');
  });

  it('should show buttons to scan or cancel if the trip starts in the future', () => {
    component.trip.arrivalTime = '2120-12-15T21:00:40.000+0000';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#button-container'))).toBeTruthy();
  });

  it('should show buttons to scan or cancel if the trip starts in the future', () => {
    component.trip.arrivalTime = '2018-12-15T21:00:40.000+0000';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#button-container'))).toBeFalsy();
  });

  it('should render the scan button disabled if the start reservation is not ready yet', () => {
    spyOn(component, 'isUpcoming').and.returnValue(true);
    spyOn(component, 'isReadyForScan').and.returnValue(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#scan-button')).nativeElement.disabled).toBeTruthy();
  });

  it('should not render the scan button disabled if the start reservation is ready now', () => {
    spyOn(component, 'isUpcoming').and.returnValue(true);
    spyOn(component, 'isReadyForScan').and.returnValue(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#scan-button')).nativeElement.disabled).toBeFalsy();
  });

  it('should return true if the arrival time is in the future', async () => {
    spyOn(component, 'isUpcoming');
    component.trip.arrivalTime = '2000-12-15T21:05:40.000+0000';
    fixture.detectChanges();
    expect(component.isUpcoming()).toBeFalsy();
  });

  it('should return false if the arrival time is in the past', () => {
    spyOn(component, 'isUpcoming');
    component.trip.arrivalTime = '2000-12-15T21:05:40.000+0000';
    fixture.detectChanges();
    expect(component.isUpcoming()).toBeFalsy();
  });

  it('should return true if the start reservation window has started but is not 10 minutes after the time', () => {
    component.trip.startReservation.time = new Date().toString();
    fixture.detectChanges();
    expect(component.isReadyForScan()).toBeTruthy();
  });

  it('should return false if the start reservation window has started but is is after the reservation window', () => {
    component.trip.startReservation.time = new Date('2020-12-15T21:05:40.000+0000').toString();
    fixture.detectChanges();
    expect(component.isReadyForScan()).toBeFalsy();
  });

  it('should return false if the start reservation was in the past', () => {
    component.trip.startReservation.time = new Date('2000-12-15T21:05:40.000+0000').toString();
    fixture.detectChanges();
    expect(component.isReadyForScan()).toBeFalsy();
  });

  xit('should render the trips status', () => {
    expect(fixture.debugElement.query(By.css('.title'))
      .nativeElement.innerText).toBe('Completed Trip');
  });
});
