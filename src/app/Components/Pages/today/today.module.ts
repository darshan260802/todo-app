import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodayComponent } from './today.component';
import { PriorityDirective } from 'src/app/Directives/priority.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkspacesRoutingModule } from '../workspaces/workspaces-routing.module';
import { TuiDataListWrapperModule, TuiElasticContainerModule, TuiInputDateModule, TuiInputModule, TuiIslandModule, TuiSelectModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDataListModule, TuiDialogModule } from '@taiga-ui/core';



@NgModule({
  declarations: [
    TodayComponent
  ],
  imports: [
    CommonModule,
    PriorityDirective,
    FormsModule,
    ReactiveFormsModule,
    WorkspacesRoutingModule,
    TuiInputModule,
    TuiButtonModule,
    TuiElasticContainerModule,
    TuiIslandModule,
    TuiDialogModule,
    TuiInputDateModule,
    TuiTextAreaModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiDataListModule
  ],
  exports:[
    TodayComponent
  ]
})
export class TodayModule { }
