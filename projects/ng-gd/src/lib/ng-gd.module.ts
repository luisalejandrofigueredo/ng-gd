import { NgModule } from '@angular/core';
import { NgGdComponent } from './ng-gd.component';
import {NgGdService} from  './ng-gd.service';



@NgModule({
  declarations: [
    NgGdComponent
  ],
  imports: [
  ],
  providers:[NgGdService],
  exports: [
    NgGdComponent
  ]
})
export class NgGdModule { }
