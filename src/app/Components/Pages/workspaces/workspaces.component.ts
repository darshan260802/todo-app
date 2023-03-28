import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from 'src/app/Shared/workspace.service';

export interface Workspace {
  workspaceId: string;
  createdAt: string;
  name: string;
  bgColor: string;
  color: string;
  userId: string
}
export interface Task{
  createdAt: number | string;
  workspaceId: string;
  taskId: string
  name: string;
  dueDate: string;
  note: string;
  priority: "low" | "medium" | "high";
}

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
})
export class WorkspacesComponent {
  workspaces: Workspace[] = [];
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    workspaceService.getWorkspaces().subscribe((d: Workspace[]) => {
      this.workspaces = d;
    });
  }

  workspaceForm = this.fb.group({
    name: new FormControl(''),
  });

  async addWorkspace() {
    const newName = this.workspaceForm.get('name')?.value;
    if (!newName) {
      return;
    }
    await this.workspaceService.createWorkspace(newName);
    this.workspaceForm.get('name')?.reset();
  }
  navigate(...path: string[]): void {
    this.router.navigate(path, { relativeTo: this.route });
  }
}
