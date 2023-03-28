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
  taskList:Task[] = []
  workspace: Workspace = {
    workspaceId: '',
    createdAt: '',
    name: '',
    bgColor: '',
    color: '',
    userId:''
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
          this.workspace = workspace;
          wsService.getTasks(workspace.workspaceId).subscribe((tasks: Task[]) =>{
            this.taskList = tasks;
          })
        });

    });
  }

  todoForm = this.fb.group({
    name: new FormControl(''),
  });

  updateForm = this.fb.group({
    date: new FormControl(new TuiDay(2023,2,28)),
    note: new FormControl(''),
    priority: new FormControl('')
  })

  async addTodo() {
    const wsName = this.todoForm.get('name')?.value;
    if (!wsName) {
      return;
    }
    this.todoForm.reset();
    await this.wsService.createTodo(this.workspace.workspaceId, wsName);
  }

  async deleteTodo(context:TuiDialogContext){
    await this.wsService.deleteTodo(this.currentTask.taskId);
    // @ts-ignore
    context.complete();
  }

  async updateTodo(){
    let dt = this.updateForm.get('date')?.value as TuiDay
    this.currentTask['dueDate'] = new Date(dt.year, dt.month, dt.day).toDateString();
    this.currentTask['note'] = this.updateForm.get('note')?.value ?? '';
    this.currentTask['priority'] = this.updateForm.get('priority')?.value as ('low'| 'medium' | 'high') ?? this.currentTask['priority'];
    await this.wsService.updateTask(this.currentTask.taskId, this.currentTask);
    this.isEdit = false;
  }



  openTodo(content: PolymorpheusContent<TuiDialogContext>, index: number) {
    this.currentTask = { ...this.taskList[index] };
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

}
