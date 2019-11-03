import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(seconds: number): string {
    const minutes = seconds / 60;
    const hours = minutes / 60;

    if (hours < 1) {
      return `${Math.round(minutes)} min`;
    }

    const remainder = Math.round(minutes) % 60;
    if (remainder) {
      return `${Math.floor(hours)} hr ${remainder} min`;
    } else {
      return `${hours} hr`;
    }
  }
}
