import { DistancePipe } from './distance.pipe';

describe('DistancePipe', () => {
  it('create an instance', () => {
    const pipe = new DistancePipe();
    expect(pipe).toBeTruthy();
  });

  it('should show feet if it\'s less than 1000 feet', () => {
    const pipe = new DistancePipe();
    const display = pipe.transform(999);
    expect(display).toBe('999 ft');
  });

  it('should show miles if it\'s more than 1000 feet', () => {
    const pipe = new DistancePipe();
    const display = pipe.transform(1001);
    expect(display).toBe('0.2 mi');
  });

  it('should round feet with a demimal to a whole number', () => {
    const pipe = new DistancePipe();
    const display = pipe.transform(10.4);
    expect(display).toBe('10 ft');
  });
});
