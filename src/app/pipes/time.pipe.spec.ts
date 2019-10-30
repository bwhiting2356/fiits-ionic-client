import { TimePipe } from './time.pipe';

describe('TimePipe', () => {
  it('create an instance', () => {
    const pipe = new TimePipe();
    expect(pipe).toBeTruthy();
  });

  it('should display seconds if it\'s less than a minute', () => {
    const pipe = new TimePipe();
    const display = pipe.transform(20);
    expect(display).toBe('20 sec');
  })

  it('should display minutes if it\'s less than an hour', () => {
    const pipe = new TimePipe();
    const display = pipe.transform(300);
    expect(display).toBe('5 min');
  });

  it('should display minutes rounded down', () => {
    const pipe = new TimePipe();
    const display = pipe.transform(301);
    expect(display).toBe('5 min');
  });

  it('should display hours if it\'s more than an hour', () => {
    const pipe = new TimePipe();
    const display = pipe.transform(3600);
    expect(display).toBe('1 h');
  });

  it('should display hours rounded down', () => {
    const pipe = new TimePipe();
    const display = pipe.transform(3754);
    expect(display).toBe('1 h');
  });
});
