import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuiDialogService, TuiDialogContext } from '@taiga-ui/core';
import { WorkspaceService } from 'src/app/Shared/workspace.service';
import { Task, Workspace } from '../workspaces/workspaces.component';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
})
export class TodayComponent {
  taskList: Task[] = [];
  schedule: Task[] = [];
  wsServ: WorkspaceService;
  workspaces: { id: string; name: string }[] = [];
  currentTask!: Task;
  isEdit: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private wsService: WorkspaceService,
    private fb: FormBuilder,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {
    this.wsServ = wsService;
    wsService.getWorkspaces().subscribe((workspaces: Workspace[]) => {
      this.workspaces = workspaces.map((ws) => ({
        id: ws.workspaceId,
        name: ws.name,
      }));
      this.todoForm.get('workspaceId')?.setValue(this.workspaces[0].name);
    });
    wsService.getAllTasks().subscribe((tasks: Task[]) => {
      tasks.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      this.taskList = tasks;
      this.schedule = this.getSchedule();
      console.log(this.schedule);
    });
  }

  getWorkspaceName(id: string): string {
    return this.workspaces.find((ws) => ws.id === id)?.name ?? '';
  }
  getWorkspaceNames(): string[] {
    return this.workspaces.map((ws) => ws.name);
  }

  todoForm = this.fb.group({
    name: new FormControl(''),
    workspaceId: new FormControl(''),
  });

  updateForm = this.fb.group({
    date: new FormControl(new TuiDay(2023, 2, 28)),
    note: new FormControl(''),
    priority: new FormControl(''),
  });

  async addTodo() {
    const wsName = this.todoForm.get('name')?.value;
    const wsId =
      this.workspaces.find(
        (ws) => this.todoForm.get('workspaceId')?.value === ws.name
      )?.id ?? '';
    if (!wsName) {
      return;
    }
    this.todoForm.get('name')?.setValue('');
    await this.wsService.createTodo(wsId, wsName);
  }

  async deleteTodo(context: TuiDialogContext) {
    await this.wsService.deleteTodo(this.currentTask.taskId);
    // @ts-ignore
    context.complete();
  }

  async updateTodo() {
    let dt = this.updateForm.get('date')?.value as TuiDay;
    this.currentTask['dueDate'] = new Date(
      dt.year,
      dt.month,
      dt.day
    ).toDateString();
    this.currentTask['note'] = this.updateForm.get('note')?.value ?? '';
    this.currentTask['priority'] =
      (this.updateForm.get('priority')?.value as 'low' | 'medium' | 'high') ??
      this.currentTask['priority'];
    await this.wsService.updateTask(this.currentTask.taskId, this.currentTask);
    this.isEdit = false;
  }

  getSchedule() {
    const currDate = new Date(new Date().toDateString()).getTime();
    const day = 86400000;

    let a = this.taskList.filter(
      (task: Task) =>
        new Date(task.dueDate).getTime() === currDate 
    );
    return a;
  }

  openTodo(content: PolymorpheusContent<TuiDialogContext>, index: number) {
    this.currentTask = { ...this.schedule[index] };
    const d = new Date(this.currentTask.dueDate);

    this.updateForm.setValue({
      date: new TuiDay(d.getFullYear(), d.getMonth(), d.getDate()),
      note: this.currentTask.note,
      priority: this.currentTask.priority,
    });
    this.dialogService
      .open(content, { label: this.currentTask.name, size: 's' })
      .subscribe({
        complete: () => {
          this.isEdit = false;
        },
      });
  }
}
