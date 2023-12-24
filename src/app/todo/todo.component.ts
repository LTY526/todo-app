import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TodoListService } from './services/todo-list.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
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
  queryParams = new BehaviorSubject<QueryParams<Todo>>({
    page: 1,
    size: 5,
    searchTerm: '',
    sortBy: 'id',
    sortDirection: 'desc',
    predicates: [(item: Todo) => item.completed === false],
  });

  currentPageData$: Observable<QueryResult<Todo>>;

  constructor(
    private snackBarSvc: MatSnackBar,
    private todoListSvc: TodoListService,
  ) {
    this.currentPageData$ = this.queryParams.pipe(
      switchMap((params) => this.todoListSvc.getTodoList$(params)),
    );
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.queryParams.next({
      ...this.queryParams.getValue(),
      page: pageEvent.pageIndex + 1,
      size: pageEvent.pageSize,
    });
  }

  addNewTodo(description: string): void {
    if (description.trim() == '') {
      return;
    }
    this.todoListSvc.addTodo(description);
    this.snackBarSvc.open('Added!');
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
