import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(feet: number): any {
    if (feet < 1000) {
      return `${feet.toFixed(0)} ft`;
    } else {
      return `${Number(feet / 5280).toFixed(1)} mi`;
    }
  }

}
