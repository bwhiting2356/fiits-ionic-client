import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripInfoComponent } from './trip-info.component';
import { mockTrips } from 'src/app/trips/mock-trips';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { By } from '@angular/platform-browser';

describe('TripInfoComponent', () => {
  let component: TripInfoComponent;
  let fixture: ComponentFixture<TripInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TripInfoComponent],
      imports: [PipesModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return the message \'Total earnings\'', async () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(component.priceMessage).toEqual('Total earnings');
  });

  it('should return the message \'Total cost\'', async () => {
    component.trip = mockTrips[3];
    fixture.detectChanges();
    expect(component.priceMessage).toEqual('Total cost');
  });

  it('should render departure time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#departure-time')).nativeElement.innerText).toEqual('1:00 PM');
  });

  it('should render origin address', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#origin-address')).nativeElement.innerText).toEqual('Mock Origin');
  });

  it('should render walking 1 time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#walking-1-time')).nativeElement.innerText).toEqual('Walk 2 hr 41 min');
  });

  it('should render walking 1 distance', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#walking-1-distance')).nativeElement.innerText).toEqual('(2.7 mi)');
  });

  it('should render start reservation time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#start-reservation-time')).nativeElement.innerText).toEqual('1:06 PM');
  });

  it('should render start reservation price', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#start-reservation-price')).nativeElement.innerText).toEqual('$0.75');
  });

  it('should render start reservation station address', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#start-reservation-address')).nativeElement.innerText).toEqual('867 Main Street');
  });

  it('should render bicycling time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#bicycling-time')).nativeElement.innerText).toEqual('Ride 0 min');
  });

  it('should render bicycling distance', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#bicycling-distance')).nativeElement.innerText).toEqual('(0 ft)');
  });

  it('should render bicycling rental price', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#rental-price')).nativeElement.innerText).toEqual('$0.00');
  });

  it('should render walking 2 time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#walking-2-time')).nativeElement.innerText).toEqual('Walk 19 min');
  });

  it('should render walking 2 distance', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#walking-2-distance')).nativeElement.innerText).toEqual('(0.3 mi)');
  });

  it('should render end reservation time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#end-reservation-time')).nativeElement.innerText).toEqual('1:06 PM');
  });

  it('should render end reservation price', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#end-reservation-price')).nativeElement.innerText).toEqual('-$0.45');
  });

  it('should render end reservation station address', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#end-reservation-address')).nativeElement.innerText).toEqual('123 Main Street');
  });

  it('should render arrival time', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#arrival-time')).nativeElement.innerText).toEqual('1:01 PM');
  });

  it('should render destination address', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#destination-address')).nativeElement.innerText).toEqual('Mock Destination');
  });

  it('should render total duration', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#total-duration')).nativeElement.innerText).toEqual('2 hr 59 min');
  });

  it('should render total distance', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#total-distance')).nativeElement.innerText).toEqual('3.0 mi');
  });

  it('should render total price', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#total-price ion-text:nth-child(2)')).nativeElement.innerText).toEqual('$0.30');
  });

  it('should render total price message', () => {
    component.trip = mockTrips[0];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#total-price ion-text:nth-child(1)')).nativeElement.innerText).toEqual('Total earnings:');
  });

  it('should return \'success\' if the number is greater than or equal to 0', () => {
    const colorValue = component.textColor(0.01);
    expect(colorValue).toBe('success');
  });

  it('shoudl return empty string if the number is less than 0', () => {
    const colorValue = component.textColor(-0.01);
    expect(colorValue).toBe('');
  });

});
