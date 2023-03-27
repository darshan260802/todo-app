import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspacesComponent } from './workspaces.component';

const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    component: WorkspacesComponent
  },
  {
    path:':workspaceId',
    component: WorkspaceComponent
  },
  {
    path:'**',
    pathMatch: 'full',
    component: WorkspacesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspacesRoutingModule { }
