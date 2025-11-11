import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  task = '';
  TaskDate = '';
  pending_list: any[] = [];
  showPending: boolean = false;
  editingId: number | null = null;

  taskList: {
    id: number;
    task: string;
    TaskDate: string;
    done?: boolean;
  }[] = [];

  ngOnInit() {
    const savedTasks = localStorage.getItem('taskList');
    const savedPending = localStorage.getItem('pending_list');
    this.showPending = false;

    if (savedTasks) this.taskList = JSON.parse(savedTasks);
    if (savedPending) this.pending_list = JSON.parse(savedPending);

    this.sortTasks();
  }

  addTask() {
    if (this.task.trim()) {
      if (this.editingId !== null) {
        const index = this.taskList.findIndex((t) => t.id === this.editingId);
        if (index !== -1) {
          this.taskList[index].task = this.task;
          this.taskList[index].TaskDate = this.TaskDate;
        }
        this.editingId = null;
      } else {
        this.taskList.push({
          id: this.taskList.length + 1,
          task: this.task,
          TaskDate: this.TaskDate,
          done: false,
        });
      }

      this.saveTasks();
      this.task = '';
      this.TaskDate = '';
    }
  }

  deleteTask(taskID: number) {
    this.taskList = this.taskList.filter((item) => item.id !== taskID);
    this.saveTasks();
  }

  editTask(t: any) {
    this.task = t.task;
    this.TaskDate = t.TaskDate;
    this.editingId = t.id;
  }

  sortTasks() {
    this.taskList.sort((a, b) => {
      const dateA = new Date(a.TaskDate).getTime();
      const dateB = new Date(b.TaskDate).getTime();

      if (dateA === dateB) return a.id - b.id;
      return dateA - dateB;
    });

    this.taskList.forEach((task, index) => {
      task.id = index + 1;
    });
  }

  task_done(t: any) {
    t.done = !t.done;
    this.saveTasks();
  }

  showPendingTask() {
    this.showPending = !this.showPending;
    if (this.showPending) {
      this.pending_list = this.taskList.filter((item) => !item.done);
      localStorage.setItem('pending_list', JSON.stringify(this.pending_list));
    }
  }

  saveTasks() {
    this.sortTasks();
    localStorage.setItem('taskList', JSON.stringify(this.taskList));

    this.pending_list = this.taskList.filter((item) => !item.done);
    localStorage.setItem('pending_list', JSON.stringify(this.pending_list));
  }
}
