import { DistancePipe } from './distance.pipe';

describe('DistancePipe', () => {
  it('create an instance', () => {
    const pipe = new DistancePipe();
    expect(pipe).toBeTruthy();
  });

  it('should show feet if it\'s less than a mile', () => {
    const pipe = new DistancePipe();
    const display = pipe.transform(200);
    expect(display).toBe('200 ft');
  })

  it('should show miles if it\'s more than a mile', () => {
    const pipe = new DistancePipe();
    const display = pipe.transform(6000);
    expect(display).toBe('1 mi');

  })
});
