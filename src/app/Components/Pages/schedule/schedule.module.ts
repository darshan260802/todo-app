import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { PriorityDirective } from 'src/app/Directives/priority.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkspacesRoutingModule } from '../workspaces/workspaces-routing.module';
import { TuiDataListWrapperModule, TuiElasticContainerModule, TuiInputDateModule, TuiInputModule, TuiIslandModule, TuiSelectModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDataListModule, TuiDialogModule } from '@taiga-ui/core';



@NgModule({
  declarations: [ScheduleComponent],
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
    ScheduleComponent
  ]
})
export class ScheduleModule { }
