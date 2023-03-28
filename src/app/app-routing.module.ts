import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './Components/Pages/auth/auth.component';
import { ScheduleComponent } from './Components/Pages/schedule/schedule.component';
import { AuthGuard } from './RouteGuards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'workspaces',
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workspaces',
    loadChildren: () =>
      import('./Components/Pages/workspaces/workspaces.module').then(
        (module) => module.WorkspacesModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
