import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TodoListService } from './services/todo-list.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { QueryParams } from '../models/QueryParams';
import { Todo } from '../models/Todo';
import { QueryResult } from '../models/QueryResult';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  queryParams = new BehaviorSubject<QueryParams>({
    page: 1,
    size: 5,
    searchTerm: '',
    sortBy: 'id',
    sortDirection: 'desc',
  });

  currentPageData$: Observable<QueryResult<Todo>>;

  constructor(
    private snackBarSvc: MatSnackBar,
    private todoListSvc: TodoListService,
  ) {
    this.currentPageData$ = this.queryParams.pipe(
      switchMap((params) => this.todoListSvc.getTodoList$(params)),
      tap((data) => {
        const totalPages = Math.ceil(data.total / this.queryParams.getValue().size);
        console.log(`There are ${totalPages} page(s).`);
        console.log(data);
      })
    );

    // setInterval(() => {
    //   this.todoListSvc.addTodo({
    //     id: 999,
    //     title: 'New Todo',
    //     description: 'This is a new todo',
    //     completed: false,
    //     dateCreated: new Date(),
    //   })
    // }, 1000)

    // setTimeout(() => {
    //   this.queryParams.next({
    //     page: 1,
    //     size: 99,
    //     searchTerm: '',
    //     sortBy: '',
    //     sortDirection: 'asc',
    //   });
    // }, 8000)
  }

  switchPage(page: number): void {
    this.queryParams.next({
      ...this.queryParams.getValue(),
      page,
    });
  }

  handlePageEvent(e: PageEvent) {
    this.queryParams.next({
      ...this.queryParams.getValue(),
      page: e.pageIndex + 1,
      size: e.pageSize,
    });
  }

  editTodoDescription(todo: Todo, newDescription: string): void {
    this.todoListSvc.editTodo(todo.id, { ...todo, description: newDescription });
    this.snackBarSvc.open('Edited!');
  }

  removeTodo(id: number): void {
    this.todoListSvc.removeTodo(id);
    this.snackBarSvc.open('Removed!');
  }

  toggleTodoCompleted(todo: Todo, completed: boolean): void {
    this.todoListSvc.editTodo(todo.id, { ...todo, completed });
    this.snackBarSvc.open(`Marked as ${ completed ? 'completed' : 'incomplete' }!`);
  }
}
