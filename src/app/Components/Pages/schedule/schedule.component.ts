import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuiDialogService, TuiDialogContext } from '@taiga-ui/core';
import { WorkspaceService } from 'src/app/Shared/workspace.service';
import { Task, Workspace } from '../workspaces/workspaces.component';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  taskList: Task[] = [];
  schedule:{title:string, tasks: Task[]}[] = []
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
    const currDate = this.getNumericDate(new Date().toDateString());
    const time = {
      day: 86400000,
      week: 604800017,
      month: 2629800000,
    };

    const dt: {title: string, tasks: Task[] }[] = [];
    this.taskList.forEach((task: Task) => {
      const due = this.getNumericDate(task.dueDate);

      // Older
      if (due.time < currDate.time - time.day) {
        const index = dt.findIndex(item => item.title === 'Older');
        if( index === -1){
          dt.push({title:'Older', tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }

      // Yesterday
      if (due.time < currDate.time) {
        const index = dt.findIndex(item => item.title === 'Yesterday');
        if( index === -1){
          dt.push({title:'Yesterday', tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }


      // today
      if (due.time <= currDate.time) {
        const index = dt.findIndex(item => item.title === 'Today');
        if( index === -1){
          dt.push({title:'Today', tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }

      // tomorrow
      if (due.time <= currDate.time + time.day) {
        const index = dt.findIndex(item => item.title === 'Tomorrow');
        if( index === -1){
          dt.push({title:'Tomorrow', tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }

      // week
      if (due.time <= currDate.time + time.day * (7 - currDate.dayNum)) {
        const index = dt.findIndex(item => item.title === due.day);
        if( index === -1){
          dt.push({title:due.day, tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }

      // nextweek
      if (due.time <= currDate.time + time.day * (14 - currDate.dayNum)) {
        const index = dt.findIndex(item => item.title === 'Next Week');
        if( index === -1){
          dt.push({title:'Next Week', tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }

      // Month
      if (due.year <= currDate.year) {
        const index = dt.findIndex(item => item.title === due.month);
        if( index === -1){
          dt.push({title:due.month, tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
        return;
      }

      // Future
        const index = dt.findIndex(item => item.title === `${due.month} ${due.year}`);
        if( index === -1){
          dt.push({title:`${due.month} ${due.year}`, tasks: [task]})
        }else{
          dt[index].tasks.push(task);
        }
    });
    return dt;
  }
  getNumericDate(d: string) {
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const dt = new Date(d);
    return {
      time: dt.getTime(),
      day: weekDays[dt.getDay()],
      dayNum: dt.getDay(),
      month: months[dt.getMonth()],
      monthNum: dt.getMonth(),
      year: dt.getFullYear(),
    };
  }

  openTodo(content: PolymorpheusContent<TuiDialogContext>, index1: number, index2: number) {
    this.currentTask = { ...this.schedule[index1].tasks[index2] };
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
