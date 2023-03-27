import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { WorkspaceService } from 'src/app/Shared/workspace.service';
import { Workspace } from '../workspaces.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent {
  workspaceId: string = '';
  data!: Workspace;
  
  constructor(
    private route: ActivatedRoute,
    private wsService: WorkspaceService,
    private fb: FormBuilder,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {
    route.paramMap.subscribe((params: ParamMap) => {
      this.workspaceId = params.get('workspaceId') ?? '';
      wsService
        .getWorkspace(this.workspaceId)
        .subscribe((workspace: Workspace) => {
          this.data = workspace;
        });
    });
  }

  todoForm = this.fb.group({
    name: new FormControl(''),
  });

  async addTodo() {
    const wsName = this.todoForm.get('name')?.value;
    if(!wsName){return}
    console.log('heavy',this.data);
    
    await this.wsService.createTodo(this.data.workspaceId,wsName)
  }
}
