import { NgModule } from '@angular/core';

import { TimePipe } from './time.pipe';
import { DistancePipe } from './distance.pipe';

@NgModule({
    declarations: [ TimePipe, DistancePipe ],
    imports: [],
    exports: [ TimePipe, DistancePipe ]
})
export class PipesModule {}
