import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (minutes < 1) {
      return `${seconds} sec`;
    } else if (hours < 1) {
      return `${minutes} min`;
    } else {
      return `${hours} h`;
    }
  }
}
