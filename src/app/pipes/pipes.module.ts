import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { TimePipe } from './time.pipe';
import { DistancePipe } from './distance.pipe';

@NgModule({
    declarations: [ TimePipe, DistancePipe ],
    imports: [],
    exports: [ TimePipe, DistancePipe ]
})
export class PipesModule {}
