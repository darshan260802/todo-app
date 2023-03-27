import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuiDialogService, TuiDialogContext } from '@taiga-ui/core';
import { WorkspaceService } from 'src/app/Shared/workspace.service';
import { Task, Workspace } from '../workspaces.component';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent {
  workspaceId: string = '';
  data: Workspace = {
    workspaceId: '',
    createdAt: '',
    name: '',
    taskList: [],
    bgColor: '',
    color: '',
  };
  currentTask!: Task;
  isEdit: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private wsService: WorkspaceService,
    private fb: FormBuilder,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
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

  updateForm = this.fb.group({
    date: new FormControl(new TuiDay(0,0,0)),
    note: new FormControl(''),
    priority: new FormControl('')
  })

  async addTodo() {
    const wsName = this.todoForm.get('name')?.value;
    if (!wsName) {
      return;
    }
    console.log('heavy', this.data);

    await this.wsService.createTodo(this.data.workspaceId, wsName);
  }

  async deleteTodo(){
    
  }


  openTodo(content: PolymorpheusContent<TuiDialogContext>, index: number) {
    this.currentTask = { ...this.data?.taskList[index] };
    const d = new Date(this.currentTask.dueDate);

    this.updateForm.setValue({
      date: new TuiDay(d.getFullYear(), d.getMonth(), d.getDate()),
      note:this.currentTask.note,
      priority: this.currentTask.priority
    })
    this.dialogService
      .open(content, { label: this.currentTask.name, size: 's' })
      .subscribe({
        complete: () => {
          this.isEdit = false;
          let dt = this.updateForm.get('date')?.value as TuiDay
          console.log(new Date(dt.year, dt.month, dt.day).toDateString());
          
        },
      });
  }
  log(d: any) {
    console.log(d);
  }
}
