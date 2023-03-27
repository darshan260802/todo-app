import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspacesComponent } from './workspaces.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { TuiElasticContainerModule, TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PriorityDirective } from 'src/app/Directives/priority.directive';


@NgModule({
  declarations: [
    WorkspacesComponent,
    WorkspaceComponent,
    PriorityDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkspacesRoutingModule,
    TuiInputModule,
    TuiButtonModule,
    TuiElasticContainerModule,
    TuiIslandModule,
    TuiDialogModule,
    
  ]
})
export class WorkspacesModule { }
