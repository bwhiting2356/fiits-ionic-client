import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(feet: number): any {
    const miles = Math.floor(feet / 5280);
    if (miles < 1) {
      return `${feet} ft`;
    } else {
      return `${miles} mi`
    }
    
  }

}
