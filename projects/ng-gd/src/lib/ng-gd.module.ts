import { NgModule } from '@angular/core';
import { NgGdComponent } from './ng-gd.component';
import { GraphViewComponent } from './graph-view.component';
import {NgGdService} from  './ng-gd.service';



@NgModule({
  declarations: [
    NgGdComponent
  ],
  imports: [
    GraphViewComponent
  ],
  providers:[NgGdService],
  exports: [
    NgGdComponent,
    GraphViewComponent
  ]
})
export class NgGdModule { }
